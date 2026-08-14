# System Design Document

## Fireflies Meeting Intelligence --- Fireflies.ai Functional Clone

**Version:** 2.0\
**Status:** **FROZEN FOR IMPLEMENTATION**\
**Date:** August 14, 2026\
**Companion documents:** `PRD.md`, `TECH_STACK.md`

------------------------------------------------------------------------

# 1. Purpose

`PRD.md` defines **what** we build.

`TECH_STACK.md` defines **what technologies** we use and why.

This document defines **how the system works**:

-   architecture
-   component boundaries
-   state ownership
-   database model
-   API contracts
-   transcript ingestion
-   synchronization
-   AI boundary
-   deployment
-   testing
-   execution sequence

The architecture is intentionally a modular monolith because the
assignment is approximately 24 hours and explicitly evaluates code
quality and modularity rather than infrastructure complexity.

------------------------------------------------------------------------

# 2. Scope

## P0

``` text
Dashboard
Meeting workspace
Transcript
Player
Summary
Topics
Decisions
Action items
Meeting CRUD
Action CRUD
Persistence
Seed data
Fireflies-style UI
```

## P1

``` text
Global search
Tags
Evidence links
Export
```

## P2

``` text
Ask-a-question
LLM generation
Comments
Highlights
Soundbites
VTT upload
Dark mode
```

------------------------------------------------------------------------

# 3. Architecture

``` text
                         Browser
                            │
                            ▼
                 ┌────────────────────┐
                 │      Next.js       │
                 │    TypeScript      │
                 │                    │
                 │ App Router         │
                 │ UI Components      │
                 │ TanStack Query     │
                 │ Player Context     │
                 └─────────┬──────────┘
                           │
                       REST / JSON
                           │
                           ▼
                 ┌────────────────────┐
                 │      FastAPI       │
                 │                    │
                 │ API Routers        │
                 │ Pydantic Schemas   │
                 │ Service Layer      │
                 │ Parsers / AI       │
                 └─────────┬──────────┘
                           │
                     SQLAlchemy 2
                           │
                           ▼
                 ┌────────────────────┐
                 │      SQLite        │
                 │                    │
                 │ Meetings           │
                 │ Participants       │
                 │ Transcript         │
                 │ Summary             │
                 │ Topics              │
                 │ Actions             │
                 │ Decisions           │
                 │ Tags               │
                 └────────────────────┘

                 FastAPI static media
                           │
                           ▼
                 demo-meeting.mp3
```

------------------------------------------------------------------------

# 4. Architectural Principles

### Separation of concerns

``` text
Router
  ↓
Schema
  ↓
Service
  ↓
Model
  ↓
Database
```

### No direct database access from frontend

The browser only talks to HTTP APIs.

### Business logic belongs in services

Routers should remain thin.

### Server state is not UI state

Meeting data belongs in TanStack Query.

Player position belongs in React Context.

------------------------------------------------------------------------

# 5. Frontend Route Map

  Route                     Purpose
  ------------------------- ----------------------
  `/meetings`               Meetings library
  `/meetings/new`           Create meeting
  `/meetings/[meetingId]`   Meeting workspace
  `/settings`               Settings placeholder

------------------------------------------------------------------------

# 6. Frontend Layout

The main workspace follows the Fireflies Notepad model.

Fireflies documentation describes its Notepad as a meeting workspace
containing summary, transcript, recording, analytics and action items,
with a left AI-notes panel and right transcript panel.
citeturn0search3

Our implementation:

