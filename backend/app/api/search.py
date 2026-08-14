"""
Search router — P1 global search endpoint.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.common import DataResponse
from app.services import global_search

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=DataResponse[list[dict]])
def search(
    q: str = Query(..., min_length=1, description="Search query"),
    db: Session = Depends(get_db),
):
    """
    Global search across meetings, participants, transcripts, summaries,
    topics, action items, and decisions.
    """
    results = global_search(db, q)
    return DataResponse(data=results)
