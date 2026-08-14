# Technical Stack & Engineering Decisions

## Fireflies Meeting Intelligence --- SDE Fullstack Assignment

**Version:** 2.0\
**Status:** **FROZEN FOR IMPLEMENTATION**\
**Date:** August 14, 2026

------------------------------------------------------------------------

# 1. Technology Decision Summary

  -----------------------------------------------------------------------
  Layer                   Choice                  Decision
  ----------------------- ----------------------- -----------------------
  Frontend                Next.js 16.2.x +        Required stack +
                          TypeScript              current Active LTS line

  UI                      Tailwind CSS 4.3.x      Fast, precise visual
                                                  recreation

  UI primitives           shadcn/ui               Accessible primitives,
                                                  heavily restyled

  Server state            TanStack Query          API
                                                  caching/invalidation

  Client state            React Context +         Only ephemeral UI state
                          useState                

  Backend                 FastAPI 0.139.2         Explicit preference;
                                                  assignment allows
                                                  FastAPI

  Language                Python 3.12             Stable project runtime

  Validation              Pydantic 2.x            Request/response
                                                  contracts

  ORM                     SQLAlchemy 2.0.51       Database abstraction

  Migrations              Alembic                 Reproducible schema
                                                  changes

  Database                SQLite 3                Required by assignment

  Testing                 Pytest                  Backend tests

  Lint/format             Ruff                    Python quality

  Frontend lint           ESLint                  TypeScript/React
                                                  quality

  CI                      GitHub Actions          Push/PR validation

  Deployment              Vercel + Render/Railway Simple two-service
                                                  deployment

  Media                   FastAPI static files    Single known sample
                                                  audio

  AI                      Optional provider       Never required for P0
                          behind service          
                          interface               
  -----------------------------------------------------------------------

Current upstream references checked before freezing: Next.js 16.2.11 is
listed as Active LTS, FastAPI 0.139.2 is the July 16, 2026 release shown
on PyPI, SQLAlchemy 2.0.51 is current in its 2.0 documentation, Tailwind
CSS 4.3 is current in the supplied 2026 release notes, and Node.js 24 is
an LTS line.
citeturn1search0turn2search0turn1search2turn1search6turn3search1

**Important:** exact patch versions may be represented by lockfiles. The
versions above define the frozen compatibility targets for this
assignment.

------------------------------------------------------------------------

# 2. Why FastAPI

The assignment allows:

``` text
Python with FastAPI / Django
```

We choose **FastAPI**.

Reasons:

1.  The project is API-first.
2.  REST endpoints are straightforward.
3.  Pydantic validation is integrated.
4.  Automatic OpenAPI documentation is useful during evaluation.
5.  Dependency injection is simple.
6.  The application has no need for Django's full batteries-included
    stack.
7.  The codebase can remain small and modular.
8.  It is easy to explain in a technical interview.

------------------------------------------------------------------------

# 3. Frontend Stack

## Next.js + TypeScript

Use:

-   Next.js App Router
-   TypeScript
-   React

The frontend is responsible for:

-   routing
-   rendering
-   UI state
-   server-state caching
-   transcript interaction
-   media interaction

It does **not** access SQLite directly.

Architecture:

``` text
Browser
   ↓
Next.js
   ↓ REST / JSON
FastAPI
   ↓
SQLAlchemy
   ↓
SQLite
```

------------------------------------------------------------------------

# 4. Visual Stack

## Tailwind CSS

Used for:

-   layout
-   spacing
-   typography
-   responsive behavior
-   Fireflies-inspired colors
-   states
-   panels
-   cards
-   responsive breakpoints

## shadcn/ui

Use selectively for:

-   Dialog
-   DropdownMenu
-   Button
-   Input
-   Tabs
-   Toast
-   Tooltip

Do not use default shadcn styling blindly.

The supplied Fireflies screenshots are the visual reference.

The primitives are implementation tools, not the design.

------------------------------------------------------------------------

# 5. State Management

No Redux.

### Server state

Use TanStack Query for:

