"""
Action item Pydantic schemas.
"""

from datetime import date, datetime

from pydantic import BaseModel, Field

from app.schemas.meeting import ParticipantOut


class ActionItemCreate(BaseModel):
    """Request body for POST /meetings/{id}/action-items."""
    title: str = Field(..., min_length=1, max_length=500)
    description: str | None = None
    assignee_id: int | None = None
    due_date: date | None = None
    status: str = Field(default="pending", pattern="^(pending|in_progress|completed)$")
    source_segment_id: int | None = None


class ActionItemUpdate(BaseModel):
    """Request body for PATCH /action-items/{id} — all fields optional."""
    title: str | None = Field(default=None, min_length=1, max_length=500)
    description: str | None = None
    assignee_id: int | None = None
    due_date: date | None = None
    status: str | None = Field(default=None, pattern="^(pending|in_progress|completed)$")
    source_segment_id: int | None = None


class ActionItemOut(BaseModel):
    """API response for a single action item."""
    id: int
    meeting_id: int
    source_segment_id: int | None
    title: str
    description: str | None
    assignee: ParticipantOut | None
    due_date: date | None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_action(cls, action) -> "ActionItemOut":
        return cls(
            id=action.id,
            meeting_id=action.meeting_id,
            source_segment_id=action.source_segment_id,
            title=action.title,
            description=action.description,
            assignee=ParticipantOut.model_validate(action.assignee) if action.assignee else None,
            due_date=action.due_date,
            status=action.status,
            created_at=action.created_at,
            updated_at=action.updated_at,
        )
