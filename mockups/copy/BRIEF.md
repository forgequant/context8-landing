# Context8 — Product Brief

## What Is It
Context8 (context8.markets) — crypto intelligence API. One REST call, full market scorecard.

## Core Mechanic
23 independent AI modules analyze each crypto asset. TA, funding rates, OI divergence, social sentiment, macro regime, fear & greed, etc. When modules **disagree** — that IS the signal. Conflict between modules = alpha. Not another "buy/sell signal" tool. We show you WHERE and WHY the market disagrees with itself.

## Key Features
- **Signal Board**: Bull/bear verdict per module with confidence scores. Visual scorecard.
- **Crowded Trade Detection**: Z-score rankings of overleveraged positions primed for liquidation.
- **Divergence Watch**: Sentiment says one thing, price says another. Catch moves before they happen.

## Working Concepts (from previous brainstorm)
- "The Daily Disagree" — conflict-first intelligence
- "Where the market lies to itself"
- "Crypto signals that fight each other. That's the alpha."
- "23 independent modules. When they disagree, you profit."

## API
Single REST endpoint: `GET /v1/signals?asset=BTC&modules=all`
Returns: verdict, score (4-2), conviction (3/10), all module signals with confidence.
Auth: Bearer token (`ctx8_sk_...`). Free tier available.

## Target Audiences (hypothesized)
- Crypto traders (retail & semi-pro) — want edge, hate noise
- Quant funds / prop desks — need structured data, API-first
- Developer teams building trading bots — need clean API
- Crypto-curious professionals — want signal without chart-staring

## Design Direction (finalized)
Dark theme, warm amber (#C49A3C) accents, Bloomberg-inspired data density.
JetBrains Mono for data, Inter for UI. Professional but edgy.

## Landing Page Sections (need copy for each)
1. Nav: Logo + links (Features, API, Pricing, Get API Key)
2. Hero badge: Short status line with pulsing dot
3. Hero H1: Main headline
4. Hero accent: Secondary punch line (currently in amber accent color)
5. Hero subtitle: 1-2 sentence description
6. Stats: 3 boxes (currently "23 Modules / 6 Conflicts Daily / 1 API Key")
7. CTA buttons: Primary + secondary (currently "Get API Key" + "View Docs")
8. Scorecard: Header text + table column names + verdict text
9. Features: 3 cards (title + description each)
10. API Preview: Section label + title
11. Bottom CTA: H2 + subtitle + button
12. Footer: Copyright + links

## What We Need From This Team
Final positioning statement, tone of voice, and production-ready copy for ALL sections above.
