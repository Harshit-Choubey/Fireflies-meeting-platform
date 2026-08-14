"""
Seed script for Fireflies Meeting Intelligence Platform.

Populates realistic sample meetings with complete:
- Participants
- Timed transcript segments (matching sample media duration)
- AI Overview & summaries
- Outline / Key Topics with timestamps
- Decisions with timestamps/evidence links
- Action items with assignees, status, due dates, and evidence links
- Tags
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models.action_item import ActionItem
from app.models.decision import Decision
from app.models.meeting import Meeting
from app.models.participant import MeetingParticipant, Participant
from app.models.summary import Summary
from app.models.tag import MeetingTag, Tag
from app.models.topic import Topic
from app.models.transcript import TranscriptSegment


def seed_data(db: Session) -> None:
    from app.database.database import Base, engine
    Base.metadata.create_all(bind=engine)

    # Check if already seeded
    if db.query(Meeting).first():
        print("Database already contains meetings. Skipping seed.")
        return

    print("Seeding initial meeting intelligence data...")

    # 1. Create Tags
    tag_eng = Tag(name="Engineering", color="#7C4DFF")
    tag_prod = Tag(name="Product", color="#20C997")
    tag_sprint = Tag(name="Sprint", color="#FF922B")
    tag_client = Tag(name="Client", color="#339AF0")

    db.add_all([tag_eng, tag_prod, tag_sprint, tag_client])
    db.flush()

    # 2. Create Participants
    rahul = Participant(name="Rahul Sharma", email="rahul@company.com", avatar_color="#7C4DFF")
    priya = Participant(name="Priya Patel", email="priya@company.com", avatar_color="#FF922B")
    alex = Participant(name="Alex Rivera", email="alex@company.com", avatar_color="#20C997")
    sarah = Participant(name="Sarah Jenkins", email="sarah@company.com", avatar_color="#E599F7")

    db.add_all([rahul, priya, alex, sarah])
    db.flush()

    now = datetime.now()

    # ==========================================
    # Meeting 1: Product Architecture & API Refactor (Primary Demo Meeting)
    # ==========================================
    m1 = Meeting(
        title="Product Architecture & API Refactor Sync",
        meeting_date=now - timedelta(hours=3),
        duration_seconds=180,
        media_url="/media/demo-meeting.mp3",
        media_duration_seconds=180,
        description="Weekly architecture review focusing on FastAPI migration, database indexes, and meeting transcript synchronization logic.",
    )
    db.add(m1)
    db.flush()

    # Link participants
    db.add_all([
        MeetingParticipant(meeting_id=m1.id, participant_id=rahul.id, role="Host / Engineering Lead"),
        MeetingParticipant(meeting_id=m1.id, participant_id=priya.id, role="Product Manager"),
        MeetingParticipant(meeting_id=m1.id, participant_id=alex.id, role="Senior Full-Stack Engineer"),
    ])

    # Link tags
    db.add_all([
        MeetingTag(meeting_id=m1.id, tag_id=tag_eng.id),
        MeetingTag(meeting_id=m1.id, tag_id=tag_prod.id),
        MeetingTag(meeting_id=m1.id, tag_id=tag_sprint.id),
    ])

    # Transcript segments (Timestamps fit 180s total)
    segments_m1 = [
        (0, "Rahul Sharma", rahul.id, 0.0, 15.0, "Welcome everyone to our technical alignment meeting. Today we are reviewing our core API migration to FastAPI and evaluating the database indexing strategy for transcript synchronization."),
        (1, "Priya Patel", priya.id, 15.0, 35.0, "Thanks Rahul. From the product side, our primary focus is ensuring smooth transcript scrolling and zero latency during media playback. Reviewers expect immediate response when clicking any transcript segment."),
        (2, "Alex Rivera", alex.id, 38.0, 65.0, "I have benchmarked SQLite with Write-Ahead Logging (WAL) and foreign keys enabled. Using a composite index on (meeting_id, start_time) allows sub-5ms lookup during player timeupdate events."),
        (3, "Rahul Sharma", rahul.id, 66.0, 95.0, "That is great news Alex. Let's make sure we explicitly enforce foreign keys on every SQLite connection via SQLAlchemy event listeners so cascade deletes function perfectly."),
        (4, "Priya Patel", priya.id, 96.0, 125.0, "Agreed. What is our plan for action item completion in the Notepad UI? Should we wait for network response before updating the checkbox?"),
        (5, "Alex Rivera", alex.id, 126.0, 155.0, "We will use optimistic UI updates with TanStack Query. The checkbox toggles immediately in the visual state, and if the API patch fails, we roll back gracefully with a toast notification."),
        (6, "Rahul Sharma", rahul.id, 156.0, 180.0, "Excellent strategy. Let's finalize the FastAPI router schemas and deploy our seed script so the application is immediately usable by any evaluator."),
    ]

    t_objs_m1 = []
    for seq, speaker, pid, start_t, end_t, txt in segments_m1:
        t = TranscriptSegment(
            meeting_id=m1.id,
            participant_id=pid,
            speaker_label=speaker,
            text=txt,
            start_time=start_t,
            end_time=end_t,
            sequence=seq,
        )
        db.add(t)
        t_objs_m1.append(t)
    db.flush()

    # Summary
    db.add(Summary(
        meeting_id=m1.id,
        overview=(
            "The engineering team aligned on migrating the core API layer to FastAPI with Pydantic contract validation. "
            "Database benchmarks confirmed that SQLite in WAL mode with a composite index on (meeting_id, start_time) "
            "delivers smooth sub-5ms player/transcript synchronization. "
            "The UI architecture will use TanStack Query with optimistic updates for action items to ensure responsive UX."
        ),
        generated_by="seed",
    ))

    # Topics
    db.add_all([
        Topic(
            meeting_id=m1.id,
            title="FastAPI Migration & Architecture",
            description="Overview of routing, Pydantic schemas, and FastAPI service structure.",
            start_time=0.0,
            end_time=35.0,
            order_index=0,
        ),
        Topic(
            meeting_id=m1.id,
            title="Database Indexing & SQLite Performance",
            description="PRAGMA configuration, composite indexing, and WAL mode verification.",
            start_time=38.0,
            end_time=95.0,
            order_index=1,
        ),
        Topic(
            meeting_id=m1.id,
            title="UI Synchronization & Optimistic State",
            description="TanStack Query mutation strategy and PlayerSyncContext interaction.",
            start_time=96.0,
            end_time=180.0,
            order_index=2,
        ),
    ])

    # Decisions
    db.add_all([
        Decision(
            meeting_id=m1.id,
            source_segment_id=t_objs_m1[2].id,
            decision_text="Use SQLite in WAL mode with composite index on (meeting_id, start_time)",
            rationale="Achieves sub-5ms query performance for active segment lookup during media playback.",
        ),
        Decision(
            meeting_id=m1.id,
            source_segment_id=t_objs_m1[5].id,
            decision_text="Adopt optimistic UI updates for Action Item status changes",
            rationale="Provides instant visual feedback for check actions with automatic rollback on network error.",
        ),
    ])

    # Action Items
    db.add_all([
        ActionItem(
            meeting_id=m1.id,
            source_segment_id=t_objs_m1[3].id,
            title="Configure SQLite foreign key event listener in SQLAlchemy",
            description="Ensure PRAGMA foreign_keys=ON is executed on every DB connection pool check-out.",
            assignee_id=alex.id,
            due_date=(now + timedelta(days=2)).date(),
            status="completed",
        ),
        ActionItem(
            meeting_id=m1.id,
            source_segment_id=t_objs_m1[5].id,
            title="Implement TanStack Query optimistic mutation hook for Action Items",
            description="Create useUpdateActionItem hook with onMutate context snapshot and onError rollback.",
            assignee_id=alex.id,
            due_date=(now + timedelta(days=3)).date(),
            status="in_progress",
        ),
        ActionItem(
            meeting_id=m1.id,
            source_segment_id=t_objs_m1[6].id,
            title="Deploy seed-on-startup logic for Vercel / Render environment",
            description="Verify evaluator experience loads instantly populated database on first page load.",
            assignee_id=rahul.id,
            due_date=(now + timedelta(days=4)).date(),
            status="pending",
        ),
    ])

    # ==========================================
    # Meeting 2: Q3 Customer Feedback & Feature Roadmap
    # ==========================================
    m2 = Meeting(
        title="Q3 Customer Feedback & Feature Roadmap",
        meeting_date=now - timedelta(days=1, hours=4),
        duration_seconds=150,
        media_url="/media/demo-meeting.mp3",
        media_duration_seconds=180,
        description="Review of enterprise client feedback regarding meeting summary exports, tag filtering, and search efficiency.",
    )
    db.add(m2)
    db.flush()

    db.add_all([
        MeetingParticipant(meeting_id=m2.id, participant_id=priya.id, role="Product Lead"),
        MeetingParticipant(meeting_id=m2.id, participant_id=sarah.id, role="Customer Success Lead"),
        MeetingParticipant(meeting_id=m2.id, participant_id=rahul.id, role="Engineering Lead"),
    ])

    db.add_all([
        MeetingTag(meeting_id=m2.id, tag_id=tag_prod.id),
        MeetingTag(meeting_id=m2.id, tag_id=tag_client.id),
    ])

    segments_m2 = [
        (0, "Sarah Jenkins", sarah.id, 0.0, 30.0, "Our key enterprise accounts love the automated meeting outline, but they specifically requested Markdown and TXT export options for offline distribution."),
        (1, "Priya Patel", priya.id, 31.0, 75.0, "That aligns with our Q3 roadmap. We can add client-side TXT and Markdown export generators for both transcript and summary views."),
        (2, "Rahul Sharma", rahul.id, 76.0, 120.0, "We can also implement tag filtering across the meetings library so users can instantly filter by Engineering, Sales, or Client calls."),
        (3, "Sarah Jenkins", sarah.id, 121.0, 150.0, "Perfect. That covers the top customer requests for this quarter."),
    ]

    t_objs_m2 = []
    for seq, speaker, pid, start_t, end_t, txt in segments_m2:
        t = TranscriptSegment(
            meeting_id=m2.id,
            participant_id=pid,
            speaker_label=speaker,
            text=txt,
            start_time=start_t,
            end_time=end_t,
            sequence=seq,
        )
        db.add(t)
        t_objs_m2.append(t)
    db.flush()

    db.add(Summary(
        meeting_id=m2.id,
        overview="Customer success presented Q3 feedback highlighting enterprise demand for transcript exports and tag-based library filtering. Engineering confirmed both capabilities fit into the current P1 scope.",
        generated_by="seed",
    ))

    db.add_all([
        Topic(meeting_id=m2.id, title="Enterprise Customer Requests", description="Export formats and offline access needs.", start_time=0.0, end_time=75.0, order_index=0),
        Topic(meeting_id=m2.id, title="Tag System & Library Filtering", description="Categorization strategy for meetings library.", start_time=76.0, end_time=150.0, order_index=1),
    ])

    db.add_all([
        Decision(
            meeting_id=m2.id,
            source_segment_id=t_objs_m2[1].id,
            decision_text="Support TXT and Markdown export for summaries and transcripts",
            rationale="Direct response to enterprise customer workflow requirements.",
        ),
    ])

    db.add_all([
        ActionItem(
            meeting_id=m2.id,
            source_segment_id=t_objs_m2[1].id,
            title="Implement client-side Markdown and TXT exporter",
            description="Format transcript speaker blocks and summary sections for text download.",
            assignee_id=alex.id,
            due_date=(now + timedelta(days=5)).date(),
            status="pending",
        ),
    ])

    # ==========================================
    # Meeting 3: Weekly Engineering Standup & Deployment Check
    # ==========================================
    m3 = Meeting(
        title="Weekly Engineering Standup & Deployment Check",
        meeting_date=now - timedelta(days=3, hours=2),
        duration_seconds=120,
        media_url="/media/demo-meeting.mp3",
        media_duration_seconds=180,
        description="Routine standup covering CI/CD pipelines, Vercel frontend deployments, and Render backend environment setup.",
    )
    db.add(m3)
    db.flush()

    db.add_all([
        MeetingParticipant(meeting_id=m3.id, participant_id=rahul.id, role="Engineering Lead"),
        MeetingParticipant(meeting_id=m3.id, participant_id=alex.id, role="Senior Engineer"),
    ])

    db.add_all([
        MeetingTag(meeting_id=m3.id, tag_id=tag_eng.id),
        MeetingTag(meeting_id=m3.id, tag_id=tag_sprint.id),
    ])

    segments_m3 = [
        (0, "Rahul Sharma", rahul.id, 0.0, 45.0, "Let's quickly check our GitHub Actions CI pipeline. We have ruff linting, pytest, and Next.js production build checks enabled on every push."),
        (1, "Alex Rivera", alex.id, 46.0, 90.0, "All CI workflows are passing cleanly. Deployment environment variables for CORS and API URLs are configured."),
        (2, "Rahul Sharma", rahul.id, 91.0, 120.0, "Great. We are ready for technical evaluation."),
    ]

    t_objs_m3 = []
    for seq, speaker, pid, start_t, end_t, txt in segments_m3:
        t = TranscriptSegment(
            meeting_id=m3.id,
            participant_id=pid,
            speaker_label=speaker,
            text=txt,
            start_time=start_t,
            end_time=end_t,
            sequence=seq,
        )
        db.add(t)
        t_objs_m3.append(t)
    db.flush()

    db.add(Summary(
        meeting_id=m3.id,
        overview="Engineering standup confirmed that automated CI pipelines and production deployment targets are fully verified.",
        generated_by="seed",
    ))

    db.add_all([
        Topic(meeting_id=m3.id, title="CI/CD & Linting Verification", description="GitHub Actions workflow status.", start_time=0.0, end_time=90.0, order_index=0),
    ])

    db.commit()
    print("Seeding complete! 3 sample meetings created successfully.")


if __name__ == "__main__":
    from app.database.database import SessionLocal
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
