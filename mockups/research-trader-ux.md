# Trader UX Research: Data-Dense Signal Dashboards

## 1. Information Hierarchy -- How Professionals Scan Dashboards

### Eye-Tracking Patterns

**F-Pattern (dominant for data-heavy interfaces):**
- Users scan left-to-right across the top row, then drop down the left column, making shorter horizontal scans at each level
- Heat maps consistently show a "golden triangle" in the top-left quadrant
- Implication: Place the highest-priority signal (overall portfolio verdict) in the top-left; secondary context (individual module signals) below and to the right

**Z-Pattern (for sparse or summary views):**
- Top-left -> top-right -> diagonal down -> bottom-left -> bottom-right
- Works for landing states and overview cards before the user drills in
- Implication: Use Z-pattern for the collapsed/summary mode of signal cards

**Grid scanning for data tables:**
- Professional users scan top-to-bottom in the first column (signal name/label), then selectively read across rows that catch attention
- Left-align labels, right-align numbers -- this is non-negotiable for scan speed

### Hierarchy Recommendations for Signal Dashboards

| Priority | Content | Placement |
|----------|---------|-----------|
| P0 | Aggregate signal / consensus verdict | Top-left hero area |
| P1 | Module-level signals (bull/bear/neutral per module) | Grid below hero, sorted by conviction strength |
| P2 | Disagreement indicators | Inline badges on conflicting modules |
| P3 | Raw data / detailed reasoning | Progressive disclosure (expand/drill-in) |

---

## 2. Color Psychology in Trading

### Why Bloomberg Uses Amber/Orange

Bloomberg Terminal's iconic amber-on-black (#FFA028 / #F39F41) traces back to 1980s hardware limitations (amber phosphor CRTs). It persisted because:

- **Amber on dark = maximum prolonged-use comfort.** Pure white on black causes halation; amber reduces eye strain during 12+ hour sessions
- **Amber carries urgency without panic.** Red triggers fight-or-flight (documented to increase erratic trading decisions). Amber signals "pay attention" without the cortisol spike
- **Brand equity.** Bloomberg's amber IS finance. Users associate it with authority

### Color Meanings in Trading Platforms

| Color | Semantic | Notes |
|-------|----------|-------|
| Green | Bullish / up / positive P&L | Universal, but problematic for CVD |
| Red | Bearish / down / negative P&L | Triggers stress response; avoid for primary data display |
| Amber/Orange | Warnings, pending, caution | Bloomberg's base color; less emotional than red |
| Blue | Neutral, informational, stable | Safe anchor color; often used for links and UI chrome |
| White/Light gray | Primary data text | High contrast on dark backgrounds |
| Dim gray | Secondary/supporting text | De-emphasizes less critical info |

### Color-Blindness-Safe Alternatives

Red-green color blindness (deuteranopia/protanopia) affects **7-10% of male users** -- a significant portion of the trading demographic.

**Bloomberg's solution:** Dedicated CVD themes with alternate color palettes:
- Default: Green (up) / Red (down)
- Deuteranopia: Blue (up) / Orange (down)
- Protanomaly: Teal (up) / Magenta (down)

**Recommended safe palette for bull/bear:**

```
Bull (up):     #22C55E (green)   OR  #3B82F6 (blue)    -- CVD-safe alt
Bear (down):   #EF4444 (red)     OR  #F97316 (orange)   -- CVD-safe alt
Neutral:       #6B7280 (gray)
Conflict:      #EAB308 (amber)   OR  #A855F7 (purple)
```

**Always pair color with a secondary indicator:**
- Directional arrows (up/down triangles)
- +/- prefix on numbers
- Background tint + text label
- Icon shape differences (circle vs triangle vs square)

---

## 3. Cognitive Load: Showing 20+ Data Points Without Overwhelming

### The 5-7 Rule for Primary Metrics

Research consistently shows that default dashboard views should surface **5-7 critical metrics** maximum. Everything else lives behind progressive disclosure.

### Progressive Disclosure Strategy

**Level 0 -- Glanceable (< 2 seconds):**
- Overall signal: BULLISH / BEARISH / MIXED
- Confidence score: 78%
- Key number: Current price + 24h change

