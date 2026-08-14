"""
Decision model.

Decisions represent concluded outcomes from a meeting.
Like ActionItem, they link back to the transcript via source_segment_id (SET NULL on delete).
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class Decision(Base):
    __tablename__ = "decisions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    meeting_id: Mapped[int] = mapped_column(
        ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False
    )

    # SET NULL: preserve the decision if its transcript evidence is later removed.
    source_segment_id: Mapped[int | None] = mapped_column(
        ForeignKey("transcript_segments.id", ondelete="SET NULL"), nullable=True
    )

    decision_text: Mapped[str] = mapped_column(Text, nullable=False)
    rationale: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="decisions")
    source_segment: Mapped["TranscriptSegment | None"] = relationship("TranscriptSegment")


from app.models.meeting import Meeting  # noqa: E402
from app.models.transcript import TranscriptSegment  # noqa: E402
