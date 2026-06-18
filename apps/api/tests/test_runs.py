def _first_ids(client):
    project = client.get("/api/projects").json()[0]
    module = client.get("/api/modules").json()[0]
    return project["id"], module["id"]


def test_list_runs(client):
    response = client.get("/api/runs")
    assert response.status_code == 200
    runs = response.json()
    assert len(runs) >= 3
    assert runs[0]["project_name"]
    assert runs[0]["module_name"]


def test_create_run(client):
    project_id, module_id = _first_ids(client)
    payload = {"project_id": project_id, "module_id": module_id, "target": "test-target", "score": 91}
    response = client.post("/api/runs", json=payload)
    assert response.status_code == 201
    run = response.json()
    assert run["score"] == 91
    assert run["completed_at"] is not None


def test_create_run_unknown_project(client):
    _, module_id = _first_ids(client)
    payload = {"project_id": "does-not-exist", "module_id": module_id, "target": "x"}
    response = client.post("/api/runs", json=payload)
    assert response.status_code == 404
