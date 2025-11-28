import { Link } from 'react-router-dom'

// Progress bar component for sentiment visualization
function SentimentBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-terminal-muted">{label}</span>
        <span className="text-terminal-green font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-graphite-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-terminal-green to-terminal-cyan rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

// Metric card component
function MetricCard({ label, value, change, isPositive }: {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}) {
  return (
    <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4 hover:border-terminal-cyan/30 transition-colors">
      <div className="text-xs text-terminal-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="text-xl font-bold text-terminal-text font-mono">{value}</div>
      {change && (
        <div className={`text-xs mt-1 ${isPositive ? 'text-terminal-green' : 'text-terminal-red'}`}>
          {isPositive ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  )
}

// Badge component for narratives
function Badge({ children, variant = 'default' }: {
  children: React.ReactNode;
  variant?: 'default' | 'hot' | 'cold' | 'neutral';
}) {
  const variants = {
    default: 'bg-terminal-cyan/20 text-terminal-cyan border-terminal-cyan/30',
    hot: 'bg-terminal-green/20 text-terminal-green border-terminal-green/30',
    cold: 'bg-terminal-red/20 text-terminal-red border-terminal-red/30',
    neutral: 'bg-graphite-800 text-terminal-muted border-graphite-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono rounded border ${variants[variant]}`}>
      {children}
    </span>
  )
}

// Asset row for movers table
function AssetRow({
  symbol,
  change24h,
  change7d,
  social,
  sentiment,
  comment,
  isPositive
}: {
  symbol: string;
  change24h: string;
  change7d: string;
  social: string;
  sentiment: string;
  comment: string;
  isPositive: boolean;
}) {
  return (
    <tr className="border-b border-graphite-800 hover:bg-graphite-800/50 transition-colors">
      <td className="py-3 px-2">
        <span className={`font-bold font-mono ${isPositive ? 'text-terminal-green' : 'text-terminal-red'}`}>
          {symbol}
        </span>
      </td>
      <td className={`py-3 px-2 font-mono text-sm ${isPositive ? 'text-terminal-green' : 'text-terminal-red'}`}>
        {change24h}
      </td>
      <td className={`py-3 px-2 font-mono text-sm ${change7d.startsWith('+') ? 'text-terminal-green' : 'text-terminal-red'}`}>
        {change7d}
      </td>
      <td className="py-3 px-2 text-sm text-terminal-cyan">{social}</td>
      <td className="py-3 px-2 text-sm">
        <span className="text-terminal-green">{sentiment}</span>
      </td>
      <td className="py-3 px-2 text-xs text-terminal-muted max-w-[200px]">{comment}</td>
    </tr>
  )
}

// Risk indicator component
function RiskIndicator({ level, label }: { level: 'low' | 'medium' | 'high'; label: string }) {
  const colors = {
    low: 'bg-terminal-green',
    medium: 'bg-yellow-500',
    high: 'bg-terminal-red',
  }
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colors[level]} animate-pulse`} />
      <span className="text-sm text-terminal-muted">{label}</span>
    </div>
  )
}

export function DailyReport() {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-4 md:px-6 py-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <Link to="/" className="text-sm text-terminal-cyan hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-terminal-cyan">Daily Market Overview</h1>
            <p className="text-terminal-muted text-sm mt-1">Crypto market intelligence • Social signals • Key narratives</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-terminal-cyan/10 border border-terminal-cyan/30 rounded text-terminal-cyan text-sm">
              Nov 28, 2025
            </span>
            <span className="px-3 py-1 bg-terminal-green/10 border border-terminal-green/30 rounded text-terminal-green text-sm">
              LIVE
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-6xl mx-auto space-y-8">

        {/* Key Metrics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Unique Creators"
            value="249,766"
            change="7.1% vs 24h"
            isPositive={false}
          />
          <MetricCard
            label="Market Sentiment"
            value="82%"
            change="1-2% vs avg"
            isPositive={true}
          />
          <MetricCard
            label="DeFi Engagements"
            value="53M"
            change="19% vs weekly"
            isPositive={false}
          />
          <MetricCard
            label="AI Creators"
            value="—"
            change="9.7% vs 24h"
            isPositive={false}
          />
        </section>

        {/* Executive Summary */}
        <section className="bg-graphite-900 border border-terminal-cyan/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan flex items-center gap-2">
            <span className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse" />
            Executive Summary
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-terminal-red mt-1">▼</span>
                <p className="text-sm text-terminal-muted">
                  <strong className="text-terminal-text">Social activity cooled</strong> — unique creators down 7.1% to 249,766 vs prior 24h
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-terminal-green mt-1">▲</span>
                <p className="text-sm text-terminal-muted">
                  <strong className="text-terminal-text">Sentiment bullish</strong> — 82% positive (up 1-2% vs weekly/monthly averages)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">◆</span>
                <p className="text-sm text-terminal-muted">
                  <strong className="text-terminal-text">Price action mixed</strong> — narrow breadth, concentrated in privacy coins (ZEC ETF news)
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-terminal-cyan mt-1">●</span>
                <p className="text-sm text-terminal-muted">
                  <strong className="text-terminal-text">BTC ETF inflows rebounded</strong> while Solana ETFs saw outflows
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-terminal-red mt-1">!</span>
                <p className="text-sm text-terminal-muted">
                  <strong className="text-terminal-text">Anomalies:</strong> Upbit $36M Solana hack; Tether downgrade by S&P
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-terminal-green mt-1">★</span>
                <p className="text-sm text-terminal-muted">
                  <strong className="text-terminal-text">Key narratives:</strong> Privacy coins, Solana ecosystem, Chainlink partnerships
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sentiment Visualization */}
        <section className="bg-graphite-900 border border-graphite-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-terminal-text">Sentiment Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <SentimentBar value={82} label="Overall Market" />
            <SentimentBar value={84} label="DeFi Sector" />
            <SentimentBar value={83} label="AI Sector" />
          </div>
        </section>

        {/* Narratives & Sectors */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2 flex items-center gap-2">
            <span className="text-terminal-cyan">02</span> Narratives & Sectors
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Privacy Coins Card */}
            <div className="bg-graphite-900 border border-terminal-green/30 rounded-lg p-4 hover:border-terminal-green/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-terminal-green">Privacy Coins</h3>
                <Badge variant="hot">+1000% ZEC</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Assets</span>
                  <span className="text-terminal-text">ZEC, DASH, XMR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Catalyst</span>
                  <span className="text-terminal-cyan">Grayscale ETF filing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Social</span>
                  <span className="text-terminal-green">↑ Surge</span>
                </div>
              </div>
            </div>

            {/* Solana Ecosystem Card */}
            <div className="bg-graphite-900 border border-yellow-500/30 rounded-lg p-4 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-yellow-400">Solana Ecosystem</h3>
                <Badge variant="neutral">Mixed</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Assets</span>
                  <span className="text-terminal-text">SOL ($140), MON</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Events</span>
                  <span className="text-terminal-red">$36M hack, ETF outflows</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Social</span>
                  <span className="text-terminal-cyan">↑ Mentions, ↓ Engagement</span>
                </div>
              </div>
            </div>

            {/* DeFi Card */}
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4 hover:border-terminal-cyan/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-terminal-cyan">DeFi</h3>
                <Badge variant="default">84% sentiment</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Assets</span>
                  <span className="text-terminal-text">SOL, ETH, XRP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Engagements</span>
                  <span className="text-terminal-red">↓ 19%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Mentions</span>
                  <span className="text-terminal-green">↑ 9.4%</span>
                </div>
              </div>
            </div>

            {/* AI Card */}
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4 hover:border-terminal-cyan/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-purple-400">AI Sector</h3>
                <Badge variant="default">83% sentiment</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Assets</span>
                  <span className="text-terminal-text">AIOZ (+5%), NAO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Focus</span>
                  <span className="text-terminal-cyan">Chainlink, Bittensor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Volume</span>
                  <span className="text-terminal-muted">Low</span>
                </div>
              </div>
            </div>

            {/* Bitcoin Ecosystem Card */}
            <div className="bg-graphite-900 border border-orange-500/30 rounded-lg p-4 hover:border-orange-500/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-orange-400">Bitcoin Ecosystem</h3>
                <Badge variant="hot">ETF Inflows</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Catalyst</span>
                  <span className="text-terminal-green">Texas BTC reserve</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">ETF Flows</span>
                  <span className="text-terminal-green">↑ Rebounded</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Dominance</span>
                  <span className="text-terminal-cyan">Steady</span>
                </div>
              </div>
            </div>

            {/* Declining Card */}
            <div className="bg-graphite-900 border border-terminal-red/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-terminal-red">Declining</h3>
                <Badge variant="cold">Reduced</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-terminal-muted">
                  <span className="text-terminal-red">↓</span> Memecoins/pump-fun
                </div>
                <div className="text-terminal-muted">
                  <span className="text-terminal-red">↓</span> General Layer-1s (beyond SOL)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Movers */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2 flex items-center gap-2">
            <span className="text-terminal-cyan">03</span> Top Movers
          </h2>

          {/* Positive Movers */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-terminal-green mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-terminal-green/20 flex items-center justify-center">↑</span>
              Positive Movers
            </h3>
            <div className="bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-graphite-800 text-terminal-muted text-xs uppercase">
                  <tr>
                    <th className="py-2 px-2 text-left">Symbol</th>
                    <th className="py-2 px-2 text-left">24h</th>
                    <th className="py-2 px-2 text-left">7d</th>
                    <th className="py-2 px-2 text-left">Social</th>
                    <th className="py-2 px-2 text-left">Sentiment</th>
                    <th className="py-2 px-2 text-left">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  <AssetRow symbol="ZEC" change24h="N/A (surge)" change7d="-30% post-rally" social="High" sentiment="Bullish" comment="Grayscale ETF filing drove 1000% rally" isPositive={true} />
                  <AssetRow symbol="AIOZ" change24h="+4.95%" change7d="+16.3%" social="+45% mentions" sentiment="84%" comment="DePIN/AI integration; AltRank #132" isPositive={true} />
                  <AssetRow symbol="SOL" change24h="→ $140" change7d="N/A" social="High" sentiment="Mixed" comment="ETF/tokenized assets despite hack" isPositive={true} />
                  <AssetRow symbol="ISP" change24h="+14.3%" change7d="+30.8%" social="+138% engmt" sentiment="78%" comment="Whale buys; Galaxy 79.5" isPositive={true} />
                  <AssetRow symbol="VR" change24h="+0.7%" change7d="+6.9%" social="-58% engmt" sentiment="98%" comment="Metaverse AI tools; Galaxy 78.6" isPositive={true} />
                </tbody>
              </table>
            </div>
          </div>

          {/* Negative Movers */}
          <div>
            <h3 className="text-sm font-semibold text-terminal-red mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-terminal-red/20 flex items-center justify-center">↓</span>
              Negative Movers
            </h3>
            <div className="bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-graphite-800 text-terminal-muted text-xs uppercase">
                  <tr>
                    <th className="py-2 px-2 text-left">Symbol</th>
                    <th className="py-2 px-2 text-left">24h</th>
                    <th className="py-2 px-2 text-left">7d</th>
                    <th className="py-2 px-2 text-left">Social</th>
                    <th className="py-2 px-2 text-left">Sentiment</th>
                    <th className="py-2 px-2 text-left">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  <AssetRow symbol="DDD" change24h="0%" change7d="-55.6%" social="Low" sentiment="N/A" comment="Sharp drop despite Galaxy 100" isPositive={false} />
                  <AssetRow symbol="EMC" change24h="-12.3%" change7d="-5.7%" social="+72% engmt" sentiment="67%" comment="Scam fears outweigh AI promo" isPositive={false} />
                  <AssetRow symbol="NAO" change24h="+0.1%" change7d="+0.9%" social="+300-467%" sentiment="N/A" comment="Low volume despite Galaxy 100" isPositive={false} />
                  <AssetRow symbol="USHI" change24h="-1.4%" change7d="-0.1%" social="+217% mentions" sentiment="67%" comment="Thin liquidity" isPositive={false} />
                  <AssetRow symbol="MON" change24h="Dump" change7d="N/A" social="Controversial" sentiment="Mixed" comment="Post-launch selloff; Hayes: 'send to zero'" isPositive={false} />
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Social & Influencer Highlights */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2 flex items-center gap-2">
            <span className="text-terminal-cyan">04</span> Social & Influencer Highlights
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Top Influencers */}
            <div className="space-y-3">
              <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-terminal-cyan">@MEXC_Official</span>
                  <span className="text-xs text-terminal-muted">1.7M followers</span>
                </div>
                <div className="text-sm text-terminal-muted">115 posts • 8.7M engagements</div>
                <Badge variant="hot">Bullish DeFi</Badge>
              </div>

              <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-terminal-cyan">@WatcherGuru</span>
                  <span className="text-xs text-terminal-muted">2M+ engagements</span>
                </div>
                <div className="text-sm text-terminal-muted">ETF inflows, ZEC ETF, Solana hacks</div>
                <Badge variant="neutral">Mixed</Badge>
              </div>

              <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-terminal-red">@CryptoHayes</span>
                  <span className="text-xs text-terminal-muted">816K engagements</span>
                </div>
                <div className="text-sm text-terminal-muted">Bearish on MON: "send to zero"</div>
                <Badge variant="cold">Bearish MON</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-terminal-cyan">@lookonchain</span>
                  <span className="text-xs text-terminal-muted">1M+ engagements</span>
                </div>
                <div className="text-sm text-terminal-muted">Whale $ENA buys, XRP reserves low</div>
                <Badge variant="neutral">Analytics</Badge>
              </div>

              <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-terminal-cyan">@solana</span>
                  <span className="text-xs text-terminal-muted">195K engagements</span>
                </div>
                <div className="text-sm text-terminal-muted">"Amazon for finance" — defensive</div>
                <Badge variant="default">Defensive</Badge>
              </div>

              <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-terminal-green">DeFi Posts</span>
                  <span className="text-xs text-terminal-muted">Chainlink focus</span>
                </div>
                <div className="text-sm text-terminal-muted">Solana growth, ZEC privacy insurance</div>
                <Badge variant="hot">84% bullish</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Risks & Observations */}
        <section className="bg-graphite-900 border border-terminal-red/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-red flex items-center gap-2">
            <span className="text-2xl">⚠</span> Risks & Observations for Next Day
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-terminal-red/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-terminal-red text-sm">1</span>
                </div>
                <div>
                  <RiskIndicator level="high" label="Privacy Surge (ZEC)" />
                  <p className="text-sm text-terminal-muted mt-1">1000% rally + ETF hype risks pullback amid thin liquidity</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-terminal-red/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-terminal-red text-sm">2</span>
                </div>
                <div>
                  <RiskIndicator level="high" label="Solana Ecosystem Pressure" />
                  <p className="text-sm text-terminal-muted mt-1">$36M Upbit hack + ETF outflows; monitor on-chain volume</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-500 text-sm">3</span>
                </div>
                <div>
                  <RiskIndicator level="medium" label="Monad Post-Launch Froth" />
                  <p className="text-sm text-terminal-muted mt-1">93% airdrop wallets sold; Hayes criticism amplifies downside</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-500 text-sm">4</span>
                </div>
                <div>
                  <RiskIndicator level="medium" label="Tether S&P Downgrade" />
                  <p className="text-sm text-terminal-muted mt-1">BTC/gold exposure concerns could spill to stables/DeFi</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-terminal-muted/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-terminal-muted text-sm">5</span>
                </div>
                <div>
                  <RiskIndicator level="low" label="Low Conviction Environment" />
                  <p className="text-sm text-terminal-muted mt-1">Downward social trends suggest low conviction; watch BTC ETF flows</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-terminal-green/10 rounded-lg p-3 -mx-3">
                <div className="w-8 h-8 rounded-full bg-terminal-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-terminal-green text-sm">+</span>
                </div>
                <div>
                  <span className="text-terminal-green font-semibold text-sm">Bullish Anchors</span>
                  <p className="text-sm text-terminal-muted mt-1">Texas BTC reserve, Chainlink accumulation provide macro support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Footer */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 py-6 border-t border-graphite-800">
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-terminal-cyan">82%</div>
            <div className="text-xs text-terminal-muted">Market Sentiment</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-terminal-red">-7.1%</div>
            <div className="text-xs text-terminal-muted">Creator Activity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-terminal-green">+9.4%</div>
            <div className="text-xs text-terminal-muted">DeFi Mentions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-terminal-red">-19%</div>
            <div className="text-xs text-terminal-muted">DeFi Engagements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-orange-400">$36M</div>
            <div className="text-xs text-terminal-muted">Upbit Hack</div>
          </div>
        </section>

      </article>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-8 pt-8 border-t border-graphite-800 text-xs text-terminal-muted">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <p>Report generated: Nov 28, 2025 • UTC</p>
            <p className="mt-1">Data sources: LunarCrush, CoinGecko, Grayscale, Polymarket, On-chain analytics</p>
          </div>
          <div className="text-right">
            <p>This report combines facts, social signals, and sentiment analysis.</p>
            <p className="mt-1 text-terminal-red">Not financial advice.</p>
          </div>
        </div>
        <p className="mt-6">
          <Link to="/" className="text-terminal-cyan hover:underline">← Back to Context8</Link>
        </p>
      </footer>
    </div>
  )
}
