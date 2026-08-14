"""
TranscriptSegment model.

Each segment represents one speaker turn in the meeting.
Segments are ordered by `sequence` and indexed by (meeting_id, start_time)
because the player synchronization algorithm queries by meeting and time.
"""

from sqlalchemy import CheckConstraint, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"
    __table_args__ = (
        # Every segment in a meeting must have a unique position in the sequence.
        UniqueConstraint("meeting_id", "sequence", name="uq_segment_meeting_sequence"),
        # end_time must be >= start_time — enforced at the DB layer.
        CheckConstraint("end_time >= start_time", name="ck_segment_time_order"),
        CheckConstraint("start_time >= 0", name="ck_segment_start_nonneg"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    meeting_id: Mapped[int] = mapped_column(
        ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False
    )

    # participant_id is nullable because some segments may have an unknown speaker.
    participant_id: Mapped[int | None] = mapped_column(
        ForeignKey("participants.id", ondelete="SET NULL"), nullable=True
    )

    # speaker_label is always required (even if participant_id is null).
    speaker_label: Mapped[str] = mapped_column(String(255), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)

    # Time offsets in seconds from the start of the recording.
    start_time: Mapped[float] = mapped_column(nullable=False)
    end_time: Mapped[float] = mapped_column(nullable=False)

    # Chronological position — used for display ordering and parser output.
    sequence: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationships
    meeting: Mapped["Meeting"] = relationship(
        "Meeting", back_populates="transcript_segments"
    )
    participant: Mapped["Participant | None"] = relationship("Participant")


# Composite index: transcript queries filter by meeting and then navigate
# by timestamp (for player sync). This index makes both operations fast.
Index("ix_transcript_segments_meeting_start", TranscriptSegment.meeting_id, TranscriptSegment.start_time)


from app.models.meeting import Meeting  # noqa: E402
from app.models.participant import Participant  # noqa: E402
