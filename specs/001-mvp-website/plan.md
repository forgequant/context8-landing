# Implementation Plan: MVP Website (Landing, Dashboard, Auth)

**Branch**: `001-mvp-website` | **Date**: 2025-10-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-mvp-website/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build the Context8 MVP website with OAuth-gated landing page, user dashboard, and authentication system. The website serves as the primary entry point for users to discover Context8's AI-ready crypto MCP service, sign up via OAuth (Google/GitHub), and manage their account through a minimal dashboard showing plan details and available data sources.

**Primary Requirement**: Dark-themed, mobile-responsive web application with three main pages:
1. Landing page with hero, value props, plans, FAQ
2. OAuth authentication flow (Google/GitHub)
3. Dashboard showing plan, usage, and data sources

**Technical Approach**: Next.js App Router with server-side rendering, Auth.js for OAuth, TailwindCSS + shadcn/ui for dark theme UI, centralized YAML-based site copy, deployed to Vercel (frontend) with session management.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 18.x (LTS)
**Primary Dependencies**: Next.js 14+ (App Router), React 18+, Auth.js (NextAuth), TailwindCSS 3.x, shadcn/ui, next-themes
**Storage**: Database for user/session storage (PostgreSQL recommended for production, SQLite acceptable for MVP development)
**Testing**: Vitest for unit tests, Playwright for E2E testing
**Target Platform**: Web (Vercel deployment), modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: Web application (Next.js frontend with integrated backend via API routes)
**Performance Goals**:
  - Landing page < 2s load on 3G
  - Lighthouse score 90+ mobile/desktop
  - OAuth flow < 30s end-to-end
  - Above-the-fold content < 2s on 3G
**Constraints**:
  - OAuth-only authentication (no email/password)
  - Dark theme by default (light mode optional future enhancement)
  - Mobile-first responsive design (320px - 2560px viewports)
  - No JavaScript required for core content visibility (progressive enhancement)
  - 100 concurrent users maximum for MVP
**Scale/Scope**:
  - ~5-10 pages/routes (landing, auth, dashboard, privacy, terms, status)
  - 2 OAuth providers (Google, GitHub)
  - 2 user roles (Free, Pro)
  - 4 data sources displayed in dashboard
  - MVP targets < 100 concurrent users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: AI-First Architecture ✅ PASS

**Gate**: Features should prioritize server-side data assembly; avoid client-heavy processing.

**Status**: Not directly applicable to website (this principle applies to MCP server); website serves as UI/auth layer only. No violations.

### Principle II: Minimal Surface Area ✅ PASS

**Gate**: All endpoints must require OAuth authentication except public landing page and auth routes.

**Status**: PASS - Specification explicitly requires:
- FR-011: OAuth authentication for all endpoints except /, /auth/signin, and static assets
- FR-018: HTTP 401 for unauthenticated requests
- No public API endpoints

**Compliance**: All protected routes (/dashboard, /billing) behind OAuth. Landing page (/) is public as intended.

### Principle III: Deterministic Format ✅ PASS

**Gate**: Website content should follow stable, versioned structure.

**Status**: PASS - Centralized site copy in YAML files (site_copy.yaml):
- FR-029: Centralized brand copy
- FR-030: Consistent tone guidelines
- FR-032: Consistent CTA labels across pages

**Compliance**: Static content in version-controlled YAML ensures deterministic rendering.

### Principle IV: Modular Adapters ⚠️ NOT APPLICABLE

**Gate**: External integrations should be modular and hot-swappable.

**Status**: NOT APPLICABLE - Website has only OAuth providers (Google/GitHub) which are configured, not custom-built adapters. No data adapter integration in website layer.

### Principle V: Dark-Theme UX ✅ PASS

**Gate**: UI must default to dark theme with minimal clutter.

**Status**: PASS - Explicit requirements:
- FR-002: Landing page dark theme by default
- FR-021: Dashboard dark theme consistent with landing
- FR-030: Concise, factual copy (no hype)
- Constitution: "Dark color scheme by default (light mode optional)"

**Compliance**: next-themes for theme management, TailwindCSS dark mode classes.

### Principle VI: Privacy-First Telemetry ✅ PASS

**Gate**: No analytics by default; PII must be redacted from logs.

