def test_list_findings(client):
    response = client.get("/api/findings")
    assert response.status_code == 200
    findings = response.json()
    assert len(findings) >= 5
    first = findings[0]
    assert {"title", "severity", "status", "remediation", "module_name"} <= set(first)


def test_filter_findings_by_severity(client):
    response = client.get("/api/findings", params={"severity": "high"})
    assert response.status_code == 200
    findings = response.json()
    assert findings
    assert all(item["severity"] == "high" for item in findings)


def test_create_finding(client):
    run = client.get("/api/runs").json()[0]
    payload = {
        "run_id": run["id"],
        "title": "Secret stored in plain text",
        "severity": "critical",
        "target": "config/app.env",
        "remediation": "Move the secret into a managed secret store.",
    }
    response = client.post("/api/findings", json=payload)
    assert response.status_code == 201
    created = response.json()
    assert created["severity"] == "critical"
    assert created["project_id"] == run["project_id"]


def test_create_finding_unknown_run(client):
    payload = {"run_id": "missing", "title": "Orphan finding", "severity": "low"}
    response = client.post("/api/findings", json=payload)
    assert response.status_code == 404
