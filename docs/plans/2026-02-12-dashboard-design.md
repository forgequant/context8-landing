# Daily Disagree Dashboard Design

**Date**: 2026-02-12
**Status**: Approved (2-expert brainstorm)
**Scope**: Dashboard UI/UX for crypto intelligence platform (Daily Disagree)

---

## 1. Expert Panel

| Expert | Focus | Key Contribution |
|--------|-------|-------------------|
| Trading Dashboard UX Expert | Layout, IA, interaction patterns, wireframes | Module scorecard design, keyboard nav, filter/sort, aha moment |
| DataViz + Real-time Expert | Charts, colors, real-time performance | Color system, component architecture, WebSocket batching, Zustand store |

---

## 2. Design Philosophy

**"Bloomberg density, not Bloomberg complexity."**

- Dense data display (many values visible without scrolling)
- Modern whitespace and typography hierarchy
- 2-minute scanning window: open, scan conflicts, dig in or move on
- Reading experience first, interactive tool second
- Conflict IS the signal (low conviction = interesting, not bad)

---

## 3. Color System (DD_COLORS)

### Signal Colors

| Token | Hex | Use |
|-------|-----|-----|
| `bullish` | `#4CAF78` | Bull signals |
| `bearish` | `#C94D4D` | Bear signals |
| `neutral` | `#7B8FA0` | Neutral / steel |
| `accent` | `#C49A3C` | Amber — brand, conviction, conflict |

### Conviction Scale (amber gradient)

```
0:  #1A1C21  (graphite-800, no conviction)
3:  #3D3526  (dark amber tint)
5:  #6B5D30  (medium amber)
7:  #9A7E35  (strong amber)
10: #C49A3C  (full amber)
```

### Conflict Severity

```
Low:      #7B8FA0  (steel)
Medium:   #C49A3C  (amber)
High:     #E8853D  (warm orange)
Critical: #C94D4D  (red)
```

### Module Category Colors

```
On-Chain:     #C49A3C  (amber)
Sentiment:    #7DD3FC  (cyan)
Technical:    #A78BFA  (violet)
Derivatives:  #F59E0B  (warm yellow)
Macro:        #60A5FA  (blue)
```

### Colorblind Safety

Every signal uses **color + shape + text** (never color alone):

| Signal | Color | Icon | Label |
|--------|-------|------|-------|
| Bullish | `#4CAF78` | ▲ (up triangle) | BULL |
| Bearish | `#C94D4D` | ▼ (down triangle) | BEAR |
| Neutral | `#7B8FA0` | ◆ (diamond) | NEUT |

WCAG AA compliant on dark backgrounds.

---

## 4. Page Layout

### Main Dashboard (2-column)

```
┌─────────────────────────────────────────────────────────┐
│ PRICE TICKER STRIP (fixed, 40px)                        │
│ [BTC $97,432 ▲+2.1%] [ETH $3,841 ▼-0.3%] [SOL ▲+5.4%]│
├─────────────────────────────────────────────────────────┤
│  HEADLINE BANNER                                        │
│  "78% of crypto Twitter is bullish BTC.                 │
│   4 of 6 Context8 modules disagree. Confidence: 3/10." │
├────────────────────────────┬────────────────────────────┤
│ LEFT COL (60%)             │ RIGHT COL (40%)            │
│                            │                            │
│ MODULE SCORECARD           │ CROWDED TRADE ALERTS       │
│ (grouped pill grid)        │ (gauge cards)              │
│ + Bull/Bear Balance bar    │                            │
│                            │ DIVERGENCE WATCH           │
│ CONFLICT CARDS             │ (compact list)             │
│ (sorted by severity)       │                            │
│                            │ MACRO REGIME               │
│                            │ (summary card)             │
│                            │                            │
│                            │ CONFLICT NETWORK           │
│                            │ (mini SVG, 240x240)        │
├────────────────────────────┴────────────────────────────┤
│ PRICE CHART (lightweight-charts, full width, 400px)     │
│ BTC/USDT candlestick with event markers                 │
├─────────────────────────────────────────────────────────┤
│ CONVICTION HEATMAP (7-day, all modules, CSS Grid)       │
└─────────────────────────────────────────────────────────┘
```

### Mobile (< 768px)

Single column. Order: Headline → Balance bar → Scorecard (horizontal scroll) → Crowded Trades → Conflicts → Price Chart → Divergences → Macro. Heatmap and conflict network hidden.

---