**Level 1 -- Scannable (5-10 seconds):**
- Module-by-module signal grid (compact cards)
- Disagreement badges where modules conflict
- Top alert or anomaly

**Level 2 -- Readable (30+ seconds):**
- Expanded module with reasoning text
- Historical signal accuracy
- Raw indicators and data sources

**Level 3 -- Explorable (interactive):**
- Full data tables
- Custom timeframe selection
- What-if scenario tools

### Cognitive Load Reduction Techniques

1. **Chunking:** Group related signals visually (technical modules together, fundamental modules together)
2. **Preattentive attributes:** Use color, size, and position to encode meaning BEFORE the user reads text
3. **Consistent encoding:** If green = bullish in one place, it must mean bullish EVERYWHERE
4. **Spatial stability:** Never rearrange grid positions based on data changes -- users build spatial memory
5. **Information scent:** Visual cues (arrow icons, color dots) that tell users what they'll find if they click/expand
6. **Adaptive density per expertise:** Novice mode shows 5 cards with explanations; Pro mode shows 20+ compact rows

---

## 4. Typography for Financial Data

### The Cardinal Rule: Tabular Lining Figures

All numbers in data tables MUST use tabular (fixed-width) figures so digits align vertically. This is NOT the same as using a monospace font.

**CSS implementation:**
```css
.data-value {
  font-variant-numeric: tabular-nums lining-nums;
}
```

**Why this matters:**
- "$1,234.56" and "$987.65" must right-align perfectly
- Changing values (real-time updates) must not cause layout shifts
- Users compare numbers by scanning columns vertically -- misalignment breaks this

### Font Recommendations

| Element | Font Style | Size | Weight |
|---------|-----------|------|--------|
| Page title | Sans-serif (Inter, system) | 20-24px | 600 (semibold) |
| Section headers | Sans-serif | 14-16px | 600 |
| Data labels | Sans-serif | 12-13px | 400 (regular) |
| Data values (numbers) | Sans-serif with tabular-nums | 13-14px | 500 (medium) |
| Large hero numbers | Sans-serif with tabular-nums | 28-36px | 700 (bold) |
| Secondary/muted text | Sans-serif | 11-12px | 400 |
| Monospace (code, hashes) | JetBrains Mono, SF Mono | 12-13px | 400 |

### Line Height and Spacing

- **Data table rows:** 1.4x font size for line-height (e.g., 14px font -> 20px line-height)
- **Compact mode:** 1.2x minimum (below this, readability drops sharply)
- **Row padding:** 8px vertical in standard density, 4px in compact
- **Column gap:** 16-24px minimum for readable separation

### Font Pairing Strategy

Use a **single font family** across the entire dashboard with 2-3 weight variations maximum:
- Regular (400) for labels and body
- Medium (500) for data values
- Semibold (600) for headers and emphasis

Recommended: **Inter** (excellent tabular-nums support, free, wide language coverage) or **system-ui** for zero-latency rendering.

---

## 5. Accessibility in Dark Themes

### WCAG Contrast Requirements

| Element Type | Min Contrast Ratio | Target |
|-------------|-------------------|--------|
| Body text (< 18px) | 4.5:1 (AA) | 7:1 (AAA) |
| Large text (>= 18px bold) | 3:1 (AA) | 4.5:1 (AAA) |
| UI components & graphical objects | 3:1 (AA) | 4.5:1 |
| Disabled elements | No requirement | Still recommend 2:1 |

### Dark Theme Advantage

Dark backgrounds unlock **50% more usable color shades** that meet 3:1 contrast requirements compared to light backgrounds (per Google Material audit). This is why data-dense financial interfaces overwhelmingly use dark themes.

### Recommended Dark Theme Palette

```
Background levels:
  Base:        #0F1117  (deepest background)
  Surface 1:   #1A1D27  (card backgrounds)
  Surface 2:   #252830  (elevated elements, hover states)
  Surface 3:   #2E3139  (active/selected states)

Text levels:
  Primary:     #F1F5F9  (contrast ~15:1 on base)
  Secondary:   #94A3B8  (contrast ~6:1 on base)
  Tertiary:    #64748B  (contrast ~3.5:1 on base)
  Disabled:    #475569  (contrast ~2.5:1 on base)

Semantic colors (on dark backgrounds):
  Bullish:     #22C55E  (green-500, contrast 5.2:1)
  Bearish:     #EF4444  (red-500, contrast 4.6:1)
  Warning:     #EAB308  (yellow-500, contrast 7.2:1)
  Info:        #3B82F6  (blue-500, contrast 4.1:1)
  Neutral:     #6B7280  (gray-500, contrast 3.8:1)
```

### Color-Blindness Design Checklist

- [ ] Never use color as the SOLE differentiator -- always pair with shape, icon, or text
- [ ] Test with deuteranopia and protanopia simulators
- [ ] Offer user-selectable color schemes (default, deuteranopia, protanopia)
- [ ] Use blue/orange as a safe alternative to green/red
- [ ] Ensure 3:1 contrast between adjacent colored elements (not just against background)

---

## 6. Mobile Trading UIs: Lessons from Robinhood and Coinbase

### How Robinhood Handles Data Density

**Card-based progressive disclosure:**
- Each asset is a compact card showing: name, price, % change
- Tap to expand into full chart + news + buy/sell
- No multi-panel layouts -- single-column stack with expandable sections

**Color as instant comprehension:**
- Entire background tints green or red based on portfolio performance
- Individual cards show directional color for their asset
- Minimizes text reading; emotional/visceral understanding