``` text
┌──────────────────────────────────────────────────────────┐
│ App Header / Meeting Header                              │
├──────┬──────────────────────────────┬────────────────────┤
│ Nav  │ Meeting Intelligence         │ Transcript         │
│ Rail │                              │                    │
│      │ Overview                     │ Search             │
│      │ Topics                       │                    │
│      │ Decisions                    │ Sarah · 00:53      │
│      │ Action Items                 │ Text...            │
│      │                              │                    │
├──────┴──────────────────────────────┴────────────────────┤
│                       Media Player                       │
└──────────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 7. Visual Design System

The supplied Fireflies screenshots establish the visual reference.

## Primary visual characteristics

-   deep navy/purple surfaces
-   bright purple CTA
-   white workspace
-   subtle borders
-   rounded cards
-   compact metadata
-   participant avatars
-   clean sans-serif typography
-   large whitespace
-   low visual noise
-   purple/lilac emphasis
-   minimal line icons

## Design tokens

``` text
--color-brand: #7C4DFF
--color-brand-hover: #6F3FF0
--color-navy: #10072F
--color-soft-purple: #EEE8FF
--color-text: #111827
--color-muted: #667085
--color-surface: #FFFFFF
--color-background: #F7F7FA
--color-border: #E7E7EE
--color-success: #20C997
```

These are implementation approximations derived from the supplied
references, not private Fireflies tokens.

------------------------------------------------------------------------

# 8. Frontend Components

``` text
components/
│
├── layout/
│   ├── AppShell
│   ├── Sidebar
│   ├── TopBar
│   └── UserMenu
│
├── meetings/
│   ├── MeetingList
│   ├── MeetingRow
│   ├── MeetingFilters
│   ├── MeetingSearch
│   ├── MeetingHeader
│   └── MeetingForm
│
├── notepad/
│   ├── Notepad
│   ├── SummaryPanel
│   ├── TopicsList
│   ├── DecisionList
│   └── ActionItemList
│
├── transcript/
│   ├── TranscriptPanel
│   ├── TranscriptSearch
│   ├── TranscriptSegment
│   └── HighlightedText
│
├── player/
│   └── MediaPlayer
│
└── ui/
    ├── Dialog
    ├── Toast
    ├── Button
    ├── Input
    └── Dropdown
```

------------------------------------------------------------------------

# 9. State Ownership

  State                       Owner
  --------------------------- -------------------
  Meetings                    TanStack Query
  Meeting                     TanStack Query
  Transcript                  TanStack Query
  Summary                     TanStack Query
  Topics                      TanStack Query
  Actions                     TanStack Query
  Decisions                   TanStack Query
  Tags                        TanStack Query
  Search/filter URL values    URL
  Player position             PlayerSyncContext
  Active transcript segment   PlayerSyncContext
  Modal                       local state
  Form draft                  local state

------------------------------------------------------------------------

# 10. Data Fetching

``` text
useMeetings()
useMeeting()
useTranscript()
useSummary()
useTopics()
useActionItems()
useDecisions()
useTags()

useCreateMeeting()
useUpdateMeeting()
useDeleteMeeting()

useCreateActionItem()
useUpdateActionItem()
useDeleteActionItem()
```

Query invalidation:

``` text
create meeting
    ↓
invalidate meetings

update meeting
    ↓
invalidate meeting + meetings

delete meeting
    ↓
invalidate meetings

update action
    ↓
optimistic update
    ↓
rollback on failure
```

------------------------------------------------------------------------

# 11. Transcript ↔ Player Synchronization

This is one of the most important pieces of the assignment.

## Transcript → player

``` text
User clicks segment
       ↓
seekTo(segment.start_time)
       ↓
audio.currentTime = timestamp
       ↓
player seeks
```

## Player → transcript

``` text
audio timeupdate
       ↓
currentTime
       ↓
find active segment
       ↓
highlight segment
       ↓
scrollIntoView()
```

At the current data scale, segments are sorted by `start_time`. Use
binary search to find the last segment satisfying:

``` text
segment.start_time <= currentTime
```

------------------------------------------------------------------------

# 12. Synchronization State

``` ts
type PlayerSyncState = {
  currentTime: number;
  activeSegmentId: number | null;
  isPlaying: boolean;
  duration: number;
  seekTo: (seconds: number) => void;
  play: () => void;
  pause: () => void;
};
```

The media element remains owned by `MediaPlayer`.

The context exposes the controlled interface.

------------------------------------------------------------------------

# 13. Transcript Search

Search stays local in P0.

Algorithm:

``` text
query
 ↓
normalize lowercase
 ↓
segments.filter(text.includes(query))
 ↓
