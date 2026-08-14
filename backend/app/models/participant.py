"""
Participant and MeetingParticipant models.

Participant is a person who can appear in multiple meetings.
MeetingParticipant is the join table that links participants to meetings
and records the role they had in each specific meeting.
"""

from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class Participant(Base):
    __tablename__ = "participants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Email is the natural unique identifier for a participant.
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)

    # Hex color for the avatar circle in the UI — generated at creation.
    avatar_color: Mapped[str] = mapped_column(String(7), nullable=False, default="#7C4DFF")

    # Relationships
    meeting_links: Mapped[list["MeetingParticipant"]] = relationship(
        "MeetingParticipant", back_populates="participant"
    )
    action_items: Mapped[list["ActionItem"]] = relationship(
        "ActionItem", back_populates="assignee", foreign_keys="ActionItem.assignee_id"
    )


class MeetingParticipant(Base):
    """
    Association table between Meeting and Participant.
    Using a composite primary key instead of a surrogate integer key
    because the pair (meeting_id, participant_id) is naturally unique.
    """

    __tablename__ = "meeting_participants"
    __table_args__ = (
        UniqueConstraint("meeting_id", "participant_id", name="uq_meeting_participant"),
    )

    meeting_id: Mapped[int] = mapped_column(
        ForeignKey("meetings.id", ondelete="CASCADE"), primary_key=True
    )
    participant_id: Mapped[int] = mapped_column(
        ForeignKey("participants.id", ondelete="CASCADE"), primary_key=True
    )
    role: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Relationships back to their parent entities
    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="participants")
    participant: Mapped["Participant"] = relationship(
        "Participant", back_populates="meeting_links"
    )


# Circular import resolution — Meeting imports MeetingParticipant, so import here.
from app.models.action_item import ActionItem  # noqa: E402
from app.models.meeting import Meeting  # noqa: E402
