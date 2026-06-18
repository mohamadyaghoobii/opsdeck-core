def test_list_modules(client):
    response = client.get("/api/modules")
    assert response.status_code == 200
    modules = response.json()
    assert len(modules) >= 6
    slugs = {module["slug"] for module in modules}
    assert "kubernetes-review" in slugs
    assert "report-center" in slugs


def test_module_statuses_are_known(client):
    modules = client.get("/api/modules").json()
    for module in modules:
        assert module["status"] in {"ready", "beta", "planned"}