## 5. Module Scorecard

### Grouped Pill Grid (not flat table)

5 category groups arranged vertically. Within each group, modules are horizontal pill-shaped items:

```
ON-CHAIN                                      (amber border)
  [▲ Whale Activity  8] [▼ Exchange Flow  6] [▲ UTXO Age  4]

SENTIMENT                                     (cyan border)
  [▲ Social Volume  7] [▲ Fear & Greed  9] [▼ Funding Sent.  5]
```

Each pill: `[signal_icon  module_name  conviction_number]`

### Pill Design

- Width: auto (min 140px), Height: 36px
- Background: signal color at 10% opacity
- Left border: 3px solid signal color
- Conflict: pulsing amber border glow
- Conviction font-size scales: 0-3 (12px, 50% opacity) → 9-10 (18px, bold, 100%)
- Sorted by conviction descending within category

### Bull/Bear Balance Bar

Horizontal stacked bar (recharts) below scorecard:
```
[████████ BULL ████ NEUT ██████████ BEAR]
 7 Bull / 3 Neutral / 13 Bear
```

### Filtering & Sorting

Filter pills: All | Conflicts Only | High Conviction (>70%) | By Category
Sort: Default (grouped) | Confidence desc | Signal | Conflict intensity

---

## 6. Conflict Visualization

### Conflict Cards (not Sankey)

Vertical list sorted by severity. Each card:

```
┌──────────────────────────────────────────────────────┐
│  ▓▓ CRITICAL                                         │
│  ▲ Funding Rate      vs.      ▼ Social Sentiment     │
│  BEARISH (conf: 8)   ←──⚡──→  BULLISH (conf: 7)    │
│  "Funding shows crowded longs but social at 78..."   │
│  ┌─ Last time: Jan 18 — Funding was right (-14%)  ┐ │
└──────────────────────────────────────────────────────┘
```

- Left border: 4px, severity color
- Resolution hint from `historical_analog` data
- High severity: pulsing glow

### Conviction Inverted Color Logic

Low conviction = visually prominent (amber, highlighted). High conviction = muted. **Conflict is signal.**

### "Fracture Line" Pattern

When adjacent scorecard rows have opposing signals, the border renders as 1px amber instead of default — visible "cracks" draw the eye.

---

## 7. Crowded Trade Alerts

### Semi-Circular Gauge Cards

```
DOGE — CROWDED LONGS
    ╭──────────────╮
   ╱  z-score: 3.2  ╲
  │                  │
  SAFE ████████▎    │ EXTREME
  │     87%         │
   ╲                ╱
    ╰──────────────╯
Contributing: Funding, OI, Social (3/6)
Last Time: Jan 18: -14% in 3 days
```

Implementation: recharts `RadialBarChart` (startAngle: 180, endAngle: 0).

Color thresholds: 0-0.4 Safe (green) → 0.4-0.6 Caution (amber) → 0.6-0.8 High (orange) → 0.8-1.0 Extreme (red).

---

## 8. Live Prices & Real-Time

### Price Ticker Strip

Fixed 40px bar at top. Each item: symbol (muted) + price (primary) + 24h change (signal color). Price flash animation (300ms) on update. JetBrains Mono for all numbers.

### Mini Sparklines

60x20px lightweight-charts `LineSeries`. Color: green if 24h positive, red if negative. No axes, no crosshair, no labels.

### WebSocket Architecture

```
Binance WS → 100ms buffer (requestAnimationFrame) → Zustand batchUpdate → React.memo PriceCells
```

- Single Binance WebSocket connection for all symbols
- `requestAnimationFrame` batching (not `setInterval`) — aligns with browser paint cycle
- Zustand selectors: each `PriceCell` subscribes to only its symbol
- `key={price}` trick: remounts span on change, re-triggers CSS flash animation
- Stale data detection: 30s no-message → "STALE" banner, reconnect

### Connection Status

Small dot: green = connected, amber = reconnecting, red = disconnected. Stale banner shows seconds since last update.

---

## 9. Charts

### Price Chart (lightweight-charts v5)

- Candlestick, 1h default (timeframe selector: 15m/1h/4h/1D)
- Colors: up `#4CAF78`, down `#C94D4D`
- Background: `#0B0C0E`, grid: `#1A1C2133`
- Crosshair: amber (`#C49A3C44`)
- Event markers: colored circles for conflict dates, crowded trade alerts

### Conviction Heatmap (CSS Grid)

