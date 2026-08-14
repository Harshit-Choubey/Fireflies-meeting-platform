"""
Meeting Pydantic schemas.

We keep three clear schema roles:
- MeetingCreate: what the client sends when creating a meeting
- MeetingUpdate: what the client sends when patching a meeting
- MeetingOut:    what the API returns (never exposes ORM model directly)
"""

from datetime import datetime

from pydantic import BaseModel, Field


class ParticipantOut(BaseModel):
    """Participant as embedded in meeting responses."""
    id: int
    name: str
    email: str
    avatar_color: str

    model_config = {"from_attributes": True}


class TagOut(BaseModel):
    """Tag as embedded in meeting responses."""
    id: int
    name: str
    color: str

    model_config = {"from_attributes": True}


class MeetingCreate(BaseModel):
    """Request body for POST /meetings."""
    title: str = Field(..., min_length=1, max_length=500)
    meeting_date: datetime
    duration_seconds: int = Field(default=0, ge=0)
    description: str | None = None
    media_url: str | None = None
    media_duration_seconds: int | None = None

    # Participants specified by name+email — created if they don't exist yet.
    participants: list[dict] = Field(default_factory=list)

    # Optional raw transcript text in the [HH:MM:SS] Speaker: text format.
    transcript_text: str | None = None


class MeetingUpdate(BaseModel):
    """Request body for PATCH /meetings/{id} — all fields optional."""
    title: str | None = Field(default=None, min_length=1, max_length=500)
    meeting_date: datetime | None = None
    duration_seconds: int | None = Field(default=None, ge=0)
    description: str | None = None


class MeetingOut(BaseModel):
    """API response for a single meeting."""
    id: int
    title: str
    meeting_date: datetime
    duration_seconds: int
    media_url: str | None
    media_duration_seconds: int | None
    description: str | None
    created_at: datetime
    updated_at: datetime
    participants: list[ParticipantOut]
    tags: list[TagOut]

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_meeting(cls, meeting) -> "MeetingOut":
        """
        Build MeetingOut from a Meeting ORM object.
        We extract participants and tags from their join-table relationships.
        """
        return cls(
            id=meeting.id,
            title=meeting.title,
            meeting_date=meeting.meeting_date,
            duration_seconds=meeting.duration_seconds,
            media_url=meeting.media_url,
            media_duration_seconds=meeting.media_duration_seconds,
            description=meeting.description,
            created_at=meeting.created_at,
            updated_at=meeting.updated_at,
            participants=[
                ParticipantOut.model_validate(link.participant)
                for link in meeting.participants
            ],
            tags=[
                TagOut.model_validate(link.tag)
                for link in meeting.tags
            ],
        )
