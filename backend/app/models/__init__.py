"""
Models package — import all models here so Alembic autogenerate
can discover them in one place.
"""

from app.models.action_item import ActionItem
from app.models.decision import Decision
from app.models.meeting import Meeting
from app.models.participant import MeetingParticipant, Participant
from app.models.summary import Summary
from app.models.tag import MeetingTag, Tag
from app.models.topic import Topic
from app.models.transcript import TranscriptSegment

__all__ = [
    "Meeting",
    "Participant",
    "MeetingParticipant",
    "TranscriptSegment",
    "Summary",
    "Topic",
    "ActionItem",
    "Decision",
    "Tag",
    "MeetingTag",
]
