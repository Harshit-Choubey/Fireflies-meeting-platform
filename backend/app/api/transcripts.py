"""
Transcript router — serves transcript data for a meeting.
Also serves summary and topics (meeting intelligence GET endpoints).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.exceptions import MeetingNotFoundError
from app.database.session import get_db
from app.schemas.common import DataResponse
from app.schemas.decision import SummaryOut, TopicOut
from app.schemas.transcript import TranscriptOut, TranscriptSegmentOut
from app.services import get_summary, get_topics, get_transcript

router = APIRouter(tags=["transcript"])


@router.get("/meetings/{meeting_id}/transcript", response_model=DataResponse[TranscriptOut])
def get_meeting_transcript(meeting_id: int, db: Session = Depends(get_db)):
    """Return all transcript segments for a meeting in sequence order."""
    try:
        segments = get_transcript(db, meeting_id)
    except MeetingNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "MEETING_NOT_FOUND", "message": str(e)},
        )
    return DataResponse(
        data=TranscriptOut(
            meeting_id=meeting_id,
            segments=[TranscriptSegmentOut.model_validate(s) for s in segments],
        )
    )


@router.get("/meetings/{meeting_id}/summary", response_model=DataResponse[SummaryOut | None])
def get_meeting_summary(meeting_id: int, db: Session = Depends(get_db)):
    """Return the AI summary for a meeting."""
    try:
        summary = get_summary(db, meeting_id)
    except MeetingNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "MEETING_NOT_FOUND", "message": str(e)},
        )
    return DataResponse(data=SummaryOut.model_validate(summary) if summary else None)


@router.get("/meetings/{meeting_id}/topics", response_model=DataResponse[list[TopicOut]])
def get_meeting_topics(meeting_id: int, db: Session = Depends(get_db)):
    """Return all topics for a meeting in presentation order."""
    try:
        topics = get_topics(db, meeting_id)
    except MeetingNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "MEETING_NOT_FOUND", "message": str(e)},
        )
    return DataResponse(data=[TopicOut.model_validate(t) for t in topics])
