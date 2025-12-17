import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'

// Progress bar component for sentiment visualization
function SentimentBar({ value, label }: { value: number; label: string }) {
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
          className="h-full bg-gradient-to-r from-terminal-green to-terminal-cyan rounded-full"
        />
      </div>
    </div>
  )
}

// Metric card component
function MetricCard({ label, value, change, isPositive, delay = 0 }: {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  delay?: number;
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

// Section header component
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

export function DailyReport() {
  const headerRef = useRef(null)
  const metricsRef = useRef(null)
  const summaryRef = useRef(null)
  const narrativesRef = useRef(null)
  const moversRef = useRef(null)
  const socialRef = useRef(null)
  const risksRef = useRef(null)

  const isHeaderInView = useInView(headerRef, { once: true })
  const isSummaryInView = useInView(summaryRef, { once: true })
  const isNarrativesInView = useInView(narrativesRef, { once: true })
  const isMoversInView = useInView(moversRef, { once: true })
  const isSocialInView = useInView(socialRef, { once: true })
  const isRisksInView = useInView(risksRef, { once: true })

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
              Nov 28, 2025
            </span>
            <span className="px-3 py-1.5 bg-terminal-green/10 border border-terminal-green/30 rounded-lg text-terminal-green text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
              LIVE
            </span>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <article className="max-w-6xl mx-auto space-y-10 relative z-10">

        {/* Key Metrics Grid */}
        <section ref={metricsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Unique Creators"
            value="249,766"
            change="7.1% vs 24h"
            isPositive={false}
            delay={0}
          />
          <MetricCard
            label="Market Sentiment"
            value="82%"
            change="1-2% vs avg"
            isPositive={true}
            delay={0.1}
          />
          <MetricCard
            label="DeFi Engagements"
            value="53M"
            change="19% vs weekly"
            isPositive={false}
            delay={0.2}
          />
          <MetricCard
            label="AI Creators"
            value="—"
            change="9.7% vs 24h"
            isPositive={false}
            delay={0.3}
          />
        </section>

        {/* Executive Summary */}
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
        </motion.section>

        {/* Sentiment Visualization */}
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
            <SentimentBar value={82} label="Overall Market" />
            <SentimentBar value={84} label="DeFi Sector" />
            <SentimentBar value={83} label="AI Sector" />
          </div>
        </motion.section>

        {/* Narratives & Sectors */}
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
            {/* Privacy Coins Card */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.02 }}
              className="bg-graphite-900 border border-terminal-green/30 rounded-xl p-4 hover:border-terminal-green/50 transition-all"
            >
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
            </motion.div>

            {/* Solana Ecosystem Card */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.02 }}
              className="bg-graphite-900 border border-yellow-500/30 rounded-xl p-4 hover:border-yellow-500/50 transition-all"
            >
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
            </motion.div>

            {/* DeFi Card */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.02 }}
              className="bg-graphite-900 border border-graphite-700 rounded-xl p-4 hover:border-terminal-cyan/30 transition-all"
            >
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
            </motion.div>

            {/* AI Card */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.02 }}
              className="bg-graphite-900 border border-graphite-700 rounded-xl p-4 hover:border-terminal-cyan/30 transition-all"
            >
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
            </motion.div>

            {/* Bitcoin Ecosystem Card */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.02 }}
              className="bg-graphite-900 border border-orange-500/30 rounded-xl p-4 hover:border-orange-500/50 transition-all"
            >
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
            </motion.div>

            {/* Declining Card */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="bg-graphite-900 border border-terminal-red/30 rounded-xl p-4"
            >
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
            </motion.div>
          </motion.div>
        </section>

        {/* Top Movers */}
        <section ref={moversRef}>
          <SectionHeader number="03" title="Top Movers" />

          {/* Positive Movers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMoversInView ? 1 : 0, y: isMoversInView ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h3 className="text-sm font-semibold text-terminal-green mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-terminal-green/20 flex items-center justify-center text-xs">↑</span>
              Positive Movers
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
                  <AssetRow symbol="ZEC" change24h="N/A (surge)" change7d="-30% post-rally" social="High" sentiment="Bullish" comment="Grayscale ETF filing drove 1000% rally" isPositive={true} />
                  <AssetRow symbol="AIOZ" change24h="+4.95%" change7d="+16.3%" social="+45% mentions" sentiment="84%" comment="DePIN/AI integration; AltRank #132" isPositive={true} />
                  <AssetRow symbol="SOL" change24h="→ $140" change7d="N/A" social="High" sentiment="Mixed" comment="ETF/tokenized assets despite hack" isPositive={true} />
                  <AssetRow symbol="ISP" change24h="+14.3%" change7d="+30.8%" social="+138% engmt" sentiment="78%" comment="Whale buys; Galaxy 79.5" isPositive={true} />
                  <AssetRow symbol="VR" change24h="+0.7%" change7d="+6.9%" social="-58% engmt" sentiment="98%" comment="Metaverse AI tools; Galaxy 78.6" isPositive={true} />
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Negative Movers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMoversInView ? 1 : 0, y: isMoversInView ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-terminal-red mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-terminal-red/20 flex items-center justify-center text-xs">↓</span>
              Negative Movers
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
                  <AssetRow symbol="DDD" change24h="0%" change7d="-55.6%" social="Low" sentiment="N/A" comment="Sharp drop despite Galaxy 100" isPositive={false} />
                  <AssetRow symbol="EMC" change24h="-12.3%" change7d="-5.7%" social="+72% engmt" sentiment="67%" comment="Scam fears outweigh AI promo" isPositive={false} />
                  <AssetRow symbol="NAO" change24h="+0.1%" change7d="+0.9%" social="+300-467%" sentiment="N/A" comment="Low volume despite Galaxy 100" isPositive={false} />
                  <AssetRow symbol="USHI" change24h="-1.4%" change7d="-0.1%" social="+217% mentions" sentiment="67%" comment="Thin liquidity" isPositive={false} />
                  <AssetRow symbol="MON" change24h="Dump" change7d="N/A" social="Controversial" sentiment="Mixed" comment="Post-launch selloff; Hayes: 'send to zero'" isPositive={false} />
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* Social & Influencer Highlights */}
        <section ref={socialRef}>
          <SectionHeader number="04" title="Social & Influencer Highlights" />

          <motion.div
            initial="hidden"
            animate={isSocialInView ? "visible" : "hidden"}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid md:grid-cols-2 gap-4"
          >
            {/* Top Influencers */}
            <div className="space-y-3">
              {[
                { handle: '@MEXC_Official', followers: '1.7M followers', posts: '115 posts • 8.7M engagements', badge: 'Bullish DeFi', variant: 'hot' as const },
                { handle: '@WatcherGuru', followers: '2M+ engagements', posts: 'ETF inflows, ZEC ETF, Solana hacks', badge: 'Mixed', variant: 'neutral' as const },
                { handle: '@CryptoHayes', followers: '816K engagements', posts: 'Bearish on MON: "send to zero"', badge: 'Bearish MON', variant: 'cold' as const, isBearish: true }
              ].map((influencer, i) => (
                <motion.div
                  key={influencer.handle}
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-graphite-900 border border-graphite-800 rounded-xl p-4 hover:border-terminal-cyan/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold ${influencer.isBearish ? 'text-terminal-red' : 'text-terminal-cyan'}`}>{influencer.handle}</span>
                    <span className="text-xs text-terminal-muted">{influencer.followers}</span>
                  </div>
                  <div className="text-sm text-terminal-muted mb-2">{influencer.posts}</div>
                  <Badge variant={influencer.variant}>{influencer.badge}</Badge>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              {[
                { handle: '@lookonchain', followers: '1M+ engagements', posts: 'Whale $ENA buys, XRP reserves low', badge: 'Analytics', variant: 'neutral' as const },
                { handle: '@solana', followers: '195K engagements', posts: '"Amazon for finance" — defensive', badge: 'Defensive', variant: 'default' as const },
                { handle: 'DeFi Posts', followers: 'Chainlink focus', posts: 'Solana growth, ZEC privacy insurance', badge: '84% bullish', variant: 'hot' as const }
              ].map((influencer, i) => (
                <motion.div
                  key={influencer.handle}
                  variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-graphite-900 border border-graphite-800 rounded-xl p-4 hover:border-terminal-cyan/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold ${influencer.handle === 'DeFi Posts' ? 'text-terminal-green' : 'text-terminal-cyan'}`}>{influencer.handle}</span>
                    <span className="text-xs text-terminal-muted">{influencer.followers}</span>
                  </div>
                  <div className="text-sm text-terminal-muted mb-2">{influencer.posts}</div>
                  <Badge variant={influencer.variant}>{influencer.badge}</Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Risks & Observations */}
        <motion.section
          ref={risksRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isRisksInView ? 1 : 0, y: isRisksInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="bg-graphite-900 border border-terminal-red/30 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-terminal-red flex items-center gap-2">
            <span className="text-2xl">⚠</span> Risks & Observations for Next Day
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-terminal-red/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-terminal-red text-sm font-bold">1</span>
                </div>
                <div>
                  <RiskIndicator level="high" label="Privacy Surge (ZEC)" />
                  <p className="text-sm text-terminal-muted mt-1">1000% rally + ETF hype risks pullback amid thin liquidity</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-terminal-red/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-terminal-red text-sm font-bold">2</span>
                </div>
                <div>
                  <RiskIndicator level="high" label="Solana Ecosystem Pressure" />
                  <p className="text-sm text-terminal-muted mt-1">$36M Upbit hack + ETF outflows; monitor on-chain volume</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-500 text-sm font-bold">3</span>
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
                  <span className="text-yellow-500 text-sm font-bold">4</span>
                </div>
                <div>
                  <RiskIndicator level="medium" label="Tether S&P Downgrade" />
                  <p className="text-sm text-terminal-muted mt-1">BTC/gold exposure concerns could spill to stables/DeFi</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-terminal-muted/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-terminal-muted text-sm font-bold">5</span>
                </div>
                <div>
                  <RiskIndicator level="low" label="Low Conviction Environment" />
                  <p className="text-sm text-terminal-muted mt-1">Downward social trends suggest low conviction; watch BTC ETF flows</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-terminal-green/10 rounded-lg p-3 -mx-3">
                <div className="w-8 h-8 rounded-full bg-terminal-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-terminal-green text-sm font-bold">+</span>
                </div>
                <div>
                  <span className="text-terminal-green font-semibold text-sm">Bullish Anchors</span>
                  <p className="text-sm text-terminal-muted mt-1">Texas BTC reserve, Chainlink accumulation provide macro support</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Stats Footer */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 py-6 border-t border-graphite-800"
        >
          {[
            { value: '82%', label: 'Market Sentiment', color: 'text-terminal-cyan' },
            { value: '-7.1%', label: 'Creator Activity', color: 'text-terminal-red' },
            { value: '+9.4%', label: 'DeFi Mentions', color: 'text-terminal-green' },
            { value: '-19%', label: 'DeFi Engagements', color: 'text-terminal-red' },
            { value: '$36M', label: 'Upbit Hack', color: 'text-orange-400' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-terminal-muted">{stat.label}</div>
            </motion.div>
          ))}
        </motion.section>

      </article>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-8 pt-8 border-t border-graphite-800 text-xs text-terminal-muted relative z-10">
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
