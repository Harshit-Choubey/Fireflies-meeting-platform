"""
Tags router — tag management and meeting tagging.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.exceptions import MeetingNotFoundError, TagNotFoundError
from app.database.session import get_db
from app.schemas.common import DataResponse
from app.schemas.decision import TagCreate, TagOut
from app.services import add_tag_to_meeting, create_tag, list_tags, remove_tag_from_meeting

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("", response_model=DataResponse[list[TagOut]])
def get_tags(db: Session = Depends(get_db)):
    """Return all available tags."""
    tags = list_tags(db)
    return DataResponse(data=[TagOut.model_validate(t) for t in tags])


@router.post("", response_model=DataResponse[TagOut], status_code=status.HTTP_201_CREATED)
def post_tag(data: TagCreate, db: Session = Depends(get_db)):
    """Create a new tag."""
    tag = create_tag(db, data)
    return DataResponse(data=TagOut.model_validate(tag))


@router.post("/meetings/{meeting_id}/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def add_meeting_tag(meeting_id: int, tag_id: int, db: Session = Depends(get_db)):
    """Associate a tag with a meeting."""
    try:
        add_tag_to_meeting(db, meeting_id, tag_id)
    except MeetingNotFoundError as e:
        raise HTTPException(status_code=404, detail={"code": "MEETING_NOT_FOUND", "message": str(e)})
    except TagNotFoundError as e:
        raise HTTPException(status_code=404, detail={"code": "TAG_NOT_FOUND", "message": str(e)})


@router.delete("/meetings/{meeting_id}/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_meeting_tag(meeting_id: int, tag_id: int, db: Session = Depends(get_db)):
    """Remove a tag from a meeting."""
    try:
        remove_tag_from_meeting(db, meeting_id, tag_id)
    except MeetingNotFoundError as e:
        raise HTTPException(status_code=404, detail={"code": "MEETING_NOT_FOUND", "message": str(e)})
