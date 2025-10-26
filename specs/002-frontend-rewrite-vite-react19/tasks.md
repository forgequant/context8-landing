# Tasks: Context8 Landing Page - Modern Frontend Rewrite

**Input**: Design documents from `/specs/002-frontend-rewrite-vite-react19/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Unit tests (Vitest) and E2E tests (Playwright) will be implemented for each user story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend-v2 project**: `frontend-v2/src/`, `frontend-v2/tests/`
- All tasks create files in the new `/frontend-v2` directory
- Existing Next.js app in `/app` remains untouched during development

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Vite + React 19 project with Tailwind CSS v4 and Framer Motion

- [ ] T001 Create `frontend-v2/` directory at repository root
- [ ] T002 Initialize Vite project with React + TypeScript template in `frontend-v2/`
- [ ] T003 [P] Install core dependencies: `react@19`, `react-dom@19`, `framer-motion@12`, `tailwindcss@next`
- [ ] T004 [P] Install utility libraries: `clsx`, `tailwind-merge` in `frontend-v2/`
- [ ] T005 [P] Install dev dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `playwright` in `frontend-v2/`
- [ ] T006 Configure Vite with path aliases in `frontend-v2/vite.config.ts`
- [ ] T007 [P] Configure Tailwind CSS with dark theme colors in `frontend-v2/tailwind.config.ts`
- [ ] T008 [P] Configure TypeScript with strict mode in `frontend-v2/tsconfig.json`
- [ ] T009 [P] Configure Vitest for unit tests in `frontend-v2/vitest.config.ts`
- [ ] T010 [P] Configure Playwright for E2E tests in `frontend-v2/playwright.config.ts`
- [ ] T011 Create project directory structure: `src/{components,hooks,data,styles,lib}` in `frontend-v2/`
- [ ] T012 [P] Create `frontend-v2/public/{fonts,images}` directories for static assets
- [ ] T013 [P] Create `frontend-v2/tests/{unit,e2e}` directories for test files
- [ ] T014 Create global styles in `frontend-v2/src/styles/globals.css` with Tailwind imports
- [ ] T015 [P] Create font stylesheet in `frontend-v2/src/styles/fonts.css` for JetBrains Mono and Inter
- [ ] T016 [P] Create className utility function in `frontend-v2/src/lib/cn.ts`
- [ ] T017 [P] Create animation variants library in `frontend-v2/src/lib/animations.ts`
- [ ] T018 Update `frontend-v2/src/main.tsx` to import global styles
- [ ] T019 Update `frontend-v2/package.json` with dev/build/test scripts
- [ ] T020 Create `frontend-v2/README.md` with setup and development instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities, hooks, and data structures that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T021 Create `useReducedMotion` hook in `frontend-v2/src/hooks/useReducedMotion.ts`
- [ ] T022 [P] Create `useScrollReveal` hook in `frontend-v2/src/hooks/useScrollReveal.ts`
- [ ] T023 [P] Create `useTypewriter` hook in `frontend-v2/src/hooks/useTypewriter.ts`
- [ ] T024 [P] Create `usePriceAnimation` hook in `frontend-v2/src/hooks/usePriceAnimation.ts`
- [ ] T025 Define TypeScript interfaces in `frontend-v2/src/data/mockPrices.ts` and create mock crypto price data
- [ ] T026 [P] Define TypeScript interfaces in `frontend-v2/src/data/features.ts` and create feature list data
- [ ] T027 [P] Define TypeScript interfaces in `frontend-v2/src/data/pricing.ts` and create pricing tier data
- [ ] T028 [P] Define TypeScript interfaces in `frontend-v2/src/data/codeExamples.ts` and create integration code snippets
- [ ] T029 Create base `Page` layout component in `frontend-v2/src/components/layout/Page.tsx`
- [ ] T030 [P] Create base `Section` layout component in `frontend-v2/src/components/layout/Section.tsx`
- [ ] T031 [P] Create `Container` UI component in `frontend-v2/src/components/ui/Container.tsx`
- [ ] T032 [P] Create `Button` UI component in `frontend-v2/src/components/ui/Button.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - First-Time Visitor Learns Product Value (Priority: P1) 🎯 MVP

**Goal**: Display terminal-style landing page with typewriter hero, features section, and responsive design

**Independent Test**: Open landing page in browser, verify hero types out within 3 seconds, all sections visible, fully responsive on mobile

### Tests for User Story 1