match ranges
 ↓
render highlighted fragments
```

Search behavior:

-   case-insensitive
-   substring
-   match count
-   next/previous
-   clear
-   no server request

------------------------------------------------------------------------

# 14. Global Search

P1 moves search to the backend because it spans multiple resource types.

``` text
GET /api/v1/search?q=database
```

Search order:

1.  meeting title
2.  participant
3.  transcript
4.  summary
5.  topic
6.  action item
7.  decision

Result:

``` json
{
  "type": "transcript",
  "meeting_id": 12,
  "segment_id": 44,
  "timestamp": 84,
  "snippet": "database architecture..."
}
```

The frontend converts results into navigation targets.

------------------------------------------------------------------------

# 15. Backend Directory

``` text
backend/app/
│
├── api/
│   ├── meetings.py
│   ├── transcripts.py
│   ├── action_items.py
│   ├── decisions.py
│   ├── tags.py
│   └── search.py
│
├── core/
│   ├── config.py
│   ├── exceptions.py
│   └── security.py
│
├── database/
│   ├── database.py
│   └── session.py
│
├── models/
│   ├── meeting.py
│   ├── participant.py
│   ├── transcript.py
│   ├── summary.py
│   ├── topic.py
│   ├── action_item.py
│   ├── decision.py
│   └── tag.py
│
├── schemas/
│   ├── meeting.py
│   ├── transcript.py
│   ├── action_item.py
│   ├── decision.py
│   └── common.py
│
├── services/
│   ├── meeting_service.py
│   ├── transcript_service.py
│   ├── search_service.py
│   ├── action_item_service.py
│   ├── decision_service.py
│   └── ai_service.py
│
├── parsers/
│   └── transcript_parser.py
│
└── main.py
```

------------------------------------------------------------------------

# 16. Database ER Model

``` text
MEETING
   │
   ├──── MEETING_PARTICIPANT ──── PARTICIPANT
   │
   ├──── TRANSCRIPT_SEGMENT
   │              │
   │              ├──── source of ACTION_ITEM
   │              └──── source of DECISION
   │
   ├──── SUMMARY
   │
   ├──── TOPIC
   │
   ├──── ACTION_ITEM
   │
   ├──── DECISION
   │
   └──── MEETING_TAG ──── TAG
```

------------------------------------------------------------------------

# 17. Database Constraints

### Meetings

``` text
title NOT NULL
meeting_date NOT NULL
duration_seconds >= 0
```

### Transcript

``` text
meeting_id NOT NULL
text NOT NULL
speaker_label NOT NULL
start_time >= 0
end_time >= start_time
UNIQUE(meeting_id, sequence)
```

### Action items

``` text
status IN (
  'pending',
  'in_progress',
  'completed'
)
```

### Tags

``` text
name UNIQUE
```

------------------------------------------------------------------------

# 18. SQLite Configuration

Every connection must execute:

``` sql
PRAGMA foreign_keys=ON;
PRAGMA journal_mode=WAL;
```

Cascade rules must therefore work in both local development and tests.

------------------------------------------------------------------------

# 19. Transcript Ingestion Contract

P0 input:

``` text
[HH:MM:SS] Speaker Name: text
```

Example:

``` text
[00:01:24] Rahul: I think we should move the API.
[00:01:31] Priya: Agreed, let's discuss dependencies.
```

Continuation lines:

``` text
[00:01:24] Rahul: I think we should move the API
because the current architecture is difficult
to maintain.
```

become one segment.

Validation:

``` text
timestamp valid
speaker present
text present
timestamps monotonic
at least one segment
request size bounded
```

------------------------------------------------------------------------

# 20. Transcript Parser

``` python
SEGMENT_PATTERN = re.compile(
    r"^\[(\d{2}):(\d{2}):(\d{2})\]\s*([^:\n]+):\s*(.*)$"
)
```

Parser output:

``` python
{
    "speaker_label": "Rahul",
    "text": "...",
    "start_time": 84,
    "end_time": 91,
    "sequence": 0
}
```

The parser does not generate AI data.

------------------------------------------------------------------------

# 21. Meeting Creation Flow

``` text
User
 │
 │ title + participants + transcript
 ▼
