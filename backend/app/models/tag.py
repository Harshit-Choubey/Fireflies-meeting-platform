"""
Tag and MeetingTag models.

Tags categorize meetings (e.g. Engineering, Sprint, Client).
Tag names are globally unique.
MeetingTag is the join table with a composite primary key.
"""

from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # Tag names must be unique globally — prevents duplicate Engineering, Sprint, etc.
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)

    # CSS hex color for tag badge display.
    color: Mapped[str] = mapped_column(String(7), nullable=False, default="#7C4DFF")

    meeting_links: Mapped[list["MeetingTag"]] = relationship(
        "MeetingTag", back_populates="tag"
    )


class MeetingTag(Base):
    """
    Association table linking meetings to tags.
    Composite PK prevents duplicating the same tag on the same meeting.
    """

    __tablename__ = "meeting_tags"
    __table_args__ = (
        UniqueConstraint("meeting_id", "tag_id", name="uq_meeting_tag"),
    )

    meeting_id: Mapped[int] = mapped_column(
        ForeignKey("meetings.id", ondelete="CASCADE"), primary_key=True
    )
    tag_id: Mapped[int] = mapped_column(
        ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True
    )

    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="tags")
    tag: Mapped["Tag"] = relationship("Tag", back_populates="meeting_links")


from app.models.meeting import Meeting  # noqa: E402
