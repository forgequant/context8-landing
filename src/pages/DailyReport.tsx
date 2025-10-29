import { Link } from 'react-router-dom'

export function DailyReport() {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-6 py-8">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-12">
        <Link to="/" className="text-sm text-terminal-cyan hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-terminal-cyan">Daily BTC Report</h1>
          <span className="text-sm text-terminal-muted">Oct 29, 2025</span>
        </div>
        <p className="text-terminal-muted">Comprehensive market analysis • Facts, opinion, and actionable steps</p>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto space-y-8 text-sm leading-relaxed">

        {/* TL;DR */}
        <section className="bg-graphite-900 border border-terminal-cyan/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">TL;DR</h2>
          <ul className="space-y-2 text-terminal-text">
            <li>• <strong>Spot price</strong>: ~$113–114k, moderate daily volatility; market awaits macro triggers (Fed, US-China news). <a href="https://www.barrons.com/articles/bitcoin-price-ethereum-crypto-today-813f945c" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[barrons.com]</a></li>
            <li>• <strong>News/flows</strong>: After peak ~$125k in early October, spot ETF interest remains high (IBIT tops October inflows). <a href="https://www.tomshardware.com/tech-industry/cryptocurrency/bitcoin-rockets-to-all-time-high-of-over-usd125-000-rise-fueled-by-increase-in-u-s-equities-and-interest-in-bitcoin-etfs" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Tom's Hardware]</a></li>
            <li>• <strong>Sentiment</strong>: Crypto Fear & Greed = <span className="text-yellow-300">37 (Fear)</span> — cautious market. <a href="https://alternative.me/crypto/" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Alternative.me]</a></li>
            <li>• <strong>Polymarket</strong>: Most probable 2025 target — <span className="text-terminal-green">≥$130k (~52%)</span>, <span className="text-terminal-green">≥$150k (~15%)</span>; millions in bets. <a href="https://polymarket.com/event/what-price-will-bitcoin-hit-in-2025" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Polymarket]</a></li>
            <li>• <strong>Microstructure</strong> (Binance BTCUSDT, real-time): spread ~$0.01 (0.88 bps), bid/ask imbalance ≈1.76 favoring buyers; overall health <span className="text-yellow-300">55.9/100 (Fair)</span> — trade with limits.</li>
          </ul>
        </section>

        {/* Market & Price */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            1. Market & Price (Facts)
          </h2>
          <div className="space-y-3 text-terminal-muted">
            <p>• <strong className="text-terminal-text">Current range</strong>: ~$112–116k; today's reports fix ~<strong className="text-terminal-cyan">$113k</strong>. Movement tied to Fed rate expectations and US-China news.</p>
            <p>• <strong className="text-terminal-text">2025 ATH</strong>: In early October, BTC updated maximum <strong className="text-terminal-cyan">~$125–126k</strong> on spot ETF inflows backdrop.</p>
            <p>• <strong className="text-terminal-text">ETF background</strong>: In October, IBIT (BlackRock) led daily/weekly inflows multiple times; cumulative October spot ETF inflows — billions USD.</p>
            <p>• <strong className="text-terminal-text">Fear/Greed index</strong>: <strong className="text-yellow-300">FGI=37 (Fear)</strong> — after correction, mood is moderately negative without panic.</p>
          </div>
        </section>

        {/* News Brief */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            2. News Brief (Facts)
          </h2>
          <div className="space-y-3 text-terminal-muted">
            <p>• <strong className="text-terminal-text">Today</strong>: Pullback in major crypto assets, BTC ~−1% in 24h; triggers — macro expectations (Fed, US-China geopolitics).</p>
            <p>• <strong className="text-terminal-text">October</strong>: Wave of spot ETF inflows (IBIT leads), supported rally to ~125k at peak.</p>
            <p>• <strong className="text-terminal-text">Regulatory context</strong>: SEC allowed in-kind procedures for crypto ETPs (structurally positive for fund efficiency).</p>
          </div>
        </section>

        {/* Polymarket */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            3. Polymarket — Market Probabilities (Facts)
          </h2>
          <div className="space-y-3 text-terminal-muted">
            <p>Current major market: <strong className="text-terminal-cyan">"What price will Bitcoin hit in 2025?"</strong></p>
            <p>Probability snapshot by "steps" (platform uses <strong>Binance BTCUSDT</strong> as resolution source):</p>
            <ul className="space-y-2 ml-6">
              <li>• <strong className="text-terminal-green">≥$130k</strong>: ~<strong>52%</strong></li>
              <li>• <strong className="text-terminal-green">≥$150k</strong>: ~<strong>15%</strong></li>
              <li>• More distant bins (≥$170k, ≥$200k): clearly below 10%</li>
              <li>• Total market trading volume: <strong>$38M+</strong></li>
            </ul>
            <p className="text-yellow-300 italic">Opinion: Useful as "consensus quoting," but this is conditional probability, sensitive to hype/news revaluation and specific market liquidity.</p>
          </div>
        </section>

        {/* Sentiment */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            4. Sentiment & Positioning (Facts → Conclusion)
          </h2>
          <div className="space-y-3 text-terminal-muted">
            <p>• <strong className="text-yellow-300">FGI=37</strong> indicates "fearful buying" and market inclination to <strong>react to news</strong> rather than sustain trend.</p>
            <p>• <strong className="text-terminal-text">ETF flows</strong> remain non-trivial spot driver and secondary demand (effect of "slow pump" with sustained inflows).</p>
            <p className="text-terminal-cyan italic mt-4">My opinion: Base scenario — range trading $110–118k with upward bias on positive macro surprises/ETF inflows; breakout above $118–120k on volume opens path to $125k retest.</p>
          </div>
        </section>

        {/* Microstructure */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            5. Microstructure: BTCUSDT (Binance) — "Now"
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4 space-y-3 text-terminal-muted">
            <p className="text-terminal-cyan font-semibold">Key metrics (at report generation moment):</p>
            <ul className="space-y-2 ml-6">
              <li>• <strong>LTP</strong>: <span className="text-terminal-cyan">$113,459.08</span>, 24h: <span className="text-terminal-red">−1.234%</span>, High/Low: $116,086 / $112,100, 24h volume: 15,854 BTC</li>
              <li>• <strong>Spread</strong>: <span className="text-terminal-green">$0.01 (0.88 bps)</span> — very tight</li>
              <li>• <strong>Order book imbalance</strong> (Top-20): <span className="text-terminal-green">1.757</span> — bias toward bids (buy pressure)</li>
              <li>• <strong>Order flow</strong> (60s): bid 8.17 vs ask 6.63 ord/s; Net Flow +1.53 ord/s</li>
              <li>• <strong>CVD</strong> (short-term): <span className="text-terminal-green">+33.7</span> — accumulation</li>
              <li>• <strong>Health score</strong>: <span className="text-yellow-300">55.9/100 (Fair)</span>; engine recommendations: limit orders, closely monitor tape</li>
              <li>• <strong>Anomalies</strong>: none detected</li>
            </ul>
            <p className="text-terminal-cyan italic mt-4">Conclusion (my opinion): Short-term buyer advantage with moderate depth. Good for range scalping; for upward impulse needs volume spike through upper third of day.</p>
          </div>
        </section>

        {/* Levels/Scenarios */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            6. Levels/Scenarios (Retail Trader Setup)
          </h2>
          <div className="space-y-4 text-terminal-muted">
            <div>
              <p className="text-terminal-cyan font-semibold mb-2">Levels (spot, rounded):</p>
              <ul className="space-y-2 ml-6">
                <li>• <strong>Support</strong>: $112.1k (daily low), $110k (round/sentiment), $108–109k (density zones per October aggregators)</li>
                <li>• <strong>Resistance</strong>: $116k (today's upper bound), $118–120k (key to impulse), $125–126k (ATH/sell zone)</li>
              </ul>
            </div>
            <div>
              <p className="text-terminal-cyan font-semibold mb-2">Scenarios:</p>
              <ol className="space-y-3 ml-6">
                <li><strong className="text-terminal-text">1. Range $110–118k</strong> (base, 40–60% probability by news background). Tactics: bounce from boundaries/middle, take profit in parts, protect beyond extremum.</li>
                <li><strong className="text-terminal-text">2. Upward breakout {'>'}$120k</strong> on volume/news → quick test $123–125k; lock partial and trail stop.</li>
                <li><strong className="text-terminal-text">3. Downward break {'<'}$110k</strong> on negative macro/liquidations → acceleration to $106–108k (last month's demand zone).</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Risk Management */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            7. Risk Management (Practice)
          </h2>
          <ul className="space-y-2 text-terminal-muted ml-6">
            <li>• <strong className="text-terminal-text">Risk per trade ≤0.5–1.0% of capital</strong>; R:R ≥1:2</li>
            <li>• <strong className="text-terminal-text">Instrument</strong>: limit orders (thin spread), avoid market entries during news releases (slippage)</li>
            <li>• <strong className="text-terminal-text">Hedge/options</strong>: short perp hedges on breakouts, calendar call spreads to events (Fed/ETF reports) — limited risk</li>
            <li>• <strong className="text-terminal-text">Calendar</strong>: track Fed/inflation/ETF statement dates (inflows/outflows)</li>
          </ul>
        </section>

        {/* Daily Monitoring */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            8. Daily Monitoring Checklist
          </h2>
          <ol className="space-y-2 text-terminal-muted ml-6">
            <li>1. <strong className="text-terminal-text">Spot ETF flows</strong> (IBIT, FBTC, etc.) — inflows/outflows and daily volumes</li>
            <li>2. <strong className="text-terminal-text">FGI</strong> (day-to-day dynamics) — fear/greed regime shift</li>
            <li>3. <strong className="text-terminal-text">Polymarket</strong> — probability shifts in ≥$130k/≥$150k bins (sign of collective expectation change)</li>
            <li>4. <strong className="text-terminal-text">Tape/order book</strong> — imbalance and CVD on 1–5 min window (acceleration signals)</li>
            <li>5. <strong className="text-terminal-text">Macro calendar</strong> (risk events) — Fed decisions, US inflation, US-China headlines</li>
          </ol>
        </section>

        {/* Bottom Line */}
        <section className="bg-graphite-900 border border-graphite-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">Bottom Line (My Opinion)</h2>
          <div className="space-y-3 text-terminal-muted">
            <p>• Currently <strong className="text-terminal-green">neutral-bullish sideways</strong>: without new inflows/macro catalysts, market inclined to "chop."</p>
            <p>• For <strong className="text-terminal-text">retail trader</strong> now rational: range strategies, partial profit taking, stop discipline, following ETF flows and microstructure signals (imbalance, volume spikes).</p>
            <p>• <strong className="text-terminal-cyan">Assumption</strong>: If Fed/US-China news without "negatives" and ETF inflows persist, window for $118–125k retest in coming weeks remains open; negative on rates/policy — risk of $108–110k test.</p>
          </div>
        </section>

      </article>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-graphite-800 text-xs text-terminal-muted">
        <p>Report generated: Oct 29, 2025 • Asia/Singapore timezone</p>
        <p className="mt-2">This report combines facts (with sources), opinion, and assumptions. Not financial advice.</p>
        <p className="mt-4">
          <Link to="/" className="text-terminal-cyan hover:underline">← Back to Context8</Link>
        </p>
      </footer>
    </div>
  )
}
