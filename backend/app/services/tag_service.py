"""
Tag service — tag management and meeting tagging.
"""

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import MeetingNotFoundError, TagNotFoundError
from app.models.meeting import Meeting
from app.models.tag import MeetingTag, Tag
from app.schemas.decision import TagCreate


def list_tags(db: Session) -> list[Tag]:
    return db.query(Tag).order_by(Tag.name).all()


def create_tag(db: Session, data: TagCreate) -> Tag:
    """Create a new tag. Raises IntegrityError if name already exists."""
    tag = Tag(name=data.name.strip(), color=data.color)
    db.add(tag)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # Return the existing tag instead of failing — idempotent behavior.
        existing = db.query(Tag).filter(Tag.name == data.name.strip()).first()
        if existing:
            return existing
        raise
    db.refresh(tag)
    return tag


def add_tag_to_meeting(db: Session, meeting_id: int, tag_id: int) -> None:
    """Associate a tag with a meeting. Silently ignores if already tagged."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting is None:
        raise MeetingNotFoundError(meeting_id)

    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if tag is None:
        raise TagNotFoundError(tag_id)

    existing = (
        db.query(MeetingTag)
        .filter(MeetingTag.meeting_id == meeting_id, MeetingTag.tag_id == tag_id)
        .first()
    )
    if existing:
        return

    link = MeetingTag(meeting_id=meeting_id, tag_id=tag_id)
    db.add(link)
    db.commit()


def remove_tag_from_meeting(db: Session, meeting_id: int, tag_id: int) -> None:
    """Remove a tag from a meeting."""
    link = (
        db.query(MeetingTag)
        .filter(MeetingTag.meeting_id == meeting_id, MeetingTag.tag_id == tag_id)
        .first()
    )
    if link:
        db.delete(link)
        db.commit()
