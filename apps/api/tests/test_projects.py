def test_list_projects(client):
    response = client.get("/api/projects")
    assert response.status_code == 200
    projects = response.json()
    assert len(projects) >= 2
    assert {"id", "name", "slug", "environment"} <= set(projects[0])


def test_create_project(client):
    payload = {"name": "Edge Gateway", "owner": "networking-team", "environment": "production"}
    response = client.post("/api/projects", json=payload)
    assert response.status_code == 201
    created = response.json()
    assert created["name"] == "Edge Gateway"
    assert created["slug"] == "edge-gateway"


def test_create_project_validation(client):
    response = client.post("/api/projects", json={"name": "x"})
    assert response.status_code == 422
