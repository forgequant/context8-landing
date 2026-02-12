# Trader UI/UX Stack Decision

**Date**: 2026-02-12
**Status**: Approved (5-expert validation)
**Scope**: Frontend stack for crypto intelligence dashboard (Daily Disagree)

---

## 1. Decision Process

### Expert Panel (5 agents, parallel)

| Expert | Role | Key Contribution |
|--------|------|------------------|
| Skeptic / Devil's Advocate | Attack every choice, find risks | Caught Tailwind 4 blocker, library count explosion |
| AI-Assisted Dev Researcher | What stacks work best with AI agents | Confirmed shadcn/recharts as AI-optimal |
| Trading Platform Veteran | Built 3 production trading platforms | WebSocket architecture, missing production pieces |
| Fintech Stack Researcher | Actual stacks of Binance/Bybit/TradingView | Validated React+TS+lightweight-charts as industry standard |
| DX Expert | Developer experience for 1-2 person team | Cut library count from 46 to 23, time estimates |

### Prior Research (4 agents, parallel)

| Expert | Focus |
|--------|-------|
| Financial DataViz Expert | Charting libraries comparison |
| Trading UI/UX Component Expert | Data grids, panels, keyboards |
| Real-time Data Architecture Expert | WebSocket, state management, caching |
| Bundle Size / Performance Expert | Current deps audit, code splitting |

---

## 2. Unanimous Decisions (all experts agree)

| Decision | Rationale |
|----------|-----------|
| **React 19.2 + Vite 7 + TypeScript 5.x** | Binance, Bybit, TradingView all use React+TS. Vite 10x faster than Next.js for dashboards |
| **lightweight-charts v5** | Best OSS financial charting. TradingView's own library. Apache 2.0. 40KB gzip |
| **TanStack Query v5** | Server state, cache, retry, devtools. AI generates excellent code for it |
| **shadcn/ui** | v0.dev generates shadcn by default. MCP server exists for Claude Code. AI-optimal |
| **No Effect.ts** | Overengineering for MVP. Steep FP learning curve. Insufficient AI training data |
| **No Next.js** | Overkill for internal dashboard. Vite is faster for dev |
| **Tailwind 3.4 (NOT 4.1)** | See debate #1 below |

---

## 3. Key Debates & Verdicts

### Debate 1: Tailwind 3.4 vs 4.1 — VERDICT: 3.4

**Severity: BLOCKER (5/5)**

| Expert | Position |
|--------|----------|
| Skeptic | BLOCKER. HMR 20x slower in 4.1.x. Dev/prod parity issues. Tailwind Labs 75% layoffs |
| AI Researcher | v3 preferred. AI models trained on v3 data. `@theme` directive may confuse AI |
| DX Expert | v3. Alpha risk in production unacceptable |