CreateMeetingForm
 │
 │ POST /api/v1/meetings
 ▼
MeetingsRouter
 │
 │ Pydantic validation
 ▼
MeetingService
 │
 ├── parse transcript
 ├── resolve participants
 ├── create meeting
 ├── create segments
 └── commit transaction
 ▼
SQLite
 │
 ▼
201 Created
 │
 ▼
Frontend invalidates meetings query
 │
 ▼
Redirect to workspace
```

All writes occur in one transaction.

------------------------------------------------------------------------

# 22. Meeting Delete Flow

``` text
DELETE /meetings/{id}
       ↓
MeetingService
       ↓
DELETE meeting
       ↓
SQLite CASCADE
       ↓
participants links
transcript
summary
topics
actions
decisions
tags
       ↓
commit
```

No orphan meeting-owned records should remain.

------------------------------------------------------------------------

# 23. Action Item Flow

### Create

``` text
ActionItemForm
      ↓
POST /meetings/{id}/action-items
      ↓
Service
      ↓
DB
```

### Complete

``` text
Checkbox
   ↓
optimistic UI
   ↓
PATCH /action-items/{id}
   ↓
success → keep
failure → rollback
```

### Evidence

``` text
Action Item
      │
      ▼
source_segment_id
      │
      ▼
Transcript Segment
      │
      ▼
Jump to timestamp
```

------------------------------------------------------------------------

# 24. Decision Flow

Decisions are P0-readable domain objects.

``` text
Decision
 ├── decision_text
 ├── rationale
 ├── source_segment_id
 └── created_at
```

P1 adds full decision CRUD.

Evidence navigation:

``` text
Click timestamp
      ↓
seekTo(source_segment.start_time)
      ↓
transcript active
```

------------------------------------------------------------------------

# 25. AI Boundary

``` text
Transcript
    ↓
AIService
    ↓
Provider
    ↓
LLM
    ↓
Pydantic validation
    ↓
Service
    ↓
Database
```

Never:

``` text
LLM → direct database write
```

LLM failure:

``` text
timeout/error
     ↓
fallback to seeded intelligence
```

P0 does not depend on network AI.

------------------------------------------------------------------------

# 26. Media

Use:

``` text
backend/static/media/demo-meeting.mp3
```

FastAPI:

``` text
GET /media/demo-meeting.mp3
```

Seed data must satisfy:

``` text
max transcript timestamp <= media duration
```

------------------------------------------------------------------------

# 27. Deployment Architecture

``` text
                 GitHub
                   │
          ┌────────┴────────┐
          ▼                 ▼
       Vercel             Render
      Next.js             FastAPI
          │                 │
          │ REST            │
          └────────►────────┘
                            │
                         SQLite
                            │
                         seed-on-empty
```

Environment:

``` text
Frontend:
NEXT_PUBLIC_API_URL

Backend:
DATABASE_URL
CORS_ORIGINS
LLM_API_KEY
```

------------------------------------------------------------------------

# 28. Persistence Strategy

For free hosting:

``` text
startup
  ↓
database exists?
  ↓
meetings count == 0?
  ↓
run seed
```

This prioritizes a reliable evaluator demo over permanent storage of
reviewer-created records.

If persistent disk is later selected, remove seed-on-empty as the
primary recovery mechanism but retain the seed command for local setup.

------------------------------------------------------------------------

# 29. Error Handling

Backend errors:

``` text
422 VALIDATION_ERROR
404 *_NOT_FOUND
500 INTERNAL_ERROR
```

Never expose:

-   stack traces
-   database internals
-   secret values

Frontend:

``` text
API error
   ↓
Toast
   ↓
user can retry
```

------------------------------------------------------------------------

# 30. Loading / Empty / Error States

Every major resource needs all three.

### Loading

Skeleton:

``` text
████████████
████████
████████████
```

### Empty

``` text
No meetings found.

[Clear filters]
```

### Error

``` text
Something went wrong.

