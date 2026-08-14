"""
Meetings router — HTTP layer for meeting CRUD.

Responsibilities:
- Define HTTP methods and URLs
- Inject database session
- Call service functions
- Return correct status codes and response schemas
- Handle exceptions and return structured error responses

No business logic belongs here.
"""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.exceptions import MeetingNotFoundError, TranscriptParseError
from app.database.session import get_db
from app.schemas.common import CollectionResponse, DataResponse, Meta
from app.schemas.meeting import MeetingCreate, MeetingOut, MeetingUpdate
from app.services import (
    create_meeting,
    delete_meeting,
    get_meeting_or_404,
    list_meetings,
    update_meeting,
)

router = APIRouter(prefix="/meetings", tags=["meetings"])


@router.get("", response_model=CollectionResponse[MeetingOut])
def get_meetings(
    search: str | None = Query(default=None),
    participant: str | None = Query(default=None),
    date_from: datetime | None = Query(default=None),
    date_to: datetime | None = Query(default=None),
    tag_ids: list[int] | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List meetings with optional search/filter/pagination."""
    meetings, total = list_meetings(
        db,
        search=search,
        participant=participant,
        date_from=date_from,
        date_to=date_to,
        tag_ids=tag_ids,
        page=page,
        limit=limit,
    )
    return CollectionResponse(
        data=[MeetingOut.from_orm_meeting(m) for m in meetings],
        meta=Meta(page=page, limit=limit, total=total),
    )


@router.post("", response_model=DataResponse[MeetingOut], status_code=status.HTTP_201_CREATED)
def post_meeting(data: MeetingCreate, db: Session = Depends(get_db)):
    """Create a new meeting with optional transcript."""
    try:
        meeting = create_meeting(db, data)
    except TranscriptParseError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": "TRANSCRIPT_PARSE_ERROR", "message": str(e)},
        )
    return DataResponse(data=MeetingOut.from_orm_meeting(meeting))


@router.get("/{meeting_id}", response_model=DataResponse[MeetingOut])
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    """Retrieve a single meeting by ID."""
    try:
        meeting = get_meeting_or_404(db, meeting_id)
    except MeetingNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "MEETING_NOT_FOUND", "message": str(e)},
        )
    return DataResponse(data=MeetingOut.from_orm_meeting(meeting))


@router.patch("/{meeting_id}", response_model=DataResponse[MeetingOut])
def patch_meeting(meeting_id: int, data: MeetingUpdate, db: Session = Depends(get_db)):
    """Update a meeting's editable fields."""
    try:
        meeting = update_meeting(db, meeting_id, data)
    except MeetingNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "MEETING_NOT_FOUND", "message": str(e)},
        )
    return DataResponse(data=MeetingOut.from_orm_meeting(meeting))


@router.delete("/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_meeting(meeting_id: int, db: Session = Depends(get_db)):
    """Delete a meeting and all its owned data."""
    try:
        delete_meeting(db, meeting_id)
    except MeetingNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "MEETING_NOT_FOUND", "message": str(e)},
        )
