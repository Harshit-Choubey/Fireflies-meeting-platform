"""
Action item service — business logic for action item CRUD.

Action items belong to a meeting. Completion uses an optimistic UI update
on the frontend; the backend just persists the status change.
"""

from sqlalchemy.orm import Session, joinedload

from app.core.exceptions import ActionItemNotFoundError, MeetingNotFoundError
from app.models.action_item import ActionItem
from app.models.meeting import Meeting
from app.schemas.action_item import ActionItemCreate, ActionItemUpdate


def get_action_items(db: Session, meeting_id: int) -> list[ActionItem]:
    """Return all action items for a meeting, with assignee loaded."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting is None:
        raise MeetingNotFoundError(meeting_id)

    return (
        db.query(ActionItem)
        .options(joinedload(ActionItem.assignee))
        .filter(ActionItem.meeting_id == meeting_id)
        .order_by(ActionItem.created_at)
        .all()
    )


def create_action_item(
    db: Session, meeting_id: int, data: ActionItemCreate
) -> ActionItem:
    """Create a new action item for a meeting."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting is None:
        raise MeetingNotFoundError(meeting_id)

    action = ActionItem(
        meeting_id=meeting_id,
        title=data.title,
        description=data.description,
        assignee_id=data.assignee_id,
        due_date=data.due_date,
        status=data.status,
        source_segment_id=data.source_segment_id,
    )
    db.add(action)
    db.commit()
    db.refresh(action)

    # Reload with relationships.
    return (
        db.query(ActionItem)
        .options(joinedload(ActionItem.assignee))
        .filter(ActionItem.id == action.id)
        .first()
    )


def update_action_item(
    db: Session, action_item_id: int, data: ActionItemUpdate
) -> ActionItem:
    """Update an action item's fields. Raises ActionItemNotFoundError if missing."""
    action = (
        db.query(ActionItem)
        .options(joinedload(ActionItem.assignee))
        .filter(ActionItem.id == action_item_id)
        .first()
    )
    if action is None:
        raise ActionItemNotFoundError(action_item_id)

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(action, field, value)

    db.commit()
    db.refresh(action)

    return (
        db.query(ActionItem)
        .options(joinedload(ActionItem.assignee))
        .filter(ActionItem.id == action_item_id)
        .first()
    )


def delete_action_item(db: Session, action_item_id: int) -> None:
    """Delete an action item."""
    action = db.query(ActionItem).filter(ActionItem.id == action_item_id).first()
    if action is None:
        raise ActionItemNotFoundError(action_item_id)

    db.delete(action)
    db.commit()