7-column (days) x N-row (modules). Each cell: 40x28px, background = amber gradient by conviction. Left border = signal color. Pure CSS Grid + inline styles (42 divs faster than recharts custom ScatterChart).

### Conflict Network (SVG)

240x240px. 5 category clusters in pentagon. Modules as small circles. Conflict lines colored by severity. No D3, no physics — fixed positions with raw SVG.

---

## 10. Interaction Patterns

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Ctrl+K` / `Cmd+K` | Command palette |
| `1`-`4` | Navigate sections |
| `j/k` or `↑/↓` | Scorecard row navigation |
| `Enter/Space` | Expand/collapse module detail |
| `←/→` | Previous/next day report |
| `/` | Focus filter/search |

### Command Palette

Ctrl+K doubles as asset switcher. Typing ticker name → Enter → navigate to asset detail. Supports `compare btc eth` syntax (Phase 2).

### Notifications

New report: amber bar "New report available. [View Report] [Dismiss]". Does not auto-dismiss. Crowded trade alert: red bar at z-score > 2.5. No sound, no browser notifications in v1.

---

## 11. Component File Structure

```
src/components/disagree/
  ModuleScorecard.tsx       — grouped pill grid + balance bar
  ModulePill.tsx            — individual module pill
  BullBearBalance.tsx       — recharts horizontal stacked bar
  ConflictCard.tsx          — conflict detail card
  ConflictList.tsx          — sorted conflict cards
  ConflictNetwork.tsx       — mini SVG node-link diagram
  CrowdedTradeCard.tsx      — gauge + historical analog
  CrowdedTradeGauge.tsx     — recharts RadialBarChart
  ConvictionHeatmap.tsx     — CSS Grid heatmap
  DivergenceWatch.tsx       — compact divergence list
  MacroRegimeCard.tsx       — macro summary card
  PriceTicker.tsx           — fixed top ticker strip
  PriceChart.tsx            — lightweight-charts candlestick
  MiniSparkline.tsx         — 60x20 lightweight-charts line
  WSStatusBanner.tsx        — stale data / disconnect indicator
  HeadlineBanner.tsx        — full-width headline display

src/pages/
  Dashboard.tsx             — layout shell (sidebar + outlet)
  DailyReport.tsx           — main report view
  AssetDetail.tsx           — single asset deep dive
  CrowdedTrades.tsx         — dedicated crowded trades view
  DivergenceWatch.tsx       — dedicated divergence view
  ReportHistory.tsx         — calendar + historical reports

src/stores/
  priceStore.ts             — Zustand WebSocket price store
  uiStore.ts                — UI preferences (filters, collapsed state)

src/hooks/
  useWebSocketPrices.ts     — Binance WS + 100ms rAF buffer
  useDailyDisagreeReport.ts — TanStack Query hook for ctx8-api
  useKeyboardNav.ts         — global keyboard shortcuts

src/lib/
  colors.ts                 — DD_COLORS constant
  signals.ts                — signal display config (icon, color, label)
  formatPrice.ts            — Intl.NumberFormat per-symbol precision
```

---

## 12. Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Page title | Inter | 800 | 1.5rem |
| Section header | JetBrains Mono | 600 | 0.6875rem |
| Module name | JetBrains Mono | 600 | 0.8125rem |
| Detail text | JetBrains Mono | 400 | 0.75rem |
| Signal tag | JetBrains Mono | 600 | 0.625rem |
| Conviction score | JetBrains Mono | 600 | 2rem |

**Rule**: Numeric data = JetBrains Mono. Prose/labels = Inter. Section headers = JetBrains Mono uppercase, letter-spacing 0.06em.

---

## 13. Opinionated Decisions

1. **Do not auto-refresh** the report. Data changes once/day. Use TanStack Query `staleTime: 1hr`.
2. **Do not paginate** the scorecard. 23 modules fit in one scroll.
3. **Do not use tabs** for asset switching. Use command palette + conflict strip.
4. **Cache last report** for instant display. Show stale data immediately, update in background.
5. **Sidebar 48px collapsed**, not 64px. Every pixel matters on 1440px laptops.
6. **Crowded trades on RIGHT** side. F-pattern: primary content left, actionable right.
7. **No radar charts** for module confidence. Tables + bars beat charts for scanning.
8. **Headline banner fixed 120px**. Truncate long headlines. Scorecard always above fold.
9. **First-visit only**: staggered row reveal (50ms delay). After first visit, instant load.
