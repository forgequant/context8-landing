# Implementation Plan: Context8 Landing Page - Modern Frontend Rewrite

**Branch**: `002-frontend-rewrite-vite-react19` | **Date**: 2025-10-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-frontend-rewrite-vite-react19/spec.md`

## Summary

Complete rewrite of the Context8 landing page using modern web technologies to deliver a high-performance, terminal-aesthetic marketing site. The implementation uses Vite + React 19 for optimal developer experience and runtime performance, Tailwind CSS v4 for utility-first styling with the dark CLI theme, and Framer Motion for smooth scroll-triggered animations and typewriter effects. The landing page will be a static site deployed to Vercel with mock cryptocurrency price data, optimized for sub-2s load times and 60fps animations while maintaining accessibility and progressive enhancement principles.

## Technical Context

**Language/Version**: TypeScript 5.3+, React 19.0.0, Node.js 20+
**Primary Dependencies**: Vite 6.0+, Tailwind CSS 4.0+, Framer Motion 12.0+, React DOM 19.0+
**Storage**: N/A (static site with in-memory mock data)
**Testing**: Vitest for unit tests, Playwright for E2E tests
**Target Platform**: Modern browsers (Chrome 90+, Safari 14+, Firefox 88+, Edge 90+), mobile-responsive (320px+)
**Project Type**: Web (frontend-only static site)
**Performance Goals**: Lighthouse score 90+ (desktop) / 85+ (mobile), FCP < 1.5s, 60fps animations, bundle < 200KB gzipped
**Constraints**: Accessibility WCAG 2.1 AA, progressive enhancement (works without JS), prefers-reduced-motion support
**Scale/Scope**: Single-page landing site, 7 sections, ~15 reusable components, ~10 animation variants

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### V. Dark-Theme UX ✅ PASS

**Principle**: Dark theme and minimal copy; avoid cognitive load.

**Compliance**:
- ✅ Dark color scheme (#0B0C0E background, #E6E8EC text, #7DD3FC accent) specified in FR-011
- ✅ Minimal design with terminal aesthetic reduces cognitive load
- ✅ Mobile-responsive design specified in FR-008
- ✅ Concise content in terminal/code sections aligns with minimal copy principle

**Justification**: Landing page fully embraces dark theme and minimal design philosophy. No violations.

### VII. Operational Simplicity ✅ PASS

**Principle**: Minimal dependencies; predictable builds; reproducible deploys.

**Compliance**:
- ✅ Modern stack (Vite + React 19) uses minimal, well-maintained dependencies
- ✅ Locked dependency versions through package-lock.json
- ✅ Static site deployment (Vercel) ensures reproducible builds
- ✅ No complex build pipeline - Vite handles bundling efficiently
- ✅ Mock data eliminates external API dependencies for landing page

**Justification**: Implementation uses proven, stable dependencies. Static site architecture is inherently simple. No violations.

### Other Principles - Not Applicable

- **I. AI-First Architecture**: N/A (landing page doesn't involve MCP server architecture)
- **II. Minimal Surface Area**: N/A (landing page is marketing content, OAuth is out of scope per OOS-002)
- **III. Deterministic Format**: N/A (applies to MCP report format, not landing page)
- **IV. Modular Adapters**: N/A (no data adapters needed for static mock data)
- **VI. Privacy-First Telemetry**: N/A (analytics out of scope per OOS-007)

### Technology Stack Alignment ✅ PASS

**Constitution Stack**: Next.js (App Router) + React + TypeScript + TailwindCSS

**Proposed Stack**: Vite + React 19 + TypeScript + Tailwind CSS v4

**Deviation Analysis**:
- **Frontend Framework**: Vite instead of Next.js
  - **Justification**: Landing page is a static marketing site with no server-side rendering needs. Vite provides:
    - Faster dev experience (instant HMR)
    - Simpler build process (no server components complexity)
    - Smaller bundle size (no Next.js runtime overhead)
    - Static export matches deployment target (Vercel static hosting)
  - **Alignment**: Both use React + TypeScript + Tailwind, maintaining core stack consistency
  - **Risk**: Low - Vite is production-ready and widely adopted for static sites

**Verdict**: Deviation is justified and maintains spirit of constitution (operational simplicity, minimal dependencies)

## Project Structure

### Documentation (this feature)

```text
specs/002-frontend-rewrite-vite-react19/
├── spec.md              # Feature specification (/speckit.specify output)
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 research findings
├── data-model.md        # Phase 1 component data structures
├── quickstart.md        # Phase 1 developer setup guide
├── contracts/           # Phase 1 component APIs and prop interfaces
│   ├── components.md    # Component interface definitions
│   └── animations.md    # Animation variant specifications
├── checklists/          # Quality validation checklists
│   └── requirements.md  # Spec quality validation (already completed)
└── tasks.md             # Phase 2 implementation tasks (/speckit.tasks output)
```

### Source Code (repository root)

**Structure Decision**: New Vite application in `/frontend-v2` directory to avoid conflicts with existing Next.js app during parallel development. After completion and testing, this will replace the current `/app` structure.

```text
frontend-v2/                    # New Vite-based landing page
├── public/                     # Static assets
│   ├── fonts/                  # JetBrains Mono, Inter web fonts
│   └── images/                 # Logos, icons, diagrams
├── src/
│   ├── components/
│   │   ├── terminal/           # Terminal-themed components
│   │   │   ├── TerminalHero.tsx        # Hero section with typewriter effect
│   │   │   ├── TypeWriter.tsx          # Typewriter animation hook/component
│   │   │   ├── Cursor.tsx              # Blinking cursor component
│   │   │   └── TerminalWindow.tsx      # Terminal container wrapper
│   │   ├── code/               # Code display components
│   │   │   ├── CodeBlock.tsx           # Syntax-highlighted code display
│   │   │   ├── ASCIIDiagram.tsx        # ASCII art architecture diagram
│   │   │   └── InlineCode.tsx          # Inline code snippets
│   │   ├── sections/           # Page sections
│   │   │   ├── HeroSection.tsx         # Main hero with terminal animation
│   │   │   ├── FeaturesSection.tsx     # Animated feature checklist
│   │   │   ├── ArchitectureSection.tsx # ASCII diagram + explanation
│   │   │   ├── IntegrationSection.tsx  # Code examples + YAML config
│   │   │   ├── PricingSection.tsx      # Free vs Pro comparison table
│   │   │   └── FooterSection.tsx       # Links, social, copyright
│   │   ├── ui/                 # Reusable UI primitives
│   │   │   ├── LivePriceWidget.tsx     # Animated crypto price ticker
│   │   │   ├── ScrollReveal.tsx        # Scroll-triggered fade-in wrapper
│   │   │   ├── AnimatedList.tsx        # Sequential list animation
│   │   │   ├── Button.tsx              # Styled button component
│   │   │   └── Container.tsx           # Responsive container wrapper
│   │   └── layout/             # Layout components
│   │       ├── Page.tsx                # Root page wrapper
│   │       └── Section.tsx             # Section container with spacing
│   ├── hooks/                  # Custom React hooks
│   │   ├── useTypewriter.ts            # Typewriter animation logic
│   │   ├── useScrollReveal.ts          # Intersection Observer for animations
│   │   ├── useReducedMotion.ts         # Detect prefers-reduced-motion
│   │   └── usePriceAnimation.ts        # Mock price update logic
│   ├── data/                   # Mock data and constants
│   │   ├── mockPrices.ts               # Cryptocurrency mock prices
│   │   ├── features.ts                 # Feature list data
│   │   ├── pricing.ts                  # Pricing tier information
│   │   └── codeExamples.ts             # Integration code snippets
│   ├── styles/                 # Global styles
│   │   ├── globals.css                 # Tailwind imports + custom CSS
│   │   └── fonts.css                   # Font-face declarations
│   ├── lib/                    # Utility functions
│   │   ├── cn.ts                       # Class name utility (clsx + tailwind-merge)
│   │   └── animations.ts               # Framer Motion animation variants
│   ├── App.tsx                 # Root application component
│   ├── main.tsx                # Vite entry point
│   └── vite-env.d.ts           # Vite TypeScript declarations
├── tests/                      # Test files
│   ├── unit/                   # Component unit tests (Vitest)
│   │   ├── typewriter.test.tsx
│   │   ├── price-widget.test.tsx
│   │   └── scroll-reveal.test.tsx
│   └── e2e/                    # End-to-end tests (Playwright)
│       ├── landing-page.spec.ts
│       ├── animations.spec.ts
│       └── responsive.spec.ts
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TypeScript config for Vite build
├── vitest.config.ts            # Vitest test configuration
├── playwright.config.ts        # Playwright E2E test config
└── README.md                   # Setup and development guide
```

**Rationale**:
- Separate `/frontend-v2` directory allows parallel development without disrupting existing Next.js app
- Component structure follows feature-based organization (terminal, code, sections, ui, layout)
- Hooks extracted for reusability and testability
- Mock data centralized in `/data` for easy updates
- Tests co-located with source in `/tests` directory for clarity

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations detected. All complexity is justified:

| Decision | Justification |
|----------|---------------|
| Vite instead of Next.js | Static site doesn't need SSR; Vite provides simpler, faster build for this use case |
| Framer Motion library | Implementing custom spring physics and gesture animations would add significant complexity |
| Separate `/frontend-v2` directory | Allows parallel development and A/B testing before replacing existing app |
