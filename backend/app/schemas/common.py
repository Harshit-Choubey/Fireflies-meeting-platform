"""
Common Pydantic types and response wrappers used across all schemas.

The response envelope pattern keeps all API responses consistent:
- Single resource: {"data": {...}}
- Collection:      {"data": [...], "meta": {...}}
- Error:           {"error": {"code": "...", "message": "..."}}
"""

from typing import Generic, TypeVar

from pydantic import BaseModel

DataT = TypeVar("DataT")


class DataResponse(BaseModel, Generic[DataT]):
    """Single-resource response envelope."""
    data: DataT


class Meta(BaseModel):
    """Pagination metadata for collection responses."""
    page: int
    limit: int
    total: int


class CollectionResponse(BaseModel, Generic[DataT]):
    """Collection response envelope with pagination metadata."""
    data: list[DataT]
    meta: Meta


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorDetail
