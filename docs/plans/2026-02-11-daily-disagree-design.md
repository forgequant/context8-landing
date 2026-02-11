# The Daily Disagree — Product Design

**Date**: 2026-02-11
**Status**: Approved (team brainstorm consensus)
**Origin**: 4-agent product brainstorm (skeptic, builder, growth, wild)

## Problem

Context8 has 26 MCP tools, crypto payments, daily report UI, and $8/mo subscription.
**0 paying users.** The original concept (daily AI-generated crypto reports) is commodity
content competing against free alternatives (Messari, The Block, Bankless, ChatGPT).

## Insight

AITrader has 23 independent analysis modules that can **disagree with each other**.
No other crypto product surfaces cross-signal conflicts. The moat is not "AI analysis"
(table stakes in 2026) — it's **conflict detection between independent data sources**.

## Product Concept

**"The Daily Disagree"** — conflict-first crypto intelligence.

Tagline: *"We don't tell you what to buy. We tell you where the market is lying to itself."*

Instead of consensus-driven market summaries, every report highlights **where modules
disagree**: funding vs price, OI vs sentiment, TA vs macro. The tension IS the content.

## Architecture

```
AITrader Skills (Python, existing)
    │
    │  funding-screener, oi-divergence, social-price-divergence,
    │  ta-scanner, feargreed, macro-indicators
    │
    ▼
Generation Script (Python, ~150-180 lines, NEW)
    │  Runs skills via `uv run`, aggregates JSON output,
    │  detects conflicts, formats into DailyReport schema
    │
    ▼
Supabase `daily_reports` table (existing, schema update needed)
    │
    ▼
Context8 React UI (existing DailyReport.tsx, type + render updates)
    │
    ▼
Distribution: Website + Telegram channel + Twitter (manual initially)
```

### No new infrastructure needed
- Supabase already running (tables, RLS, hooks)
- React DailyReport page already built (~710 lines)
- AITrader skills already produce JSON to stdout
- All that's missing: ~400 lines of glue code

## Report Format

```
CONTEXT8 DAILY DISAGREE — Feb 12, 2026

HEADLINE: 78% of crypto Twitter is bullish BTC.
4 of 6 Context8 modules disagree. Confidence: 3/10.

CROWDED TRADE ALERTS:
#1: DOGE — Crowded Longs (z-score: 3.2)
    Last time (Jan 18): -14% in 3 days
#2: SOL — Crowded Longs (z-score: 2.1)
    Last time (Jan 22): -9% in 5 days
#3: AVAX — Crowded Shorts (z-score: -1.9)
    Last time (Dec 30): +11% in 2 days (squeeze)

MODULE SCORECARD — BTC:
  TA Scanner:       BULLISH  (RSI 58, MACD+)
  Funding:          BEARISH  (Crowded longs, z: 1.4)
  OI Divergence:    BEARISH  (Shorts accumulating)
  Social Sentiment: BULLISH  (Greed 72)
  Macro Regime:     BEARISH  (DXY up, risk-off)
  VERDICT: 2-3 BEARISH LEAN | Confidence: 3/10

DIVERGENCE WATCH:
  AVAX: Sentiment 78 but price flat — pending move
  LINK: Sentiment 34 but price +5% — no social confirmation
```

## Schema Design

### New TypeScript types (`src/types/dailyReport.ts`)

The current schema is social-metrics focused (LunarCrush: unique_creators, influencers,
narratives). The new schema is derivatives-positioning focused.

**Approach**: Add new fields to the existing DailyReport interface. Keep backward
compatibility — old social fields become optional, new fields are the primary content.

```typescript
// New interfaces to ADD

interface ModuleVerdict {
  module: string            // 'ta_scanner' | 'funding' | 'oi_divergence' | 'social' | 'macro' | 'feargreed'
  bias: 'bullish' | 'bearish' | 'neutral'
  confidence: number        // 0-100
  summary: string           // "RSI 58, MACD+" or "Crowded longs, z: 1.4"
}

interface CrowdedTrade {
  symbol: string            // "DOGEUSDT"
  direction: 'long' | 'short'
  z_score: number           // e.g. 3.2
  funding_rate: number      // raw rate
  annualized_pct: number    // annualized %
  historical_analog?: {
    date: string            // "2026-01-18"
    outcome_pct: number     // -14.0
    outcome_days: number    // 3
  }
}

interface Divergence {
  symbol: string
  type: 'social_price' | 'oi_price' | 'funding_price'
  description: string       // "Sentiment 78 but price flat"
  signal: string            // "pending_move" | "buy_divergence" | "sell_divergence"
  strength: number          // signal strength from skill output
}

interface ConvictionScore {
  symbol: string
  score: number             // 0-10
  bullish_modules: number
  bearish_modules: number
  neutral_modules: number
  modules: ModuleVerdict[]
}

// Fields to ADD to DailyReport interface
interface DailyReportV2 extends DailyReport {
  headline?: string                    // Lead disagreement
  conviction_scores?: ConvictionScore[]  // Top 10 assets
  crowded_trades?: CrowdedTrade[]      // Top 3-5 extreme positions
  divergences?: Divergence[]           // Active divergences
  module_scorecard?: ConvictionScore   // Featured asset (BTC) full breakdown
  macro_regime?: {
    bias: 'risk_on' | 'risk_off' | 'mixed'
    feargreed_value: number
    feargreed_label: string
    dxy_trend: 'up' | 'down' | 'sideways'
    summary: string
  }
  report_version?: number              // 2 for new format
}
```

