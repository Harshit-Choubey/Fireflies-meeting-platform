# Product Requirements Document (PRD)

## Fireflies Meeting Intelligence --- Functional Clone

**Version:** 2.0\
**Status:** **FROZEN FOR IMPLEMENTATION**\
**Date:** August 14, 2026\
**Assignment:** SDE Fullstack Assignment --- Fireflies.ai Clone

------------------------------------------------------------------------

## 1. Product Definition

Build a functional, original implementation of the core post-meeting
Fireflies experience: a meeting library, meeting workspace/notepad,
interactive transcript, media playback, AI-generated meeting
intelligence, and persistent meeting/action-item management.

The product must **feel like Fireflies**, not like a generic notes
application. The implementation will reproduce the interaction model and
visual language observed in the supplied Fireflies references while
using original code, components, data, and implementation.

The assignment explicitly prioritizes functionality, UI/UX similarity,
database design, backend/API design, code quality, modularity, and code
understanding. The assignment also allows seeded/mock transcript and AI
data instead of real speech-to-text.

------------------------------------------------------------------------

## 2. Product Goal

### Primary goal

Create a polished meeting-intelligence workspace that allows a reviewer
to:

1.  Browse previous meetings.
2.  Search/filter meetings.
3.  Open a meeting workspace.
4.  Read an interactive transcript.
5.  Play/seek a sample recording.
6.  Jump from transcript → recording and recording → transcript.
7.  Review summary, topics, decisions, and action items.
8.  Create, edit, and delete meetings.
9.  Create/edit/complete action items.
10. Search inside a transcript.
11. Experience a visually faithful Fireflies-style interface.
12. Optionally use global search, tags, exports, and an Ask-a-Question
    experience.

### Differentiation principle

The clone remains faithful to the assignment first.

Our differentiators are **additive**, not replacements for the required
Fireflies workflow:

-   evidence-linked decisions/action items
-   global search
-   tags
-   polished empty/loading/error states
-   optional meeting Q&A
-   export

The project must never sacrifice P0 assignment requirements to build
bonuses.

------------------------------------------------------------------------

# 3. Target Users

### Primary: Assignment Reviewer / Recruiter

A technical evaluator opening the deployed application and GitHub
repository.

They should be able to understand the product in under one minute and
verify the core requirements without needing instructions.

### Secondary: Meeting participant

Someone reviewing past meetings and trying to answer:

-   What happened?
-   What was decided?
-   What do I need to do?
-   Where in the transcript was that discussed?

------------------------------------------------------------------------

# 4. Product Principles

1.  **Fireflies-first UX:** the interface should visually and
    behaviorally resemble the supplied Fireflies references.
2.  **P0 before polish:** all required functionality must work before
    optional features.
3.  **Evidence over decoration:** decisions and actions should be
    traceable to transcript timestamps where possible.
4.  **Fast reviewer path:** seeded meetings are available immediately.
5.  **Original implementation:** no copied repository structure or
    source code.
6.  **Simple architecture:** no unnecessary infrastructure.
7.  **Explainable engineering:** every major architectural choice should
    be explainable in an interview.
8.  **Graceful failure:** errors, empty states, loading states, and
    unavailable optional AI should not break the core application.

------------------------------------------------------------------------

# 5. Scope Lock

## P0 --- Must Ship

-   Meetings Library / Dashboard
-   Meeting search
-   Date and participant filters
-   Recency sorting
-   Fireflies-style application shell
-   Meeting workspace / Notepad
-   Two-panel summary + transcript layout
-   Interactive transcript
-   Speaker labels and timestamps
-   Media player with seek bar
-   Transcript → player seeking
-   Player → active transcript synchronization
-   Transcript search + highlighting
-   Summary / overview
-   Meeting outline / topics / chapters
-   Action items
-   Decisions
-   Meeting CRUD
-   Action-item CRUD
-   Persistent SQLite storage
-   Seed data
-   Toasts / confirmations / error states
-   Settings placeholder
-   Default logged-in user

## P1 --- High-value bonus

Only after every P0 acceptance criterion passes:

-   Global search
-   Tags
-   Tag filtering
-   Evidence links for action items and decisions
-   Export transcript/summary as TXT/Markdown
-   PDF export if time permits

## P2 --- Optional

Only if P0 + P1 are stable:

-   Ask-a-Question / meeting Q&A
-   LLM-powered summary generation
-   Comments
-   Highlights
-   Soundbites
-   VTT upload
-   Dark mode

## Placeholder only

-   Real-time meeting bot
-   Real speech-to-text
-   Zoom/Meet/calendar integrations
-   CRM integrations
-   Team collaboration
-   Real authentication
-   Live meeting assistant

These are represented by polished "Coming Soon" states only.

