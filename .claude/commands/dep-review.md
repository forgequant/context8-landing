---
description: Review an npm dependency before adding it to the project
---

## User Input

```text
$ARGUMENTS
```

## Workflow

1. **Identify the dependency** from user input (e.g., `zustand`, `@tanstack/react-query`).

2. **Research the dependency**:
   - What does it do? (read its README/docs)
   - How large is it? (bundle size gzip, tree-shaking support)
   - Who maintains it? (org vs individual, last commit date, stars)
   - Is it widely used? (weekly npm downloads)
   - Any known security issues?

3. **Evaluate against built-in alternatives**:
   - Can this be done with React built-ins (useState, useReducer, Context)?
   - Can this be done with browser APIs (fetch, Intl, etc.)?
   - Is the built-in approach reasonable for our use case?

4. **Check against approved stack** in `docs/plans/2026-02-12-trader-ui-stack.md`:
   - Is this already in the "Add now" or "Add later" section?
   - Does it conflict with an existing library?

5. **Present the review** in this format:

```
## Dependency Review: <package>

**Purpose:** what it does and why we need it
**Built-in alternative:** what it would take without this dep
**Bundle size:** Xkb gzip
**Verdict:** APPROVE / REJECT / NEEDS DISCUSSION

### Checklist
- [ ] Built-in insufficient because: <reason>
- [ ] Maintained (last commit < 6 months)
- [ ] Acceptable bundle size (< 50KB gzip)
- [ ] No known CVEs
- [ ] Good AI code generation support (high npm downloads, many examples)

### If approved
- Add to approved list in stack doc
- Create ADR if this is a significant architectural choice
```

## Rules

- **Default is REJECT.** The bar for adding deps is high.
- Built-in + 30 lines of code beats a dependency every time.
- Check `docs/plans/2026-02-12-trader-ui-stack.md` "Not adding" section for already-rejected libs.
- If approved, update stack doc accordingly.