-   meetings
-   transcript
-   summary
-   topics
-   action items
-   decisions
-   tags

### URL state

Use URL search parameters for:

-   meeting search
-   filters
-   sorting
-   global search query where appropriate

This makes search shareable and refresh-safe.

### Local state

Use React state for:

-   open dialog
-   active tab
-   menu state
-   form draft
-   local UI toggles

### Shared player state

Use:

``` text
PlayerSyncContext
```

for:

-   current time
-   active segment
-   seekTo()
-   play/pause

------------------------------------------------------------------------

# 6. Backend Stack

``` text
FastAPI
  ↓
Pydantic
  ↓
Service Layer
  ↓
SQLAlchemy ORM
  ↓
SQLite
```

### Router responsibility

Routers handle:

-   HTTP method
-   URL
-   dependency injection
-   status codes
-   request/response schemas

### Service responsibility

Services handle:

-   business logic
-   transactions
-   entity relationships
-   transcript parsing
-   search
-   optional AI orchestration

### Model responsibility

SQLAlchemy models define:

-   tables
-   relationships
-   constraints
-   indexes

------------------------------------------------------------------------

# 7. Database

SQLite is mandatory because the assignment explicitly specifies it.

Use SQLite for:

-   meetings
-   participants
-   transcripts
-   summaries
-   topics
-   action items
-   decisions
-   tags

### SQLite configuration

Enable:

``` sql
PRAGMA foreign_keys=ON;
PRAGMA journal_mode=WAL;
```

Foreign keys must be enabled on every connection.

------------------------------------------------------------------------

# 8. ORM

Use SQLAlchemy 2.0 style APIs.

Benefits:

-   explicit relationships
-   typed models
-   migrations through Alembic
-   parameterized queries
-   clean service-layer queries

SQLAlchemy 2.0.51 is the current 2.0 release referenced by the official
documentation as of June 2026. citeturn1search2

------------------------------------------------------------------------

# 9. Database Schema

Core entities:

``` text
Meeting
Participant
MeetingParticipant
TranscriptSegment
Summary
Topic
ActionItem
Decision
Tag
MeetingTag
```

### Meeting

``` text
id
title
meeting_date
duration_seconds
media_url
media_duration_seconds
description
created_at
updated_at
```

### Participant

``` text
id
name
email
avatar_color
```

### MeetingParticipant

``` text
meeting_id
participant_id
role
```

### TranscriptSegment

``` text
id
meeting_id
participant_id nullable
speaker_label
text
start_time
end_time
sequence
```

### Summary

``` text
id
meeting_id UNIQUE
overview
generated_by
generated_at
```

### Topic

``` text
id
meeting_id
title
description
start_time
end_time
order_index
```

### ActionItem

``` text
id
meeting_id
source_segment_id nullable
title
description
assignee_id nullable
due_date nullable
status
created_at
updated_at
```

`assignee_id` references `Participant.id`.

### Decision

``` text
id
meeting_id
source_segment_id nullable
decision_text
rationale
created_at
```

### Tag

``` text
id
name UNIQUE
color
```

### MeetingTag

``` text
meeting_id
tag_id
```

------------------------------------------------------------------------

# 10. Indexing

Required indexes:

``` text
meetings(meeting_date DESC)

transcript_segments(meeting_id, start_time)

action_items(meeting_id, status)

topics(meeting_id, order_index)
```

Unique constraints:

``` text
participants.email
tags.name
```

Composite primary keys:

``` text
meeting_participants(meeting_id, participant_id)
meeting_tags(meeting_id, tag_id)
```

------------------------------------------------------------------------

# 11. Cascade Semantics

Deleting a meeting cascades to:

-   meeting participants
-   transcript segments
-   summary
-   topics
-   action items
-   decisions
-   meeting tags

Deleting a transcript segment:

``` text
source_segment_id → SET NULL
```

for:

-   action items
-   decisions

This preserves the intelligence record even if transcript evidence
changes.

------------------------------------------------------------------------

# 12. API Conventions