------------------------------------------------------------------------

# 6. Fireflies UI Reference Study

The supplied screenshots and the current Fireflies site establish the
following visual/product patterns.

Official Fireflies documentation describes the Notepad as the meeting
workspace containing the AI summary, transcript, recording, analytics,
and action items, with a two-panel layout: AI summary/notes on the left
and transcript on the right. citeturn0search3

The supplied references also show:

### Global visual language

-   Deep navy / near-black purple backgrounds on marketing/feature
    surfaces.
-   Bright purple primary actions.
-   White/light workspace surfaces.
-   Rounded cards and controls.
-   Subtle borders and shadows.
-   Large, clean typography.
-   Purple-to-lilac emphasis in headings.
-   Small, compact metadata text.
-   Avatar circles for participants.
-   Minimal line icons.
-   Strong whitespace.
-   Productivity-focused, low-noise layouts.

### Application shell

The meeting workspace reference shows:

-   narrow left navigation rail
-   central meeting content
-   right transcript/search panel
-   clean white workspace
-   compact meeting header
-   participant avatars
-   timestamp links
-   small utility actions
-   purple accent actions

### Meeting workspace / Notepad

The workspace should use the following mental model:

``` text
┌──────────────────────────────────────────────────────────────┐
│ Meeting header                                               │
├───────────────────────────────┬──────────────────────────────┤
│ AI NOTES / NOTEPAD            │ TRANSCRIPT                   │
│                               │                              │
│ Overview                      │ Search                       │
│ Topics / Outline              │ Speaker + timestamp          │
│ Decisions                     │ Transcript segment           │
│ Action Items                  │ Speaker + timestamp          │
│                               │ Transcript segment           │
│                               │                              │
├───────────────────────────────┴──────────────────────────────┤
│ Media player / recording controls                            │
└──────────────────────────────────────────────────────────────┘
```

This is a product-level recreation of the Fireflies interaction model,
not a copy of Fireflies source code.

### Meeting search

Current Fireflies documentation describes quick filters and advanced
filters including participant and date range, and meeting actions from
the library. citeturn0search16

Our P0 filter model:

-   search text
-   participant
-   date range

P1 adds:

-   tags

We intentionally do not implement every Fireflies filter because the
assignment does not require them.

------------------------------------------------------------------------

# 7. Functional Requirements

## 7.1 Meetings Library

### Meeting row/card must show

-   title
-   meeting date
-   time
-   duration
-   participant avatars
-   participant names/count
-   optional tags
-   optional meeting type/source

### Search

Search is:

-   case-insensitive
-   substring based
-   trimmed
-   debounced at 300ms on the frontend

P0 searches:

-   title
-   participant name

P1 global search also searches transcript and meeting intelligence.

### Filters

P0:

-   date from
-   date to
-   participant

P1:

-   tags

### Sorting

Default:

``` text
meeting_date DESC
```

Newest meeting first.

------------------------------------------------------------------------

# 8. Meeting Workspace

The workspace is the central product experience.

It should resemble the supplied Fireflies Notepad references and
preserve the assignment's required summary + transcript workflow.

### Header

Show:

-   meeting title
-   date/time
-   duration
-   participant avatars
-   edit action
-   delete action
-   overflow menu
-   optional share placeholder

### Left panel: Meeting Intelligence / Notepad

Sections:

1.  Overview
2.  Key topics / outline
3.  Decisions
4.  Action items

Each timestamp associated with an intelligence item is clickable.

### Right panel: Transcript

Each segment contains:

``` text
Avatar
Speaker name
Timestamp
Transcript text
```

The active segment receives a subtle accent/background treatment.

------------------------------------------------------------------------

# 9. Transcript Requirements

## Segment

``` text
speaker
timestamp
start_time
end_time
text
sequence
```

### Interaction

Clicking a segment:

``` text
TranscriptSegment
      ↓
seekTo(start_time)
      ↓
MediaPlayer
      ↓
timeupdate
      ↓
active segment
```

During playback, the current transcript segment is highlighted and
automatically scrolled into view.

### Search

Search within the current transcript.

Requirements:

-   case-insensitive
-   substring matching
-   highlight matches
-   show match count
-   next/previous match
-   clear search
-   preserve transcript scroll where practical

------------------------------------------------------------------------

# 10. Media Player

Use a single known sample audio file.

Requirements:

-   play/pause
-   seek bar
-   current time
-   total duration
-   click transcript → seek player
-   player time → active transcript

The seed transcript timestamps must be compatible with the actual sample
duration.

No real transcription pipeline is required.

------------------------------------------------------------------------

# 11. AI Summary & Notes

The assignment allows seeded, mocked, or LLM-generated summaries.

Default implementation:

**seeded structured intelligence**