- [ ] T033 [P] [US1] Unit test for `useTypewriter` hook in `frontend-v2/tests/unit/useTypewriter.test.tsx`
- [ ] T034 [P] [US1] Unit test for `useScrollReveal` hook in `frontend-v2/tests/unit/useScrollReveal.test.tsx`
- [ ] T035 [P] [US1] Unit test for `useReducedMotion` hook in `frontend-v2/tests/unit/useReducedMotion.test.tsx`
- [ ] T036 [P] [US1] E2E test for landing page load and hero animation in `frontend-v2/tests/e2e/landing-page.spec.ts`
- [ ] T037 [P] [US1] E2E test for scroll animations in `frontend-v2/tests/e2e/animations.spec.ts`
- [ ] T038 [P] [US1] E2E test for responsive design in `frontend-v2/tests/e2e/responsive.spec.ts`

### Implementation for User Story 1

- [ ] T039 [P] [US1] Create `Cursor` component with blinking animation in `frontend-v2/src/components/terminal/Cursor.tsx`
- [ ] T040 [P] [US1] Create `TypeWriter` component using `useTypewriter` hook in `frontend-v2/src/components/terminal/TypeWriter.tsx`
- [ ] T041 [US1] Create `TerminalHero` component integrating TypeWriter and Cursor in `frontend-v2/src/components/terminal/TerminalHero.tsx`
- [ ] T042 [P] [US1] Create `ScrollReveal` wrapper component using `useScrollReveal` in `frontend-v2/src/components/ui/ScrollReveal.tsx`
- [ ] T043 [P] [US1] Create `AnimatedList` component with stagger animations in `frontend-v2/src/components/ui/AnimatedList.tsx`
- [ ] T044 [US1] Create `HeroSection` using TerminalHero in `frontend-v2/src/components/sections/HeroSection.tsx`
- [ ] T045 [US1] Create `FeaturesSection` with animated checklist in `frontend-v2/src/components/sections/FeaturesSection.tsx`
- [ ] T046 [US1] Create `FooterSection` with links and social icons in `frontend-v2/src/components/sections/FooterSection.tsx`
- [ ] T047 [US1] Create root `App.tsx` assembling all sections in `frontend-v2/src/App.tsx`
- [ ] T048 [US1] Add responsive design breakpoints and mobile-specific styles in `frontend-v2/src/styles/globals.css`
- [ ] T049 [US1] Test hero typewriter animation with `prefers-reduced-motion` enabled
- [ ] T050 [US1] Test scroll reveal animations across all sections

**Checkpoint**: At this point, User Story 1 should be fully functional - landing page with hero, features, footer, all responsive

---

## Phase 4: User Story 2 - Technical User Explores Integration Details (Priority: P2)

**Goal**: Display code examples, ASCII diagram, and integration instructions with syntax highlighting

**Independent Test**: Navigate to integration section, verify ASCII diagram renders, code blocks have syntax highlighting, YAML config is copyable

### Tests for User Story 2

- [ ] T051 [P] [US2] Unit test for `CodeBlock` component in `frontend-v2/tests/unit/CodeBlock.test.tsx`
- [ ] T052 [P] [US2] Unit test for `ASCIIDiagram` component in `frontend-v2/tests/unit/ASCIIDiagram.test.tsx`
- [ ] T053 [P] [US2] E2E test for code block rendering and copy functionality in `frontend-v2/tests/e2e/code-blocks.spec.ts`

### Implementation for User Story 2

- [ ] T054 [P] [US2] Create `CodeBlock` component with syntax highlighting in `frontend-v2/src/components/code/CodeBlock.tsx`
- [ ] T055 [P] [US2] Create `ASCIIDiagram` component for architecture visualization in `frontend-v2/src/components/code/ASCIIDiagram.tsx`
- [ ] T056 [P] [US2] Create `InlineCode` component for small code snippets in `frontend-v2/src/components/code/InlineCode.tsx`
- [ ] T057 [US2] Create `ArchitectureSection` with ASCII diagram in `frontend-v2/src/components/sections/ArchitectureSection.tsx`
- [ ] T058 [US2] Create `IntegrationSection` with code examples in `frontend-v2/src/components/sections/IntegrationSection.tsx`
- [ ] T059 [US2] Add code example data to `frontend-v2/src/data/codeExamples.ts` (YAML, Bash, TypeScript examples)
- [ ] T060 [US2] Integrate ArchitectureSection and IntegrationSection into `frontend-v2/src/App.tsx`
- [ ] T061 [US2] Test syntax highlighting for YAML, Bash, and TypeScript code blocks
- [ ] T062 [US2] Test code block copy functionality with keyboard navigation

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - landing page with code examples and architecture

