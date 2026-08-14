"""
Transcript service — retrieves transcript segments for a meeting.

Transcript search is client-side for P0 (seeded data is small).
This service just provides the data fetch.
"""

from sqlalchemy.orm import Session

from app.core.exceptions import MeetingNotFoundError
from app.models.meeting import Meeting
from app.models.transcript import TranscriptSegment


def get_transcript(db: Session, meeting_id: int) -> list[TranscriptSegment]:
    """
    Return all transcript segments for a meeting, ordered by sequence.
    Raises MeetingNotFoundError if the meeting doesn't exist.
    """
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting is None:
        raise MeetingNotFoundError(meeting_id)

    return (
        db.query(TranscriptSegment)
        .filter(TranscriptSegment.meeting_id == meeting_id)
        .order_by(TranscriptSegment.sequence)
        .all()
    )