**Status**: PASS - Assumptions section confirms:
- Assumption 4: "No analytics tracking is implemented in MVP; telemetry is opt-out by default per constitution"
- Security Assumption 2: "Session tokens stored in secure, HttpOnly cookies; no localStorage usage for sensitive data"

**Compliance**: No analytics libraries in MVP; structured logging with PII redaction for server-side logs.

### Principle VII: Operational Simplicity ✅ PASS

**Gate**: Minimal dependencies; prefer standard patterns; justify complexity.

**Status**: PASS - Technology stack follows Next.js conventions:
- Next.js App Router (standard React framework)
- Auth.js (industry-standard OAuth library)
- TailwindCSS + shadcn/ui (minimal custom CSS)
- Vercel deployment (zero-config hosting)

**Compliance**: No custom authentication, no complex state management, leverages platform defaults.

### Summary

**Gates Passed**: 6/6 applicable gates
**Violations**: 0
**Deferred**: 0
**Not Applicable**: 1 (Modular Adapters - no data adapters in website layer)

All constitutional principles are satisfied. Proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/001-mvp-website/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (input)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── api-routes.yaml  # Next.js API route definitions
│   └── auth-flow.md     # OAuth flow documentation
├── checklists/          # Quality validation
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Next.js App Router structure (Option 2: Web application)

app/
├── (auth)/                    # Auth route group
│   ├── signin/
│   │   └── page.tsx          # Sign-in page (/auth/signin)
│   └── layout.tsx            # Auth layout (if needed)
├── (marketing)/               # Public route group
│   ├── page.tsx              # Landing page (/)
│   ├── privacy/
│   │   └── page.tsx          # Privacy policy
│   ├── terms/
│   │   └── page.tsx          # Terms of service
│   └── status/
│       └── page.tsx          # System status
├── (dashboard)/               # Protected route group
│   ├── dashboard/
│   │   ├── page.tsx          # Dashboard home
│   │   ├── sources/
│   │   │   └── page.tsx      # Data sources view
│   │   ├── plan/
│   │   │   └── page.tsx      # Plan details view
│   │   └── layout.tsx        # Dashboard layout
│   └── billing/
│       └── page.tsx          # Billing/upgrade page
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts      # Auth.js API routes
├── layout.tsx                # Root layout
├── globals.css               # Global styles (TailwindCSS)
└── not-found.tsx             # 404 page

components/
├── ui/                        # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   └── ...
├── landing/                   # Landing page components
│   ├── hero.tsx
│   ├── value-props.tsx
│   ├── how-it-works.tsx
│   ├── plans.tsx
│   ├── faq.tsx
│   └── footer.tsx
├── dashboard/                 # Dashboard components
│   ├── plan-panel.tsx
│   ├── sources-panel.tsx
│   └── dashboard-header.tsx
├── auth/                      # Auth components
│   ├── oauth-buttons.tsx
│   └── signin-form.tsx
└── shared/                    # Shared components
    ├── theme-toggle.tsx       # Dark/light mode toggle (future)
    └── navbar.tsx

lib/
├── auth.ts                    # Auth.js configuration
├── db.ts                      # Database client setup
├── utils.ts                   # Utility functions
└── types.ts                   # TypeScript types

config/
├── site-copy.ts               # Site copy from YAML (or direct export)
└── data-sources.ts            # Data sources configuration

public/
├── og/
│   └── context8.png           # Open Graph image
└── favicon.ico

tests/
├── e2e/                       # Playwright E2E tests
│   ├── landing.spec.ts
│   ├── auth.spec.ts
│   └── dashboard.spec.ts
└── unit/                      # Vitest unit tests
    ├── components/
    └── lib/

.env.local.example             # Environment variable template
.env.local                     # Local environment (gitignored)
next.config.js                 # Next.js configuration
tailwind.config.ts             # TailwindCSS configuration
components.json                # shadcn/ui configuration
tsconfig.json                  # TypeScript configuration
```

**Structure Decision**: Using Next.js App Router with route groups for clear separation of concerns:
- `(marketing)` group: Public landing, legal pages (no auth required)
- `(auth)` group: Authentication flows
- `(dashboard)` group: Protected dashboard routes (auth middleware applied)

This structure aligns with Next.js 14+ conventions, enables layout composition, and supports middleware-based auth protection.

## Complexity Tracking

> **No constitution violations detected. This section is empty.**
