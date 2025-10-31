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
          <span className="text-sm text-terminal-muted">Oct 31, 2025 09:30 UTC</span>
        </div>
        <p className="text-terminal-muted">Quant analysis • Facts • Microstructure</p>
        <p className="text-xs text-terminal-muted mt-1">Exchange: Binance (via SSE / context8-analytics)</p>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto space-y-8 text-sm leading-relaxed">

        {/* TL;DR */}
        <section className="bg-graphite-900 border border-terminal-cyan/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">TL;DR</h2>
          <ul className="space-y-2 text-terminal-text">
            <li>• <strong>Spot price</strong>: <span className="text-terminal-cyan">$110,043.82</span>; market stabilized in $108.6–$116k range after peak $126k on Oct 6. Mid-point: $112,280.</li>
            <li>• <strong>Weekly range</strong>: $108,604 – $115,957; range/mid 6.55% — moderate volatility.</li>
            <li>• <strong>Sentiment</strong>: Crypto Fear & Greed = <span className="text-yellow-300">37 (Fear)</span> — cautious mood persists. <a href="https://alternative.me/crypto/" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Alternative.me]</a></li>
            <li>• <strong>Polymarket</strong>: <span className="text-terminal-green">≥$130k (~53%)</span>, <span className="text-terminal-green">≥$150k (~15%)</span>, <span className="text-terminal-red">≤$80k (~10%)</span>. Volume $38M. <a href="https://polymarket.com/event/what-price-will-bitcoin-hit-in-2025" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Polymarket]</a></li>
            <li>• <strong>Microstructure</strong> (Binance BTCUSDT): spread $0.01 (0.91 m-bps) ultra-tight; imbalance <span className="text-terminal-red">-0.923 (seller bias)</span>, orders/sec 46, net flow <span className="text-terminal-green">+0.58</span>, health <span className="text-terminal-green">80/100 (good)</span>.</li>
          </ul>
        </section>

        {/* Macro & Fundamentals */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            1. Macro & Fundamental Facts
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody className="space-y-2">
                <tr><td className="py-1"><strong>Fed (Oct 30)</strong></td><td className="py-1 text-right">Rate cut -25 bps → 3.75–4.00%</td></tr>
                <tr><td className="py-1"><strong>QT (balance sheet)</strong></td><td className="py-1 text-right">Ends Dec 1, reinvestment begins</td></tr>
                <tr><td className="py-1"><strong>US GDP Q3</strong></td><td className="py-1 text-right">+3.1% QoQ (soft landing)</td></tr>
                <tr><td className="py-1"><strong>PCE (inflation)</strong></td><td className="py-1 text-right">Release Oct 31 12:30 UTC</td></tr>
                <tr><td className="py-1"><strong>BTC ETF (US)</strong></td><td className="py-1 text-right">Mixed flows, inst. demand stable</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-green mt-3 text-sm">✅ Fed eased policy, QT halt Dec 1 → increased dollar liquidity.</p>
        </section>

        {/* Market Stats */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            2. Market Statistics (CoinGecko / Weekly)
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody className="space-y-2">
                <tr><td className="py-1"><strong>7-day range</strong></td><td className="py-1 text-right">$108,604 – $115,957</td></tr>
                <tr><td className="py-1"><strong>Today 24h</strong></td><td className="py-1 text-right">$108,201 – $113,567</td></tr>
                <tr><td className="py-1"><strong>Mid-point</strong></td><td className="py-1 text-right"><span className="text-terminal-cyan">$112,280</span></td></tr>
                <tr><td className="py-1"><strong>Range / mid</strong></td><td className="py-1 text-right">≈ 6.55%</td></tr>
                <tr><td className="py-1"><strong>October ATH</strong></td><td className="py-1 text-right">$126,080 (Oct 6)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-cyan mt-3 text-sm">📊 Market stabilized after 125–126k peak in early October.</p>
        </section>

        {/* Sentiment */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            3. Sentiment & Forecasts
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>Fear & Greed Index</strong></td><td className="py-1 text-right"><span className="text-yellow-300">37 (Fear)</span> → caution</td></tr>
                <tr><td className="py-1"><strong>Polymarket ≥$130k</strong></td><td className="py-1 text-right"><span className="text-terminal-green">≈ 53%</span></td></tr>
                <tr><td className="py-1"><strong>Polymarket ≥$150k</strong></td><td className="py-1 text-right"><span className="text-terminal-green">≈ 15%</span></td></tr>
                <tr><td className="py-1"><strong>Polymarket ≤$80k</strong></td><td className="py-1 text-right"><span className="text-terminal-red">≈ 10%</span></td></tr>
                <tr><td className="py-1"><strong>Market volume</strong></td><td className="py-1 text-right">≈ $38M</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-muted mt-3 text-sm">Social media: discussing "Fed easing" and "possible ATH retest".</p>
        </section>

        {/* Key Levels */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            4. Key Levels (Weekly)
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>Support S1</strong></td><td className="py-1 text-right">$108.0–$108.6k (7-day low edge)</td></tr>
                <tr><td className="py-1"><strong>Support S2</strong></td><td className="py-1 text-right">$106–$107k (October clusters)</td></tr>
                <tr><td className="py-1"><strong>Resistance R1</strong></td><td className="py-1 text-right">$113–$116k (7-day high)</td></tr>
                <tr><td className="py-1"><strong>Resistance R2</strong></td><td className="py-1 text-right">$118–$120k (window to $125k retest)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Microstructure */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            5. Microstructure (SSE, Binance BTCUSDT)
          </h2>
          <p className="text-terminal-muted text-xs mb-3">Snapshot time: 2025-10-31 08:57:51 UTC | Stream status: ok (≈ 80ms lag)</p>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>Last price (LTP)</strong></td><td className="py-1 text-right"><span className="text-terminal-cyan">$110,043.82</span></td></tr>
                <tr><td className="py-1"><strong>Bid / Ask</strong></td><td className="py-1 text-right">$110,043.81 / $110,043.82</td></tr>
                <tr><td className="py-1"><strong>Spread</strong></td><td className="py-1 text-right"><span className="text-terminal-green">$0.01 ≈ 0.91 m-bps</span> ultra-tight</td></tr>
                <tr><td className="py-1"><strong>Bid sum (top-20)</strong></td><td className="py-1 text-right">0.46 BTC (thin support below)</td></tr>
                <tr><td className="py-1"><strong>Ask sum (top-20)</strong></td><td className="py-1 text-right">11.55 BTC (dense cap above)</td></tr>
                <tr><td className="py-1"><strong>Imbalance</strong></td><td className="py-1 text-right"><span className="text-terminal-red">-0.923</span> seller bias</td></tr>
                <tr><td className="py-1"><strong>Orders/sec</strong></td><td className="py-1 text-right">46 orders / s (active flow)</td></tr>
                <tr><td className="py-1"><strong>Net flow</strong></td><td className="py-1 text-right"><span className="text-terminal-green">+0.58</span> (buyers active)</td></tr>
                <tr><td className="py-1"><strong>Micro-price</strong></td><td className="py-1 text-right">$110,043.81 ≈ mid → neutral</td></tr>
                <tr><td className="py-1"><strong>Health score</strong></td><td className="py-1 text-right"><span className="text-terminal-green">80 / 100</span> good</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-cyan mt-3 text-sm italic">💬 Instant ask-side bias; upward move requires absorbing cluster 110,043–110,045 (≈5 BTC). Below price, book is thin — downside impulse could drop $30–50 without resistance.</p>
        </section>

        {/* Probability Assessment */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            6. Probability Assessment (1-week horizon)
          </h2>
          <p className="text-terminal-muted text-sm mb-3">Model: normal distribution around mid $112,280, σ ≈ 1.64%</p>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>Sideways $109–$114k</strong></td><td className="py-1 text-right"><span className="text-terminal-cyan">≈ 60%</span></td></tr>
                <tr><td className="py-1"><strong>Rise {'>'} $116k</strong></td><td className="py-1 text-right"><span className="text-terminal-green">≈ 12%</span> (upside impulse on inflows)</td></tr>
                <tr><td className="py-1"><strong>Drop {'<'} $108.5k</strong></td><td className="py-1 text-right"><span className="text-terminal-red">≈ 12%</span> (inflation/ETF outflows)</td></tr>
                <tr><td className="py-1"><strong>Tails ({'<'}$106k / {'>'}$120k)</strong></td><td className="py-1 text-right">≈ 4–6% each (unlikely extremes)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-yellow-300 mt-3 text-sm">⚠️ Microstructure shift: ask-cluster dominance → short-term probability of range pullback slightly higher than upside breakout.</p>
        </section>

        {/* Practical Observations */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            7. Practical Observations (no recommendations)
          </h2>
          <ol className="space-y-2 text-terminal-muted ml-6 text-sm">
            <li>1. <strong className="text-terminal-text">Spread {'<'} 1 m-bps</strong> — optimal conditions for limit execution.</li>
            <li>2. <strong className="text-terminal-text">Orders/sec {'>'} 50 + imbalance shift toward 0</strong> → market ready for impulse.</li>
            <li>3. <strong className="text-terminal-text">Spread expansion {'>'} 3 m-bps</strong> → declining depth and rising liquidity risk premiums.</li>
            <li>4. <strong className="text-terminal-text">Monitor FGI and ETF flows</strong>: FGI {'>'} 40 + two days of ETF inflows typically coincide with range breakout.</li>
            <li>5. <strong className="text-terminal-text">Track Polymarket</strong>: ≥$150k share rising {'>'} 20% → signal of strengthening long-term optimism.</li>
          </ol>
        </section>

        {/* Summary */}
        <section className="bg-graphite-900 border border-graphite-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">Summary TL;DR</h2>
          <ul className="space-y-2 text-terminal-muted text-sm">
            <li>• <strong className="text-terminal-text">Fed</strong> eased policy (−25 bps; QT halt Dec 1).</li>
            <li>• <strong className="text-terminal-text">BTC</strong> trades in $108.6–$116k, mid ≈ $112k.</li>
            <li>• <strong className="text-terminal-text">Sentiment</strong> — cautious (Fear 37).</li>
            <li>• <strong className="text-terminal-text">Microstructure SSE</strong>: LTP $110,043.82; spread $0.01; ask-dominance (imbalance −0.92); orders/sec 46; net flow +0.58.</li>
            <li>• <strong className="text-terminal-text">Probabilities (week)</strong>: sideways 60%, up breakout 12%, down 12%, tails 4–6%.</li>
            <li>• <strong className="text-terminal-text">Conclusion</strong>: market stable within range; macro backdrop easing; breakout possible only with ask-cluster absorption and ETF inflow confirmation.</li>
          </ul>
        </section>

      </article>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-graphite-800 text-xs text-terminal-muted">
        <p>Report generated: Oct 31, 2025 09:30 UTC</p>
        <p className="mt-2">Data source: SSE (Binance BTCUSDT), Polymarket, Alternative.me (FGI), CoinGecko, Farside</p>
        <p className="mt-2">This report combines facts (with sources), quant analysis, and microstructure. Not financial advice.</p>
        <p className="mt-4">
          <Link to="/" className="text-terminal-cyan hover:underline">← Back to Context8</Link>
        </p>
      </footer>
    </div>
  )
}
