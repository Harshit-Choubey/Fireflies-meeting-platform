"""
Meeting model — the central entity of the system.

Every other entity (transcript, summary, topics, actions, decisions, tags)
belongs to a meeting. Deleting a meeting cascades to all owned records.
"""

from datetime import datetime

from sqlalchemy import DateTime, Index, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    meeting_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    # Duration of the meeting itself (may differ from media length).
    duration_seconds: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # URL path served by FastAPI static files — e.g. /media/demo-meeting.mp3
    media_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    # Actual audio duration so the frontend can validate transcript timestamps.
    media_duration_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)

    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships — cascade="all, delete-orphan" means deleting a meeting
    # automatically deletes all its owned records in the database layer.
    participants: Mapped[list["MeetingParticipant"]] = relationship(
        "MeetingParticipant", back_populates="meeting", cascade="all, delete-orphan"
    )
    transcript_segments: Mapped[list["TranscriptSegment"]] = relationship(
        "TranscriptSegment", back_populates="meeting", cascade="all, delete-orphan"
    )
    summary: Mapped["Summary | None"] = relationship(
        "Summary", back_populates="meeting", cascade="all, delete-orphan", uselist=False
    )
    topics: Mapped[list["Topic"]] = relationship(
        "Topic", back_populates="meeting", cascade="all, delete-orphan"
    )
    action_items: Mapped[list["ActionItem"]] = relationship(
        "ActionItem", back_populates="meeting", cascade="all, delete-orphan"
    )
    decisions: Mapped[list["Decision"]] = relationship(
        "Decision", back_populates="meeting", cascade="all, delete-orphan"
    )
    tags: Mapped[list["MeetingTag"]] = relationship(
        "MeetingTag", back_populates="meeting", cascade="all, delete-orphan"
    )


# Index for default sort order: newest meetings first.
Index("ix_meetings_meeting_date", Meeting.meeting_date.desc())


# Import related models so SQLAlchemy can resolve relationships.
from app.models.participant import MeetingParticipant  # noqa: E402
from app.models.transcript import TranscriptSegment  # noqa: E402
from app.models.summary import Summary  # noqa: E402
from app.models.topic import Topic  # noqa: E402
from app.models.action_item import ActionItem  # noqa: E402
from app.models.decision import Decision  # noqa: E402
from app.models.tag import MeetingTag  # noqa: E402
