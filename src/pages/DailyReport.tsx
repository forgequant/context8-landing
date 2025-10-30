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
          <span className="text-sm text-terminal-muted">Oct 30, 2025 11:03 UTC</span>
        </div>
        <p className="text-terminal-muted">Comprehensive market analysis • Facts, opinion, and actionable steps</p>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto space-y-8 text-sm leading-relaxed">

        {/* TL;DR */}
        <section className="bg-graphite-900 border border-terminal-cyan/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">TL;DR</h2>
          <ul className="space-y-2 text-terminal-text">
            <li>• <strong>Spot price</strong>: <span className="text-terminal-cyan">$110,030</span>, <span className="text-terminal-red">-2.44%</span> in 24h; market continues correction from local high $113.6k. Range: $107,925–$113,643.</li>
            <li>• <strong>Volume</strong>: 26,722 BTC (~$2.96B) — stable activity, but priority shifted to sellers.</li>
            <li>• <strong>Sentiment</strong>: Crypto Fear & Greed = <span className="text-yellow-300">36 (Fear)</span> — sustained cautious mood. <a href="https://alternative.me/crypto/" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Alternative.me]</a></li>
            <li>• <strong>Polymarket</strong>: Most probable 2025 target — <span className="text-terminal-green">≥$130k (~52%)</span>, <span className="text-terminal-green">≥$150k (~15%)</span>; probability above $150k declined amid correction. <a href="https://polymarket.com/event/what-price-will-bitcoin-hit-in-2025" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Polymarket]</a></li>
            <li>• <strong>Microstructure</strong> (Binance BTCUSDT): spread $0.01 (0.91 bps), imbalance <span className="text-terminal-red">0.02 (seller dominance)</span>, CVD <span className="text-terminal-red">-57.22</span>, health <span className="text-terminal-green">87.5/100 (Excellent)</span> — liquidity high, safe for limit orders.</li>
          </ul>
        </section>

        {/* Market & Price */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            1. Market Summary (SSE / Binance)
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody className="space-y-2">
                <tr><td className="py-1"><strong>Price (LTP)</strong></td><td className="py-1 text-right"><span className="text-terminal-cyan">$110,030.29</span></td></tr>
                <tr><td className="py-1"><strong>24h Change</strong></td><td className="py-1 text-right"><span className="text-terminal-red">-2.44%</span></td></tr>
                <tr><td className="py-1"><strong>Daily Range</strong></td><td className="py-1 text-right">$107,925 – $113,643</td></tr>
                <tr><td className="py-1"><strong>24h VWAP</strong></td><td className="py-1 text-right">$110,810</td></tr>
                <tr><td className="py-1"><strong>24h Volume</strong></td><td className="py-1 text-right">26,722 BTC (~$2.96B)</td></tr>
                <tr><td className="py-1"><strong>Report Time</strong></td><td className="py-1 text-right text-terminal-muted">2025-10-30 11:03:07 UTC</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-yellow-300 mt-3 text-sm">🟡 Market continues correcting from local max $113.6k; volumes stable but priority shifted to sellers.</p>
        </section>

        {/* Microstructure */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            2. Microstructure (Order Book, Flows, Balance)
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>Bid</strong></td><td className="py-1 text-right">$110,027.93 (0.0577 BTC)</td></tr>
                <tr><td className="py-1"><strong>Ask</strong></td><td className="py-1 text-right">$110,027.94 (8.8145 BTC)</td></tr>
                <tr><td className="py-1"><strong>Spread</strong></td><td className="py-1 text-right"><span className="text-terminal-green">$0.01 (0.91 bps) ✅ tight</span></td></tr>
                <tr><td className="py-1"><strong>Imbalance (Top-20)</strong></td><td className="py-1 text-right"><span className="text-terminal-red">0.02 🔴 seller dominance</span></td></tr>
                <tr><td className="py-1"><strong>CVD (delta)</strong></td><td className="py-1 text-right"><span className="text-terminal-red">-57.22</span></td></tr>
                <tr><td className="py-1"><strong>Flow rate</strong></td><td className="py-1 text-right">Bid 6.68 / Ask 7.57 ord/s</td></tr>
                <tr><td className="py-1"><strong>Net flow</strong></td><td className="py-1 text-right"><span className="text-terminal-red">-0.88 ord/s → mild sell pressure</span></td></tr>
                <tr><td className="py-1"><strong>Health score</strong></td><td className="py-1 text-right"><span className="text-terminal-green">🟢 87.5/100 (Excellent)</span></td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-cyan mt-3 text-sm italic">💬 Microstructure healthy, liquidity high, but order flow shifted to mild sell-pressure zone. Safe for limit orders; market entries may cause minor slippage.</p>
        </section>

        {/* Volume Profile */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            3. Volume Profile & Liquidity (6-hour window)
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>POC (Point of Control)</strong></td><td className="py-1 text-right text-terminal-cyan">$110,180</td></tr>
                <tr><td className="py-1"><strong>VAH / VAL</strong></td><td className="py-1 text-right">$111,227 / $109,546</td></tr>
                <tr><td className="py-1"><strong>Total Volume (6h)</strong></td><td className="py-1 text-right">5,374 BTC</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-muted mt-3 text-sm">📈 Balanced structure, POC close to current price → consolidation. Main buyer interest in $109.5–110.2k zone.</p>
        </section>

        {/* News & Macro */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            4. News & Macro Background (Oct 30)
          </h2>
          <div className="space-y-3 text-terminal-muted">
            <p className="font-semibold text-terminal-text">Facts:</p>
            <ul className="space-y-2 ml-6">
              <li>• Market cooling after impulse above $113k; -2.4% in 24h</li>
              <li>• Spot ETF activity (IBIT, FBTC) remains positive, but inflow pace declining</li>
              <li>• <strong className="text-yellow-300">Fear & Greed Index: ~36 (Fear)</strong> — sustained cautious sentiment</li>
              <li>• Participants await US macro data (PCE, inflation) and Fed rhetoric</li>
              <li>• Stock markets consolidating; BTC-NASDAQ correlation persists</li>
            </ul>
            <p className="text-terminal-cyan italic mt-3">Opinion: Technical correction without panic signals. Long-term background remains bullish with continued ETF inflows.</p>
          </div>
        </section>

        {/* Polymarket */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            5. Polymarket (Predictive Probabilities)
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>BTC ≥ $130,000 in 2025</strong></td><td className="py-1 text-right text-terminal-green">~52%</td></tr>
                <tr><td className="py-1"><strong>BTC ≥ $150,000 in 2025</strong></td><td className="py-1 text-right text-terminal-green">~15%</td></tr>
                <tr><td className="py-1"><strong>BTC ≥ $200,000 in 2025</strong></td><td className="py-1 text-right">{'<'} 5%</td></tr>
                <tr><td className="py-1"><strong>Bet Volume</strong></td><td className="py-1 text-right">≈ $38M</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-muted mt-3 text-sm">📊 Prediction market preserves moderate optimism, but probability of rise above $150k declined amid correction.</p>
        </section>

        {/* Levels/Scenarios */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            6. Tactical Assessment & Scenarios
          </h2>
          <div className="space-y-4 text-terminal-muted">
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
              <table className="w-full text-terminal-text text-sm">
                <tbody>
                  <tr><td className="py-1"><strong>Trend (H4)</strong></td><td className="py-1 text-right">Correction within range</td></tr>
                  <tr><td className="py-1"><strong>Momentum</strong></td><td className="py-1 text-right text-yellow-300">Weak, neutral-bearish</td></tr>
                  <tr><td className="py-1"><strong>Sentiment</strong></td><td className="py-1 text-right text-yellow-300">Cautious</td></tr>
                  <tr><td className="py-1"><strong>Liquidity</strong></td><td className="py-1 text-right text-terminal-green">High</td></tr>
                  <tr><td className="py-1"><strong>Microstructure</strong></td><td className="py-1 text-right text-yellow-300">Healthy, but seller pressure</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <p className="text-terminal-cyan font-semibold mb-2">🎯 Working Scenarios:</p>
              <ol className="space-y-3 ml-6">
                <li><strong className="text-terminal-text">1. Base range: $108k–$113k</strong> → trades from boundaries, partial profit taking</li>
                <li><strong className="text-terminal-text">2. Bullish scenario:</strong> Hold above $111.5k → target $113–114k</li>
                <li><strong className="text-terminal-text">3. Bearish scenario:</strong> Break below $108k → decline to $105k</li>
              </ol>
            </div>
            <p className="text-terminal-cyan italic mt-3">📌 Tactics: Use limit orders, avoid entries on thin volumes, track ETF flows and CVD.</p>
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
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">Bottom Line for Traders</h2>
          <div className="space-y-3 text-terminal-muted">
            <p>• BTC holds in <strong className="text-yellow-300">corrective sideways</strong> while market structure remains <strong className="text-terminal-green">healthy and liquid</strong>.</p>
            <p>• Short-term seller dominance, but fundamental risks limited.</p>
            <p>• For <strong className="text-terminal-text">retail trader</strong> rational to:</p>
            <ul className="ml-6 space-y-1 text-sm">
              <li>→ Work within $108–113k range</li>
              <li>→ Risk ≤ 1% per trade</li>
              <li>→ Take partial profits at +1.5–2%</li>
              <li>→ Watch for CVD and imbalance shifts ({'>'} 3 = reversal signal)</li>
            </ul>
          </div>
        </section>

      </article>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-graphite-800 text-xs text-terminal-muted">
        <p>Report generated: Oct 30, 2025 11:03 UTC</p>
        <p className="mt-2">Data source: SSE (Binance BTCUSDT), Polymarket, Alternative.me (FGI), CoinGecko</p>
        <p className="mt-2">This report combines facts (with sources), opinion, and assumptions. Not financial advice.</p>
        <p className="mt-4">
          <Link to="/" className="text-terminal-cyan hover:underline">← Back to Context8</Link>
        </p>
      </footer>
    </div>
  )
}