[Try again]
```

This is part of the Fireflies-style polish, not optional decoration.

------------------------------------------------------------------------

# 31. Testing Strategy

### Unit

-   transcript parser
-   timestamp conversion
-   active segment binary search
-   search matching
-   status transitions

### Integration

-   meeting CRUD
-   action CRUD
-   cascade delete
-   FK enforcement
-   search endpoint
-   seed idempotency

### Manual E2E

``` text
Dashboard
→ meeting
→ playback
→ transcript seek
→ transcript search
→ action completion
→ refresh
→ persistence
```

------------------------------------------------------------------------

# 32. Risk Register

  -----------------------------------------------------------------------
  Risk                    Impact                  Mitigation
  ----------------------- ----------------------- -----------------------
  SQLite filesystem reset High                    Seed-on-empty startup

  Transcript/player       High                    Binary search +
  boundary bug                                    boundary tests

  UI recreation takes too High                    Freeze tokens/reference
  long                                            before coding

  Scope creep             High                    P0 gate

  LLM unavailable         Medium                  Seeded fallback

  CORS deployment issue   High                    Test production
                                                  frontend → API

  Media timestamp         Medium                  Validate seed
  mismatch                                        timestamps against
                                                  duration

  Parser rejects input    Medium                  Explicit contract +
                                                  validation

  Reviewer sees blank app High                    Seed verification
                                                  before deployment
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 33. 24-Hour Execution Plan

  Time     Deliverable
  -------- -----------------------------------------------
  0--1     Repository + frontend/backend scaffold
  1--2     DB models + Alembic
  2--4     Meeting/participant CRUD
  4--6     Transcript/summary/topic/action/decision APIs
  6--7     Seed data
  7--8     Backend tests + CI
  8--9     Fireflies visual tokens + shell
  9--12    Meetings dashboard
  12--16   Meeting workspace
  16--18   Transcript/player synchronization
  18--20   CRUD modals + toasts + states
  20--21   P1 global search/tags
  21--22   Export/evidence links
  22--23   Deployment
  23--24   QA + README + screenshots

If behind schedule:

``` text
Drop P2
Drop PDF
Drop dark mode
Keep P0 perfect
```

------------------------------------------------------------------------

# 34. Implementation Order

Do not start with the UI.

### Phase 1

``` text
Repository
Database
Models
Migrations
Seed
```

### Phase 2

``` text
API
CRUD
Tests
```

### Phase 3

``` text
App shell
Dashboard
```

### Phase 4

``` text
Meeting workspace
Transcript
Player
```

### Phase 5

``` text
Intelligence
Actions
Decisions
```

### Phase 6

``` text
P1
```

### Phase 7

``` text
Deployment
QA
README
```

------------------------------------------------------------------------

# 35. Definition of Done

The implementation is complete when:

``` text
[✓] npm build
[✓] backend tests
[✓] lint
[✓] seed works
[✓] dashboard works
[✓] CRUD works
[✓] transcript search works
[✓] transcript/player sync works
[✓] summary works
[✓] action items work
[✓] persistence works
[✓] deployment works
[✓] README complete
```

------------------------------------------------------------------------

# 36. Evaluation Traceability

  Evaluation           Design evidence
  -------------------- ----------------------------------
  Functionality        P0 flows + acceptance criteria
  UI/UX                visual tokens + Notepad layout
  Database             ER model + constraints + indexes
  API                  REST contract
  Code quality         layered backend
  Modularity           component/service boundaries
  Code understanding   explicit decisions + trade-offs

------------------------------------------------------------------------

# 37. Final Architecture Decision

The system is intentionally:

``` text
Next.js
     +
FastAPI
     +
SQLAlchemy
     +
SQLite
     +
TanStack Query
     +
Tailwind
```

It is **not**:

``` text
microservices
Redis
PostgreSQL
Kubernetes
GraphQL
Redux
real STT
real auth
```

The goal is not maximum technology.

The goal is:

> **A complete, polished, explainable Fireflies clone that satisfies the
> assignment exceptionally well within the 24-hour constraint.**

**DESIGN STATUS: FROZEN**
