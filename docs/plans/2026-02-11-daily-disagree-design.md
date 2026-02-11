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
    │  detects conflicts, formats into Event Envelope
    │
    ▼
ctx8-api (Go, k3s) — POST /api/v1/reports
    │  Stores in PostgreSQL (CloudNativePG)
    │  Event → NATS JetStream (future: fan-out to TG/email)
    │
    ▼
Context8 React UI — GET /api/v1/reports/{asset}/latest
    │  Fetches from ctx8-api (replaces Supabase hooks)
    │
    ▼
Distribution: Website + Telegram channel + Twitter (manual initially)
```

### Infrastructure (all existing in k3s)
- **ctx8-api**: Go API at api.context8.markets (Phase 0 done: healthz)
- **PostgreSQL**: CloudNativePG, database `ctx8`, role `ctx8`
- **NATS JetStream**: running in k3s (Phase 2 fan-out)
- **Zitadel**: OIDC auth (Phase 2+ for protected endpoints)
- **Flux GitOps**: auto-deploys from GHCR

### What needs building
- ctx8-api: reports table migration + REST endpoints (Go)
- ctx8-api: generation script (Python, runs AITrader → POSTs to API)
- Context8: update types + UI for v2 report format
- Context8: switch DailyReport hooks from Supabase to ctx8-api

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

## Data Model

### PostgreSQL migration (ctx8-api)

Uses the existing Event Envelope pattern from the ctx8-api design doc.

```sql
-- Migration: 000002_create_reports.up.sql
CREATE TABLE IF NOT EXISTS reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset       TEXT NOT NULL,              -- 'BTC', 'MARKET'
    report_date DATE NOT NULL,
    headline    TEXT NOT NULL DEFAULT '',
    payload     JSONB NOT NULL DEFAULT '{}', -- full report content
    raw_data    JSONB NOT NULL DEFAULT '{}', -- raw skill outputs for debug
    status      TEXT NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft', 'published', 'archived')),
    version     INTEGER NOT NULL DEFAULT 2,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at TIMESTAMPTZ,
    UNIQUE(asset, report_date)
);

CREATE INDEX idx_reports_asset_date ON reports (asset, report_date DESC);
CREATE INDEX idx_reports_status ON reports (status) WHERE status = 'published';
```

### Report payload (JSONB)

```json
{
  "headline": "78% of crypto Twitter is bullish BTC. 4 of 6 modules disagree.",
  "conviction_scores": [
    {
      "symbol": "BTCUSDT",
      "score": 3,
      "bullish_modules": 2,
      "bearish_modules": 3,
      "neutral_modules": 0,
      "modules": [
        {"module": "ta_scanner", "bias": "bullish", "confidence": 70, "summary": "RSI 58, MACD+"},
        {"module": "funding", "bias": "bearish", "confidence": 80, "summary": "Crowded longs, z: 1.4"}
      ]
    }
  ],
  "crowded_trades": [
    {
      "symbol": "DOGEUSDT",
      "direction": "long",
      "z_score": 3.2,
      "funding_rate": 0.0012,
      "annualized_pct": 52.6,
      "historical_analog": {"date": "2026-01-18", "outcome_pct": -14.0, "outcome_days": 3}
    }
  ],
  "divergences": [
    {
      "symbol": "AVAXUSDT",
      "type": "social_price",
      "description": "Sentiment 78 but price flat",
      "signal": "pending_move",
      "strength": 17.5
    }
  ],
  "macro_regime": {
    "bias": "risk_off",
    "feargreed_value": 28,
    "feargreed_label": "extreme_fear",
    "dxy_trend": "up",
    "summary": "DXY rising + US10Y up + VIX elevated = risk-off"
  }
}
```

### ctx8-api REST endpoints

```
GET  /api/v1/reports/{asset}/latest    → latest published report for asset
GET  /api/v1/reports/{asset}/{date}    → report for specific date (YYYY-MM-DD)
GET  /api/v1/reports                   → list published reports (paginated)
POST /api/v1/reports                   → create report (auth: service key)
```

Aligns with Phase 1 endpoints from ctx8-api design doc.

### Frontend TypeScript types

```typescript
interface ModuleVerdict {
  module: string            // 'ta_scanner' | 'funding' | 'oi_divergence' | 'social' | 'macro' | 'feargreed'
  bias: 'bullish' | 'bearish' | 'neutral'
  confidence: number        // 0-100
  summary: string           // "RSI 58, MACD+" or "Crowded longs, z: 1.4"
}

interface CrowdedTrade {
  symbol: string
  direction: 'long' | 'short'
  z_score: number
  funding_rate: number
  annualized_pct: number
  historical_analog?: { date: string; outcome_pct: number; outcome_days: number }
}

interface Divergence {
  symbol: string
  type: 'social_price' | 'oi_price' | 'funding_price'
  description: string
  signal: string
  strength: number
}

interface ConvictionScore {
  symbol: string
  score: number             // 0-10
  bullish_modules: number
  bearish_modules: number
  neutral_modules: number
  modules: ModuleVerdict[]
}

