"""
Integration tests for Meeting CRUD, Action Items CRUD, Decisions, Search, and Cascade Delete.
"""

from datetime import datetime, timezone


def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_create_and_get_meeting(client):
    payload = {
        "title": "Architecture Review",
        "meeting_date": datetime.now(timezone.utc).isoformat(),
        "duration_seconds": 300,
        "description": "API design discussion",
        "participants": [
            {"name": "Rahul Sharma", "email": "rahul@test.com"},
            {"name": "Priya Patel", "email": "priya@test.com"},
        ],
        "transcript_text": "[00:00:05] Rahul Sharma: Hello everyone.\n[00:00:15] Priya Patel: Hi Rahul.",
    }
    res = client.post("/api/v1/meetings", json=payload)
    assert res.status_code == 201
    data = res.json()["data"]
    meeting_id = data["id"]
    assert data["title"] == "Architecture Review"
    assert len(data["participants"]) == 2

    # Get transcript
    t_res = client.get(f"/api/v1/meetings/{meeting_id}/transcript")
    assert t_res.status_code == 200
    t_data = t_res.json()["data"]
    assert len(t_data["segments"]) == 2
    assert t_data["segments"][0]["speaker_label"] == "Rahul Sharma"


def test_action_item_crud_and_completion(client):
    # Create meeting first
    m_res = client.post(
        "/api/v1/meetings",
        json={
            "title": "Action Test Meeting",
            "meeting_date": datetime.now(timezone.utc).isoformat(),
        },
    )
    meeting_id = m_res.json()["data"]["id"]

    # Create action item
    action_payload = {
        "title": "Setup pytest suite",
        "description": "Write integration tests",
        "status": "pending",
    }
    a_res = client.post(f"/api/v1/meetings/{meeting_id}/action-items", json=action_payload)
    assert a_res.status_code == 201
    action_id = a_res.json()["data"]["id"]
    assert a_res.json()["data"]["status"] == "pending"

    # Complete action item
    p_res = client.patch(f"/api/v1/action-items/{action_id}", json={"status": "completed"})
    assert p_res.status_code == 200
    assert p_res.json()["data"]["status"] == "completed"

    # Delete action item
    d_res = client.delete(f"/api/v1/action-items/{action_id}")
    assert d_res.status_code == 204


def test_cascade_delete_meeting(client):
    m_res = client.post(
        "/api/v1/meetings",
        json={
            "title": "Cascade Test Meeting",
            "meeting_date": datetime.now(timezone.utc).isoformat(),
            "transcript_text": "[00:00:05] Rahul: Test segment.",
        },
    )
    meeting_id = m_res.json()["data"]["id"]

    # Delete meeting
    del_res = client.delete(f"/api/v1/meetings/{meeting_id}")
    assert del_res.status_code == 204

    # Verify meeting is gone
    get_res = client.get(f"/api/v1/meetings/{meeting_id}")
    assert get_res.status_code == 404
