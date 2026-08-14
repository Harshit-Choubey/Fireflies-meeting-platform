"""
Decision service — business logic for decision CRUD.

Decisions are P0-readable (list + display).
Full CRUD (create/edit/delete) is P1.
Both paths are implemented here so the router can expose them.
"""

from sqlalchemy.orm import Session

from app.core.exceptions import DecisionNotFoundError, MeetingNotFoundError
from app.models.decision import Decision
from app.models.meeting import Meeting
from app.schemas.decision import DecisionCreate, DecisionUpdate


def get_decisions(db: Session, meeting_id: int) -> list[Decision]:
    """Return all decisions for a meeting."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting is None:
        raise MeetingNotFoundError(meeting_id)

    return (
        db.query(Decision)
        .filter(Decision.meeting_id == meeting_id)
        .order_by(Decision.created_at)
        .all()
    )


def create_decision(db: Session, meeting_id: int, data: DecisionCreate) -> Decision:
    """Create a new decision for a meeting."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting is None:
        raise MeetingNotFoundError(meeting_id)

    decision = Decision(
        meeting_id=meeting_id,
        decision_text=data.decision_text,
        rationale=data.rationale,
        source_segment_id=data.source_segment_id,
    )
    db.add(decision)
    db.commit()
    db.refresh(decision)
    return decision


def update_decision(
    db: Session, decision_id: int, data: DecisionUpdate
) -> Decision:
    """Update a decision."""
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if decision is None:
        raise DecisionNotFoundError(decision_id)

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(decision, field, value)

    db.commit()
    db.refresh(decision)
    return decision


def delete_decision(db: Session, decision_id: int) -> None:
    """Delete a decision."""
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if decision is None:
        raise DecisionNotFoundError(decision_id)

    db.delete(decision)
    db.commit()