**Key mobile patterns:**
- Single primary action per screen
- Bottom sheet for details (doesn't lose context of list)
- Horizontal swipe for timeframe switching (1D / 1W / 1M / 1Y / ALL)
- Pull-to-refresh as the universal data freshness gesture

### Mobile Density Strategies

| Desktop Pattern | Mobile Adaptation |
|----------------|-------------------|
| Multi-column grid | Single column with collapsible sections |
| Hover tooltips | Long-press or tap-to-reveal |
| Data tables (20+ columns) | Horizontal scroll with frozen first column |
| Side-by-side comparison | Stacked cards with swipe between |
| Real-time streaming updates | Badge/dot indicators; pull to refresh for details |

### Critical Mobile Considerations

- **Touch targets:** Minimum 44x44px (Apple HIG) / 48x48dp (Material)
- **Thumb zone:** Primary actions in bottom third of screen
- **Data truncation:** Show 3-5 key metrics per card; "See all" for rest
- **Offline state:** Clear staleness indicators when data cannot refresh

---

## 7. Real-Time vs Static Data

### Data Freshness Indicators

**Always show data age:**
```
"Live"           -- streaming connection active
"Updated 2s ago" -- recent batch update
"Updated 5m ago" -- getting stale (amber text)
"Stale (15m)"    -- data unreliable (red badge + icon)
"Offline"        -- no connection (gray + strikethrough)
```

### Animation Patterns for Updates

**DO:**
- Subtle background flash (50ms) on value change, then fade back
- Number count-up/count-down animation for smooth transitions
- Green/red micro-flash on price ticks (150-300ms duration)
- Pulsing dot indicator for live-streaming data sources

**DON'T:**
- Continuous animation (causes cognitive fatigue)
- Full-row highlighting that persists more than 500ms
- Any animation that shifts layout or causes content reflow
- Animation without `prefers-reduced-motion` media query support

### Staleness Hierarchy

| Age | Visual Treatment | User Action |
|-----|-----------------|-------------|
| 0-5s | "Live" green dot | None needed |
| 5-60s | Timestamp shown, no alarm | None needed |
| 1-5m | Amber timestamp, subtle border | Optional manual refresh |
| 5-15m | Amber badge "Stale", reduced opacity on data | Encourage refresh |
| 15m+ | Red badge "Stale", data grayed out | Warn: do not trade on this data |

---

## 8. Visualizing Conflicting Signals (Module Disagreements)

This is the most critical design challenge for the product. When 5 analysis modules produce different signals (3 bullish, 1 bearish, 1 neutral), users need to instantly understand:

1. **What is the consensus?** (aggregate signal)
2. **How strong is the consensus?** (agreement level)
3. **Who disagrees and why?** (outlier identification)

### Pattern A: Consensus Bar with Outlier Badges

```
[===BULLISH===|==NEUTRAL==|BEAR]     3/5 Bull  |  Agreement: 60%
     ^RSI  ^MACD  ^Fund     ^Sent  ^Vol
```

- Horizontal stacked bar showing proportion of bull/neutral/bear votes
- Module names positioned along the bar at their "vote" position
- Outlier modules highlighted with contrasting badge

**When to use:** Quick glanceable overview, works at small sizes

### Pattern B: Signal Matrix (Recommended for Primary View)

```
Module          Signal    Confidence   Aligned?
--------------------------------------------------
RSI/Momentum    BULL      High (85%)   [check]
MACD Cross      BULL      Med  (62%)   [check]
Fundamentals    BULL      High (78%)   [check]
Sentiment       BEAR      Low  (41%)   [!warning]
Volume Profile  NEUTRAL   Med  (55%)   [~]
--------------------------------------------------
CONSENSUS: BULLISH (60% agreement, 3/5 aligned)
```

- Matrix clearly shows each module's vote
- "Aligned?" column instantly highlights disagreement
- Confidence score provides weight context
- Sort by: conviction (high to low) or by alignment (dissenters first)

### Pattern C: Divergence Gauge

A radial or linear gauge where:
- Center = total agreement (all modules say the same)
- Edges = total disagreement (modules split evenly)
- Needle position shows current divergence level
- Color shifts from green (consensus) through amber (mixed) to red (chaos)

**When to use:** Hero-level KPI showing overall signal reliability

### Pattern D: Tug-of-War / Force Diagram

Visual representation of opposing forces:
- Left side = bullish modules (arrows pulling left, sized by confidence)
- Right side = bearish modules (arrows pulling right, sized by confidence)
- Center shows the net direction and magnitude

**When to use:** Storytelling view for understanding WHY the signal is what it is

### Disagreement Design Principles

1. **Never hide disagreement.** When modules conflict, that IS the most important signal. Surface it, don't average it away
2. **Show the outlier, not just the majority.** A single high-conviction bearish signal among 4 weak bullish signals may be more valuable than the consensus
3. **Confidence-weight the visualization.** A 90% confidence bear signal matters more than a 50% confidence bull signal
4. **Use spatial tension.** Place disagreeing elements visually close together so the eye naturally compares them (juxtaposition principle)
5. **Provide "Why does X disagree?" affordance.** Expandable tooltip or drill-in explaining the dissenting module's reasoning
6. **Temporal context.** Show if disagreement is increasing or decreasing over time (are modules converging or diverging?)

### Color Coding for Conflict States

```
Full agreement (5/5):    Green border + "Strong Signal" label
Supermajority (4/5):     Green border + amber badge on dissenter
Simple majority (3/5):   Amber border + "Mixed Signal" label
Split (2-3 vs 2-3):     Red border + "Conflicting" label + expanded detail
Total chaos (all diff):  Red pulsing border + "No Consensus" alert
```

---

## 9. Specific Recommendations Summary

### Font Sizes for Data Tables

| Context | Size | Line Height |
|---------|------|-------------|
| Compact table (pro mode) | 12-13px | 16-18px |
| Standard table | 13-14px | 18-20px |
| Comfortable table (default) | 14-15px | 20-22px |
| Hero metrics | 28-36px | 1.1x |
| Card titles | 14-16px semibold | 20-22px |

### Color Contrast Ratios That Work

| Pair | Ratio | Verdict |
|------|-------|---------|
| #F1F5F9 on #0F1117 | ~15:1 | Excellent (primary text) |
| #94A3B8 on #0F1117 | ~6:1 | Good (secondary text) |
| #22C55E on #0F1117 | ~5.2:1 | Pass AA (bullish) |
| #EF4444 on #0F1117 | ~4.6:1 | Pass AA (bearish) |
| #EAB308 on #0F1117 | ~7.2:1 | Excellent (warning) |
| #3B82F6 on #0F1117 | ~4.1:1 | Pass AA large text (info) |

### Layout Pattern for Signal Dashboard

```
+------------------------------------------+
|  [Logo]  TOKEN/PAIR    $PRICE  +2.3%     |  <- Fixed header, hero metrics
+------------------------------------------+
|  CONSENSUS: BULLISH          Confidence:  |
|  [||||||||||||   ] 78%       Agreement:   |  <- Hero signal area
|                              3/5 aligned  |
+------------------------------------------+
|  Module Grid (2-3 columns on desktop)     |
|  +--------+ +--------+ +--------+        |
|  | RSI    | | MACD   | | Fund.  |        |  <- Signal cards
|  | BULL   | | BULL   | | BULL   |        |
|  | 85%    | | 62%    | | 78%    |        |
|  +--------+ +--------+ +--------+        |
|  +--------+ +--------+                   |
|  | Sent.  | | Volume |                   |  <- Dissenters highlighted
|  | BEAR ! | | NEUT ~ |                   |
|  | 41%    | | 55%    |                   |
|  +--------+ +--------+                   |
+------------------------------------------+
|  [Expanded Module Detail on Click]        |  <- Progressive disclosure
|  Reasoning, historical accuracy, raw data |
+------------------------------------------+
```

### Spacing System

Use a **4px base grid** for data-dense layouts:

| Token | Value | Use Case |
|-------|-------|----------|
| space-1 | 4px | Inline padding, icon gaps |
| space-2 | 8px | Card internal padding, row padding |
| space-3 | 12px | Between related elements |
| space-4 | 16px | Card padding, section gaps |
| space-5 | 20px | Between card groups |
| space-6 | 24px | Major section separation |
| space-8 | 32px | Page-level margins |

---

## 10. Sources

- [Bloomberg UX: Designing for Color Accessibility](https://www.bloomberg.com/company/stories/designing-the-terminal-for-color-accessibility/)
- [Bloomberg UX: Concealing Complexity](https://www.bloomberg.com/company/stories/how-bloomberg-terminal-ux-designers-conceal-complexity/)
- [Matt Strom: UI Density](https://mattstromawn.com/writing/ui-density/)
- [Smashing Magazine: UX Strategies for Real-Time Dashboards](https://www.smashingmagazine.com/2025/09/ux-strategies-real-time-dashboards/)
- [Aufait UX: Dashboard Design Strategies for Conflicting KPIs](https://www.aufaitux.com/blog/dashboard-design-strategies-for-conflicting-kpis/)
- [Bookmap: Color Psychology in Market Data Visualization](https://bookmap.com/blog/the-role-of-color-psychology-in-market-data-visualization)
- [Datawrapper: Fonts for Data Visualization](https://www.datawrapper.de/blog/fonts-for-data-visualization)
- [A List Apart: Web Typography for Tables](https://alistapart.com/article/web-typography-tables/)
- [Smashing Magazine: Designing for Colorblindness](https://www.smashingmagazine.com/2024/02/designing-for-colorblindness/)
- [UX Collective: Color Blindness in User Interfaces](https://uxdesign.cc/color-blindness-in-user-interfaces-66c27331b858)
- [Agentic Design: Confidence Visualization Patterns](https://agentic-design.ai/patterns/ui-ux-patterns/confidence-visualization-patterns)
- [Robinhood UI Design Analysis](https://worldbusinessoutlook.com/how-the-robinhood-ui-balances-simplicity-and-strategy-on-mobile/)
- [IxDF: Progressive Disclosure](https://www.interaction-design.org/literature/topics/progressive-disclosure)
- [NNGroup: Text Scanning Patterns Eyetracking](https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/)
- [MDN: font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variant-numeric)
- [WCAG 2.2: Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Datawrapper: Color Contrast Check for Data Vis](https://blog.datawrapper.de/color-contrast-check-data-vis-wcag-apca/)
- [Paul Wallas: Designing for Data Density](https://paulwallas.medium.com/designing-for-data-density-what-most-ui-tutorials-wont-teach-you-091b3e9b51f4)
