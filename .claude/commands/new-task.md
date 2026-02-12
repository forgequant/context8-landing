---
description: Create a new beads task with strict orx-style scope contract
---

## User Input

```text
$ARGUMENTS
```

## Workflow

1. **Parse intent** from user input. If vague, ask ONE clarifying question.

2. **Create beads issue** with `bd create`:
   - `--title`: imperative, concise (e.g., "Add WebSocket price store")
   - `--type`: task | bug | feature
   - `--priority`: 0-4 (0=critical, 4=backlog)

3. **Fill the scope contract** using `bd update <id> --description="..."`:

```markdown
## Objective
One sentence: what is the concrete result.

## Must-Haves (max 3)
- [ ] First deliverable
- [ ] Second deliverable
- [ ] Third deliverable (only if needed)

## Non-Goals
- What this task explicitly does NOT do

## Constraints
- Technical or process constraints

## Verification
```bash
npm run typecheck              # no errors
npm run lint                   # no errors
npm test -- --run              # all pass
```
```

4. **Set acceptance criteria** with `bd update <id> --acceptance-criteria="..."`:

```markdown
- [ ] Specific measurable condition
- [ ] Another condition
```

5. **Show the created issue** with `bd show <id>` for user review.

## Rules

- **Max 3 Must-Haves.** If more work found → create a separate issue.
- **Verification must be runnable commands**, not vague statements.
- **Non-Goals prevent scope creep** — explicitly state what's out.
- Do NOT use `bd edit` (blocks agents). Use `bd update` with inline values.
- Link to design doc or ADR in Constraints if relevant.
