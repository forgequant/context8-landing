#!/usr/bin/env python3
"""Record an observer problem to .beads/observer/problems.jsonl."""

import argparse
import datetime
import json
import secrets
import sys
from pathlib import Path


def find_repo_root(start: Path) -> Path:
    """Walk up from start until a directory containing .beads/ is found."""
    current = start.resolve()
    while current != current.parent:
        if (current / ".beads").is_dir():
            return current
        current = current.parent
    print("Error: could not find .beads/ directory", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    repo_root = find_repo_root(Path(__file__).parent)
    taxonomy_path = repo_root / ".beads" / "observer" / "taxonomy.json"

    try:
        with open(taxonomy_path) as f:
            taxonomy = json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"Error: cannot load taxonomy: {exc}", file=sys.stderr)
        sys.exit(1)

    valid_categories = list(taxonomy["categories"].keys())

    parser = argparse.ArgumentParser(description="Record an observer problem")
    parser.add_argument("--issue-id", required=True, help="Issue identifier")
    parser.add_argument("--category", required=True, help="Problem category")
    parser.add_argument(
        "--severity",
        required=True,
        choices=["low", "medium", "high", "critical"],
    )
    parser.add_argument(
        "--detection-method",
        required=True,
        choices=[
            "lint-failure",
            "review-comment",
            "execution-failure",
            "post-hoc-fix",
            "diff-analysis",
        ],
    )
    parser.add_argument("--summary", required=True, help="Problem summary")
    parser.add_argument(
        "--verified",
        type=lambda v: v.lower() in ("true", "1", "yes"),
        default=True,
        help="Whether the problem is verified (default: True)",
    )
    parser.add_argument(
        "--resolution-reason",
        choices=["real_fix", "false_alarm", "wont_fix"],
        default="real_fix",
    )

    args = parser.parse_args()

    if args.category not in valid_categories:
        print(
            f"Error: invalid category '{args.category}'. "
            f"Valid: {', '.join(valid_categories)}",
            file=sys.stderr,
        )
        sys.exit(1)

    record = {
        "id": f"obs-{secrets.token_hex(3)}",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "issue_id": args.issue_id,
        "category": args.category,
        "severity": args.severity,
        "detection_method": args.detection_method,
        "summary": args.summary,
        "verified": args.verified,
        "resolution_reason": args.resolution_reason,
    }

    problems_path = repo_root / ".beads" / "observer" / "problems.jsonl"
    try:
        with open(problems_path, "a") as f:
            f.write(json.dumps(record) + "\n")
    except OSError as exc:
        print(f"Error: cannot write to {problems_path}: {exc}", file=sys.stderr)
        sys.exit(1)

    print(
        f"Recorded: {record['id']} [{record['category']}] {record['summary']}",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
