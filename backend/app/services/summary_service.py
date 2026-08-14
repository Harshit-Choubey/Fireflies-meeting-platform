"""
Summary and Topic services — read-only retrieval for meeting intelligence.

Summary and topics are created by the seed script or AI generation.
The API exposes read endpoints; writes are internal to the seeding process.
"""

from sqlalchemy.orm import Session

from app.core.exceptions import MeetingNotFoundError
from app.models.meeting import Meeting
from app.models.summary import Summary
from app.models.topic import Topic


def get_summary(db: Session, meeting_id: int) -> Summary | None:
    """Return the summary for a meeting, or None if none exists."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting is None:
        raise MeetingNotFoundError(meeting_id)

    return db.query(Summary).filter(Summary.meeting_id == meeting_id).first()


def get_topics(db: Session, meeting_id: int) -> list[Topic]:
    """Return all topics for a meeting, ordered by presentation order."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting is None:
        raise MeetingNotFoundError(meeting_id)

    return (
        db.query(Topic)
        .filter(Topic.meeting_id == meeting_id)
        .order_by(Topic.order_index)
        .all()
    )
