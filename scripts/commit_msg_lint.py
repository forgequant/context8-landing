#!/usr/bin/env python3
"""Lint commit messages for context8-landing conventions.

Format:
  <type>: <subject>

  Goal: ...
  Why: ...
  How: ... (optional)

Types: feat, fix, refactor, docs, test, chore, infra
"Why" is mandatory for feat/fix/refactor. Optional for docs/test/chore/infra.
"""
from __future__ import annotations

import pathlib
import re
import sys

VALID_TYPES = {"feat", "fix", "refactor", "docs", "test", "chore", "infra"}
TYPES_REQUIRING_WHY = {"feat", "fix", "refactor"}
TYPE_RE = re.compile(r"^(?P<type>[a-z]+):\s+.+")


def lint_commit_msg(msg: str) -> list[str]:
    errors: list[str] = []
    lines = msg.strip().splitlines()

    if not lines:
        return ["empty commit message"]

    subject = lines[0].strip()

    # Check type prefix
    match = TYPE_RE.match(subject)
    if not match:
        errors.append(f"subject must start with '<type>: ' — valid types: {', '.join(sorted(VALID_TYPES))}")
        return errors

    commit_type = match.group("type")
    if commit_type not in VALID_TYPES:
        errors.append(f"unknown type '{commit_type}' — valid: {', '.join(sorted(VALID_TYPES))}")

    # Check subject length
    if len(subject) > 100:
        errors.append(f"subject too long ({len(subject)} chars, max 100)")

    # For types requiring Why, check body
    if commit_type in TYPES_REQUIRING_WHY:
        body = "\n".join(lines[1:]) if len(lines) > 1 else ""
        if "Why:" not in body and "why:" not in body.lower():
            errors.append(f"'{commit_type}' commits must include 'Why:' in the body")

    return errors


def main() -> int:
    # When called as commit-msg hook, first arg is the message file
    if len(sys.argv) > 1:
        msg_file = pathlib.Path(sys.argv[1])
    else:
        # Default git commit message file
        msg_file = pathlib.Path(".git/COMMIT_EDITMSG")

    if not msg_file.exists():
        # No message to lint (might be running outside commit-msg hook)
        return 0

    msg = msg_file.read_text(encoding="utf-8", errors="replace")

    # Strip comments (lines starting with #)
    clean_lines = [ln for ln in msg.splitlines() if not ln.startswith("#")]
    clean_msg = "\n".join(clean_lines).strip()

    if not clean_msg:
        return 0

    errors = lint_commit_msg(clean_msg)
    if errors:
        print("[COMMIT MSG]", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        print(
            "\nExpected format:\n"
            "  <type>: <subject>\n"
            "  \n"
            "  Goal: what we wanted to achieve\n"
            "  Why: why this change matters\n"
            f"\nTypes: {', '.join(sorted(VALID_TYPES))}",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
