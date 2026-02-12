#!/usr/bin/env python3
"""Detect untracked binary artifacts in the repo.

Usage: task observer:check-artifacts
Or run directly: python3 scripts/observer_close_hook.py
Advisory only — always exits 0, never blocks.
"""

import subprocess
import sys
from pathlib import Path

BINARY_KEYWORDS = ("ELF", "Mach-O", "PE32", "executable", "shared object")


def find_repo_root(start: Path) -> Path | None:
    """Walk up from start until a directory containing .beads/ is found."""
    current = start.resolve()
    while current != current.parent:
        if (current / ".beads").is_dir():
            return current
        current = current.parent
    return None


def get_untracked_files(repo_root: Path) -> list[str]:
    """Return list of untracked file paths from git status --porcelain."""
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True,
            cwd=repo_root,
        )
    except FileNotFoundError:
        print("Warning: git not found, skipping artifact check", file=sys.stderr)
        return []

    files = []
    for line in result.stdout.splitlines():
        if line.startswith("?? "):
            files.append(line[3:].strip())
    return files


def is_binary(filepath: Path) -> tuple[bool, str]:
    """Check if a file is a binary using the file command. Returns (is_binary, file_type)."""
    try:
        result = subprocess.run(
            ["file", str(filepath)],
            capture_output=True,
            text=True,
        )
    except (FileNotFoundError, OSError):
        return False, ""

    output = result.stdout
    first_line = output.splitlines()[0] if output.splitlines() else ""
    # Skip text files — "Python script text executable" is not a binary
    if "text" in first_line:
        return False, first_line
    for keyword in BINARY_KEYWORDS:
        if keyword in first_line:
            return True, first_line
    return False, first_line


def main() -> None:
    repo_root = find_repo_root(Path(__file__).parent)
    if repo_root is None:
        print("Warning: could not find .beads/ directory, skipping", file=sys.stderr)
        sys.exit(0)

    untracked = get_untracked_files(repo_root)
    if not untracked:
        sys.exit(0)

    observer_script = repo_root / "scripts" / "observer_record.py"
    if not observer_script.exists():
        print(
            f"Warning: {observer_script} not found, skipping recording",
            file=sys.stderr,
        )
        # Still check and warn, just don't record
        for filepath_str in untracked:
            filepath = repo_root / filepath_str
            if not filepath.is_file():
                continue
            found, file_type = is_binary(filepath)
            if found:
                print(
                    f"Warning: untracked binary: {filepath_str} ({file_type})",
                    file=sys.stderr,
                )
        sys.exit(0)

    for filepath_str in untracked:
        filepath = repo_root / filepath_str
        if not filepath.is_file():
            continue

        found, file_type = is_binary(filepath)
        if not found:
            continue

        print(
            f"Warning: untracked binary: {filepath_str} ({file_type})",
            file=sys.stderr,
        )

        summary = f"Untracked binary: {filepath_str} ({file_type})"
        try:
            subprocess.run(
                [
                    sys.executable,
                    str(observer_script),
                    "--issue-id", "auto",
                    "--category", "build-artifact",
                    "--severity", "low",
                    "--detection-method", "post-hoc-fix",
                    "--summary", summary,
                ],
                cwd=repo_root,
            )
        except OSError as exc:
            print(f"Warning: failed to call observer_record.py: {exc}", file=sys.stderr)

    sys.exit(0)


if __name__ == "__main__":
    main()