Each meeting contains:

### Overview

2--4 concise paragraphs.

### Key topics

``` text
Topic
Description
Start timestamp
End timestamp
```

### Decisions

``` text
Decision
Rationale
Source timestamp
```

### Action items

``` text
Title
Description
Assignee
Due date
Status
Source timestamp
```

Possible status values:

``` text
pending
in_progress
completed
```

------------------------------------------------------------------------

# 12. Decisions

Decisions are a first-class meeting-intelligence entity.

A decision represents a concluded outcome from a meeting.

### UI

``` text
Decisions

● Use the new API architecture

Why:
The current architecture is difficult to scale.

01:24  Jump to transcript
```

### P0

-   display decisions
-   timestamp/evidence link when available

### P1

-   create decision
-   edit decision
-   delete decision
-   evidence linking

This keeps the assignment scope disciplined while making the domain
model strong.

------------------------------------------------------------------------

# 13. Action Items

Users can:

-   create
-   edit
-   assign
-   add due date
-   mark in progress
-   mark completed
-   delete

Completion should feel instantaneous using an optimistic UI update, with
rollback if the API fails.

------------------------------------------------------------------------

# 14. Meeting CRUD

## Create

Two modes:

### Manual

``` text
Title
Date
Participants
Duration
Transcript
```

### Paste transcript

Supported contract:

``` text
[00:01:24] Rahul: I think we should move the API.
[00:01:31] Priya: Agreed, let's discuss dependencies.
```

Rules:

-   `[HH:MM:SS] Speaker: text`
-   multiline continuation is allowed
-   timestamps must be monotonically increasing
-   speaker cannot be empty
-   text cannot be empty
-   at least one segment is required

## Update

Editable:

-   title
-   participants
-   date/time where appropriate

## Delete

Confirmation dialog required.

Deletion cascades meeting-owned data.

------------------------------------------------------------------------

# 15. Global Search --- P1

Global search is intentionally included because it naturally extends
Fireflies' meeting-memory workflow.

Current Fireflies materials describe meeting search as a way to find
specific content down to sentences and timestamps, while Global AskFred
can search across past meetings. citeturn0search9turn0search10

Our P1 global search UI:

``` text
Search everything

"database"

Meetings
────────────────────
Sprint Planning
Product Architecture

Transcript Matches
────────────────────
Sprint Planning · 01:24
"database architecture..."

Client Call · 13:52
"database migration..."
```

Results must link directly to:

-   meeting
-   transcript segment where applicable

------------------------------------------------------------------------

# 16. Tags --- P1

Meetings can have multiple tags.

Examples:

``` text
Engineering
Sales
Product
Client
Interview
Sprint
Backend
```

UI:

``` text
Sprint Planning

[Engineering] [Sprint] [Backend]
```

Filters allow selecting one or more tags.

------------------------------------------------------------------------

# 17. Export --- P1

Supported:

-   TXT
-   Markdown

PDF is optional if implementation time remains.

Export options:

``` text
Export
├── Transcript
├── Summary
└── Summary + Action Items
```

Exports should be generated from persisted meeting data.

------------------------------------------------------------------------

# 18. Ask-a-Question --- P2

The Fireflies product currently exposes AskFred as a meeting-focused AI
assistant, and its documentation describes asking questions about a
selected meeting from the meeting workspace.
citeturn0search1turn0search3

Our optional version:

``` text
┌─────────────────────────────┐
│ Ask about this meeting     │
├─────────────────────────────┤
│ What were the main risks?  │
│                             │
│ Ask anything...         ↑   │
└─────────────────────────────┘
```

If implemented:

-   answers must use the selected meeting transcript as context
-   seeded/mock responses are acceptable
-   LLM failure must never break P0

------------------------------------------------------------------------

# 19. Toasts / Modals / States

Every mutation should provide feedback.

Examples:

``` text
✓ Meeting created
✓ Meeting updated
✓ Action item completed
✓ Meeting deleted
```

Errors:

``` text
Could not save changes.
Please try again.
```

Loading:

-   skeletons

Empty:

-   useful empty state + primary action

Delete:

-   confirmation dialog

------------------------------------------------------------------------

# 20. Settings

Placeholder page with:

-   Profile
-   Appearance
-   Notifications
-   Integrations
-   Account

Each unavailable area can show:

``` text
Coming Soon
```

No real authentication is required.

------------------------------------------------------------------------

# 21. Visual Design System

The visual system is derived from the supplied screenshots and is an
implementation guide, not a claim of Fireflies' private design tokens.

### Colors

``` text
App dark / hero:
#10072F

Primary purple:
#7C4DFF

Purple hover:
#6F3FF0

Soft purple:
#EEE8FF

Primary text:
#111827

Secondary text:
#667085

Workspace:
#FFFFFF

Subtle background:
#F7F7FA

Border:
#E7E7EE

Success:
#20C997
```

