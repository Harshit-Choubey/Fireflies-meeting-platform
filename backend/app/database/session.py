"""
FastAPI dependency for database session injection.

Every request that needs the database calls `get_db` as a dependency.
The session is automatically closed when the request finishes (via the finally block).
"""

from collections.abc import Generator

from sqlalchemy.orm import Session

from app.database.database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    Yield a database session and ensure it is closed after the request.

    Usage in a route:
        @router.get("/meetings")
        def list_meetings(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
