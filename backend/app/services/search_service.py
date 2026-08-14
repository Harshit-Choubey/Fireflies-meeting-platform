"""
Search service — P1 global search across multiple resource types.

Strategy: SQLite LIKE queries are sufficient at seed data scale.
The search is case-insensitive and substring-based.

Results are ordered by resource type priority:
1. meeting title
2. participant
3. transcript
4. summary
5. topic
6. action item
7. decision
"""

from sqlalchemy.orm import Session

from app.models.action_item import ActionItem
from app.models.decision import Decision
from app.models.meeting import Meeting
from app.models.participant import MeetingParticipant, Participant
from app.models.summary import Summary
from app.models.topic import Topic
from app.models.transcript import TranscriptSegment


def global_search(db: Session, query: str) -> list[dict]:
    """
    Search across all resource types and return a unified result list.

    Each result contains:
    - type: resource type string
    - meeting_id: which meeting this result belongs to
    - title: display label for the result
    - snippet: short excerpt showing the match
    - segment_id: (transcript only) which segment matched
    - timestamp: (transcript only) start_time of the matching segment
    """
    if not query or not query.strip():
        return []

    q = query.strip()
    like = f"%{q}%"
    results: list[dict] = []

    # 1. Meeting titles
    for meeting in db.query(Meeting).filter(Meeting.title.ilike(like)).limit(10).all():
        results.append({
            "type": "meeting",
            "meeting_id": meeting.id,
            "title": meeting.title,
            "snippet": meeting.title,
            "segment_id": None,
            "timestamp": None,
        })

    # 2. Participants (return the meetings they are in)
    for link in (
        db.query(MeetingParticipant)
        .join(Participant)
        .filter(Participant.name.ilike(like))
        .limit(10)
        .all()
    ):
        results.append({
            "type": "participant",
            "meeting_id": link.meeting_id,
            "title": link.participant.name,
            "snippet": f"Participant in meeting",
            "segment_id": None,
            "timestamp": None,
        })

    # 3. Transcript segments
    for segment in (
        db.query(TranscriptSegment)
        .filter(TranscriptSegment.text.ilike(like))
        .limit(15)
        .all()
    ):
        # Return a short snippet around the match.
        snippet = _extract_snippet(segment.text, q)
        results.append({
            "type": "transcript",
            "meeting_id": segment.meeting_id,
            "title": f"{segment.speaker_label} · {_format_time(segment.start_time)}",
            "snippet": snippet,
            "segment_id": segment.id,
            "timestamp": segment.start_time,
        })

    # 4. Summary overview
    for summary in db.query(Summary).filter(Summary.overview.ilike(like)).limit(5).all():
        results.append({
            "type": "summary",
            "meeting_id": summary.meeting_id,
            "title": "Meeting Summary",
            "snippet": _extract_snippet(summary.overview, q),
            "segment_id": None,
            "timestamp": None,
        })

    # 5. Topics
    for topic in db.query(Topic).filter(Topic.title.ilike(like)).limit(10).all():
        results.append({
            "type": "topic",
            "meeting_id": topic.meeting_id,
            "title": topic.title,
            "snippet": topic.description or topic.title,
            "segment_id": None,
            "timestamp": topic.start_time,
        })

    # 6. Action items
    for action in (
        db.query(ActionItem)
        .filter(ActionItem.title.ilike(like))
        .limit(10)
        .all()
    ):
        results.append({
            "type": "action_item",
            "meeting_id": action.meeting_id,
            "title": action.title,
            "snippet": action.description or action.title,
            "segment_id": action.source_segment_id,
            "timestamp": None,
        })

    # 7. Decisions
    for decision in (
        db.query(Decision)
        .filter(Decision.decision_text.ilike(like))
        .limit(10)
        .all()
    ):
        results.append({
            "type": "decision",
            "meeting_id": decision.meeting_id,
            "title": decision.decision_text[:100],
            "snippet": decision.rationale or decision.decision_text,
            "segment_id": decision.source_segment_id,
            "timestamp": None,
        })

    return results


def _extract_snippet(text: str, query: str, window: int = 80) -> str:
    """
    Return a short snippet of text centered on the first occurrence of query.
    Falls back to the first `window` characters if the match is not found.
    """
    lower_text = text.lower()
    lower_query = query.lower()
    pos = lower_text.find(lower_query)

    if pos == -1:
        return text[:window] + ("..." if len(text) > window else "")

    start = max(0, pos - window // 2)
    end = min(len(text), pos + len(query) + window // 2)
    snippet = text[start:end]

    prefix = "..." if start > 0 else ""
    suffix = "..." if end < len(text) else ""
    return prefix + snippet + suffix


def _format_time(seconds: float) -> str:
    """Format seconds as MM:SS for display in search results."""
    mins = int(seconds) // 60
    secs = int(seconds) % 60
    return f"{mins:02d}:{secs:02d}"
