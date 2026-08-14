"""
Meeting service — business logic for meeting operations.

The service is responsible for:
- Resolving or creating participants
- Parsing transcript text
- Creating all meeting-owned records in a single transaction
- Enforcing business rules (e.g. at least one participant if provided)

Routers call the service. The service calls repositories (or ORM directly
for simple queries). Database sessions are passed in — the service does
not create its own sessions.
"""

from datetime import datetime

from sqlalchemy import desc, or_
from sqlalchemy.orm import Session, joinedload

from app.core.exceptions import MeetingNotFoundError
from app.models.meeting import Meeting
from app.models.participant import MeetingParticipant, Participant
from app.parsers.transcript_parser import parse_transcript
from app.schemas.meeting import MeetingCreate, MeetingUpdate


def get_meeting_or_404(db: Session, meeting_id: int) -> Meeting:
    """Fetch a meeting with all its relationships or raise MeetingNotFoundError."""
    meeting = (
        db.query(Meeting)
        .options(
            joinedload(Meeting.participants).joinedload(MeetingParticipant.participant),
            joinedload(Meeting.tags),
        )
        .filter(Meeting.id == meeting_id)
        .first()
    )
    if meeting is None:
        raise MeetingNotFoundError(meeting_id)
    return meeting


def list_meetings(
    db: Session,
    search: str | None = None,
    participant: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    tag_ids: list[int] | None = None,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[Meeting], int]:
    """
    Return a paginated list of meetings with optional filtering.

    Filters:
    - search: case-insensitive substring match on title or participant name
    - participant: participant name substring
    - date_from / date_to: date range
    - tag_ids: meetings must have all specified tags

    Returns (meetings, total_count).
    """
    query = (
        db.query(Meeting)
        .options(
            joinedload(Meeting.participants).joinedload(MeetingParticipant.participant),
            joinedload(Meeting.tags),
        )
    )

    if search:
        # Search in title OR in any participant's name.
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Meeting.title.ilike(search_term),
                Meeting.participants.any(
                    MeetingParticipant.participant.has(
                        Participant.name.ilike(search_term)
                    )
                ),
            )
        )

    if participant:
        participant_term = f"%{participant.strip()}%"
        query = query.filter(
            Meeting.participants.any(
                MeetingParticipant.participant.has(
                    Participant.name.ilike(participant_term)
                )
            )
        )

    if date_from:
        query = query.filter(Meeting.meeting_date >= date_from)

    if date_to:
        query = query.filter(Meeting.meeting_date <= date_to)

    if tag_ids:
        from app.models.tag import MeetingTag
        for tag_id in tag_ids:
            query = query.filter(
                Meeting.tags.any(MeetingTag.tag_id == tag_id)
            )

    # Default sort: newest meeting first.
    query = query.order_by(desc(Meeting.meeting_date))

    total = query.count()
    meetings = query.offset((page - 1) * limit).limit(limit).all()

    return meetings, total


def create_meeting(db: Session, data: MeetingCreate) -> Meeting:
    """
    Create a meeting with participants and optional transcript in one transaction.

    Flow:
    1. Resolve/create participants by email
    2. Create the Meeting record
    3. Link participants via MeetingParticipant
    4. Parse and create TranscriptSegments if transcript_text is provided
    5. Commit everything at once
    """
    # 1. Resolve participants.
    participant_objects = []
    for p_data in data.participants:
        participant = _get_or_create_participant(db, p_data)
        participant_objects.append(participant)

    # 2. Create the meeting.
    meeting = Meeting(
        title=data.title,
        meeting_date=data.meeting_date,
        duration_seconds=data.duration_seconds,
        description=data.description,
        media_url=data.media_url,
        media_duration_seconds=data.media_duration_seconds,
    )
    db.add(meeting)
    db.flush()  # Get meeting.id before creating related records.

    # 3. Link participants.
    for participant in participant_objects:
        link = MeetingParticipant(
            meeting_id=meeting.id,
            participant_id=participant.id,
        )
        db.add(link)

    # 4. Parse and create transcript segments.
    if data.transcript_text and data.transcript_text.strip():
        _create_transcript_segments(db, meeting.id, data.transcript_text)

    db.commit()
    db.refresh(meeting)
    return get_meeting_or_404(db, meeting.id)


def update_meeting(db: Session, meeting_id: int, data: MeetingUpdate) -> Meeting:
    """Update editable meeting fields. Raises MeetingNotFoundError if not found."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting is None:
        raise MeetingNotFoundError(meeting_id)

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(meeting, field, value)

    db.commit()
    db.refresh(meeting)
    return get_meeting_or_404(db, meeting_id)


def delete_meeting(db: Session, meeting_id: int) -> None:
    """
    Delete a meeting. SQLite cascade (enabled via PRAGMA) removes all
    owned records: transcript, summary, topics, actions, decisions, tags.
    """
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting is None:
        raise MeetingNotFoundError(meeting_id)

    db.delete(meeting)
    db.commit()


# ── Private helpers ───────────────────────────────────────────────────────────

def _get_or_create_participant(db: Session, p_data: dict) -> Participant:
    """
    Find an existing participant by email or create a new one.
    This ensures the same person isn't duplicated across meetings.
    """
    email = p_data.get("email", "").strip().lower()
    if not email:
        # If no email given, create a transient participant (no dedup).
        participant = Participant(
            name=p_data.get("name", "Unknown"),
            email=f"unknown_{id(p_data)}@placeholder.local",
            avatar_color=p_data.get("avatar_color", "#7C4DFF"),
        )
        db.add(participant)
        db.flush()
        return participant

    participant = db.query(Participant).filter(Participant.email == email).first()
    if participant is None:
        participant = Participant(
            name=p_data.get("name", email),
            email=email,
            avatar_color=p_data.get("avatar_color", "#7C4DFF"),
        )
        db.add(participant)
        db.flush()

    return participant


def _create_transcript_segments(
    db: Session, meeting_id: int, transcript_text: str
) -> None:
    """
    Parse transcript text and persist all segments.
    Called within the create_meeting transaction.
    TranscriptParseError propagates up — the transaction will be rolled back.
    """
    from app.models.transcript import TranscriptSegment

    parsed = parse_transcript(transcript_text)
    for seg in parsed:
        segment = TranscriptSegment(
            meeting_id=meeting_id,
            speaker_label=seg.speaker_label,
            text=seg.text,
            start_time=seg.start_time,
            end_time=seg.end_time,
            sequence=seg.sequence,
        )
        db.add(segment)
