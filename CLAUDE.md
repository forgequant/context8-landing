# context8-landing — Development Conventions

## Project

Crypto intelligence landing + dashboard (React/TypeScript). Daily Disagree product.
Stack decision: `docs/plans/2026-02-12-trader-ui-stack.md`
Landing design: `docs/plans/2026-02-12-landing-design-decisions.md`

## Active Technologies

- TypeScript 5.x (via Vite 7), React 19.2
- Tailwind CSS 3.4 (NOT 4.x — see stack doc for rationale)
- shadcn/ui, TanStack Query v5, Zustand v5, lightweight-charts v5, recharts v3

## Task Management: orx + beads

Every task is a **strict scope contract** in beads:

```markdown
## Objective
One sentence: what is the result.

## Must-Haves (max 3)
> Specify EXACT pattern/code, not concept names.
> Config/style files: include canonical content inline or under Constraints.
> Multi-repo: annotate each item with its working directory.
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

## Non-Goals
> "What would an enthusiastic agent add that I'd reject in review?"
> Consider: Extra components? Tests? Auth? Animations? Refactoring? Optimization?
- 3+ items minimum

## Constraints
> Exact versions always (React 19.2, Tailwind 3.4 — never "latest").
> Multi-file: list Files to Create and Files to Modify with full paths.
> Cross-repo: **Working directory:** ~/path/to/repo
- Relevant technical/process constraints

## Verification
> Inline comment on every command = expected output.
```bash
npm run typecheck              # no errors
npm run lint                   # no errors
npm test -- --run              # all pass
```

## Acceptance Criteria
> Must map to a Verification command. No subjective words (working, correct, proper).
> Measurable thresholds: bundle <150KB gzip, 0 lint errors, 200 status code.
- [ ] `command or artifact` → expected: measurable outcome
```

Rules:
- Max 3 must-haves per task. New work discovered → new beads issue.
- Run Verification commands (LOCAL section) before declaring "done", report results.
- Do NOT use `bd edit` (blocks agents). Use `bd update <id> --description="..."`.

## Commit Messages

Commits are AI-readable development history. Format:

```
<type>: <what changed> (imperative, lowercase)

Goal: what we wanted to achieve
Why: why this change matters / what problem it solves
How: brief technical approach (optional, for non-obvious changes)

Refs: beads-xxx (if applicable)
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `infra`

**"Why" is mandatory for `feat`, `fix`, `refactor`.** Optional for `docs`, `test`, `chore`, `infra` (but encouraged).

## Quality Gates (prek)

Pre-commit checks:
- `npm run typecheck` — TypeScript compiles
- `npm run lint` — ESLint passes
- `npm test -- --run` — Vitest passes
- beads contract lint — task format valid
- commit message format — has type + why

## Dependency Gate

Before adding ANY npm dependency, evaluate with `/dep-review`:
1. Why built-in React/browser APIs are insufficient
2. Bundle size, maintenance status, npm downloads
3. AI code generation quality (does Claude/Copilot know this lib?)
4. Check `docs/plans/2026-02-12-trader-ui-stack.md` approved/rejected lists

## Task Runner

All commands go through `task` (Taskfile.yml):

```bash
task check         # typecheck + lint + test (all quality gates)
task dev           # run dev server
task test          # vitest
task lint          # eslint
task done          # session completion: check + git status + bd sync
task bd:ready      # find available work
task hooks:install # install git hooks
```

## Session Protocol

Before saying "done":
```
[ ] 1. task done              (quality gates + beads sync)
[ ] 2. git add <files>        (stage changes)
[ ] 3. git commit             (with proper message)
[ ] 4. bd sync                (sync any new beads)
[ ] 5. git push               (push to remote)
```

## Team Workflow (parallel agents)

### Agents (`.claude/agents/`)

| Agent | Role | Skills | When |
|-------|------|--------|------|
| `dev` | Implement features from beads tasks | `/feature-dev`, `/superpowers:test-driven-development` | Task needs code |
| `tester` | Verify implementations, write tests | `/superpowers:verification-before-completion` | After dev completes |
| `reviewer` | Code review for quality + security | `/code-review`, `/superpowers:requesting-code-review` | After test passes |

### Task Flow

```
bd ready → dev implements → dev verifies → tester validates → reviewer approves → bd close
```

### Launching Parallel Teams

Use Task tool with `team_name` to spawn parallel agents. Each task in beads maps to one dev agent. Independent tasks (no `blocked_by`) run in parallel.

```
Wave 1 (no deps):     AUTH-1, DASH-1, INFRA-1        → 3 parallel devs
Wave 2 (after wave 1): AUTH-2, DASH-2, DASH-7         → 3 parallel devs
Wave 3 (after wave 2): AUTH-3, DASH-3..6               → 5 parallel devs
Wave 4 (after wave 3): AUTH-4, DASH-8..10              → 4 parallel devs
```

### Spawning a Dev Agent

```
Task tool:
  subagent_type: "general-purpose"
  team_name: "impl"
  prompt: "You are a dev agent. Read .claude/agents/dev.md for your role.
           Your task: bd show <task-id>. Implement it following the scope contract."
```

### Spawning a Tester Agent

```
Task tool:
  subagent_type: "general-purpose"
  team_name: "impl"
  prompt: "You are a tester agent. Read .claude/agents/tester.md for your role.
           Verify task: bd show <task-id>. Run all verification commands."
```

### Rules

- One beads task = one dev agent. Never split one task across agents.
- Dev agent commits but does NOT push. Team lead pushes after review.
- If dev discovers new work → `bd create` a new issue, do NOT expand scope.
- Tester runs after dev sends completion message. Not before.
- Reviewer runs after tester sends APPROVE. Not before.
- Team lead coordinates via SendMessage, assigns tasks via beads.

## Architecture Decision Records

For non-obvious technical decisions, create `docs/adr/NNNN-title.md`.
Use `/new-adr` command.

## Design Docs

- Stack: `docs/plans/2026-02-12-trader-ui-stack.md`
- Auth: `docs/plans/2026-02-12-zitadel-auth-design.md`
- Dashboard: `docs/plans/2026-02-12-dashboard-design.md`
- Daily Disagree: `docs/plans/2026-02-11-daily-disagree-design.md`

## Project Structure

```text
src/                    React application
tests/                  Test files
scripts/                Build & quality scripts
  beads_contract_lint.py  Task contract validator
  commit_msg_lint.py      Commit message validator
  observer_record.py      Observer problem recorder
  observer_close_hook.py  Binary artifact detector
  hooks/                  Git hooks (versioned)
docs/
  plans/                Design documents
  adr/                  Architecture decision records
.beads/
  observer/             Observer system (taxonomy + problems)
```

<!-- MANUAL ADDITIONS START -->

## DEPLOYMENT RULES

### Vercel Deployment
**NEVER create a new Vercel project via CLI!**

`npx vercel --prod` without linking to existing project creates a NEW project, losing all settings:
- Environment variables
- Custom domains
- Build settings

### Correct deploy process:

1. **Always check existing project**: `cat .vercel/project.json`
2. **If project linked** (.vercel/ exists): `git push origin main` (Vercel auto-deploys)
3. **Manual deploy**: `npx vercel --prod` (only if .vercel/project.json exists)
4. **If .vercel/ missing**: `npx vercel link` first, then deploy

### Current project:
- **Name**: `context8-landing`
- **Custom domain**: `context8.markets`
- **Env vars**: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

<!-- MANUAL ADDITIONS END -->
