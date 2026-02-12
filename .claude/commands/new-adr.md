---
description: Create a new Architecture Decision Record
---

## User Input

```text
$ARGUMENTS
```

## Workflow

1. **Determine the next ADR number** by listing `docs/adr/` and finding the highest `NNNN-*.md`.

2. **Gather decision context** from user input. If unclear, ask:
   - What problem are we solving?
   - What alternatives did we consider?

3. **Write the ADR** to `docs/adr/NNNN-title.md`:

```markdown
# NNNN: Title

**Status:** accepted
**Date:** YYYY-MM-DD

## Context
What situation requires a decision. Include relevant constraints
and forces that influence the choice.

## Decision
What we decided and why. Be specific about the "why" —
this is the most valuable part for future readers (human and AI).

## Consequences
What follows from this decision:
- Positive: benefits gained
- Negative: trade-offs accepted
- Neutral: things that change but aren't clearly good/bad
```

4. **Show the file** for user review.

## Rules

- Keep ADRs short (under 200 lines). Brevity is a feature.
- "Why" is the most important section — future AI agents read this.
- One decision per ADR. Multiple related decisions → multiple ADRs.
- Never delete ADRs. Supersede with a new one that references the old.
- Status transitions: accepted → superseded | deprecated