Base URL:

``` text
/api/v1
```

### Meetings

``` text
GET    /meetings
POST   /meetings
GET    /meetings/{id}
PATCH  /meetings/{id}
DELETE /meetings/{id}
```

### Meeting resources

``` text
GET /meetings/{id}/transcript
GET /meetings/{id}/summary
GET /meetings/{id}/topics
GET /meetings/{id}/action-items
POST /meetings/{id}/action-items
GET /meetings/{id}/decisions
```

### Actions

``` text
PATCH  /action-items/{id}
DELETE /action-items/{id}
```

### Tags

``` text
GET  /tags
POST /tags
POST /meetings/{id}/tags/{tag_id}
DELETE /meetings/{id}/tags/{tag_id}
```

### Global search

``` text
GET /search?q=
```

### Health

``` text
GET /health
```

------------------------------------------------------------------------

# 13. Response Format

Single resource:

``` json
{
  "data": {
    "id": 1,
    "title": "Sprint Planning"
  }
}
```

Collection:

``` json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 20
  }
}
```

Error:

``` json
{
  "error": {
    "code": "MEETING_NOT_FOUND",
    "message": "Meeting 42 not found."
  }
}
```

------------------------------------------------------------------------

# 14. Search Strategy

## P0

Server-side meeting search:

``` text
title
participant.name
```

Transcript search is client-side because seeded transcripts are small.

## P1

Global search endpoint searches:

``` text
meeting title
participant
transcript
summary
topics
action items
decisions
```

Search is:

-   case-insensitive
-   substring matching
-   trimmed

At this scale, SQLite LIKE queries are sufficient.

Future:

``` text
SQLite FTS5
```

if transcript volume grows.

------------------------------------------------------------------------

# 15. Transcript Ingestion

Accepted P0 format:

``` text
[00:01:24] Rahul: I think we should move the API.
[00:01:31] Priya: Agreed, let's discuss dependencies.
```

Validation:

-   valid HH:MM:SS
-   monotonically increasing timestamps
-   speaker required
-   text required
-   at least one segment
-   maximum request size enforced

P2:

-   WebVTT
-   JSON transcript import

No real STT.

------------------------------------------------------------------------

# 16. AI Architecture

AI is optional.

Use:

``` text
AIService interface
      ↓
Provider implementation
      ↓
LLM
```

LLM output must pass Pydantic validation before persistence.

Possible output:

``` json
{
  "overview": "...",
  "topics": [],
  "decisions": [],
  "action_items": []
}
```

If the LLM fails:

``` text
LLM failure
    ↓
Seed/mock intelligence
    ↓
Continue normally
```

AI must never be required for P0.

------------------------------------------------------------------------

# 17. Media Architecture

Use one known sample file:

``` text
backend/static/media/demo-meeting.mp3
```

FastAPI mounts:

``` text
/media
```

Meeting stores:

``` text
media_url
media_duration_seconds
```

All seed timestamps must fit the actual file duration.

This avoids a common demo failure where transcript timestamps exceed the
recording length.

------------------------------------------------------------------------

# 18. Deployment

## Frontend

Vercel.

Environment:

``` text
NEXT_PUBLIC_API_URL
```

## Backend

Render or Railway.

Environment:

``` text
DATABASE_URL
CORS_ORIGINS
LLM_API_KEY
```

## CORS

Development:

``` text
http://localhost:3000
```

Production:

``` text
https://<frontend-domain>
```

Never use:

``` text
*
```

in production.

------------------------------------------------------------------------

# 19. SQLite Deployment Persistence

Free web-service filesystems can be ephemeral.

For the zero-cost assignment deployment:

``` text
backend startup
      ↓
check meetings table
      ↓
empty?
  ┌───┴───┐
 yes      no
  ↓        ↓
seed      continue
```

This guarantees that a reviewer opening a fresh deployment sees usable
meetings.

Trade-off:

Reviewer-created records may not survive instance replacement.

If true persistence becomes necessary:

-   persistent disk
-   paid host
-   Turso/libSQL

