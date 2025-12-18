import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useDailyReport } from '../hooks/useDailyReport'
import {
  DailyReportWithMeta,
  ExecutiveSummaryItem,
  Narrative,
  TopMover,
  Risk,
  formatLargeNumber,
  formatPercentChange,
} from '../types/dailyReport'

// ============================================================================
// SKELETON COMPONENTS
// ============================================================================

function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-graphite-800 animate-pulse rounded ${className}`} />
  )
}

function MetricCardSkeleton() {
  return (
    <div className="bg-graphite-900 border border-graphite-800 rounded-xl p-4">
      <SkeletonBox className="h-3 w-20 mb-2" />
      <SkeletonBox className="h-8 w-24 mb-1" />
      <SkeletonBox className="h-3 w-16" />
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="bg-graphite-900 border border-graphite-800 rounded-xl p-6 space-y-4">
      <SkeletonBox className="h-6 w-48" />
      <div className="space-y-3">
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-4 w-5/6" />
      </div>
    </div>
  )
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

function SentimentBar({ value, label }: { value: number; label: string }) {
  const color = value >= 70 ? 'from-terminal-green to-terminal-cyan' :
                value >= 50 ? 'from-yellow-500 to-terminal-cyan' :
                'from-terminal-red to-yellow-500'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-terminal-muted">{label}</span>
        <span className="text-terminal-green font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-graphite-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
        />
      </div>
    </div>
  )
}

function MetricCard({ label, value, change, isPositive, delay = 0 }: {
  label: string
  value: string
  change?: string
  isPositive?: boolean
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, borderColor: 'rgba(125, 211, 252, 0.3)' }}
      className="bg-graphite-900 border border-graphite-800 rounded-xl p-4 transition-all"
    >
      <div className="text-xs text-terminal-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-bold text-terminal-text font-mono">{value}</div>
      {change && (
        <div className={`text-xs mt-1 ${isPositive ? 'text-terminal-green' : 'text-terminal-red'}`}>
          {isPositive ? '↑' : '↓'} {change}
        </div>
      )}
    </motion.div>
  )
}

function Badge({ children, variant = 'default' }: {
  children: React.ReactNode
  variant?: 'default' | 'hot' | 'cold' | 'neutral' | 'warm'
}) {
  const variants = {
    default: 'bg-terminal-cyan/20 text-terminal-cyan border-terminal-cyan/30',
    hot: 'bg-terminal-green/20 text-terminal-green border-terminal-green/30',
    warm: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    cold: 'bg-terminal-red/20 text-terminal-red border-terminal-red/30',
    neutral: 'bg-graphite-800 text-terminal-muted border-graphite-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono rounded border ${variants[variant]}`}>
      {children}
    </span>
  )
}

