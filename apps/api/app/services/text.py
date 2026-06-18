import re

_slug_pattern = re.compile(r"[^a-z0-9]+")


def slugify(value: str) -> str:
    slug = _slug_pattern.sub("-", value.strip().lower()).strip("-")
    return slug or "item"
