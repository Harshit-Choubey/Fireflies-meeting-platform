"""
Transcript Pydantic schemas.
"""

from pydantic import BaseModel


class TranscriptSegmentOut(BaseModel):
    """API response for a single transcript segment."""
    id: int
    meeting_id: int
    participant_id: int | None
    speaker_label: str
    text: str
    start_time: float
    end_time: float
    sequence: int

    model_config = {"from_attributes": True}


class TranscriptOut(BaseModel):
    """API response for a full meeting transcript."""
    meeting_id: int
    segments: list[TranscriptSegmentOut]
