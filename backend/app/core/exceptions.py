"""
Custom application exceptions.

We raise these in service layer and catch them in routers to return
structured, consistent error responses — never raw Python tracebacks.
"""


class MeetingNotFoundError(Exception):
    """Raised when a requested meeting does not exist in the database."""

    def __init__(self, meeting_id: int) -> None:
        self.meeting_id = meeting_id
        super().__init__(f"Meeting {meeting_id} not found.")


class ActionItemNotFoundError(Exception):
    """Raised when a requested action item does not exist."""

    def __init__(self, action_item_id: int) -> None:
        self.action_item_id = action_item_id
        super().__init__(f"Action item {action_item_id} not found.")


class DecisionNotFoundError(Exception):
    """Raised when a requested decision does not exist."""

    def __init__(self, decision_id: int) -> None:
        self.decision_id = decision_id
        super().__init__(f"Decision {decision_id} not found.")


class TagNotFoundError(Exception):
    """Raised when a requested tag does not exist."""

    def __init__(self, tag_id: int) -> None:
        self.tag_id = tag_id
        super().__init__(f"Tag {tag_id} not found.")


class TranscriptParseError(Exception):
    """Raised when transcript text cannot be parsed according to the contract."""

    def __init__(self, reason: str) -> None:
        self.reason = reason
        super().__init__(f"Transcript parse error: {reason}")