function AssetRow({ mover }: { mover: TopMover }) {
  const isPositive = mover.change_24h >= 0
  return (
    <tr className="border-b border-graphite-800 hover:bg-graphite-800/50 transition-colors">
      <td className="py-3 px-2">
        <span className={`font-bold font-mono ${isPositive ? 'text-terminal-green' : 'text-terminal-red'}`}>
          {mover.symbol}
        </span>
      </td>
      <td className={`py-3 px-2 font-mono text-sm ${isPositive ? 'text-terminal-green' : 'text-terminal-red'}`}>
        {formatPercentChange(mover.change_24h)}
      </td>
      <td className={`py-3 px-2 font-mono text-sm ${(mover.change_7d ?? 0) >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
        {mover.change_7d !== null ? formatPercentChange(mover.change_7d) : 'N/A'}
      </td>
      <td className="py-3 px-2 text-sm text-terminal-cyan">{mover.social}</td>
      <td className="py-3 px-2 text-sm">
        <span className={mover.sentiment >= 60 ? 'text-terminal-green' : mover.sentiment >= 40 ? 'text-yellow-500' : 'text-terminal-red'}>
          {mover.sentiment}%
        </span>
      </td>
      <td className="py-3 px-2 text-xs text-terminal-muted max-w-[200px]">{mover.comment}</td>
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

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2 flex items-center gap-2"
    >
      <span className="text-terminal-cyan font-mono">{number}</span> {title}
    </motion.h2>
  )
}

function getDirectionSymbol(direction: ExecutiveSummaryItem['direction']) {
  switch (direction) {
    case 'up': return { symbol: '▲', color: 'text-terminal-green' }
    case 'down': return { symbol: '▼', color: 'text-terminal-red' }
    default: return { symbol: '◆', color: 'text-yellow-500' }
  }
}

function getNarrativeVariant(status: Narrative['status']): 'hot' | 'warm' | 'cold' {
  return status
}

function getNarrativeBorderColor(status: Narrative['status']) {
  switch (status) {
    case 'hot': return 'border-terminal-green/30 hover:border-terminal-green/50'
    case 'warm': return 'border-yellow-500/30 hover:border-yellow-500/50'
    default: return 'border-graphite-700 hover:border-terminal-cyan/30'
  }
}

function getNarrativeTitleColor(status: Narrative['status']) {
  switch (status) {
    case 'hot': return 'text-terminal-green'
    case 'warm': return 'text-yellow-400'
    default: return 'text-terminal-cyan'
  }
}

// ============================================================================
// ERROR/EMPTY STATES
// ============================================================================

function NoReportState() {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-4 md:px-6 py-8 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-graphite-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-terminal-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-terminal-text mb-2">No Report Available</h2>
        <p className="text-terminal-muted mb-6">
          The daily market report hasn't been published yet. Check back later for the latest insights.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-terminal-cyan/20 text-terminal-cyan rounded-lg hover:bg-terminal-cyan/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  )
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-4 md:px-6 py-8 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-terminal-red/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-terminal-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-terminal-text mb-2">Failed to Load Report</h2>
        <p className="text-terminal-muted mb-6">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-terminal-cyan/20 text-terminal-cyan rounded-lg hover:bg-terminal-cyan/30 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-4 md:px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4">
          <SkeletonBox className="h-4 w-32" />
          <SkeletonBox className="h-8 w-64" />
          <SkeletonBox className="h-4 w-48" />
        </div>

        {/* Metrics skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>

        {/* Sections skeleton */}
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function DailyReport() {
  const { report, loading, error, exists } = useDailyReport()

  const headerRef = useRef(null)
  const summaryRef = useRef(null)
  const narrativesRef = useRef(null)
  const moversRef = useRef(null)
  const risksRef = useRef(null)

  const isHeaderInView = useInView(headerRef, { once: true })
  const isSummaryInView = useInView(summaryRef, { once: true })
  const isNarrativesInView = useInView(narrativesRef, { once: true })
  const isMoversInView = useInView(moversRef, { once: true })
  const isRisksInView = useInView(risksRef, { once: true })

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!exists || !report) return <NoReportState />

  const { metrics, executive_summary, narratives, top_movers, risks } = report

  // Separate gainers and losers
  const gainers = top_movers.filter(m => m.change_24h >= 0).sort((a, b) => b.change_24h - a.change_24h)
  const losers = top_movers.filter(m => m.change_24h < 0).sort((a, b) => a.change_24h - b.change_24h)

  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-4 md:px-6 py-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="terminal-scanlines" />
      <div className="terminal-grid" />

      {/* Header */}
      <motion.header
        ref={headerRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isHeaderInView ? 1 : 0, y: isHeaderInView ? 0 : -20 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto mb-8 relative z-10"
      >
        <Link to="/" className="text-sm text-terminal-cyan hover:underline mb-4 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-terminal-cyan">Daily Market Overview</h1>
            <p className="text-terminal-muted text-sm mt-1">Crypto market intelligence • Social signals • Key narratives</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-terminal-cyan/10 border border-terminal-cyan/30 rounded-lg text-terminal-cyan text-sm">
              {report.formattedDate}
            </span>
            {report.isToday && (
              <span className="px-3 py-1.5 bg-terminal-green/10 border border-terminal-green/30 rounded-lg text-terminal-green text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                TODAY
              </span>
            )}
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <article className="max-w-6xl mx-auto space-y-10 relative z-10">

        {/* Key Metrics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Unique Creators"
            value={formatLargeNumber(metrics.unique_creators)}
            change={metrics.unique_creators_change !== null ? `${Math.abs(metrics.unique_creators_change)}% vs 24h` : undefined}
            isPositive={metrics.unique_creators_change !== null ? metrics.unique_creators_change >= 0 : undefined}
            delay={0}
          />
          <MetricCard
            label="Market Sentiment"
            value={metrics.market_sentiment !== null ? `${metrics.market_sentiment}%` : 'N/A'}
            change={metrics.market_sentiment_change !== null ? `${Math.abs(metrics.market_sentiment_change)}% vs avg` : undefined}
            isPositive={metrics.market_sentiment_change !== null ? metrics.market_sentiment_change >= 0 : undefined}
            delay={0.1}
          />
          <MetricCard
            label="DeFi Engagements"
            value={formatLargeNumber(metrics.defi_engagements)}
            change={metrics.defi_engagements_change !== null ? `${Math.abs(metrics.defi_engagements_change)}% vs weekly` : undefined}
            isPositive={metrics.defi_engagements_change !== null ? metrics.defi_engagements_change >= 0 : undefined}
            delay={0.2}
          />
          <MetricCard
            label="AI Creators"
            value={formatLargeNumber(metrics.ai_creators)}
            change={metrics.ai_creators_change !== null ? `${Math.abs(metrics.ai_creators_change)}% vs 24h` : undefined}
            isPositive={metrics.ai_creators_change !== null ? metrics.ai_creators_change >= 0 : undefined}
            delay={0.3}
          />
        </section>

        {/* Executive Summary */}
        {executive_summary.length > 0 && (
          <motion.section
            ref={summaryRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isSummaryInView ? 1 : 0, y: isSummaryInView ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="bg-graphite-900 border border-terminal-cyan/30 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-terminal-cyan flex items-center gap-2">
              <span className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse" />
              Executive Summary
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {executive_summary.slice(0, Math.ceil(executive_summary.length / 2)).map((item, i) => {
                  const { symbol, color } = getDirectionSymbol(item.direction)
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`mt-1 ${color}`}>{symbol}</span>
                      <p className="text-sm text-terminal-muted">{item.text}</p>
                    </div>
                  )
                })}
              </div>
              <div className="space-y-3">
                {executive_summary.slice(Math.ceil(executive_summary.length / 2)).map((item, i) => {
                  const { symbol, color } = getDirectionSymbol(item.direction)
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`mt-1 ${color}`}>{symbol}</span>
                      <p className="text-sm text-terminal-muted">{item.text}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.section>
        )}

        {/* Sentiment Visualization */}
        {metrics.market_sentiment !== null && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-graphite-900 border border-graphite-800 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4 text-terminal-text flex items-center gap-2">
              <span className="text-terminal-cyan font-mono">01</span> Sentiment Overview
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <SentimentBar value={metrics.market_sentiment} label="Overall Market" />
              {/* Show additional sentiment bars if available in narratives */}
              {narratives.find(n => n.title.toLowerCase().includes('defi')) && (
                <SentimentBar
                  value={narratives.find(n => n.title.toLowerCase().includes('defi'))?.status === 'hot' ? 85 : 65}
                  label="DeFi Sector"
                />
              )}
              {narratives.find(n => n.title.toLowerCase().includes('ai')) && (
                <SentimentBar
                  value={narratives.find(n => n.title.toLowerCase().includes('ai'))?.status === 'hot' ? 80 : 60}
                  label="AI Sector"
                />
              )}
            </div>
          </motion.section>
        )}

        {/* Narratives & Sectors */}
        {narratives.length > 0 && (
          <section ref={narrativesRef}>
            <SectionHeader number="02" title="Narratives & Sectors" />

            <motion.div
              initial="hidden"
              animate={isNarrativesInView ? "visible" : "hidden"}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {narratives.map((narrative, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-graphite-900 border rounded-xl p-4 transition-all ${getNarrativeBorderColor(narrative.status)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-semibold ${getNarrativeTitleColor(narrative.status)}`}>
                      {narrative.title}
                    </h3>
                    <Badge variant={getNarrativeVariant(narrative.status)}>
                      {narrative.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-terminal-muted">{narrative.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Top Movers */}
        {top_movers.length > 0 && (
          <section ref={moversRef}>
            <SectionHeader number="03" title="Top Movers" />

            {/* Gainers */}
            {gainers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isMoversInView ? 1 : 0, y: isMoversInView ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <h3 className="text-sm font-semibold text-terminal-green mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-terminal-green/20 flex items-center justify-center text-xs">↑</span>
                  Positive Movers ({gainers.length})
                </h3>
                <div className="bg-graphite-900 border border-graphite-800 rounded-xl overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-graphite-800 text-terminal-muted text-xs uppercase">
                      <tr>
                        <th className="py-3 px-3 text-left">Symbol</th>
                        <th className="py-3 px-3 text-left">24h</th>
                        <th className="py-3 px-3 text-left">7d</th>
                        <th className="py-3 px-3 text-left">Social</th>
                        <th className="py-3 px-3 text-left">Sentiment</th>
                        <th className="py-3 px-3 text-left">Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gainers.slice(0, 5).map((mover, i) => (
                        <AssetRow key={i} mover={mover} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Losers */}
            {losers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isMoversInView ? 1 : 0, y: isMoversInView ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-sm font-semibold text-terminal-red mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-terminal-red/20 flex items-center justify-center text-xs">↓</span>
                  Negative Movers ({losers.length})
                </h3>
                <div className="bg-graphite-900 border border-graphite-800 rounded-xl overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-graphite-800 text-terminal-muted text-xs uppercase">
                      <tr>
                        <th className="py-3 px-3 text-left">Symbol</th>
                        <th className="py-3 px-3 text-left">24h</th>
                        <th className="py-3 px-3 text-left">7d</th>
                        <th className="py-3 px-3 text-left">Social</th>
                        <th className="py-3 px-3 text-left">Sentiment</th>
                        <th className="py-3 px-3 text-left">Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {losers.slice(0, 5).map((mover, i) => (
                        <AssetRow key={i} mover={mover} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </section>
        )}

        {/* Risks & Observations */}
        {risks.length > 0 && (
          <motion.section
            ref={risksRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isRisksInView ? 1 : 0, y: isRisksInView ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="bg-graphite-900 border border-terminal-red/30 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-terminal-red flex items-center gap-2">
              <span className="text-2xl">⚠</span> Risk Indicators
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {risks.map((risk, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    risk.level === 'high' ? 'bg-terminal-red/20' :
                    risk.level === 'medium' ? 'bg-yellow-500/20' :
                    'bg-terminal-green/20'
                  }`}>
                    <span className={`text-sm font-bold ${
                      risk.level === 'high' ? 'text-terminal-red' :
                      risk.level === 'medium' ? 'text-yellow-500' :
                      'text-terminal-green'
                    }`}>{i + 1}</span>
                  </div>
                  <div>
                    <RiskIndicator level={risk.level} label={risk.level.toUpperCase()} />
                    <p className="text-sm text-terminal-muted mt-1">{risk.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Quick Stats Footer */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-graphite-800"
        >
          {metrics.market_sentiment !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-2xl font-bold font-mono text-terminal-cyan">{metrics.market_sentiment}%</div>
              <div className="text-xs text-terminal-muted">Market Sentiment</div>
            </motion.div>
          )}
          {metrics.unique_creators !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-2xl font-bold font-mono text-terminal-green">{formatLargeNumber(metrics.unique_creators)}</div>
              <div className="text-xs text-terminal-muted">Active Creators</div>
            </motion.div>
          )}
          {metrics.defi_engagements !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-2xl font-bold font-mono text-yellow-400">{formatLargeNumber(metrics.defi_engagements)}</div>
              <div className="text-xs text-terminal-muted">DeFi Engagements</div>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="text-2xl font-bold font-mono text-purple-400">{top_movers.length}</div>
            <div className="text-xs text-terminal-muted">Assets Tracked</div>
          </motion.div>
        </motion.section>

      </article>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-8 pt-8 border-t border-graphite-800 text-xs text-terminal-muted relative z-10">
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
          <Link to="/" className="text-terminal-cyan hover:underline inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Context8
          </Link>
        </p>
      </footer>
    </div>
  )
}
