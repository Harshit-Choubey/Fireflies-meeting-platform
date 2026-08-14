"""
Topic model — key discussion chapters within a meeting.

Topics represent a named section of the meeting (like a chapter),
with a time range indicating when it was discussed.
order_index drives the display order in the UI.
"""

from sqlalchemy import ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    meeting_id: Mapped[int] = mapped_column(
        ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Time range of this topic in the recording (seconds from start).
    start_time: Mapped[float | None] = mapped_column(nullable=True)
    end_time: Mapped[float | None] = mapped_column(nullable=True)

    # Explicit ordering so topics appear in presentation order.
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="topics")


# Index for the common query: get all topics for a meeting in order.
Index("ix_topics_meeting_order", Topic.meeting_id, Topic.order_index)


from app.models.meeting import Meeting  # noqa: E402
