#!/usr/bin/env python3
"""Lint beads issues for strict scope contracts (orx-style anti-drift).

Validates that all open issues follow the contract template:
  Objective / Must-Haves (≤3) / Non-Goals / Constraints / Verification
  + Acceptance Criteria (beads field)

Standalone — no external dependencies.
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys

SECTION_PATTERNS: dict[str, re.Pattern[str]] = {
    "Objective": re.compile(r"^#{0,6}\s*Objective\s*:?\s*$", re.IGNORECASE),
    "Must-Haves": re.compile(
        r"^#{0,6}\s*Must[- ]Haves(?:\s*\([^)]*\))?\s*:?\s*$", re.IGNORECASE
    ),
    "Non-Goals": re.compile(r"^#{0,6}\s*Non[- ]Goals\s*:?\s*$", re.IGNORECASE),
    "Constraints": re.compile(r"^#{0,6}\s*Constraints\s*:?\s*$", re.IGNORECASE),
    "Verification": re.compile(r"^#{0,6}\s*Verification\s*:?\s*$", re.IGNORECASE),
}

ITEM_RE = re.compile(r"^\s*(?:[-*]|\d+\.)\s+(?P<text>.+?)\s*$")

# Fenced code block detection
CODE_BLOCK_RE = re.compile(r"^```")

# Vague words banned in Acceptance Criteria
VAGUE_AC_WORDS = re.compile(
    r"\b(working|works|correct|correctly|proper|properly|should work|as expected)\b",
    re.IGNORECASE,
)

# Cross-repo path pattern (~/personal/ or absolute home paths)
CROSS_REPO_RE = re.compile(r"~/\w+/|/Users/\w+/personal/")

# Working directory declaration (bold, plain, or list-prefixed)
WORKING_DIR_RE = re.compile(
    r"(?:\*\*)?Working directory(?:\*\*)?[:\s]", re.IGNORECASE
)


def _iter_issues(path: pathlib.Path) -> tuple[list[dict], list[str]]:
    errors: list[str] = []
    issues: list[dict] = []
    if not path.exists():
        return issues, []
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError as exc:
        return issues, [f"failed to read issues file: {exc}"]

    for lineno, line in enumerate(text.splitlines(), start=1):
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith(("<<<<<<<", "=======", ">>>>>>>")):
            errors.append(f"merge conflict marker at line {lineno}")
            continue
        try:
            parsed = json.loads(stripped)
        except json.JSONDecodeError as exc:
            errors.append(f"invalid JSON at line {lineno}: {exc.msg}")
            continue
        if isinstance(parsed, dict):
            issues.append(parsed)
    return issues, errors


def _extract_section_blocks(text: str) -> tuple[dict[str, list[str]], list[str]]:
    lines = text.splitlines()
    errors: list[str] = []
    section_starts: list[tuple[int, str]] = []

    for idx, line in enumerate(lines):
        stripped = line.strip()
        for section, pattern in SECTION_PATTERNS.items():
            if pattern.match(stripped):
                section_starts.append((idx, section))
                break

    seen: set[str] = set()
    for _, section in section_starts:
        if section in seen:
            errors.append(f"duplicate section: {section}")
        seen.add(section)

    if errors:
        return {}, errors

    blocks: dict[str, list[str]] = {}
    section_starts.sort(key=lambda t: t[0])
    for i, (start_idx, section) in enumerate(section_starts):
        end_idx = section_starts[i + 1][0] if i + 1 < len(section_starts) else len(lines)
        content = lines[start_idx + 1 : end_idx]
        while content and not content[0].strip():
            content = content[1:]
        while content and not content[-1].strip():
            content = content[:-1]
        blocks[section] = content
    return blocks, []


def _count_items(lines: list[str]) -> list[str]:
    items: list[str] = []
    for line in lines:
        match = ITEM_RE.match(line)
        if match:
            text = match.group("text").strip()
            if text:
                items.append(text)
    return items


def _has_code_block(lines: list[str]) -> bool:
    """Check if lines contain a fenced code block (```)."""
    count = sum(1 for ln in lines if CODE_BLOCK_RE.match(ln.strip()))
    return count >= 2  # opening + closing


def _get_ac_text(issue: dict, description: str) -> str:
    """Get acceptance criteria text from beads field or description section."""
    acceptance = str(issue.get("acceptance_criteria", "") or "")
    if _count_items(acceptance.splitlines()):
        return acceptance
    ac_match = re.search(
        r"^#{1,6}\s*Acceptance\s+Criteria\s*:?\s*$",
        description,
        re.IGNORECASE | re.MULTILINE,
    )
    if ac_match:
        return description[ac_match.end():]
    return ""


def validate_issue(issue: dict) -> tuple[list[str], list[str]]:
    """Validate issue. Returns (errors, warnings)."""
    errors: list[str] = []
    warnings: list[str] = []
    issue_id = str(issue.get("id", "")).strip() or "<no-id>"
    title = str(issue.get("title", "") or "").strip()
    header = f"{issue_id}: {title}" if title else issue_id

    description = str(issue.get("description", "") or "")
    blocks, block_errors = _extract_section_blocks(description)
    if block_errors:
        return [header] + block_errors, []

    required = ["Objective", "Must-Haves", "Non-Goals", "Constraints", "Verification"]
    for section in required:
        if section not in blocks:
            errors.append(f"missing section: {section}")

    if any(e.startswith("missing section:") for e in errors):
        return [header] + errors, []

    obj_lines = [ln.strip() for ln in blocks.get("Objective", []) if ln.strip()]
    if not obj_lines:
        errors.append("Objective is empty")

    must_haves = _count_items(blocks.get("Must-Haves", []))
    if not must_haves:
        errors.append("Must-Haves must contain 1-3 bullet items")
    elif len(must_haves) > 3:
        errors.append(f"Must-Haves has {len(must_haves)} items (max 3)")

    if not _count_items(blocks.get("Non-Goals", [])):
        errors.append("Non-Goals needs at least 1 item (use '- None' if needed)")

    if not _count_items(blocks.get("Constraints", [])):
        errors.append("Constraints needs at least 1 item (use '- None' if needed)")

    if not _count_items(blocks.get("Verification", [])):
        errors.append("Verification needs at least 1 command/check")

    # Check acceptance_criteria: beads field first, then ## Acceptance Criteria in description
    ac_text = _get_ac_text(issue, description)
    if not _count_items(ac_text.splitlines()):
        errors.append("Acceptance Criteria is missing or has no bullet items")

    # ── New rules (warnings) ─────────────────────────────────────

    # Rule 1: verification-has-code-block (ERROR)
    # Verification section should contain a fenced ```bash block
    verification_lines = blocks.get("Verification", [])
    if verification_lines and not _has_code_block(verification_lines):
        errors.append(
            "Verification should contain a ```bash code block with runnable commands"
        )

    # Rule 2: non-goals-minimum (WARNING)
    # Non-Goals should have 3+ items to prevent scope creep
    non_goals = _count_items(blocks.get("Non-Goals", []))
    if 1 <= len(non_goals) < 3:
        warnings.append(
            f"Non-Goals has only {len(non_goals)} item(s) — consider 3+ to prevent agent scope creep"
        )

    # Rule 3: cross-repo-working-dir (WARNING)
    # If description mentions paths outside this repo, must have Working directory
    if CROSS_REPO_RE.search(description) and not WORKING_DIR_RE.search(description):
        warnings.append(
            "Description references external paths but no **Working directory:** declared"
        )

    # Rule 4: acceptance-no-vague-words (WARNING)
    # Acceptance criteria should not contain subjective words
    if ac_text:
        vague_matches = VAGUE_AC_WORDS.findall(ac_text)
        if vague_matches:
            words = ", ".join(sorted(set(w.lower() for w in vague_matches)))
            warnings.append(
                f"Acceptance Criteria has vague words: {words} — use measurable outcomes"
            )

    # Rule 5: constraints-version-pinned (WARNING)
    # If constraints mention docker images or versions, should have pinned tags
    constraints_text = "\n".join(blocks.get("Constraints", []))
    if re.search(r"\blatest\b", constraints_text, re.IGNORECASE):
        warnings.append(
            "Constraints mention 'latest' — pin exact versions (e.g., node:22, alpine:3.20)"
        )

    if errors:
        return [header] + errors, warnings
    if warnings:
        return [], [header] + warnings
    return [], []


def main() -> int:
    parser = argparse.ArgumentParser(description="Lint beads issues for scope contracts.")
    parser.add_argument(
        "--issues-file", default=".beads/issues.jsonl",
        help="Path to issues JSONL (default: .beads/issues.jsonl)",
    )
    parser.add_argument(
        "--status", choices=["open", "in_progress", "all"], default="all",
        help="Filter by status (default: all non-closed)",
    )
    args = parser.parse_args()

    issues_path = pathlib.Path(args.issues_file).expanduser().resolve()
    issues, load_errors = _iter_issues(issues_path)
    if load_errors:
        for err in load_errors:
            print(f"[ERROR] {err}", file=sys.stderr)
        return 2

    # Lint all non-closed issues (open + in_progress)
    skip_statuses = {"closed", "cancelled", "rejected"}
    if args.status == "all":
        selected = [i for i in issues if str(i.get("status", "")).lower() not in skip_statuses]
    else:
        selected = [i for i in issues if str(i.get("status", "")).lower() == args.status]

    if not selected:
        return 0

    failed = False
    warned = False
    for issue in selected:
        errors, warnings = validate_issue(issue)
        if errors:
            failed = True
            header, *rest = errors
            print(f"[FAIL] {header}", file=sys.stderr)
            for msg in rest:
                print(f"  - {msg}", file=sys.stderr)
        if warnings:
            warned = True
            header, *rest = warnings
            print(f"[WARN] {header}", file=sys.stderr)
            for msg in rest:
                print(f"  - {msg}", file=sys.stderr)

    if failed:
        print(
            "\nFix: ensure description has Objective / Must-Haves (≤3) / "
            "Non-Goals / Constraints / Verification sections; "
            "Acceptance Criteria must have bullet items; "
            "Verification must contain a ```bash code block.",
            file=sys.stderr,
        )
        return 1
    if warned:
        print(
            "\nWarnings above are advisory — consider fixing for better agent executability.",
            file=sys.stderr,
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