can replace the local SQLite file.

Do not introduce external database infrastructure unless required.

------------------------------------------------------------------------

# 20. Testing

## Backend

Pytest tests:

-   meeting CRUD
-   action CRUD
-   transcript parser
-   search
-   cascade delete
-   FK enforcement
-   API validation
-   seed idempotency

## Frontend

Minimum:

-   lint
-   production build
-   manual browser QA

Critical manual test:

``` text
play → transcript follows
click transcript → player seeks
```

------------------------------------------------------------------------

# 21. CI

GitHub Actions:

### Backend

``` text
install
ruff check
pytest
```

### Frontend

``` text
npm ci
eslint
npm run build
```

CI runs on:

``` text
push
pull_request
```

------------------------------------------------------------------------

# 22. Technologies Explicitly Not Used

## No Django

FastAPI is sufficient.

## No PostgreSQL

Assignment requires SQLite.

## No MongoDB

Relational meeting intelligence is a better fit.

## No Redis

No background jobs or distributed cache are required.

## No Redux

TanStack Query + local state is enough.

## No GraphQL

REST is simpler and matches the assignment.

## No Docker

Optional but unnecessary for the 24-hour assignment.

## No Kubernetes

Massive overkill.

## No microservices

The application is small enough for a modular monolith.

## No real authentication

Explicitly out of scope.

------------------------------------------------------------------------

# 23. Project Structure

``` text
fireflies-clone/
│
├── frontend/
│   ├── app/
│   │   ├── meetings/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── meetings/
│   │   ├── transcript/
│   │   ├── notepad/
│   │   ├── player/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   ├── providers/
│   ├── types/
│   └── public/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── parsers/
│   │   └── main.py
│   ├── migrations/
│   ├── seed/
│   ├── static/
│   └── tests/
│
├── .github/
│   └── workflows/
│
├── PRD.md
├── TECH_STACK.md
├── DESIGN.md
└── README.md
```

------------------------------------------------------------------------

# 24. Environment Variables

### Frontend

``` text
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Backend

``` text
DATABASE_URL=sqlite:///./app.db
CORS_ORIGINS=http://localhost:3000
LLM_API_KEY=
```

`.env` must never be committed.

Provide:

``` text
.env.example
```

------------------------------------------------------------------------

# 25. Performance Targets

At assignment-scale data:

``` text
p95 GET list/detail < 300ms
```

Dashboard must not load transcript bodies.

Transcript and intelligence are fetched only when a meeting is opened.

------------------------------------------------------------------------

# 26. Security Baseline

-   secrets in environment variables
-   `.env` ignored
-   Pydantic validation
-   ORM parameterized queries
-   restricted CORS
-   no stack traces in production responses
-   bounded request sizes
-   safe file parsing
-   no arbitrary file paths from user input

------------------------------------------------------------------------

# 27. Engineering Trade-offs

  Decision                   Alternative               Why chosen
  -------------------------- ------------------------- --------------------------------
  FastAPI                    Django                    Smaller API-focused surface
  SQLite                     PostgreSQL                Assignment requirement + scale
  TanStack Query             Redux                     Server-state problem
  Context                    global state library      Player state is small
  Client transcript search   FTS5                      Small seeded dataset
  Seed AI                    mandatory LLM             Reliability
  Static sample media        real recording pipeline   Assignment scope
  Modular monolith           microservices             24-hour build
  Vercel + Render            complex cloud             Fast deployment

------------------------------------------------------------------------

# 28. Frozen Rules

After implementation begins:

1.  Do not change the primary architecture without a blocking reason.
2.  Do not add infrastructure because it "looks impressive."
3.  Do not start P1 while P0 is incomplete.
4.  Do not introduce an LLM dependency into a P0 path.
5.  Do not replace SQLite.
6.  Do not add real authentication.
7.  Do not copy Fireflies source code.
8.  UI changes are allowed when they improve reference fidelity without
    changing product scope.

**TECH_STACK STATUS: FROZEN**
