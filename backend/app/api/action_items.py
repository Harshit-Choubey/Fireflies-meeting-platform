"""
Action items router — full CRUD for action items within meetings.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.exceptions import ActionItemNotFoundError, MeetingNotFoundError
from app.database.session import get_db
from app.schemas.action_item import ActionItemCreate, ActionItemOut, ActionItemUpdate
from app.schemas.common import DataResponse
from app.services import (
    create_action_item,
    delete_action_item,
    get_action_items,
    update_action_item,
)

router = APIRouter(tags=["action-items"])


@router.get(
    "/meetings/{meeting_id}/action-items",
    response_model=DataResponse[list[ActionItemOut]],
)
def get_meeting_action_items(meeting_id: int, db: Session = Depends(get_db)):
    """Return all action items for a meeting."""
    try:
        actions = get_action_items(db, meeting_id)
    except MeetingNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "MEETING_NOT_FOUND", "message": str(e)},
        )
    return DataResponse(data=[ActionItemOut.from_orm_action(a) for a in actions])


@router.post(
    "/meetings/{meeting_id}/action-items",
    response_model=DataResponse[ActionItemOut],
    status_code=status.HTTP_201_CREATED,
)
def post_action_item(
    meeting_id: int, data: ActionItemCreate, db: Session = Depends(get_db)
):
    """Create a new action item for a meeting."""
    try:
        action = create_action_item(db, meeting_id, data)
    except MeetingNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "MEETING_NOT_FOUND", "message": str(e)},
        )
    return DataResponse(data=ActionItemOut.from_orm_action(action))


@router.patch(
    "/action-items/{action_item_id}",
    response_model=DataResponse[ActionItemOut],
)
def patch_action_item(
    action_item_id: int, data: ActionItemUpdate, db: Session = Depends(get_db)
):
    """Update an action item — used for status changes and edits."""
    try:
        action = update_action_item(db, action_item_id, data)
    except ActionItemNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "ACTION_ITEM_NOT_FOUND", "message": str(e)},
        )
    return DataResponse(data=ActionItemOut.from_orm_action(action))


@router.delete(
    "/action-items/{action_item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_action_item(action_item_id: int, db: Session = Depends(get_db)):
    """Delete an action item."""
    try:
        delete_action_item(db, action_item_id)
    except ActionItemNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "ACTION_ITEM_NOT_FOUND", "message": str(e)},
        )
