"""
ActionItem model.

Action items are tasks that arise from a meeting.
They have a status lifecycle: pending → in_progress → completed.

source_segment_id links back to the transcript moment where the action
was identified. It uses SET NULL on delete so the action item survives
even if the transcript segment is later removed.
"""

from datetime import date, datetime

from sqlalchemy import CheckConstraint, Date, DateTime, ForeignKey, Index, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base

VALID_STATUSES = ("pending", "in_progress", "completed")


class ActionItem(Base):
    __tablename__ = "action_items"
    __table_args__ = (
        CheckConstraint(
            "status IN ('pending', 'in_progress', 'completed')",
            name="ck_action_item_status",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    meeting_id: Mapped[int] = mapped_column(
        ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False
    )

    # SET NULL so the action item is not deleted when the transcript segment is deleted.
    source_segment_id: Mapped[int | None] = mapped_column(
        ForeignKey("transcript_segments.id", ondelete="SET NULL"), nullable=True
    )

    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Assignee is a participant — nullable because not every action has a clear owner.
    assignee_id: Mapped[int | None] = mapped_column(
        ForeignKey("participants.id", ondelete="SET NULL"), nullable=True
    )

    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")

    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="action_items")
    assignee: Mapped["Participant | None"] = relationship(
        "Participant", back_populates="action_items", foreign_keys=[assignee_id]
    )
    source_segment: Mapped["TranscriptSegment | None"] = relationship("TranscriptSegment")


# Index for the common query: get all actions for a meeting filtered by status.
Index("ix_action_items_meeting_status", ActionItem.meeting_id, ActionItem.status)


from app.models.meeting import Meeting  # noqa: E402
from app.models.participant import Participant  # noqa: E402
from app.models.transcript import TranscriptSegment  # noqa: E402
