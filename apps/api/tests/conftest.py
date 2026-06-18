import os
import tempfile
from pathlib import Path

import pytest

_db_file = Path(tempfile.gettempdir()) / "opsdeck_test.db"
if _db_file.exists():
    _db_file.unlink()

os.environ["DATABASE_URL"] = f"sqlite:///{_db_file.as_posix()}"
os.environ["APP_ENV"] = "test"
os.environ["CORS_ORIGINS"] = "http://localhost:3000"

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client