**Evidence:**
- [Tailwind 4.1.x HMR regression](https://github.com/tailwindlabs/tailwindcss/issues/17522): 2.3-3s vs 100-200ms in 4.0
- [Dev/prod parity issues](https://medium.com/@pradeepgudipati/downgrading-from-tailwind-css-v4-to-v3): classes silently purged in production
- `@tailwindcss/vite` peer dep: `vite ^5.2 || ^6` — does NOT support Vite 7

**Action:**
- Remove `@tailwindcss/postcss@4.1.16` (package conflict)
- Stay on `tailwindcss@3.4.18`
- Revisit Tailwind 4 when: Vite 7 support added + 6 months post-stable + community stabilization

### Debate 2: visx vs recharts — VERDICT: Keep recharts

| Expert | Position |
|--------|----------|
| Skeptic | visx = 2 weeks learning tax (D3). recharts works in 15 minutes |
| AI Researcher | recharts has **166x** more weekly downloads. AI generates far better code for it |
| DX Expert | 3 charting libs is insane. lightweight-charts + recharts is enough |

**Action:** Keep recharts (already installed). Add visx only if recharts can't handle a specific visualization.

### Debate 3: Zustand — VERDICT: Add, narrow role

| Expert | Position |
|--------|----------|
| Trading Veteran | Zustand sufficient for 90% of trading UIs. Proven on 3 platforms |
| Skeptic | Could start without it. TanStack Query covers 90% |
| DX Expert | Redundant. TanStack Query is enough |

**Compromise:** Add Zustand (3KB) for:
- WebSocket price store (batched updates from WS → Zustand → components)
- UI state (theme, active filters, watchlist, panel layout)
- NOT for server state (that's TanStack Query's job)

### Debate 4: WebSocket approach — VERDICT: react-use-websocket for MVP

| Expert | Position |
|--------|----------|
| Trading Veteran | "react-use-websocket is a trap for production." No backpressure, no heartbeat |
| Skeptic | Well-maintained (300K downloads/week, 1121 stars). Fine for now |
| DX Expert | Native WebSocket + 30 lines of code is simpler |

**Action:**
- MVP: react-use-websocket (auto-reconnect, simple API)
- Production (1000+ users): custom WebSocket manager (singleton, message pooling, rAF batching)
- Key Binance quirk: requires pong response or disconnects after 5 min

### Debate 5: Library count — VERDICT: Aggressive reduction

DX Expert calculated proposed stack = **46 libraries**, 71 hours learning, 33 hours config.

**Principle:** Add libraries ONE AT A TIME to solve REAL problems. Not upfront.

---

## 4. Final Stack

### Core (keep/already installed)

| Library | Size (gzip) | Role |
|---------|-------------|------|
| react 19.2 + react-dom | ~45KB | Framework |
| react-router-dom 7.x | ~12KB | Routing |
| tailwindcss 3.4 | ~8KB CSS | Styling |
| lightweight-charts 5.x | ~40KB | Financial charts (OHLCV, candlesticks) |
| recharts 3.x | ~45KB | General visualizations (scorecards, bars) |
| framer-motion 12.x | ~40KB | Animations (replace with View Transitions later) |
| date-fns 4.x | ~2-10KB | Date formatting (tree-shakes well) |
| clsx + tailwind-merge | ~2.5KB | Tailwind utilities |
| @vercel/analytics | ~3KB | Analytics |
| qrcode.react | ~8KB | Payment QR codes (lazy-loaded) |

### Add now

| Library | Size (gzip) | Role |
|---------|-------------|------|
| **@tanstack/react-query v5** | ~16KB | Server state: reports, user data. Cache, retry, devtools |
| **zustand v5** | ~3KB | Client state: WS prices, theme, filters, watchlist |
| **shadcn/ui** (5-7 components) | ~35KB | UI primitives: Table, Command, Badge, Tooltip, Dialog, Card, Toast |

### Add later (when needed)

| Library | Trigger | Size |
|---------|---------|------|
| @tanstack/react-table | Tables need sorting/filtering/virtualization | ~15KB |
| react-hotkeys-hook | More than 5 keyboard shortcuts | ~2.5KB |
| valibot | Complex form validation needed | ~1.4KB |
| react-resizable-panels | Users request resizable panels | ~8KB |
| decimal.js | Financial calculations with precision | ~12KB |

### Remove

| Library | Size saved | Reason |
|---------|-----------|--------|
| @supabase/supabase-js | -30KB | Migrating to ctx8-api (direct fetch) |
| @openai/chatkit-react | -25KB | Verify usage, likely unused |
| @tailwindcss/postcss 4.1 | conflict | Package conflict with tailwindcss 3.4 |

### Not adding

| Library | Reason |
|---------|--------|
| visx | recharts covers needs. visx = D3 learning curve. AI knows recharts 166x better |
| Tailwind 4 | Unstable. AI trained on v3. Vite 7 not supported |
| @nivo/heatmap | YAGNI. No heatmap in MVP requirements |
| Sonner | shadcn Toast (Radix) already included |
| TanStack Virtual | CSS `content-visibility: auto` for MVP |
| Zod | 17KB. Valibot (1.4KB) when needed, but not yet |
| Effect.ts | FP learning curve. Insufficient AI training data. Overengineering |
| Next.js / MUI / Ant Design | Bloat. Unnecessary for internal dashboard |

---

## 5. Bundle Budget

```
LANDING PAGE (initial):     ~35KB gzip
  react + react-dom + router + tailwind + clsx

DASHBOARD (lazy):           +~100KB gzip
  lightweight-charts + recharts + TanStack Query
  + Zustand + shadcn components

PAYMENT MODAL (on click):   +~8KB gzip
  qrcode.react

TOTAL MAX:                  ~143KB gzip
```

**vs current bundle: ~207KB (31% reduction)**

---

## 6. Architecture

### Data Flow

```
React Components
    |
    +-- TanStack Query --- REST --- ctx8-api (Go)
    |   (daily reports, user data)
    |   staleTime: 1 hour, gcTime: 10 min
    |
    +-- Zustand --- localStorage (persist middleware)
    |   (theme, watchlist, filters, panel layout)
    |
    +-- Zustand (price store) <--- WebSocket
        (live prices, 50+ symbols)
        react-use-websocket -> buffer 100ms -> batch update
```

### Feature-to-Library Mapping

| Feature | Library |
|---------|---------|
| Candlestick price charts | lightweight-charts |
| Module Scorecard (bull/bear grid) | recharts (BarChart) + shadcn Table |
| Conviction Scores (0-10) | recharts (RadialBarChart) or CSS |
| Crowded Trade Alerts | shadcn Card + Badge + lightweight-charts (mini sparklines) |
| Divergence Watch | recharts (custom viz) |
| Data tables (assets, alerts) | shadcn Table (add TanStack Table later) |
| Command palette (Ctrl+K) | shadcn Command (cmdk) |
| Panel layout | CSS Grid (add react-resizable-panels later) |
| Toasts/alerts | shadcn Toast (Radix) |
| Keyboard shortcuts | Native onKeyDown (add react-hotkeys-hook later) |
| Real-time prices | react-use-websocket -> Zustand |
| Daily reports | TanStack Query (REST from ctx8-api) |

---

## 7. Production Essentials (from Trading Veteran)

Must implement from day 1, not "later":

### Error Boundaries
```tsx
<ErrorBoundary fallback={<ChartError />}>
  <LightweightChart symbol={symbol} />
</ErrorBoundary>
```
Charts crash on bad data. One bad candle must not kill the app.

### Connection Status Indicator
```tsx
// Red banner if no WS updates for 30s
<WSStatusBanner status="connected" lastUpdate="2s ago" />
```
Traders MUST know if data is stale.

### Number Formatting
```typescript
// Different assets need different precision
const PRECISION: Record<string, number> = {
  BTCUSDT: 2,   // $50,000.12
  ETHUSDT: 2,   // $3,000.45
  SHIBUSDT: 8,  // $0.00001234
};

// Use Intl.NumberFormat, NOT .toFixed(2)
const formatPrice = (price: number, symbol: string) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: PRECISION[symbol] ?? 2,
    maximumFractionDigits: PRECISION[symbol] ?? 2,
  }).format(price);
```

### Color-Blind Accessibility
```tsx
// Don't rely on red/green alone. Add icons.
<span className={bullish ? 'text-green-500' : 'text-red-500'}>
  {bullish ? '▲' : '▼'} {value}
</span>
```
10% of users are color-blind.

### Observability
```typescript
// Log WS events from day 1. Without this, you're flying blind.
const logWSEvent = (event: string, data: unknown) => {
  console.log(`[WS] ${event}`, data);
  // TODO: Send to Sentry/PostHog when ready
};
```

---

## 8. AI-Friendliness Assessment

Source: Builder.io "React + AI Stack for 2026", v0.dev defaults, shadcn MCP server

| Library | AI Training Data | AI Generation Quality |
|---------|------------------|----------------------|
| React 19 | Massive | Excellent |
| TypeScript | Massive | Excellent |
| Tailwind 3 | Massive | Excellent (v4 = less data) |
| shadcn/ui | High (60K+ GitHub stars, v0 default) | Excellent (MCP server exists) |
| TanStack Query | High | Excellent |
| Zustand | High (2026 default state manager) | Good |
| recharts | Very High (8.5M downloads/week) | Excellent |
| lightweight-charts | Medium | Good (specialized API) |
| visx (NOT using) | Low (51K downloads/week) | Poor (D3 complexity) |

**Key insight:** "The best stack in 2026 is the one AI already knows -- clear conventions, minimal magic, the kind of code it can read, write, and debug without hallucinating." (patterns.dev)

---

## 9. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| shadcn/ui maintenance tax (you own the code) | 3/5 | Track component versions. Start with 5, not 15. Quarterly update check |
| react-use-websocket limits at scale | 3/5 | OK for MVP. Plan custom WS manager for 1000+ users |
| recharts performance with 50+ assets | 2/5 | Memoize aggressively. Lazy-render off-screen charts |
| Zustand + TanStack Query overlap | 2/5 | Clear boundary: Zustand = client state, TQ = server state |
| framer-motion bundle (40KB) | 2/5 | Replace with View Transitions API + CSS when Safari stable |
| Tailwind 3.4 EOL | 1/5 | Revisit Tailwind 4 in mid-2026 when ecosystem stabilizes |

---

## 10. When to Revisit

| Trigger | Action |
|---------|--------|
| Tailwind 4 stable + Vite 7 support + 6 months | Evaluate upgrade from 3.4 |
| Tables need sorting/filtering/virtualization | Add @tanstack/react-table |
| 5+ keyboard shortcuts | Add react-hotkeys-hook |
| Form validation complexity | Add valibot (~1.4KB) |
| 1000+ concurrent WebSocket users | Replace react-use-websocket with custom manager |
| recharts can't render a specific viz | Evaluate visx for that ONE component |
| Financial calculations need precision | Add decimal.js |
| User panels need resize/drag | Add react-resizable-panels |

---

## 11. References

### Industry Stacks
- TradingView: React + TypeScript + lightweight-charts (StackShare)
- Binance: TypeScript + React (Himalayas, StackShare)
- Bybit: Next.js + Preact + Vite (Crunchbase, w3techs)
- Deribit: Erlang/OTP backend + TradingView charting (BitcoinWiki)

### Research Sources
- [Builder.io: React + AI Stack for 2026](https://www.builder.io/blog/react-ai-stack-2026)
- [patterns.dev: React 2026](https://www.patterns.dev/react/react-2026/)
- [shadcn MCP for Claude Code](https://www.shadcn.io/mcp/claude-code)
- [Tailwind 4.1 HMR regression](https://github.com/tailwindlabs/tailwindcss/issues/17522)
- [Valibot vs Zod](https://valibot.dev/guides/comparison/)
- [TanStack Query vs SWR](https://tanstack.com/query/v5/docs/framework/react/comparison)

### Project Docs
- Landing page design: `docs/plans/2026-02-12-landing-design-decisions.md`
- Daily Disagree product: `docs/plans/2026-02-11-daily-disagree-design.md`
- ctx8-api design: `~/personal/ctx8-api/docs/plans/2026-02-11-ctx8-api-design.md`