### Supabase migration

No schema change needed — `daily_reports` already uses JSONB columns.
The new fields go into existing JSONB columns:
- `metrics` → `macro_regime` + `conviction_scores`
- `executive_summary` → `headline`
- `top_movers` → `crowded_trades` + `divergences`
- `raw_data` → full skill outputs for debugging

Alternatively, store new fields in `raw_data` JSONB and read them in the frontend
with fallback to old schema. This avoids migration entirely.

**Decision**: Use `raw_data` JSONB for all new fields. The frontend checks
`raw_data.report_version === 2` and renders accordingly. Zero migration needed.

## Generation Script

**Location**: `scripts/generate_daily_disagree.py` (in context8 repo)

**Dependencies**: `requests` (for Supabase REST), `subprocess` (for `uv run`)

**Flow**:
1. Run 6 AITrader skills via subprocess (`uv run ...py --live --top 20`)
2. Parse JSON stdout from each skill
3. Detect conflicts: compare module biases per symbol
4. Rank symbols by conflict intensity (most disagreement first)
5. Generate headline from strongest disagreement
6. Compute conviction scores (0-10 from module agreement ratio)
7. Find crowded trades (extreme z-scores from funding-screener)
8. Find divergences (from oi-divergence + social-price-divergence)
9. Format into DailyReport JSON matching Supabase schema
10. POST to Supabase REST API (`daily_reports` table)

**Skills invoked** (in aitrader repo):
```bash
uv run .claude/skills/funding-screener/scripts/funding_screener.py --top 20 --live
uv run .claude/skills/oi-divergence/scripts/oi_divergence.py --top 20 --live
uv run .claude/skills/social-price-divergence/scripts/social_price_divergence.py --top 20 --live
uv run .claude/skills/ta-scanner/scripts/ta_scanner.py --symbol BTCUSDT --live
uv run .claude/skills/feargreed/scripts/feargreed.py
uv run .claude/skills/macro-indicators/scripts/macro_indicators.py
```

**Conflict detection logic**:
- For each symbol appearing in 2+ skill outputs, extract bias
- funding z > 1.5 = bearish (crowded longs), z < -1.5 = bullish (crowded shorts)
- oi_divergence: shorts_accumulating = bearish, longs_accumulating = bullish
- social: sell_divergence = bearish, buy_divergence = bullish
- ta: summary.bias from ta-scanner
- macro: macro_bias from macro-indicators (global, not per-symbol)
- feargreed: regime from feargreed (global)
- Conflict = modules disagree on bias for same symbol
- Conviction score = (agreeing modules / total modules) * 10

## UI Updates

**File**: `src/pages/DailyReport.tsx`

Render new sections when `raw_data.report_version === 2`:

1. **Headline banner** — full-width, prominent text
2. **Module Scorecard** — grid/table showing bull/bear per module for featured asset
3. **Crowded Trade Alerts** — cards with symbol, direction, z-score, historical analog
4. **Divergence Watch** — compact list of active divergences
5. **Conviction Scores** — horizontal bar chart or number grid for top 10

Keep existing sections (executive_summary, top_movers, etc.) as fallback for v1 reports.

## Distribution

### Phase 1 (Week 0): Manual + Auto
- **Website**: context8.markets/reports/daily (existing route, updated content)
- **Telegram**: Auto-post via Telegram Bot API after generation script runs
- **Twitter**: Manual posting of headline + screenshot for first 2 weeks
- **OG meta tags**: Dynamic per report for shareable previews

### Phase 2 (Week 2+): Email
- Email signup form on report page (Supabase `email_subscribers` table)
- Resend free tier for delivery

## Pricing

- **Free**: Full daily report, all sections, on website + Telegram
- **Paid ($29/mo)**: Trade Validator (personal thesis checking) — Month 2+
- **B2B ($200-500/mo)**: Same Trade Validator, API access — Month 3+

## Kill Criteria (30-day test)

| Metric | Continue | Pivot | Kill |
|--------|----------|-------|------|
| Telegram subscribers | 200+ | 100-200 | <100 |
| Daily view rate | 30%+ | 15-30% | <15% |
| Day-2 return rate | 20%+ | 10-20% | <10% |

Investment at risk: ~400 lines of code + 30 min/day distribution = negligible.

## Phases

| Phase | Timeline | Scope |
|-------|----------|-------|
| Week 0 | 3-4 days | Generation script + schema + UI update + Telegram |
| Week 1-2 | +1 week | OG tags, email signup, per-asset pages |
| Month 1 | +2 weeks | Accuracy tracking, historical analogs |
| Month 2 | +4 weeks | Trade Validator ($29/mo paywall) |
| Month 3+ | ongoing | B2B API, more modules, feedback loops |

## References

- AITrader skills: `~/personal/aitrader/.claude/skills/`
- Context8 DailyReport types: `src/types/dailyReport.ts`
- Context8 DailyReport page: `src/pages/DailyReport.tsx`
- Context8 DailyReport hooks: `src/hooks/useDailyReport.ts`
- Supabase migration: `supabase/migrations/006_daily_reports.sql`
- Brainstorm transcript: this session (2026-02-11)
