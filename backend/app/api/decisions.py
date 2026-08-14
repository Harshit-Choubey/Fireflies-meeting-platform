"""
Decisions router — P0 read + P1 full CRUD for decisions.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.exceptions import DecisionNotFoundError, MeetingNotFoundError
from app.database.session import get_db
from app.schemas.common import DataResponse
from app.schemas.decision import DecisionCreate, DecisionOut, DecisionUpdate
from app.services import (
    create_decision,
    delete_decision,
    get_decisions,
    update_decision,
)

router = APIRouter(tags=["decisions"])


@router.get(
    "/meetings/{meeting_id}/decisions",
    response_model=DataResponse[list[DecisionOut]],
)
def get_meeting_decisions(meeting_id: int, db: Session = Depends(get_db)):
    """Return all decisions for a meeting."""
    try:
        decisions = get_decisions(db, meeting_id)
    except MeetingNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "MEETING_NOT_FOUND", "message": str(e)},
        )
    return DataResponse(data=[DecisionOut.model_validate(d) for d in decisions])


@router.post(
    "/meetings/{meeting_id}/decisions",
    response_model=DataResponse[DecisionOut],
    status_code=status.HTTP_201_CREATED,
)
def post_decision(
    meeting_id: int, data: DecisionCreate, db: Session = Depends(get_db)
):
    """Create a new decision for a meeting."""
    try:
        decision = create_decision(db, meeting_id, data)
    except MeetingNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "MEETING_NOT_FOUND", "message": str(e)},
        )
    return DataResponse(data=DecisionOut.model_validate(decision))


@router.patch(
    "/decisions/{decision_id}",
    response_model=DataResponse[DecisionOut],
)
def patch_decision(
    decision_id: int, data: DecisionUpdate, db: Session = Depends(get_db)
):
    """Update a decision."""
    try:
        decision = update_decision(db, decision_id, data)
    except DecisionNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "DECISION_NOT_FOUND", "message": str(e)},
        )
    return DataResponse(data=DecisionOut.model_validate(decision))


@router.delete(
    "/decisions/{decision_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_decision(decision_id: int, db: Session = Depends(get_db)):
    """Delete a decision."""
    try:
        delete_decision(db, decision_id)
    except DecisionNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "DECISION_NOT_FOUND", "message": str(e)},
        )
