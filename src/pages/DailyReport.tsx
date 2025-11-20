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
          <span className="text-sm text-terminal-muted">Nov 20, 2025 09:30 UTC</span>
        </div>
        <p className="text-terminal-muted">Comprehensive market analysis • Facts, opinion, and actionable insights</p>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto space-y-8 text-sm leading-relaxed">

        {/* TL;DR */}
        <section className="bg-graphite-900 border border-terminal-cyan/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">TL;DR</h2>
          <ul className="space-y-2 text-terminal-text">
            <li>• <strong>Price</strong>: BTC <span className="text-terminal-red">below $90k</span> after October ATH ≈ $126k, down ~30% from peak, wiping out 2025 gains.</li>
            <li>• <strong>Market cap</strong>: Crypto market lost <span className="text-terminal-red">&gt; $1 trillion</span> over ~6 weeks.</li>
            <li>• <strong>Technical analysis</strong>: <span className="text-terminal-red">Death cross</span> confirmed (50/200 MA) — one of the deepest corrections since 2017.</li>
            <li>• <strong>LunarCrush sentiment</strong>: Galaxy Score ≈ 67 (moderately bullish), Sentiment 76% positive, Mentions ~289k (↑1.8x), Social Dominance 30% (vs avg 17%).</li>
            <li>• <strong>Polymarket</strong>: ≈62% probability of ending 2025 <span className="text-terminal-red">below $90k</span> — consensus shifted toward prolonged correction.</li>
          </ul>
        </section>

        {/* 1. Market says */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            1. What the Market Says (Price + Macro Sentiment)
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-terminal-cyan mb-2">Facts</h3>
              <ul className="space-y-2 text-terminal-muted ml-4">
                <li>• BTC dropped from October ATH ≈ <span className="text-terminal-text">$126k</span> to below <span className="text-terminal-red">$90k</span>, losing nearly <span className="text-terminal-red">30%</span> from peak and erasing 2025 gains. <span className="text-xs">[Reuters, Moneycontrol]</span></li>
                <li>• The BTC drop over ~6 weeks wiped <span className="text-terminal-red">&gt; $1 trillion</span> from crypto market cap. <span className="text-xs">[Coinlive, Tom's Hardware]</span></li>
                <li>• News outlets note a <span className="text-terminal-red">"death cross"</span> (50/200 MA crossover from above) and one of the deepest corrections since 2017. <span className="text-xs">[CoinDesk]</span></li>
              </ul>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-4">
              <h3 className="text-base font-semibold text-yellow-300 mb-2">💭 My Opinion</h3>
              <p className="text-terminal-muted">
                From a classic cycle perspective: this is no longer a "local pullback" but a full-scale deleveraging and expectation reset phase — downtrend strength now exceeds that of an average "healthy" correction.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Social & Sentiment */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            2. Social Media & Sentiment (LunarCrush)
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-terminal-cyan mb-3">Facts from LunarCrush Data (MCP)</h3>
              <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
                <table className="w-full text-terminal-text text-sm">
                  <tbody>
                    <tr><td className="py-1"><strong>Galaxy Score™</strong></td><td className="py-1 text-right"><span className="text-terminal-green">≈ 67</span> vs avg ~60 → moderately bullish combo</td></tr>
                    <tr><td className="py-1"><strong>Sentiment</strong></td><td className="py-1 text-right"><span className="text-terminal-green">≈ 76%</span> positive mentions (avg ~79%)</td></tr>
                    <tr><td className="py-1"><strong>Mentions</strong></td><td className="py-1 text-right"><span className="text-terminal-cyan">≈ 289k</span> in 24h vs avg ~160k → <span className="text-terminal-green">~1.8x</span> increase</td></tr>
                    <tr><td className="py-1"><strong>Creators</strong></td><td className="py-1 text-right">≈ 101k unique authors per day</td></tr>
                    <tr><td className="py-1"><strong>Social Dominance</strong></td><td className="py-1 text-right"><span className="text-terminal-cyan">≈ 30%</span> vs avg ~17% → BTC dominates crypto discourse</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-4">
              <h3 className="text-base font-semibold text-yellow-300 mb-2">💭 My Opinion</h3>
              <div className="space-y-2 text-terminal-muted text-sm">
                <p>
                  <strong className="text-terminal-text">Price action</strong> — hard "risk-off" and leverage reset underway.
                </p>
                <p>
                  <strong className="text-terminal-text">Social media</strong> — not capitulation, but frantic interest: record activity yet sentiment only slightly slipped from "euphoria" to "cautiously bullish".
                </p>
                <p>
                  This is a textbook pattern: <span className="text-terminal-red">price panic with sustained narrative interest</span> → favorable backdrop for medium-term contrarian setups, but no guarantee of immediate reversal.
                </p>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-700/30 rounded p-4">
              <h3 className="text-base font-semibold text-blue-300 mb-2">🔮 Hypothesis</h3>
              <p className="text-terminal-muted text-sm">
                If social activity remains elevated while price continues to stabilize/drift lower, we'll likely see an <span className="text-terminal-cyan">"accumulation under negative noise"</span> phase — classic foundation for the next leg up.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Derivatives, ETF & Leverage */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            3. Derivatives, ETF & Leverage (from News)
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-terminal-cyan mb-2">Facts</h3>
              <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
                <ul className="space-y-2 text-terminal-muted text-sm">
                  <li>• Media reports sharp BTC decline driven by:</li>
                  <li className="ml-4">— Declining spot ETF inflows turning to outflows</li>
                  <li className="ml-4">— <span className="text-terminal-red">"Death cross"</span> on daily charts</li>
                  <li className="ml-4">— Tightening Fed rate expectations and broad "risk-off" in equities/AI sector</li>
                  <li className="text-xs">→ [CoinDesk, The Guardian]</li>
                  <li className="mt-2">• Reports note <span className="text-terminal-red">billions in leverage liquidations</span> and one of the steepest 43-day drawdowns for BTC since 2017. <span className="text-xs">[Tom's Hardware]</span></li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-4">
              <h3 className="text-base font-semibold text-yellow-300 mb-2">💭 My Opinion</h3>
              <div className="space-y-2 text-terminal-muted text-sm">
                <p>
                  This isn't "speculators leaving the market" — quite the opposite: <span className="text-terminal-text">excessive leverage + ETF flows + macro all hit from the same direction</span>.
                </p>
                <p>
                  Until ETF outflows reverse and funding/perpetual curves normalize, any upward bounces are <span className="text-terminal-red">more likely short squeezes than sustainable trends</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Polymarket */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            4. Polymarket: How the Crowd Prices BTC Scenarios
          </h2>

          <div className="space-y-4">
            <p className="text-terminal-muted italic text-sm">
              Building the picture from documented data points only (no extrapolation between points).
            </p>

            {/* 4.1 Long-term 2025 */}
            <div>
              <h3 className="text-base font-semibold text-terminal-cyan mb-3">4.1. Long-term 2025 View</h3>
              <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-terminal-text font-semibold mb-2">Fact (March 2025):</p>
                    <p className="text-terminal-muted mb-2">Polymarket pricing for BTC in 2025: <span className="text-xs">[Bitget]</span></p>
                    <table className="w-full text-terminal-muted text-sm ml-4">
                      <tbody>
                        <tr><td className="py-1">≥ $120k in 2025</td><td className="py-1 text-right"><span className="text-terminal-green">≈ 51%</span></td></tr>
                        <tr><td className="py-1">≥ $130k</td><td className="py-1 text-right"><span className="text-terminal-green">≈ 40%</span></td></tr>
                        <tr><td className="py-1">≥ $150k</td><td className="py-1 text-right"><span className="text-terminal-cyan">≈ 27%</span></td></tr>
                        <tr><td className="py-1">≥ $200k</td><td className="py-1 text-right">≈ 17%</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <p className="text-terminal-text font-semibold mb-2">Fact (Mid-summer):</p>
                    <p className="text-terminal-muted mb-2">Separate Polymarket gave: <span className="text-xs">[CryptoSlate]</span></p>
                    <table className="w-full text-terminal-muted text-sm ml-4">
                      <tbody>
                        <tr><td className="py-1">BTC &gt; $120k in 2025</td><td className="py-1 text-right"><span className="text-terminal-green">~75%</span></td></tr>
                        <tr><td className="py-1">&gt; $130k</td><td className="py-1 text-right"><span className="text-terminal-green">55%</span></td></tr>
                        <tr><td className="py-1">&gt; $150k</td><td className="py-1 text-right">33%</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-4 mt-3">
                <p className="text-yellow-300 font-semibold text-sm mb-1">💭 My Opinion</p>
                <p className="text-terminal-muted text-sm">
                  Spring–Summer 2025: betting markets were clearly in <span className="text-terminal-cyan">"extended bull"</span> mode — high consensus on continued rally, and these levels were indeed reached later.
                </p>
              </div>
            </div>

            {/* 4.2 Current Bets */}
            <div>
              <h3 className="text-base font-semibold text-terminal-cyan mb-3">4.2. Current Bets (End 2025)</h3>
              <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-terminal-text font-semibold mb-2">Fact (Now):</p>
                    <p className="text-terminal-muted">
                      Polymarket markets give <span className="text-terminal-red">≈62% probability</span> that BTC ends 2025 <span className="text-terminal-red">below $90k</span>. <span className="text-xs">[KuCoin]</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-terminal-text font-semibold mb-2">Fact (Spring 2025):</p>
                    <p className="text-terminal-muted">
                      Polymarket gave &lt;&lt;10% for $200k by end of March and highest weight to scenarios ≤ $75k, i.e., no super-bullish continuation immediately. <span className="text-xs">[reubenabati.com.ng]</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-4 mt-3">
                <p className="text-yellow-300 font-semibold text-sm mb-1">💭 My Opinion</p>
                <p className="text-terminal-muted text-sm">
                  Polymarket bets now tilt toward <span className="text-terminal-red">prolonged correction</span> (year-end &lt; $90k), but don't rule out new ATH scenarios later.
                </p>
                <p className="text-terminal-muted text-sm mt-2">
                  Clear expectation repricing: from spring's "120–150k+ almost inevitable" to current "likely range/decline around 90k".
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-700/30 rounded p-4 mt-3">
                <p className="text-blue-300 font-semibold text-sm mb-1">🔮 Hypothesis</p>
                <p className="text-terminal-muted text-sm">
                  If BTC holds above 90k through year-end, we may see sharp money rotation into Polymarket with probability reassembly toward a new bullish scenario — <span className="text-terminal-cyan">material for a contrarian "fade the consensus" trade</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-graphite-900 border border-graphite-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">Summary</h2>
          <ul className="space-y-2 text-terminal-muted text-sm">
            <li>• <strong className="text-terminal-text">Price</strong>: BTC lost ~30% from ATH ($126k → &lt;$90k), market erased &gt;$1T in cap.</li>
            <li>• <strong className="text-terminal-text">Technicals</strong>: Death cross confirmed, deepest correction since 2017.</li>
            <li>• <strong className="text-terminal-text">Social</strong>: Record activity (289k mentions, 1.8x avg) yet sentiment moderately positive (76%) — price panic with sustained interest.</li>
            <li>• <strong className="text-terminal-text">Derivatives</strong>: Billions in leverage liquidations, ETF outflows, macro risk-off. Upward bounces likely short squeezes.</li>
            <li>• <strong className="text-terminal-text">Polymarket</strong>: Consensus flipped — 62% on year-end &lt;$90k (vs spring's "75% for &gt;$120k").</li>
            <li>• <strong className="text-terminal-text">Conclusion</strong>: Not a local dip but full-scale reset phase. High social activity amid price drop — classic accumulation setup before next leg up, but reversal not guaranteed near-term.</li>
          </ul>
        </section>

      </article>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-graphite-800 text-xs text-terminal-muted">
        <p>Report generated: Nov 20, 2025 09:30 UTC</p>
        <p className="mt-2">Data sources: Reuters, Moneycontrol, Coinlive, Tom's Hardware, CoinDesk, The Guardian, LunarCrush (MCP), Polymarket, Bitget, CryptoSlate, KuCoin</p>
        <p className="mt-2">This report combines facts (with sources), qualitative analysis, and sentiment assessment. Not financial advice.</p>
        <p className="mt-4">
          <Link to="/" className="text-terminal-cyan hover:underline">← Back to Context8</Link>
        </p>
      </footer>
    </div>
  )
}
