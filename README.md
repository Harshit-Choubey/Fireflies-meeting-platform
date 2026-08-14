# Fireflies Meeting Intelligence Platform

A production-quality full-stack Fireflies.ai-inspired Meeting Intelligence Platform built as part of a technical assignment.

This project delivers a complete post-meeting workspace featuring an interactive transcript synchronized with media playback, automated AI summaries, key topic outlines, decision tracking, action item CRUD, global search, tag filtering, and export capabilities.

---

## 🏗 System Architecture

```
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
                       │ Summary            │
                       │ Topics             │
                       │ Actions            │
                       │ Decisions          │
                       │ Tags               │
                       └────────────────────┘

                       FastAPI static media
                                 │
                                 ▼
                       demo-meeting.mp3
```

---

## 🌟 Key Features

### P0 — Core Functionality
- **Meetings Library Dashboard**: Filter by date range, participant name, or search query. Sort by recency.
- **Fireflies Workspace (Notepad)**: Two-panel layout featuring AI Overview summary, Key Topics outline, Decisions, and Action Items.
- **Interactive Transcript**: Speaker avatars, timestamps, active segment highlighting, and local substring search.
- **Transcript ↔ Player Synchronization**:
  - Click transcript timestamp → Media player seeks to timestamp and plays.
  - Media player currentTime updates → Active transcript segment is highlighted and scrolled into view via $O(\log N)$ binary search.
- **Action Item CRUD**: Create, edit, complete (with optimistic UI updates), and delete action items.
- **Meeting CRUD & Ingestion**: Create meeting manually or paste raw transcript in `[HH:MM:SS] Speaker Name: text` format.
- **Seed Data on Startup**: Automatically populates 3 realistic meeting intelligence records on fresh startup.

### P1 — High-Value Enhancements
- **Global Search**: Cross-meeting search across titles, participants, transcripts, summaries, topics, decisions, and action items.
- **Tag Management**: Categorize meetings (Engineering, Product, Client, Sprint) and filter library by tags.
- **Exporting**: Export transcript, summary, and action items to Markdown (`.md`) and Plain Text (`.txt`).

---

## 🗄 Relational Database Design

Built using **SQLAlchemy 2.0** on **SQLite 3** with foreign key constraints explicitly enabled via connection listeners (`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;`).

### Entities & Relationships
1. `meetings`: Central entity (`id`, `title`, `meeting_date`, `duration_seconds`, `media_url`, `description`, `created_at`, `updated_at`).
2. `participants`: Unique people (`id`, `name`, `email` UNIQUE, `avatar_color`).
3. `meeting_participants`: Join table (`meeting_id`, `participant_id`, `role`) with composite primary key.
4. `transcript_segments`: Timed speaker turns (`id`, `meeting_id`, `participant_id`, `speaker_label`, `text`, `start_time`, `end_time`, `sequence`). Index on `(meeting_id, start_time)`.
5. `summaries`: AI Overview (`id`, `meeting_id` UNIQUE, `overview`, `generated_by`).
6. `topics`: Discussion chapters (`id`, `meeting_id`, `title`, `description`, `start_time`, `end_time`, `order_index`).
7. `action_items`: Tasks (`id`, `meeting_id`, `source_segment_id` SET NULL, `title`, `description`, `assignee_id`, `due_date`, `status`). Status CHECK (`pending`, `in_progress`, `completed`).
8. `decisions`: Concluded outcomes (`id`, `meeting_id`, `source_segment_id` SET NULL, `decision_text`, `rationale`).
9. `tags` & `meeting_tags`: Tag dictionary and join table (`meeting_id`, `tag_id`).

---

## ⚡ REST API Endpoints

### Meetings
- `GET /api/v1/meetings?search=&participant=&date_from=&date_to=&page=&limit=`
- `POST /api/v1/meetings`
- `GET /api/v1/meetings/{id}`
- `PATCH /api/v1/meetings/{id}`
- `DELETE /api/v1/meetings/{id}`

### Intelligence & Transcript
- `GET /api/v1/meetings/{id}/transcript`
- `GET /api/v1/meetings/{id}/summary`
- `GET /api/v1/meetings/{id}/topics`

### Action Items
- `GET /api/v1/meetings/{id}/action-items`
- `POST /api/v1/meetings/{id}/action-items`
- `PATCH /api/v1/action-items/{id}`
- `DELETE /api/v1/action-items/{id}`

### Decisions & Tags
- `GET /api/v1/meetings/{id}/decisions`
- `POST /api/v1/meetings/{id}/decisions`
- `GET /api/v1/tags`
- `POST /api/v1/tags`

### Global Search
- `GET /api/v1/search?q={query}`

---

## ⏱ Transcript / Player Synchronization Algorithm

The transcript panel contains $N$ segments ordered by `start_time`.
When `MediaPlayer` emits `timeupdate(currentTime)`:
1. `PlayerSyncContext` performs a binary search ($O(\log N)$) to find the highest segment index where `segment.start_time <= currentTime`.
2. Sets `activeSegmentId` to match segment.
3. The active `TranscriptSegment` element automatically invokes `scrollIntoView({ behavior: 'smooth', block: 'nearest' })`.

When a segment timestamp is clicked:
1. Calls `seekTo(start_time)`.
2. Native `<audio>` updates `currentTime`.
3. Playback resumes from exact timestamp.

---

## 🛠 Local Setup & Running

### Backend
```bash
cd backend
python -m venv .venv
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python seed/seed.py
uvicorn app.main:app --reload --port 8000
```
Backend runs at `http://localhost:8000`. Interactive OpenAPI documentation available at `http://localhost:8000/docs`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`.

---

## 🧪 Testing Discipline

### Backend Tests (Pytest)
```bash
cd backend
PYTHONPATH=. pytest
```
Tests cover:
- Transcript parser contract and error validation
- Meeting CRUD and JSON response contracts
- Action item completion and status transitions
- Cascade delete verification
- Health check endpoint

### GitHub Actions CI
Automated CI checks run on push/PR via `.github/workflows/ci.yml`:
- Ruff Python linting
- Pytest suite
- Next.js production build check
