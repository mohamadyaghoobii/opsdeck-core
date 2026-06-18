from fastapi.testclient import TestClient
from app.main import app


def test_health():
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_overview():
    client = TestClient(app)
    response = client.get("/api/overview")
    assert response.status_code == 200
    data = response.json()
    assert "projects" in data
    assert "severity_counts" in data
