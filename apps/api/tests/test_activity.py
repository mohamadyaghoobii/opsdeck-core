def test_list_activity(client):
    response = client.get("/api/activity")
    assert response.status_code == 200
    events = response.json()
    assert len(events) >= 4
    assert {"kind", "message", "created_at"} <= set(events[0])
