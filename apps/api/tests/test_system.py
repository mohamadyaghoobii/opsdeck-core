def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["app"]
    assert body["version"]


def test_ready(client):
    response = client.get("/ready")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ready"
    assert body["database"] == "connected"


def test_settings_status(client):
    response = client.get("/api/settings/status")
    assert response.status_code == 200
    body = response.json()
    assert body["environment"] == "test"
    assert "http://localhost:3000" in body["cors_origins"]
