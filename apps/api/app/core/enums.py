from enum import StrEnum


class Severity(StrEnum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"
    info = "info"


class FindingStatus(StrEnum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    suppressed = "suppressed"


class RunStatus(StrEnum):
    queued = "queued"
    running = "running"
    completed = "completed"
    failed = "failed"


class ModuleStatus(StrEnum):
    ready = "ready"
    beta = "beta"
    planned = "planned"


SEVERITY_ORDER = [
    Severity.critical,
    Severity.high,
    Severity.medium,
    Severity.low,
    Severity.info,
]

SEVERITY_WEIGHT = {
    Severity.critical: 5,
    Severity.high: 4,
    Severity.medium: 3,
    Severity.low: 2,
    Severity.info: 1,
}