### Typography

Use a clean modern sans-serif.

Priority:

``` text
Inter
system-ui
sans-serif
```

### Radius

``` text
Small controls: 6px
Cards: 10–12px
Dialogs: 12–16px
Pills: 999px
```

### Layout

Desktop is primary.

``` text
Left navigation: 64–220px
Main content: flexible
Transcript panel: 360–460px
```

The UI must remain usable on tablet widths.

------------------------------------------------------------------------

# 22. Accessibility

Required:

-   keyboard navigation
-   visible focus states
-   icon button labels
-   semantic buttons
-   dialog focus trapping
-   sufficient contrast
-   transcript timestamps keyboard accessible

------------------------------------------------------------------------

# 23. Non-Goals

Do not build:

-   real speech recognition
-   real meeting bots
-   OAuth
-   real integrations
-   multi-user permissions
-   real-time collaboration
-   production-grade analytics
-   complex distributed infrastructure

------------------------------------------------------------------------

# 24. Acceptance Criteria

## P0

-   [ ] Dashboard loads seeded meetings
-   [ ] Meeting metadata is visible
-   [ ] Search works case-insensitively
-   [ ] Date filtering works
-   [ ] Participant filtering works
-   [ ] Recency sorting works
-   [ ] Meeting opens into workspace
-   [ ] Transcript shows speakers/timestamps
-   [ ] Clicking transcript seeks media
-   [ ] Media playback highlights transcript
-   [ ] Transcript search highlights matches
-   [ ] Summary is visible
-   [ ] Topics are visible
-   [ ] Decisions are visible
-   [ ] Action items are visible
-   [ ] Action item can be created
-   [ ] Action item can be edited
-   [ ] Action item can be completed
-   [ ] Action item can be deleted
-   [ ] Meeting can be created
-   [ ] Meeting can be edited
-   [ ] Meeting can be deleted
-   [ ] Data persists after refresh
-   [ ] Seed data exists on startup
-   [ ] Toasts work
-   [ ] Delete confirmation works
-   [ ] Settings placeholder exists

## P1

-   [ ] Global search
-   [ ] Tags
-   [ ] Tag filtering
-   [ ] Evidence links
-   [ ] TXT/Markdown export

------------------------------------------------------------------------

# 25. Reviewer Demo Flow

The deployed demo should be optimized for this sequence:

``` text
1. Open app
2. See populated Meetings Library
3. Search a meeting
4. Apply participant/date filter
5. Open meeting
6. Play recording
7. Click transcript timestamp
8. Observe player seek
9. Observe transcript auto-follow
10. Search transcript
11. Review summary/topics
12. Open decision/action evidence
13. Complete an action item
14. Create/edit a meeting
15. Refresh page
16. Verify persistence
17. Try global search
18. Try tags/export if implemented
```

This path validates nearly every evaluation criterion.

------------------------------------------------------------------------

# 26. Traceability to Assignment

  Assignment requirement    Product implementation             Priority
  ------------------------- ---------------------------------- ----------
  Meetings library          Meetings dashboard                 P0
  Search/filter             Search + date + participant        P0
  Sort recency              Default date DESC                  P0
  Navbar/profile/settings   App shell + settings placeholder   P0
  Interactive transcript    Transcript panel                   P0
  Media player              HTML audio wrapper                 P0
  Transcript/player sync    PlayerSyncContext                  P0
  Transcript search         Local transcript search            P0
  Summary                   Overview                           P0
  Action items              ActionItem entity/UI               P0
  Topics                    Topic entity/UI                    P0
  Meeting CRUD              Meeting API/UI                     P0
  Action CRUD               Action API/UI                      P0
  Persistence               SQLite                             P0
  Fireflies UX              Reference-driven UI                P0
  Seed data                 Seed script                        P0
  Global search             Cross-meeting search               P1
  Tags                      Tag system                         P1
  Export                    TXT/Markdown                       P1
  Ask question              Meeting Q&A                        P2
  Dark mode                 Theme toggle                       P2

------------------------------------------------------------------------

# 27. Definition of Done

The project is ready for submission only when:

1.  P0 acceptance checklist is 100% complete.
2.  Deployed application works from a clean browser session.
3.  Seeded meetings appear without manual setup.
4.  CRUD survives refresh.
5.  Transcript/player synchronization is demonstrable.
6.  UI is visually close to supplied Fireflies references.
7.  GitHub contains frontend + backend.
8.  README explains setup, architecture, schema, API, assumptions.
9.  No secrets are committed.
10. Code can be explained line-by-line during evaluation.

**PRD STATUS: FROZEN**
