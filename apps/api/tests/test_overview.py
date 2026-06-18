def test_overview_shape(client):
    response = client.get("/api/overview")
    assert response.status_code == 200
    body = response.json()
    for key in ("projects", "modules", "runs", "findings", "open_findings", "average_score"):
        assert key in body
    assert set(body["severity_breakdown"]) == {"critical", "high", "medium", "low", "info"}
    assert set(body["module_status_breakdown"]) == {"ready", "beta", "planned"}


def test_overview_reflects_seed(client):
    body = client.get("/api/overview").json()
    assert body["projects"] >= 2
    assert body["modules"] >= 6
    assert body["findings"] >= 5
    assert 0 <= body["average_score"] <= 100
