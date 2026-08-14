from app.api.action_items import router as action_items_router
from app.api.decisions import router as decisions_router
from app.api.meetings import router as meetings_router
from app.api.search import router as search_router
from app.api.tags import router as tags_router
from app.api.transcripts import router as transcripts_router

__all__ = [
    "meetings_router",
    "transcripts_router",
    "action_items_router",
    "decisions_router",
    "tags_router",
    "search_router",
]
