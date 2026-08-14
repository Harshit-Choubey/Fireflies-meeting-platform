"""
Decision, Summary, Topic, Tag Pydantic schemas.
"""

from datetime import datetime

from pydantic import BaseModel, Field


# ── Decisions ─────────────────────────────────────────────────────────────────

class DecisionCreate(BaseModel):
    decision_text: str = Field(..., min_length=1)
    rationale: str | None = None
    source_segment_id: int | None = None


class DecisionUpdate(BaseModel):
    decision_text: str | None = Field(default=None, min_length=1)
    rationale: str | None = None
    source_segment_id: int | None = None


class DecisionOut(BaseModel):
    id: int
    meeting_id: int
    source_segment_id: int | None
    decision_text: str
    rationale: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Summary ───────────────────────────────────────────────────────────────────

class SummaryOut(BaseModel):
    id: int
    meeting_id: int
    overview: str
    generated_by: str
    generated_at: datetime

    model_config = {"from_attributes": True}


# ── Topics ────────────────────────────────────────────────────────────────────

class TopicOut(BaseModel):
    id: int
    meeting_id: int
    title: str
    description: str | None
    start_time: float | None
    end_time: float | None
    order_index: int

    model_config = {"from_attributes": True}


# ── Tags ──────────────────────────────────────────────────────────────────────

class TagCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    color: str = Field(default="#7C4DFF", pattern="^#[0-9A-Fa-f]{6}$")


class TagOut(BaseModel):
    id: int
    name: str
    color: str

    model_config = {"from_attributes": True}
