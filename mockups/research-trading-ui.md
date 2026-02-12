# Trading Terminal UI/UX Research

**For: Design Team (3 designers)**
**Date: 2026-02-12**
**Purpose: Bloomberg-like trading dashboard mockup reference**

---

## Table of Contents

1. [Bloomberg Terminal Design DNA](#1-bloomberg-terminal-design-dna)
2. [Modern Crypto Trading UIs](#2-modern-crypto-trading-uis)
3. [Data-Dense Dashboard Patterns](#3-data-dense-dashboard-patterns)
4. [Terminal-Aesthetic Web Apps](#4-terminal-aesthetic-web-apps)
5. [2025-2026 Trends](#5-2025-2026-trends)
6. [Recommended Color Palettes](#6-recommended-color-palettes)
7. [Typography Recommendations](#7-typography-recommendations)
8. [Layout Patterns](#8-layout-patterns)
9. [Bull/Bear Color Coding](#9-bullbear-color-coding)
10. [Conflicting Signals & Mixed Data](#10-conflicting-signals--mixed-data)
11. [Reference Links](#11-reference-links)

---

## 1. Bloomberg Terminal Design DNA

### What Makes It Work

Bloomberg Terminal is used by people in high-pressure jobs making mission-critical decisions. The design team implements substantial changes through incremental updates that roll out over weeks, never all at once. Key principles:

- **Information density over aesthetics** -- terminals span 4+ crowded screens with minimal whitespace. More data = more value.
- **Clear hierarchy** -- deliberate use of size, weight, and color to ensure users parse information as fast as possible.
- **Tabbed panel model** -- users customize their workflow by displaying an arbitrary number of tabs/windows across multiple screens.
- **Conceal complexity** -- advanced features are layered, not hidden. Surface-level simplicity with depth on demand.

### Bloomberg Color System

The iconic black-and-amber scheme is Bloomberg's strongest visual hallmark.

| Role | Color | Hex Code |
|------|-------|----------|
| Background | Black | `#000000` |
| Primary text (amber) | Sunshade/Amber | `#FFA028` / `#FFBF00` |
| Alert / Negative | Red | `#FF433D` |
| Links / Interactive | Blue | `#0068FF` |
| Positive / Success | Cyan/Turquoise | `#4AF6C3` |
| Secondary accent | Orange | `#FB8B1E` |

**Accessibility update:** Bloomberg now uses blue (`#0068FF`) and red (`#FF433D`) for semantic color coding (up/down) to support color vision deficiency (CVD). The default amber is reserved for non-semantic information display.

### Bloomberg Typography

- **Primary font:** Bloomberg Prop Unicode N -- custom font designed by Matthew Carter (based on his Georgia typeface).
- **Characteristics:** Monospace-like fixed grid for tabular data, proportional for prose sections.
- **Key insight:** The font was designed specifically for high-density data display, optimizing character clarity at small sizes.

**Source:** [Bloomberg UX: Concealing Complexity](https://www.bloomberg.com/company/stories/how-bloomberg-terminal-ux-designers-conceal-complexity/), [Bloomberg UX: Color Accessibility](https://www.bloomberg.com/ux/2021/10/14/designing-the-terminal-for-color-accessibility/)

---

## 2. Modern Crypto Trading UIs

### TradingView

The industry standard for charting. Key UI characteristics:

- **Core palette:** Dodger Blue `#2962FF`, Mirage (dark bg) `#131722`, White `#FFFFFF`
- **Candlestick defaults:** Green `#0ECB81` (bull), Red `#F6465D` (bear)
- **20+ chart types**, 110+ drawing tools, 400+ built-in indicators
- **CSS custom properties** for theming: `--tv-color-platform-background`, `--tv-color-pane-background`
- **Lightweight Charts dark bg:** `#222222`
- Responsive, drag-to-resize panels with watchlists, alerts, and live news integrated into the main view

**Source:** [TradingView CSS Color Themes](https://www.tradingview.com/charting-library-docs/latest/customization/styles/CSS-Color-Themes/), [TradingView Custom Themes API](https://www.tradingview.com/charting-library-docs/latest/customization/styles/custom-themes/)

### Deribit

Crypto options and derivatives focused:

- **Fully customizable panels** -- drag and drop, rearrange, detach
- **Separate custom trading pages** per asset, strategy, or user
- **Collapsible navigation** at top (no permanent left sidebar) -- maximizes trading screen real estate
- **Unique panels:** Volatility Surface, Options Pricer, Greeks columns in positions table
- **Dark/light toggle** via top-right corner
- **Design principle:** Modularity over rigidity -- traders build their own layout

**Source:** [Deribit: New User Interface](https://insights.deribit.com/exchange-updates/introducing-new-user-interface/)

### Bybit

- **Reimagined interface (Nov 2024):** complete UI overhaul
- **Night mode:** changes entire exchange color palette to darker colors, reducing eye strain
- **Adjustable, detachable, rearrangeable modules**
- **Grid-based layout** for order books, charts, positions, and trade history

**Source:** [Bybit: Reimagined Interface](https://announcements.bybit.com/article/reimagined-bybit-interface-a-new-era-of-simplicity-blt62906a3bd935a414/)

### Coinglass

Specializes in derivatives data visualization:

- **Liquidation Heatmap:** color gradient from low-intensity purple to high-intensity bright yellow
- **Two-axis layout:** horizontal = time, vertical = price levels
- **Bright yellow zones** mark high liquidation concentration areas
- **Color progression:** Deep purple -> magenta -> orange -> bright yellow
- **Design insight:** The heatmap is effective because it encodes three dimensions (time, price, intensity) in a 2D view using color as the third dimension

**Source:** [Coinglass Liquidation Heatmap](https://www.coinglass.com/pro/futures/LiquidationHeatMap)

---

## 3. Data-Dense Dashboard Patterns

### Grafana & Datadog Approach

Both are leaders in monitoring/observability with excellent dark themes.

**Datadog Design System (DRUIDS):**

| Role | Color | Hex |
|------|-------|-----|
| Brand primary | Purple | `#632CA6` |
| Brand secondary | Purple (lighter) | `#774AA4` |

- Accessible color modes for color vision deficiency, low visual acuity, contrast sensitivity
- Default "Classic" palette: 6 distinct colors optimized for readability, repeating if series > 6
- New palettes: Viridis and Plasma for host maps (vibrant in dark mode)

**Source:** [DRUIDS Color System](https://druids.datadoghq.com/foundations/color), [Datadog Dark Mode](https://www.datadoghq.com/blog/introducing-datadog-darkmode/)

### Key Information-Density Techniques

1. **Hide labels, leverage tooltips** -- show specifics only on hover in dense views
2. **Layered disclosure** -- concise summaries on main screens, expandable details on demand
3. **Section headings + tabs** -- prevent cognitive overload while keeping data accessible
4. **Whitespace as zone separator** -- not wasted space, but functional boundaries
5. **Smooth transitions for real-time updates** -- avoid blinking or sudden layout shifts
6. **"Last refreshed" timestamps** -- always show data freshness

**Source:** [Pencil & Paper: Dashboard UX Patterns](https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards), [UXPin: Dashboard Design Principles](https://www.uxpin.com/studio/blog/dashboard-design-principles/)

---

## 4. Terminal-Aesthetic Web Apps

### Warp Terminal

- **Block-based output** -- groups input and output together for easier navigation (invented this pattern)
- **IDE-like editor** in a terminal context
- **Customizable themes library** -- popular and accessible, from minimalist to custom backgrounds
- **Dark-mode-first** design philosophy
- **Colors used:** Dark background with bright blue and bright orange accents (per Berg theme inspiration)

**Source:** [Warp Themes](https://docs.warp.dev/terminal/appearance/themes), [Warp: How We Designed Themes](https://www.warp.dev/blog/how-we-designed-themes-for-the-terminal-a-peek-into-our-process)

### Design Takeaways from Terminal-Aesthetic Apps

- **Monospace is the foundation** but pair with a clean sans-serif for headers/labels
- **Input/output grouping** creates visual rhythm in dense interfaces
- **Subtle borders and depth** using slight background shade differences (not lines)
- **Glow effects sparingly** -- neon accents on dark backgrounds for emphasis, not decoration
- **Command-palette pattern** (Cmd+K) for power users

---

## 5. 2025-2026 Trends

### Dark Mode as Default Standard

- 82.7% of consumers use dark mode on their devices (2025-2026 data)
- No longer optional -- all new designs include toggleable light/dark themes by default
- Goes beyond simple color inversion: deeper blacks, subtle contrasts, carefully chosen accent colors

### Emerging Aesthetics

- **Cyberpunk Era (2026):** Deep blacks paired with Electric Neon, Sunset Coral, Holographic Silver
- **High-contrast, dark-mode-first, glowing** -- the terminal aesthetic is evolving into more dramatic futuristic designs
- **Digital Texture:** interactive elements with physical feedback (press, deform, bounce)
- **Typography as hero:** oversized headlines, expressive fonts, animated type

### Financial Dashboard Specific Trends

- **AI-augmented dashboards:** real-time signal aggregation, anomaly highlighting
- **Multi-dimensional visualization:** risk vs return, price vs volume vs signal, all in one view
- **Real-time streaming updates** with controlled animation (no rapid blinking)
- **Progressive disclosure:** most critical data at top/left, details on demand

**Source:** [2026 UX/UI Trends](https://medium.com/@tanmayvatsa1507/2026-ux-ui-design-trends-that-will-be-everywhere-0cb83b572319), [Dark Mode Design 2026](https://www.digitalsilk.com/digital-trends/dark-mode-design-guide/), [Web Design Trends 2026](https://uxpilot.ai/blogs/web-design-trends-2026)

---

## 6. Recommended Color Palettes

### Palette A: "Bloomberg Modern" (Classic Terminal)

Best for: Traditional finance feel, high information density

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#0A0A0F` | Main background (near-black with slight blue) |
| Surface | `#12121A` | Cards, panels |
| Surface elevated | `#1A1A26` | Modals, dropdowns, active panels |
| Border | `#2A2A3A` | Subtle panel dividers |
| Text primary | `#FFA028` | Amber -- primary data, Bloomberg heritage |
| Text secondary | `#8888A0` | Labels, metadata |
| Text muted | `#555566` | Disabled, tertiary info |
| Accent blue | `#0068FF` | Links, interactive elements |
| Positive/Bull | `#4AF6C3` | Cyan-green for up moves |
| Negative/Bear | `#FF433D` | Red for down moves |
| Warning | `#FB8B1E` | Alerts, attention |
| Highlight | `#FFBF00` | Selected rows, focus states |

### Palette B: "Crypto Pro" (Modern Derivatives)

Best for: Crypto-native audience, TradingView-familiar feel

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#131722` | TradingView dark standard |
| Surface | `#1C2030` | Cards, panels |
| Surface elevated | `#252A3A` | Active panels, modals |
| Border | `#363C4E` | Panel dividers |
| Text primary | `#D1D4DC` | Light gray body text |
| Text secondary | `#787B86` | Labels, metadata |
| Text muted | `#4C4F5C` | Disabled states |
| Accent blue | `#2962FF` | TradingView blue -- links, interactive |
| Positive/Bull | `#0ECB81` | Binance/TradingView green |
| Negative/Bear | `#F6465D` | Binance red |
| Warning | `#F0B90B` | Binance yellow |
| Chart grid | `#1E222D` | Subtle grid lines |

### Palette C: "Midnight Signal" (Futuristic/Cyberpunk)

Best for: Standing out, appeal to younger traders, memorable brand

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#030014` | Ultra-deep near-black with purple tint |
| Surface | `#110E20` | Cards, panels |
| Surface elevated | `#1C192C` | Active areas |
| Border | `#332E42` | Subtle borders |
| Text primary | `#E0DFF0` | Cool white |
| Text secondary | `#8888A0` | Labels |
| Text muted | `#564B5D` | Disabled |
| Accent primary | `#8252C7` | Purple -- brand accent |
| Accent secondary | `#C15BE4` | Light purple -- highlights |
| Positive/Bull | `#55B08C` | Teal green |
| Negative/Bear | `#FF5370` | Warm red-pink |
| Warning | `#FFB74D` | Warm amber |

---

## 7. Typography Recommendations

### Primary Strategy: Monospace for Data, Sans-Serif for UI

| Use Case | Recommended Fonts | Rationale |
|----------|------------------|-----------|
| **Numbers, prices, data cells** | JetBrains Mono, Fira Code, Maple Mono | Fixed-width alignment critical for financial data |
| **Labels, headers, nav** | Inter, SF Pro, Geist Sans | Clean, modern, highly legible at all sizes |
| **Charts, tiny labels** | JetBrains Mono (light weight) | Stays legible at 10-11px |
| **Headlines, section titles** | Inter (semibold/bold) | Draws eye without competing with data |

### Font Pairing Recommendations

**Pairing 1 (Safe/Professional):**
- Data: `JetBrains Mono` (400, 500)
- UI: `Inter` (400, 500, 600)
- Why: Both are free, web-optimized, excellent at small sizes

**Pairing 2 (Bloomberg Feel):**
- Data: `Fira Code` (400, 500)
- UI: `IBM Plex Sans` (400, 500, 600)
- Why: Fira Code has ligatures for operators; IBM Plex echoes the corporate terminal aesthetic

**Pairing 3 (Modern/Distinctive):**
- Data: `Maple Mono` (400, 500)
- UI: `Geist Sans` (400, 500, 600)
- Why: Maple Mono's larger x-height excels for financial data; Geist is the Vercel standard (relevant for Next.js projects)

### Size Scale

```
12px  -- Tiny labels, chart axis values
13px  -- Secondary data, metadata
14px  -- Body text, table cells (base size)
16px  -- Primary data values, important metrics
18px  -- Section headers
20px  -- Panel titles
24px  -- Page-level KPIs, hero numbers
32px  -- Dashboard title / primary metric
```

### Key Insight: Maple Mono for Financial Data

Maple Mono was specifically tested on a large financial dashboard project where "character clarity stood out immediately -- especially for numerical data." Its slightly larger x-height makes numbers more readable at small sizes compared to Fira Code or JetBrains Mono.

**Source:** [Best Monospace Fonts 2025](https://pangrampangram.com/blogs/journal/best-monospace-fonts-2025), [24+ Best Monospace Fonts](https://justcreative.com/best-monospace-fonts-for-coding/)

---

## 8. Layout Patterns

### Pattern 1: Bloomberg Grid (Maximum Density)

```
+------------------+------------------+------------------+
|    WATCHLIST      |     CHART        |   ORDER BOOK     |
|    (scrollable    |   (resizable,    |   (live stream,  |
|     list)         |    dominant)     |    bid/ask)      |
+------------------+                  +------------------+
|   POSITIONS       |                  |   TRADE FORM     |
|   (table)         |                  |   (compact)      |
+------------------+------------------+------------------+
|   NEWS FEED       |   SIGNALS / ALERTS STRIP            |
+------------------+--------------------------------------+
```

- Chart takes ~50% of horizontal space
- Panels are independently scrollable
- All panels visible simultaneously (no tabs hiding data)

### Pattern 2: TradingView Split (Balanced)

```
+------------------------------------------+-------------+
|              CHART (70%)                  | ORDER BOOK  |
|                                           |   (30%)     |
|                                           |             |
+------------------------------------------+             |
|  TABS: [Positions] [Orders] [History]    |             |
|  ----------------------------------------|  TRADE FORM |
|  Table content based on active tab       |             |
+------------------------------------------+-------------+
| STATUS BAR: Connection | Balance | Time | Alerts       |
+--------------------------------------------------------+
```

- Chart dominates (~70% width)
- Bottom panel uses tabs to switch between views
- Right sidebar is fixed for order entry

### Pattern 3: Modular Dashboard (Deribit-style)

```
+-------------+---------------------------+-------------+
|  SIDEBAR    |     MAIN CONTENT          |  SIDEBAR    |
|  (collaps.) |  (user-arranged panels)   |  (optional) |
|             |                           |             |
|  Watchlist  |  +-------+ +----------+  |  Alerts     |
|  Quick nav  |  | Chart | | Heatmap  |  |  Signals    |
|  Signals    |  +-------+ +----------+  |  News       |
|             |  +--------------------+   |             |
|             |  |   Positions Table  |   |             |
|             |  +--------------------+   |             |
+-------------+---------------------------+-------------+
```

- Fully customizable panel arrangement
- Drag-drop to rearrange
- Collapsible sidebars maximize main content
- User saves layouts per strategy/asset

### Pattern 4: Signal Dashboard (AI/Analytics Focus)

```
+--------------------------------------------------------+
|  SIGNAL HEADER: Overall Bias [BULLISH] | Confidence 73% |
+------------------+-------------------------------------+
|  SIGNAL CARDS    |         MAIN CHART                   |
|  (stacked,       |  (with overlaid signal markers)      |
|   color-coded)   |                                      |
|                  |                                      |
|  [Long Signal]   +-------------------------------------+
|  [Short Signal]  |  SIGNAL DETAILS / REASONING          |
|  [Neutral]       |  (expandable cards with evidence)    |
|  [Conflicting]   |                                      |
+------------------+-------------------------------------+
|  BOTTOM: Timeframe selector | Data freshness | Sources  |
+--------------------------------------------------------+
```

- Left panel shows signal list with status colors
- Main area shows chart with signal annotations
- Bottom area expands to show reasoning/evidence

---

## 9. Bull/Bear Color Coding

### Standard Approaches

| Market | Bull (Up) | Bear (Down) | Notes |
|--------|-----------|-------------|-------|
| Western default | Green `#00FF00` | Red `#FF0000` | Most common but harsh |
| TradingView | Green `#0ECB81` | Red `#F6465D` | Softer, modern standard |
| Binance | Green `#0ECB81` | Red `#F6465D` | Matches TradingView |
| Bloomberg | Cyan `#4AF6C3` | Red `#FF433D` | Accessible by design |
| East Asian markets | Red (up) | Green (down) | Cultural -- red = prosperity |

### Accessible Alternatives (Colorblind-Safe)

| Option | Bull (Up) | Bear (Down) | CVD Type Supported |
|--------|-----------|-------------|-------------------|
| Blue/Orange | `#2962FF` | `#FF6D00` | All types |
| Blue/Red | `#0068FF` | `#FF433D` | Bloomberg standard |
| Teal/Pink | `#4AF6C3` | `#FF5370` | Protanopia, Deuteranopia |
| Blue/Yellow | `#2196F3` | `#FFB300` | All types |

### Recommendations

1. **Default to TradingView standard** (`#0ECB81` / `#F6465D`) -- users already recognize it
2. **Offer Bloomberg-accessible mode** (`#0068FF` / `#FF433D`) as a setting
3. **Always pair color with a secondary indicator:** arrows (up/down), +/- prefix, or filled/hollow candles
4. **Never rely on color alone** -- a 2019 study in *Displays* showed reduced accuracy when charts relied solely on red-green coding

**Source:** [Bloomberg Color Accessibility](https://www.bloomberg.com/company/stories/designing-the-terminal-for-color-accessibility/), [Smashing Magazine: Designing for Colorblindness](https://www.smashingmagazine.com/2024/02/designing-for-colorblindness/)

---

## 10. Conflicting Signals & Mixed Data

### The Problem

Trading dashboards often show multiple indicators that disagree -- e.g., RSI says overbought while MACD shows bullish crossover. Designers must present conflicting information without misleading the user.

### Pattern: Signal Confidence Cards

```
+---------------------------------------------+
|  SIGNAL CARD                                 |
|  [LONG]  Confidence: 62%                     |
|  =========---------- (progress bar)          |
|                                              |
|  Bullish:  MACD crossover, Volume surge      |
|  Bearish:  RSI overbought, Resistance near   |
|  Neutral:  Funding rate flat                  |
+---------------------------------------------+
```

### Design Techniques for Mixed Signals

1. **Color as signal, not decoration** -- assign stable meanings:
   - Neutral gray for chrome/structure
   - Single highlight color for "pay attention"
   - Reserved color for risk/alerts

2. **Confidence bars / gauges** -- show strength of signal (0-100%) rather than binary bull/bear

3. **Split-color indicators** -- for conflicting signals, use a gradient bar:
   - Left side: bull color (green/blue)
   - Right side: bear color (red/orange)
   - Position of the center marker shows net bias

4. **Evidence stacking** -- list individual indicators with their individual signals:
   ```
   RSI (14)     [OVERBOUGHT]  -- red badge
   MACD         [BULLISH]     -- green badge
   Volume       [ABOVE AVG]   -- green badge
   Funding      [NEUTRAL]     -- gray badge
   ```

5. **Explicit "MIXED" state** -- use a distinct visual treatment:
   - Amber/yellow badge with striped pattern
   - Diagonal split background (half green, half red)
   - "Conflicting" label with a warning icon

6. **Centralized data source** -- ensure all metrics pull from one governed dataset to prevent conflicting numbers across panels

**Source:** [Pencil & Paper: Data Dashboards](https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards), [DataCamp: Dashboard Design](https://www.datacamp.com/tutorial/dashboard-design-tutorial)

---

## 11. Reference Links

### Bloomberg
- [Bloomberg UX: Concealing Complexity](https://www.bloomberg.com/company/stories/how-bloomberg-terminal-ux-designers-conceal-complexity/)
- [Bloomberg UX: Color Accessibility](https://www.bloomberg.com/ux/2021/10/14/designing-the-terminal-for-color-accessibility/)
- [Bloomberg Customer-Centric Design](https://www.bloomberg.com/company/stories/bloombergs-customer-centric-design-ethos/)
- [UX Magazine: Impossible Bloomberg Makeover](https://uxmag.com/articles/the-impossible-bloomberg-makeover)
- [Bloomberg Color Palette (Hex)](https://www.color-hex.com/color-palette/111776)
- [Berg VS Code Theme (Bloomberg-inspired)](https://github.com/jx22/berg)

### Trading Platforms
- [TradingView CSS Color Themes](https://www.tradingview.com/charting-library-docs/latest/customization/styles/CSS-Color-Themes/)
- [TradingView Custom Themes API](https://www.tradingview.com/charting-library-docs/latest/customization/styles/custom-themes/)
- [TradingView Lightweight Charts Colors](https://tradingview.github.io/lightweight-charts/tutorials/customization/chart-colors)
- [Deribit New UI](https://insights.deribit.com/exchange-updates/introducing-new-user-interface/)
- [Bybit Reimagined Interface](https://announcements.bybit.com/article/reimagined-bybit-interface-a-new-era-of-simplicity-blt62906a3bd935a414/)
- [Coinglass Liquidation Heatmap](https://www.coinglass.com/pro/futures/LiquidationHeatMap)

### Design Systems & Dashboards
- [DRUIDS (Datadog) Color System](https://druids.datadoghq.com/foundations/color)
- [Datadog Dark Mode](https://www.datadoghq.com/blog/introducing-datadog-darkmode/)
- [Pencil & Paper: Dashboard UX Patterns](https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards)
- [UXPin: Dashboard Design Principles 2025](https://www.uxpin.com/studio/blog/dashboard-design-principles/)
- [Fintech Design Guide 2026](https://www.eleken.co/blog-posts/modern-fintech-design-guide)

### Terminal Aesthetics
- [Warp: How We Designed Themes](https://www.warp.dev/blog/how-we-designed-themes-for-the-terminal-a-peek-into-our-process)
- [Warp Themes Documentation](https://docs.warp.dev/terminal/appearance/themes)

### Typography
- [Best Monospace Fonts 2025 (Pangram Pangram)](https://pangrampangram.com/blogs/journal/best-monospace-fonts-2025)
- [24+ Best Monospace Fonts (JustCreative)](https://justcreative.com/best-monospace-fonts-for-coding/)
- [Best Programming Fonts 2025](https://wpshout.com/best-programming-fonts/)

### Accessibility
- [Smashing Magazine: Designing for Colorblindness](https://www.smashingmagazine.com/2024/02/designing-for-colorblindness/)
- [8 Color Combinations to Avoid (2026)](https://www.webability.io/blog/colors-to-avoid-for-color-blindness)
- [Dark Mode UI Best Practices (Atmos)](https://atmos.style/blog/dark-mode-ui-best-practices)
- [Dark Mode Design 2026 Guide](https://www.digitalsilk.com/digital-trends/dark-mode-design-guide/)

### Trends
- [2026 UX/UI Design Trends (Medium)](https://medium.com/@tanmayvatsa1507/2026-ux-ui-design-trends-that-will-be-everywhere-0cb83b572319)
- [14 Web Design Trends 2026 (UXPilot)](https://uxpilot.ai/blogs/web-design-trends-2026)
- [Dark Mode Web Design: SEO & UX Trends 2025](https://designindc.com/blog/dark-mode-web-design-seo-ux-trends-for-2025/)

### Color Palettes & Resources
- [Crypto UI Design Color Palettes (Octet)](https://octet.design/colors/user-interfaces/crypto-ui-design/)
- [TradingView Color Palette (color-hex)](https://www.color-hex.com/color-palette/1022171)
- [Dark Dashboard Palette (ColorsWall)](https://colorswall.com/palette/1459)
- [Crypto Dark UI Palette (ColorsWall)](https://colorswall.com/palette/12345)
- [Figma: Stock Trader UI Kit](https://www.figma.com/community/file/1566555329071317833/stock-trader-ui-kit)
- [Dribbble: Dark Mode Trading](https://dribbble.com/search/dark-mode-trading)
- [Dribbble: Crypto UI](https://dribbble.com/tags/crypto-ui)

---

## Quick Reference: Designer Decision Matrix

| Decision | Recommendation | Fallback |
|----------|---------------|----------|
| Background color | `#131722` (TradingView standard) | `#0A0A0F` (Bloomberg dark) |
| Text color | `#D1D4DC` (never pure white) | `#E0E0E0` |
| Data font | JetBrains Mono 400 | Fira Code 400 |
| UI font | Inter 400/500/600 | Geist Sans |
| Bull color | `#0ECB81` | `#4AF6C3` (accessible) |
| Bear color | `#F6465D` | `#FF433D` (accessible) |
| Accent color | `#2962FF` (blue) | `#FFA028` (amber) |
| Panel borders | `#363C4E` (subtle) | 1px solid, never 2px+ |
| Base font size | 14px for tables | 13px minimum for any text |
| Layout model | CSS Grid with resizable panels | Flexbox fallback |
| Avoid | Pure black `#000000` background | Pure white `#FFFFFF` text |