---

## Phase 5: User Story 3 - Prospective Customer Compares Plans (Priority: P2)

**Goal**: Display pricing comparison table with Free vs Pro tiers, hover effects, mobile-responsive layout

**Independent Test**: Navigate to pricing section, verify Free and Pro columns display correctly, hover effects work, table is readable on mobile

### Tests for User Story 3

- [ ] T063 [P] [US3] Unit test for `PricingTable` component in `frontend-v2/tests/unit/PricingTable.test.tsx`
- [ ] T064 [P] [US3] E2E test for pricing table interactions in `frontend-v2/tests/e2e/pricing.spec.ts`

### Implementation for User Story 3

- [ ] T065 [P] [US3] Create `PricingTable` component with Free/Pro comparison in `frontend-v2/src/components/ui/PricingTable.tsx`
- [ ] T066 [US3] Create `PricingSection` using PricingTable in `frontend-v2/src/components/sections/PricingSection.tsx`
- [ ] T067 [US3] Add pricing tier data to `frontend-v2/src/data/pricing.ts`
- [ ] T068 [US3] Integrate PricingSection into `frontend-v2/src/App.tsx`
- [ ] T069 [US3] Test hover effects on pricing table rows
- [ ] T070 [US3] Test pricing table responsive design on mobile (<768px)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - complete landing page with pricing

---

## Phase 6: User Story 4 - Visitor Sees Live Market Data (Priority: P3)

**Goal**: Display animated cryptocurrency price widget with mock data updates

**Independent Test**: Verify live price widget displays BTC, ETH prices with smooth animation updates every 5 seconds

### Tests for User Story 4

- [ ] T071 [P] [US4] Unit test for `usePriceAnimation` hook in `frontend-v2/tests/unit/usePriceAnimation.test.tsx`
- [ ] T072 [P] [US4] Unit test for `LivePriceWidget` component in `frontend-v2/tests/unit/LivePriceWidget.test.tsx`
- [ ] T073 [P] [US4] E2E test for price widget animation in `frontend-v2/tests/e2e/price-widget.spec.ts`

### Implementation for User Story 4

- [ ] T074 [P] [US4] Create `LivePriceWidget` component with animated tickers in `frontend-v2/src/components/ui/LivePriceWidget.tsx`
- [ ] T075 [US4] Add mock price update logic using `usePriceAnimation` hook in `LivePriceWidget`
- [ ] T076 [US4] Integrate LivePriceWidget into sticky header in `frontend-v2/src/App.tsx`
- [ ] T077 [US4] Test price update animations with smooth fade transitions
- [ ] T078 [US4] Test widget behavior on mobile (compact layout)
- [ ] T079 [US4] Verify no layout shifts (CLS) when prices update

**Checkpoint**: All user stories should now be independently functional - complete landing page with live price widget

---

## Phase 7: User Story 5 - Developer Navigates Site Architecture (Priority: P3)

**Goal**: Ensure component structure is modular, reusable, and follows modern React patterns

**Independent Test**: Examine file structure, verify component separation, check for single-responsibility principle compliance

### Implementation for User Story 5

- [ ] T080 [P] [US5] Create `TerminalWindow` wrapper component in `frontend-v2/src/components/terminal/TerminalWindow.tsx`
- [ ] T081 [P] [US5] Extract shared animation variants to `frontend-v2/src/lib/animations.ts`
- [ ] T082 [P] [US5] Refactor components to use shared animation variants from lib
- [ ] T083 [US5] Create component prop TypeScript interfaces in `frontend-v2/src/components/types.ts`
- [ ] T084 [US5] Add JSDoc comments to all public component APIs
- [ ] T085 [US5] Verify all components follow single-responsibility principle
- [ ] T086 [US5] Verify no component exceeds 150 lines of code (split if needed)

**Checkpoint**: Codebase is well-structured, maintainable, and follows best practices

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Performance optimization, accessibility, and final quality improvements