interface MacroRegime {
  bias: 'risk_on' | 'risk_off' | 'mixed'
  feargreed_value: number
  feargreed_label: string
  dxy_trend: 'up' | 'down' | 'sideways'
  summary: string
}

// Report from ctx8-api
interface DailyDisagreeReport {
  id: string
  asset: string
  report_date: string
  headline: string
  payload: {
    headline: string
    conviction_scores: ConvictionScore[]
    crowded_trades: CrowdedTrade[]
    divergences: Divergence[]
    macro_regime: MacroRegime
  }
  status: 'draft' | 'published' | 'archived'
  version: number
  created_at: string
  published_at: string | null
}
```

## Generation Script

**Location**: `scripts/generate_daily_disagree.py` (in ctx8-api repo)

**Dependencies**: `requests` (for ctx8-api REST), `subprocess` (for `uv run`)

**Flow**:
1. Run 6 AITrader skills via subprocess (`uv run ...py --live --top 20`)
2. Parse JSON stdout from each skill
3. Detect conflicts: compare module biases per symbol
4. Rank symbols by conflict intensity (most disagreement first)
5. Generate headline from strongest disagreement
6. Compute conviction scores (0-10 from module agreement ratio)
7. Find crowded trades (extreme z-scores from funding-screener)
8. Find divergences (from oi-divergence + social-price-divergence)
9. Format into report JSON matching ctx8-api schema
10. POST to ctx8-api (`POST /api/v1/reports` with service API key)

**Skills invoked** (in aitrader repo):
```bash
uv run ~/personal/aitrader/.claude/skills/funding-screener/scripts/funding_screener.py --top 20 --live
uv run ~/personal/aitrader/.claude/skills/oi-divergence/scripts/oi_divergence.py --top 20 --live
uv run ~/personal/aitrader/.claude/skills/social-price-divergence/scripts/social_price_divergence.py --top 20 --live
uv run ~/personal/aitrader/.claude/skills/ta-scanner/scripts/ta_scanner.py --symbol BTCUSDT --live
uv run ~/personal/aitrader/.claude/skills/feargreed/scripts/feargreed.py
uv run ~/personal/aitrader/.claude/skills/macro-indicators/scripts/macro_indicators.py
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

Switch data fetching from Supabase to ctx8-api:
- Replace `useDailyReport()` hook (Supabase) with fetch from `api.context8.markets/api/v1/reports/{asset}/latest`
- New hook: `useDailyDisagreeReport(asset: string)`

Render new sections:
1. **Headline banner** — full-width, prominent text
2. **Module Scorecard** — grid/table showing bull/bear per module for featured asset
3. **Crowded Trade Alerts** — cards with symbol, direction, z-score, historical analog
4. **Divergence Watch** — compact list of active divergences
5. **Conviction Scores** — horizontal bar chart or number grid for top 10

## Distribution

### Phase 1 (Week 0): Manual + Auto
- **Website**: context8.markets/reports/daily (existing route, updated content)
- **Telegram**: Auto-post via Telegram Bot API after generation script runs
- **Twitter**: Manual posting of headline + screenshot for first 2 weeks
- **OG meta tags**: Dynamic per report for shareable previews

### Phase 2 (Week 2+): Email + NATS fan-out
- Email signup (PostgreSQL table via ctx8-api)
- NATS JetStream: report.published → TG adapter, email adapter
- Resend/SES for delivery

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

Investment at risk: ~600 lines of code + 30 min/day distribution = negligible.

## Phases

| Phase | Timeline | Scope |
|-------|----------|-------|
| Week 0 | 3-4 days | ctx8-api endpoints + generation script + UI update + Telegram |
| Week 1-2 | +1 week | OG tags, email signup, per-asset pages |
| Month 1 | +2 weeks | Accuracy tracking, historical analogs, NATS fan-out |
| Month 2 | +4 weeks | Trade Validator ($29/mo paywall), Zitadel auth |
| Month 3+ | ongoing | B2B API, more modules, feedback loops |

## Task Breakdown (Week 0)

### ctx8-api repo:
1. **Reports table + REST endpoints** — migration, handlers, CORS
2. **Generation script** — Python, runs AITrader → POSTs to ctx8-api

### context8 repo:
1. **DailyReport types v2** — new TypeScript interfaces
2. **DailyReport UI + fetch** — switch from Supabase to ctx8-api, render v2 content
3. **Distribution** — OG tags, Telegram auto-post

## References

- ctx8-api design doc: `~/personal/ctx8-api/docs/plans/2026-02-11-ctx8-api-design.md`
- ctx8-api ADR: `~/personal/ctx8-api/docs/adr/0001-foundational-decisions.md`
- AITrader skills: `~/personal/aitrader/.claude/skills/`
- Context8 DailyReport types: `src/types/dailyReport.ts`
- Context8 DailyReport page: `src/pages/DailyReport.tsx`
- Context8 DailyReport hooks: `src/hooks/useDailyReport.ts`
- Brainstorm transcript: this session (2026-02-11)
