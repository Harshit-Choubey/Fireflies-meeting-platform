"""
Database engine and session factory.

We configure two important SQLite PRAGMAs on every connection:
- foreign_keys=ON  : SQLite does NOT enforce FK constraints by default.
- journal_mode=WAL : Write-Ahead Logging improves concurrent read performance.

These are set via SQLAlchemy's event system so they apply to every connection
the pool creates, not just the first one.
"""

from sqlalchemy import Engine, create_engine, event, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings

# SQLAlchemy 2.0 engine — check_same_thread=False is required for SQLite
# when the same connection is used across different threads (FastAPI workers).
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},
)


@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):  # noqa: ARG001
    """Enable foreign key enforcement and WAL mode for every new connection."""
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.close()


# SessionLocal is a factory — call SessionLocal() to get a new session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class that all SQLAlchemy models inherit from."""

    pass