- [ ] T087 [P] Add web fonts (JetBrains Mono, Inter) to `frontend-v2/public/fonts/`
- [ ] T088 [P] Configure font loading with `font-display: swap` in `frontend-v2/src/styles/fonts.css`
- [ ] T089 [P] Add favicon and meta tags to `frontend-v2/index.html`
- [ ] T090 [P] Implement lazy loading for below-the-fold sections using React.lazy
- [ ] T091 Optimize bundle size: verify <200KB gzipped after production build
- [ ] T092 [P] Add focus-visible styles for keyboard navigation in `frontend-v2/src/styles/globals.css`
- [ ] T093 [P] Add skip-to-content link for screen reader users in `frontend-v2/src/App.tsx`
- [ ] T094 Verify all images have alt text and semantic HTML elements
- [ ] T095 [P] Run Lighthouse audit: verify 90+ desktop, 85+ mobile scores
- [ ] T096 [P] Verify CLS (Cumulative Layout Shift) score < 0.1
- [ ] T097 [P] Test with JavaScript disabled (progressive enhancement)
- [ ] T098 Test `prefers-reduced-motion` disables all animations correctly
- [ ] T099 [P] Add error boundaries for graceful error handling in `frontend-v2/src/App.tsx`
- [ ] T100 Run complete E2E test suite across all browsers (Chrome, Safari, Firefox)
- [ ] T101 Create production build and deploy to Vercel preview
- [ ] T102 [P] Update `frontend-v2/README.md` with final setup and deployment instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P2 → P3 → P3)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent from US1
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent from US1, US2
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Independent from US1-3
- **User Story 5 (P3)**: Can start after US1-4 - Refactors existing code for maintainability

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD approach)
- Components can be built in parallel [P] if they're in different files
- Core components before sections that use them
- Sections before integrating into main App
- Story complete and tested before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (Phase 1)
- All Foundational tasks marked [P] can run in parallel (Phase 2)
- Once Foundational phase completes, all user stories US1-US4 can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for useTypewriter hook in frontend-v2/tests/unit/useTypewriter.test.tsx"
Task: "Unit test for useScrollReveal hook in frontend-v2/tests/unit/useScrollReveal.test.tsx"
Task: "Unit test for useReducedMotion hook in frontend-v2/tests/unit/useReducedMotion.test.tsx"

# Launch all terminal components for User Story 1 together:
Task: "Create Cursor component in frontend-v2/src/components/terminal/Cursor.tsx"
Task: "Create TypeWriter component in frontend-v2/src/components/terminal/TypeWriter.tsx"
```

---

## Parallel Example: User Story 2

```bash
# Launch all code components for User Story 2 together:
Task: "Create CodeBlock component in frontend-v2/src/components/code/CodeBlock.tsx"
Task: "Create ASCIIDiagram component in frontend-v2/src/components/code/ASCIIDiagram.tsx"
Task: "Create InlineCode component in frontend-v2/src/components/code/InlineCode.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T020)
2. Complete Phase 2: Foundational (T021-T032) - CRITICAL
3. Complete Phase 3: User Story 1 (T033-T050)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy to Vercel preview if ready

**Result**: Functional landing page with hero, features, footer - fully responsive

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy (MVP!)
3. Add User Story 2 → Test independently → Deploy (with code examples)
4. Add User Story 3 → Test independently → Deploy (with pricing)
5. Add User Story 4 → Test independently → Deploy (with live prices)
6. Add User Story 5 → Test independently → Deploy (polished codebase)
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (P1)
   - Developer B: User Story 2 (P2)
   - Developer C: User Story 3 (P2)
3. After US1-3 complete:
   - Developer A: User Story 4 (P3)
   - Developer B: User Story 5 (P3)
   - Developer C: Polish tasks
4. Stories complete and integrate independently

---

## Task Summary

**Total Tasks**: 102
- **Setup (Phase 1)**: 20 tasks
- **Foundational (Phase 2)**: 12 tasks
- **User Story 1 (P1)**: 18 tasks
- **User Story 2 (P2)**: 12 tasks
- **User Story 3 (P2)**: 8 tasks
- **User Story 4 (P3)**: 9 tasks
- **User Story 5 (P3)**: 7 tasks
- **Polish (Phase 8)**: 16 tasks

**Parallel Opportunities**: 47 tasks marked [P] can run in parallel within their phase

**Independent Test Criteria**:
- **US1**: Landing page loads, hero types, sections animate, responsive works
- **US2**: Code blocks render with highlighting, ASCII diagram displays
- **US3**: Pricing table shows Free/Pro comparison, hover effects work
- **US4**: Price widget displays and updates smoothly
- **US5**: Component structure is modular and maintainable

**Suggested MVP Scope**: Phases 1-3 (User Story 1 only) = 50 tasks

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths are absolute from repository root: `frontend-v2/src/...`
