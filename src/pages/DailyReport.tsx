import { Link } from 'react-router-dom'
import { useDailyReport } from '../hooks/useDailyReport'
import {
  DailyReport as DailyReportType,
  ExecutiveSummaryItem,
  Narrative,
  TopMover,
  Risk,
  Influencer,
  formatLargeNumber,
  formatPercentChange,
} from '../types/dailyReport'

// ============================================================================
// UI COMPONENTS (matching RU version style)
// ============================================================================

function SentimentBar({ value, label }: { value: number; label: string }) {
  const barColor = value >= 60
    ? 'from-terminal-green to-emerald-400'
    : value >= 40
    ? 'from-yellow-500 to-amber-400'
    : 'from-terminal-red to-rose-400'
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="text-sm text-terminal-text font-medium">{label}</span>
        <span className={`text-lg font-bold font-mono ${value >= 60 ? 'text-terminal-green' : value >= 40 ? 'text-yellow-500' : 'text-terminal-red'}`}>{value}%</span>
      </div>
      <div className="h-3 bg-graphite-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function MetricCard({ label, value, change, isPositive }: {
  label: string
  value: string
  change?: string
  isPositive?: boolean
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

function Badge({ children, variant = 'default' }: {
  children: React.ReactNode
  variant?: 'default' | 'hot' | 'cold' | 'neutral' | 'warm'
}) {
  const variants = {
    default: 'bg-terminal-cyan/30 text-terminal-cyan border-terminal-cyan/50',
    hot: 'bg-emerald-500/30 text-emerald-400 border-emerald-500/50',
    warm: 'bg-amber-500/30 text-amber-400 border-amber-500/50',
    cold: 'bg-rose-500/30 text-rose-400 border-rose-500/50',
    neutral: 'bg-graphite-700 text-terminal-muted border-graphite-600',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-mono font-semibold rounded border ${variants[variant]}`}>
      {children}
    </span>
  )
}

function shortenComment(comment: string): string {
  // Extract key insight only, removing technical details
  // Priority: Galaxy Score > key event > first sentence
  const galaxyMatch = comment.match(/Galaxy Score[:\s]+(\d+\.?\d*)/i)
  const supportMatch = comment.match(/support \$[\d,]+/i)
  const keyEventMatch = comment.match(/(ETF|взлом|hack|rally|ралли|breakout|breakdown)[^.;]*/i)

  // Remove RSI/MACD technical noise
  const cleaned = comment
    .replace(/RSI\s+[\d.]+\s*\([^)]+\),?\s*/gi, '')
    .replace(/MACD\s+(neutral|bearish|bullish),?\s*/gi, '')
    .replace(/support\s+\$[\d,]+,?\s*/gi, '')
    .replace(/resistance\s+\$[\d,]+\.?\s*/gi, '')
    .trim()

  // Build concise comment
  const parts: string[] = []

  if (keyEventMatch) {
    parts.push(keyEventMatch[0].trim())
  } else if (cleaned.length > 0) {
    // Take first meaningful phrase
    const firstPart = cleaned.split(/[.;]/)[0].trim()
    if (firstPart.length > 5 && firstPart.length < 60) {
      parts.push(firstPart)
    }
  }

  if (galaxyMatch) {
    parts.push(`Galaxy ${galaxyMatch[1]}`)
  }

  if (parts.length === 0) {
    // Fallback: just truncate
    return comment.length > 50 ? comment.substring(0, 47) + '...' : comment
  }

  return parts.join('; ')
}

function AssetRow({ mover, isPositive }: { mover: TopMover; isPositive: boolean }) {
  const shortComment = shortenComment(mover.comment)
  return (
    <tr className="border-b border-graphite-800 hover:bg-graphite-800/50 transition-colors">
      <td className="py-3 px-3">
        <span className={`font-bold font-mono ${isPositive ? 'text-terminal-green' : 'text-terminal-red'}`}>
          {mover.symbol}
        </span>
      </td>
      <td className={`py-3 px-3 font-mono text-sm ${isPositive ? 'text-terminal-green' : 'text-terminal-red'}`}>
        {formatPercentChange(mover.change_24h)}
      </td>
      <td className={`py-3 px-3 font-mono text-sm ${(mover.change_7d ?? 0) >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
        {mover.change_7d !== null ? formatPercentChange(mover.change_7d) : 'N/A'}
      </td>
      <td className="py-3 px-3 text-sm">
        <span className={`font-medium ${mover.social === 'High' ? 'text-terminal-cyan' : 'text-terminal-muted'}`}>
          {mover.social}
        </span>
      </td>
      <td className="py-3 px-3 text-sm">
        <span className={`font-mono ${mover.sentiment >= 70 ? 'text-emerald-400' : mover.sentiment >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
          {mover.sentiment}%
        </span>
      </td>
      <td className="py-3 px-3 text-sm text-terminal-muted max-w-[180px]" title={mover.comment}>
        {shortComment}
      </td>
    </tr>
  )
}

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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDirectionSymbol(direction: ExecutiveSummaryItem['direction']) {
  switch (direction) {
    case 'up': return { symbol: '▲', color: 'text-terminal-green' }
    case 'down': return { symbol: '▼', color: 'text-terminal-red' }
    default: return { symbol: '◆', color: 'text-yellow-500' }
  }
}

function parseExecutiveSummaryText(text: string): { boldPart: string; rest: string } {
  const separators = [' — ', ' – ', ': ', ' - ']
  for (const sep of separators) {
    const idx = text.indexOf(sep)
    if (idx > 0 && idx < 50) {
      return {
        boldPart: text.substring(0, idx),
        rest: text.substring(idx)
      }
    }
  }
  return { boldPart: '', rest: text }
}

function parseNarrativeDescription(description: string): { label: string; value: string }[] {
  const parts = description.split('|').map(p => p.trim())
  return parts.map(part => {
    const colonIndex = part.indexOf(':')
    if (colonIndex > 0) {
      return {
        label: part.substring(0, colonIndex).trim(),
        value: part.substring(colonIndex + 1).trim()
      }
    }
    return { label: '', value: part }
  }).filter(p => p.value)
}

function getValueColor(value: string): string {
  if (value.includes('↑') || value.includes('+')) return 'text-terminal-green'
  if (value.includes('↓') || value.includes('-')) return 'text-terminal-red'
  return 'text-terminal-text'
}

function getNarrativeBadge(narrative: Narrative): { label: string; variant: 'hot' | 'warm' | 'cold' | 'neutral' } {
  const desc = narrative.description.toLowerCase()
  const percentMatch = narrative.description.match(/([+-]?\d+(?:\.\d+)?%)/i)

  if (desc.includes('etf outflow') || desc.includes('оттоки')) {
    return { label: 'ETF Outflows', variant: 'cold' }
  }
  if (desc.includes('etf inflow') || desc.includes('притоки')) {
    return { label: 'ETF Inflows', variant: 'hot' }
  }
  if (desc.includes('increased') || desc.includes('growing')) {
    return { label: '↑ Growing', variant: 'hot' }
  }
  if (desc.includes('bearish') || desc.includes('breakdown')) {
    return { label: 'Bearish', variant: 'cold' }
  }
  if (percentMatch) {
    const isPositive = !percentMatch[0].includes('-')
    return { label: percentMatch[0], variant: isPositive ? 'hot' : 'cold' }
  }

  return { label: narrative.status.toUpperCase(), variant: narrative.status as 'hot' | 'warm' | 'cold' }
}

function getNarrativeBorderColor(status: Narrative['status']) {
  switch (status) {
    case 'hot': return 'border-emerald-500/40 hover:border-emerald-500/60'
    case 'warm': return 'border-amber-500/40 hover:border-amber-500/60'
    default: return 'border-graphite-700 hover:border-terminal-cyan/40'
  }
}

function getNarrativeTitleColor(status: Narrative['status']) {
  switch (status) {
    case 'hot': return 'text-emerald-400'
    case 'warm': return 'text-amber-400'
    default: return 'text-terminal-cyan'
  }
}

function parseRiskLabel(label: string): { title: string; description: string } {
  const separators = [': ', ' — ', ' - ']
  for (const sep of separators) {
    const idx = label.indexOf(sep)
    if (idx > 0 && idx < 40) {
      return {
        title: label.substring(0, idx).trim(),
        description: label.substring(idx + sep.length).trim()
      }
    }
  }
  const words = label.split(' ')
  if (words.length > 4) {
    return {
      title: words.slice(0, 3).join(' '),
      description: words.slice(3).join(' ')
    }
  }
  return { title: '', description: label }
}

// ============================================================================
// LOADING / ERROR STATES
// ============================================================================

function LoadingState() {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-4 md:px-6 py-8 flex items-center justify-center">
      <p>Loading...</p>
    </div>
  )
}

function ErrorState({ error }: { error: string }) {
  const isTableMissing = error.toLowerCase().includes('schema cache') ||
                         error.toLowerCase().includes('daily_reports') ||
                         error.toLowerCase().includes('does not exist')

  if (isTableMissing) {
    return (
      <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-4 md:px-6 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-terminal-cyan mb-4">Daily Reports Coming Soon</h1>
          <p className="text-terminal-muted mb-6">We're building automated daily market intelligence reports.</p>
          <Link to="/" className="text-terminal-cyan hover:underline">← Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-4 md:px-6 py-8 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-terminal-red mb-2">Failed to Load Report</h2>
        <p className="text-terminal-muted mb-6">{error}</p>
        <Link to="/" className="text-terminal-cyan hover:underline">← Back to Home</Link>
      </div>
    </div>
  )
}

function NoReportState() {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-4 md:px-6 py-8 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">No Report Available</h2>
        <p className="text-terminal-muted mb-6">Check back later for the latest market insights.</p>
        <Link to="/" className="text-terminal-cyan hover:underline">← Back to Home</Link>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function DailyReport() {
  const { report, loading, error, exists } = useDailyReport()

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!exists || !report) return <NoReportState />

  const { metrics, executive_summary, narratives, top_movers, influencers, risks } = report

  const gainers = top_movers.filter(m => m.change_24h >= 0).sort((a, b) => b.change_24h - a.change_24h)
  const losers = top_movers.filter(m => m.change_24h < 0).sort((a, b) => a.change_24h - b.change_24h)

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
            <span className="px-3 py-1.5 bg-graphite-800 border border-graphite-700 rounded text-terminal-text text-sm font-medium">
              {report.formattedDate}
            </span>
            <span className={`px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-2 ${
              report.isToday
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                : 'bg-terminal-cyan/20 border border-terminal-cyan/50 text-terminal-cyan'
            }`}>
              <span className={`w-2 h-2 rounded-full ${report.isToday ? 'bg-emerald-400 animate-pulse' : 'bg-terminal-cyan'}`} />
              {report.isToday ? 'LIVE' : 'REPORT'}
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
            value={formatLargeNumber(metrics.unique_creators)}
            change={metrics.unique_creators_change !== null ? `${Math.abs(metrics.unique_creators_change)}% vs 24h` : undefined}
            isPositive={metrics.unique_creators_change !== null ? metrics.unique_creators_change >= 0 : undefined}
          />
          <MetricCard
            label="Market Sentiment"
            value={metrics.market_sentiment !== null ? `${metrics.market_sentiment}%` : 'N/A'}
            change={metrics.market_sentiment_change !== null ? `${Math.abs(metrics.market_sentiment_change)}% vs avg` : undefined}
            isPositive={metrics.market_sentiment_change !== null ? metrics.market_sentiment_change >= 0 : undefined}
          />
          <MetricCard
            label="DeFi Engagements"
            value={metrics.defi_engagements !== null ? `${metrics.defi_engagements}M` : 'N/A'}
            change={metrics.defi_engagements_change !== null ? `${Math.abs(metrics.defi_engagements_change)}% vs weekly` : undefined}
            isPositive={metrics.defi_engagements_change !== null ? metrics.defi_engagements_change >= 0 : undefined}
          />
          <MetricCard
            label="AI Creators"
            value={formatLargeNumber(metrics.ai_creators)}
            change={metrics.ai_creators_change !== null ? `${Math.abs(metrics.ai_creators_change)}% vs 24h` : undefined}
            isPositive={metrics.ai_creators_change !== null ? metrics.ai_creators_change >= 0 : undefined}
          />
        </section>

        {/* Executive Summary */}
        {executive_summary.length > 0 && (
          <section className="bg-graphite-900 border border-terminal-cyan/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-terminal-cyan flex items-center gap-2">
              <span className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse" />
              Executive Summary
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {executive_summary.slice(0, Math.ceil(executive_summary.length / 2)).map((item, i) => {
                  const { symbol, color } = getDirectionSymbol(item.direction)
                  const { boldPart, rest } = parseExecutiveSummaryText(item.text)
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`mt-1 ${color}`}>{symbol}</span>
                      <p className="text-sm text-terminal-muted">
                        {boldPart && <strong className="text-terminal-text">{boldPart}</strong>}
                        {rest}
                      </p>
                    </div>
                  )
                })}
              </div>
              <div className="space-y-3">
                {executive_summary.slice(Math.ceil(executive_summary.length / 2)).map((item, i) => {
                  const { symbol, color } = getDirectionSymbol(item.direction)
                  const { boldPart, rest } = parseExecutiveSummaryText(item.text)
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`mt-1 ${color}`}>{symbol}</span>
                      <p className="text-sm text-terminal-muted">
                        {boldPart && <strong className="text-terminal-text">{boldPart}</strong>}
                        {rest}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Sentiment Visualization */}
        {metrics.market_sentiment !== null && (
          <section className="bg-graphite-900 border border-graphite-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-terminal-text">Sentiment Overview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <SentimentBar value={metrics.market_sentiment} label="Overall Market" />
              <SentimentBar value={65} label="DeFi Sector" />
              <SentimentBar value={60} label="AI Sector" />
            </div>
          </section>
        )}

        {/* Narratives & Sectors */}
        {narratives.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2 flex items-center gap-2">
              <span className="text-terminal-cyan">02</span> Narratives & Sectors
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {narratives.map((narrative, i) => {
                const parsedDesc = parseNarrativeDescription(narrative.description)
                const badge = getNarrativeBadge(narrative)
                return (
                  <div
                    key={i}
                    className={`bg-graphite-900 border rounded-lg p-4 transition-colors ${getNarrativeBorderColor(narrative.status)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-semibold ${getNarrativeTitleColor(narrative.status)}`}>
                        {narrative.title}
                      </h3>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    {parsedDesc.length > 0 ? (
                      <div className="space-y-2 text-sm">
                        {parsedDesc.map((item, j) => (
                          <div key={j} className="flex justify-between">
                            <span className="text-terminal-muted">{item.label}</span>
                            <span className={getValueColor(item.value)}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-terminal-muted">{narrative.description}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Top Movers */}
        {top_movers.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2 flex items-center gap-2">
              <span className="text-terminal-cyan">03</span> Top Movers
            </h2>

            {/* Gainers */}
            {gainers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-terminal-green mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-terminal-green/20 flex items-center justify-center">↑</span>
                  Positive Movers ({gainers.length})
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
                      {gainers.slice(0, 5).map((mover, i) => (
                        <AssetRow key={i} mover={mover} isPositive={true} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Losers */}
            {losers.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-terminal-red mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-terminal-red/20 flex items-center justify-center">↓</span>
                  Negative Movers ({losers.length})
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
                      {losers.slice(0, 5).map((mover, i) => (
                        <AssetRow key={i} mover={mover} isPositive={false} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Social & Influencer Highlights */}
        {influencers && influencers.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2 flex items-center gap-2">
              <span className="text-terminal-cyan">04</span> Social & Influencer Highlights
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {influencers.slice(0, 6).map((inf, i) => (
                <div key={i} className={`bg-graphite-900 border rounded-lg p-4 transition-colors ${
                  inf.sentiment === 'bullish' ? 'border-emerald-500/30 hover:border-emerald-500/50' :
                  inf.sentiment === 'bearish' ? 'border-rose-500/30 hover:border-rose-500/50' :
                  'border-graphite-700 hover:border-terminal-cyan/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold ${
                      inf.sentiment === 'bullish' ? 'text-emerald-400' :
                      inf.sentiment === 'bearish' ? 'text-rose-400' :
                      'text-terminal-cyan'
                    }`}>{inf.name}</span>
                    <span className="text-xs text-terminal-muted font-mono">
                      {inf.followers >= 1000000 ? `${(inf.followers / 1000000).toFixed(1)}M` : `${(inf.followers / 1000).toFixed(0)}K`}
                    </span>
                  </div>
                  <div className="text-sm text-terminal-muted mb-3">
                    {inf.engagement >= 1000000 ? `${(inf.engagement / 1000000).toFixed(1)}M` : `${Math.round(inf.engagement / 1000)}K`} engagements • {inf.focus.slice(0, 2).join(', ')}
                  </div>
                  <Badge variant={inf.sentiment === 'bullish' ? 'hot' : inf.sentiment === 'bearish' ? 'cold' : 'neutral'}>
                    {inf.sentiment === 'bullish' ? `Bullish ${inf.focus[0] || ''}` : inf.sentiment === 'bearish' ? `Bearish ${inf.focus[0] || ''}` : 'Mixed'}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Risks & Observations */}
        {risks.length > 0 && (
          <section className="bg-graphite-900 border border-terminal-red/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-terminal-red flex items-center gap-2">
              <span className="text-2xl">⚠</span> Risk Indicators
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {risks.filter(r => r.level !== 'low').slice(0, Math.ceil(risks.filter(r => r.level !== 'low').length / 2)).map((risk, i) => {
                  const { title, description } = parseRiskLabel(risk.label)
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        risk.level === 'high' ? 'bg-terminal-red/20' : 'bg-yellow-500/20'
                      }`}>
                        <span className={`text-sm ${risk.level === 'high' ? 'text-terminal-red' : 'text-yellow-500'}`}>{i + 1}</span>
                      </div>
                      <div>
                        <RiskIndicator level={risk.level} label={title || risk.level.toUpperCase()} />
                        <p className="text-sm text-terminal-muted mt-1">{description || risk.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-4">
                {risks.filter(r => r.level !== 'low').slice(Math.ceil(risks.filter(r => r.level !== 'low').length / 2)).map((risk, i) => {
                  const { title, description } = parseRiskLabel(risk.label)
                  const idx = Math.ceil(risks.filter(r => r.level !== 'low').length / 2) + i
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        risk.level === 'high' ? 'bg-terminal-red/20' : 'bg-yellow-500/20'
                      }`}>
                        <span className={`text-sm ${risk.level === 'high' ? 'text-terminal-red' : 'text-yellow-500'}`}>{idx + 1}</span>
                      </div>
                      <div>
                        <RiskIndicator level={risk.level} label={title || risk.level.toUpperCase()} />
                        <p className="text-sm text-terminal-muted mt-1">{description || risk.label}</p>
                      </div>
                    </div>
                  )
                })}

                {/* Bullish Anchors */}
                {risks.filter(r => r.level === 'low').length > 0 && (
                  <div className="flex items-start gap-3 bg-terminal-green/10 rounded-lg p-3 -mx-3">
                    <div className="w-8 h-8 rounded-full bg-terminal-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-terminal-green text-sm">+</span>
                    </div>
                    <div>
                      <span className="text-terminal-green font-semibold text-sm">Bullish Anchors</span>
                      <p className="text-sm text-terminal-muted mt-1">
                        {risks.filter(r => r.level === 'low').map(r => r.label).join(' • ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Quick Stats Footer */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 py-6 border-t border-graphite-800">
          <div className="text-center p-3 bg-graphite-900/50 rounded-lg">
            <div className={`text-2xl font-bold font-mono ${(metrics.market_sentiment ?? 0) >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {metrics.market_sentiment ?? 'N/A'}%
            </div>
            <div className="text-xs text-terminal-muted mt-1">Market Sentiment</div>
          </div>
          <div className="text-center p-3 bg-graphite-900/50 rounded-lg">
            <div className={`text-2xl font-bold font-mono ${(metrics.unique_creators_change ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {metrics.unique_creators_change !== null ? `${metrics.unique_creators_change >= 0 ? '+' : ''}${metrics.unique_creators_change}%` : 'N/A'}
            </div>
            <div className="text-xs text-terminal-muted mt-1">Creator Activity</div>
          </div>
          <div className="text-center p-3 bg-graphite-900/50 rounded-lg">
            <div className="text-2xl font-bold font-mono text-amber-400">{metrics.defi_engagements ?? 'N/A'}M</div>
            <div className="text-xs text-terminal-muted mt-1">DeFi Engagements</div>
          </div>
          <div className="text-center p-3 bg-graphite-900/50 rounded-lg">
            <div className={`text-2xl font-bold font-mono ${(metrics.defi_engagements_change ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {metrics.defi_engagements_change !== null ? `${metrics.defi_engagements_change >= 0 ? '+' : ''}${metrics.defi_engagements_change}%` : 'N/A'}
            </div>
            <div className="text-xs text-terminal-muted mt-1">Weekly Change</div>
          </div>
          <div className="text-center p-3 bg-graphite-900/50 rounded-lg">
            <div className="text-2xl font-bold font-mono text-purple-400">{gainers.length}/{losers.length}</div>
            <div className="text-xs text-terminal-muted mt-1">Gainers/Losers</div>
          </div>
        </section>

      </article>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-8 pt-8 border-t border-graphite-800 text-xs text-terminal-muted">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <p>Report generated: {new Date(report.generated_at).toLocaleString()} UTC</p>
            <p className="mt-1">Data sources: LunarCrush, CoinGecko, On-chain analytics</p>
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
