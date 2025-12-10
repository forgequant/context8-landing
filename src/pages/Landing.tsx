import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { useTypewriter } from '@/hooks/useTypewriter'

export function Landing() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const usageRef = useRef(null)
  const plansRef = useRef(null)
  const faqRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: true, margin: '-100px' })
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: '-100px' })
  const isUsageInView = useInView(usageRef, { once: true, margin: '-100px' })
  const isPlansInView = useInView(plansRef, { once: true, margin: '-100px' })
  const isFaqInView = useInView(faqRef, { once: true, margin: '-100px' })

  const { displayText: heroText, isComplete: heroComplete } = useTypewriter({
    text: 'Crypto intelligence for your AI assistant',
    speed: 40,
    delay: 300
  })

  const handleAuth = () => {
    navigate('/auth')
  }

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Social Sentiment',
      description: 'Galaxy Score, AltRank, social volume, influencer activity, trending coins, news sentiment.'
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 16l4-4 4 4 5-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Derivatives Data',
      description: 'Funding rates, open interest, liquidations, long/short ratios across all major exchanges.'
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
      title: 'On-Chain & Whales',
      description: 'Exchange reserves, netflow, whale positions and alerts. Track smart money movements.'
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Technical Analysis',
      description: 'RSI, MACD, Bollinger Bands, EMA crossovers, Fear & Greed index — all calculated for you.'
    }
  ]

  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-6 py-8 md:py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="terminal-scanlines" />
      <div className="terminal-grid" />

      {/* Header */}
      <header className="max-w-6xl mx-auto mb-16 md:mb-24 flex justify-between items-center relative z-10">
        <h1 className="text-lg md:text-xl">
          <span className="text-terminal-cyan font-semibold">context8</span>
          <span className="text-terminal-muted">&gt;_</span>
        </h1>
        <nav className="flex items-center gap-6">
          <a href="#features" className="hidden md:block text-sm text-terminal-muted hover:text-terminal-text transition-colors">
            Features
          </a>
          <a href="#pricing" className="hidden md:block text-sm text-terminal-muted hover:text-terminal-text transition-colors">
            Pricing
          </a>
          <button
            onClick={handleAuth}
            className="text-sm text-terminal-cyan hover:text-terminal-text transition-colors"
          >
            Sign in →
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto relative z-10">
        {/* Hero section */}
        <motion.section
          ref={heroRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isHeroInView ? 1 : 0, y: isHeroInView ? 0 : 30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-24 md:mb-32 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-graphite-900 border border-graphite-800 text-xs text-terminal-muted mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
            Context8 MCP Server — 26 Tools for Crypto Intelligence
          </motion.div>

          {/* Main headline */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold mb-6 text-terminal-text leading-tight">
            {heroText}
            {!heroComplete && <span className="animate-cursor text-terminal-cyan">_</span>}
          </h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: heroComplete ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg md:text-xl text-terminal-muted mb-10 max-w-2xl mx-auto"
          >
            Social sentiment, derivatives, on-chain data, technical analysis, market alerts.
            26 tools for Claude, Cursor, and any MCP client.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: heroComplete ? 1 : 0, y: heroComplete ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <button
              onClick={handleAuth}
              className="w-full sm:w-auto bg-terminal-cyan text-graphite-950 px-8 py-3 rounded-lg text-base font-semibold hover:bg-terminal-cyan/90 hover:shadow-terminal-cyan transition-all"
            >
              Get Started Free
            </button>
            <a
              href="#usage"
              className="w-full sm:w-auto px-8 py-3 rounded-lg text-base font-medium text-terminal-muted border border-graphite-800 hover:border-terminal-cyan hover:text-terminal-text transition-all text-center"
            >
              See how it works
            </a>
          </motion.div>

          {/* Social proof hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: heroComplete ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm text-terminal-muted"
          >
            Free tier available • No credit card required
          </motion.p>

          {/* Maintenance notice - moved lower, less prominent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: heroComplete ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 p-4 rounded-lg bg-graphite-900/50 border border-terminal-red/20 max-w-xl mx-auto"
          >
            <p className="text-sm text-terminal-muted">
              <span className="text-terminal-red">●</span> Maintenance until Dec 20 —
              <a href="/reports/daily" className="text-terminal-cyan hover:underline ml-1">daily reports</a> continue.
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfmaKzi3O-1V6ZAC4zasdQzPA9POclHrXvFM8cQd3gCffSb3g/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-cyan hover:underline ml-1"
              >
                Share feedback →
              </a>
            </p>
          </motion.div>
        </motion.section>

        {/* Features section */}
        <motion.section
          id="features"
          ref={featuresRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isFeaturesInView ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="mb-24 md:mb-32"
        >
          <h3 className="text-sm text-terminal-cyan mb-8 text-center">WHY CONTEXT8</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isFeaturesInView ? 1 : 0, y: isFeaturesInView ? 0 : 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl bg-graphite-900 border border-graphite-800 hover:border-terminal-cyan/30 transition-all group"
              >
                <span className="w-10 h-10 rounded-lg bg-graphite-800 flex items-center justify-center text-terminal-cyan mb-4">{feature.icon}</span>
                <h4 className="text-lg font-semibold text-terminal-text mb-2 group-hover:text-terminal-cyan transition-colors">
                  {feature.title}
                </h4>
                <p className="text-sm text-terminal-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Usage section */}
        <motion.section
          id="usage"
          ref={usageRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isUsageInView ? 1 : 0, y: isUsageInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="mb-24 md:mb-32"
        >
          <h3 className="text-sm text-terminal-cyan mb-8 text-center">HOW IT WORKS</h3>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { step: '01', title: 'Clone', desc: 'Get the repo from GitHub' },
              { step: '02', title: 'Configure', desc: 'Add your Context8 API key' },
              { step: '03', title: 'Query', desc: 'Ask about sentiment, funding, whales, technicals' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isUsageInView ? 1 : 0, y: isUsageInView ? 0 : 20 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center"
              >
                <span className="text-4xl font-bold text-terminal-cyan/20 block mb-2">{item.step}</span>
                <h4 className="text-lg font-semibold text-terminal-text mb-1">{item.title}</h4>
                <p className="text-sm text-terminal-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Code example */}
          <div className="bg-graphite-900 rounded-xl border border-graphite-800 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-graphite-800 bg-graphite-900/50">
              <span className="w-3 h-3 rounded-full bg-terminal-red/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-terminal-green/60" />
              <span className="text-xs text-terminal-muted ml-2">claude_desktop_config.json</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm">
                <code>
                  <span className="text-terminal-muted">{`{`}</span>{'\n'}
                  <span className="text-terminal-muted">  </span><span className="text-terminal-cyan">"mcpServers"</span><span className="text-terminal-muted">: {`{`}</span>{'\n'}
                  <span className="text-terminal-muted">    </span><span className="text-terminal-cyan">"context8"</span><span className="text-terminal-muted">: {`{`}</span>{'\n'}
                  <span className="text-terminal-muted">      </span><span className="text-terminal-cyan">"command"</span><span className="text-terminal-muted">: </span><span className="text-terminal-green">"context8-mcp"</span><span className="text-terminal-muted">,</span>{'\n'}
                  <span className="text-terminal-muted">      </span><span className="text-terminal-cyan">"env"</span><span className="text-terminal-muted">: {`{`}</span>{'\n'}
                  <span className="text-terminal-muted">        </span><span className="text-terminal-cyan">"CONTEXT8_API_KEY"</span><span className="text-terminal-muted">: </span><span className="text-terminal-green">"your-api-key"</span>{'\n'}
                  <span className="text-terminal-muted">      {`}`}</span>{'\n'}
                  <span className="text-terminal-muted">    {`}`}</span>{'\n'}
                  <span className="text-terminal-muted">  {`}`}</span>{'\n'}
                  <span className="text-terminal-muted">{`}`}</span>
                </code>
              </pre>
            </div>
          </div>
        </motion.section>

        {/* Pricing section */}
        <motion.section
          id="pricing"
          ref={plansRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isPlansInView ? 1 : 0, y: isPlansInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="mb-24 md:mb-32"
        >
          <h3 className="text-sm text-terminal-cyan mb-4 text-center">PRICING</h3>
          <p className="text-center text-terminal-muted mb-12 max-w-lg mx-auto">
            Start free, upgrade when you need more.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isPlansInView ? 1 : 0, y: isPlansInView ? 0 : 20 }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-xl bg-graphite-900 border border-graphite-800"
            >
              <h4 className="text-lg font-semibold text-terminal-text mb-2">Free</h4>
              <p className="text-3xl font-bold text-terminal-text mb-4">
                $0<span className="text-sm font-normal text-terminal-muted">/month</span>
              </p>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start gap-2 text-terminal-muted">
                  <span className="text-terminal-green mt-0.5">✓</span>
                  2 requests/day or 5/week
                </li>
                <li className="flex items-start gap-2 text-terminal-muted">
                  <span className="text-terminal-green mt-0.5">✓</span>
                  All 26 MCP tools
                </li>
                <li className="flex items-start gap-2 text-terminal-muted">
                  <span className="text-terminal-green mt-0.5">✓</span>
                  All data sources included
                </li>
                <li className="flex items-start gap-2 text-terminal-muted">
                  <span className="text-terminal-green mt-0.5">✓</span>
                  Community support
                </li>
              </ul>
              <a
                href="/auth"
                className="block w-full py-2.5 rounded-lg text-sm font-medium border border-graphite-800 text-terminal-muted hover:border-terminal-cyan hover:text-terminal-text transition-all text-center"
              >
                Get Started
              </a>
            </motion.div>

            {/* Pro tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isPlansInView ? 1 : 0, y: isPlansInView ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-xl bg-graphite-900 border-2 border-terminal-cyan relative"
            >
              <span className="absolute -top-3 left-4 px-2 py-0.5 text-xs font-medium bg-terminal-cyan text-graphite-950 rounded">
                RECOMMENDED
              </span>
              <h4 className="text-lg font-semibold text-terminal-text mb-2">Pro</h4>
              <p className="text-3xl font-bold text-terminal-text mb-4">
                $8<span className="text-sm font-normal text-terminal-muted">/month</span>
              </p>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start gap-2 text-terminal-muted">
                  <span className="text-terminal-cyan mt-0.5">↑</span>
                  All Free features, plus:
                </li>
                <li className="flex items-start gap-2 text-terminal-text">
                  <span className="text-terminal-cyan mt-0.5">✓</span>
                  10 requests/day or 30/week
                </li>
                <li className="flex items-start gap-2 text-terminal-text">
                  <span className="text-terminal-cyan mt-0.5">✓</span>
                  Priority API access
                </li>
                <li className="flex items-start gap-2 text-terminal-text">
                  <span className="text-terminal-cyan mt-0.5">✓</span>
                  Email support
                </li>
              </ul>
              <a
                href="/auth"
                className="block w-full py-2.5 rounded-lg text-sm font-semibold bg-terminal-cyan text-graphite-950 hover:bg-terminal-cyan/90 transition-all text-center"
              >
                Upgrade to Pro
              </a>
            </motion.div>
          </div>
        </motion.section>

        {/* Tools section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-24 md:mb-32"
        >
          <h3 className="text-sm text-terminal-cyan mb-4 text-center">26 MCP TOOLS</h3>
          <p className="text-center text-terminal-muted mb-8 max-w-lg mx-auto">
            All tools accessible via natural language queries.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-xs">
            {[
              'get_coin',
              'get_galaxy_score',
              'get_altrank',
              'get_social_volume',
              'get_influencer_activity',
              'list_trending_coins',
              'get_news',
              'get_sentiment',
              'get_funding_rates',
              'get_open_interest',
              'get_liquidations',
              'list_top_liquidations',
              'get_long_short_ratio',
              'get_exchange_reserves',
              'get_exchange_netflow',
              'get_whale_positions',
              'get_whale_alerts',
              'get_rsi',
              'get_macd',
              'get_bollinger_bands',
              'get_ema_crossover',
              'get_technical_summary',
              'get_fear_greed_index',
              'get_fear_greed_history',
              'get_market_alerts',
              'get_usage'
            ].map((tool) => (
              <div key={tool} className="px-3 py-2 rounded-lg bg-graphite-900 border border-graphite-800 text-terminal-muted font-mono truncate">
                {tool}
              </div>
            ))}
          </div>
        </motion.section>

        {/* FAQ section */}
        <motion.section
          ref={faqRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isFaqInView ? 1 : 0, y: isFaqInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="mb-24 md:mb-32"
        >
          <h3 className="text-sm text-terminal-cyan mb-4 text-center">FAQ</h3>
          <p className="text-center text-terminal-muted mb-12 max-w-lg mx-auto">
            Common questions answered
          </p>

          <div className="max-w-2xl mx-auto space-y-4">
            {[
              {
                q: 'What is Context8?',
                a: 'Context8 is an MCP server that gives your AI assistant access to 26 tools for crypto market analysis — social sentiment, derivatives, on-chain data, technical indicators, and market alerts.'
              },
              {
                q: 'Which AI clients are supported?',
                a: 'Any MCP-compatible client — Claude Desktop, Cursor, Cline, and custom implementations. The server runs locally via stdio transport.'
              },
              {
                q: 'What data can I access?',
                a: 'Social metrics (Galaxy Score, trending coins, influencers), derivatives (funding, OI, liquidations), on-chain (whale positions, exchange flows), and technical analysis (RSI, MACD, Bollinger Bands).'
              },
              {
                q: 'How does pricing work?',
                a: 'Free tier includes 2 requests/day. Pro ($8/mo) gives you 10 requests/day. All tools and data sources are available on both tiers.'
              },
              {
                q: 'Is it open source?',
                a: 'Yes. The Context8 MCP server is MIT licensed. Check the GitHub repo for source code and contributions.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isFaqInView ? 1 : 0, y: isFaqInView ? 0 : 10 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-5 rounded-xl bg-graphite-900 border border-graphite-800"
              >
                <h4 className="text-base font-medium text-terminal-text mb-2">{item.q}</h4>
                <p className="text-sm text-terminal-muted leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16 text-center"
        >
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-b from-graphite-900 to-graphite-950 border border-graphite-800">
            <h3 className="text-2xl md:text-3xl font-semibold text-terminal-text mb-4">
              Give your AI crypto superpowers
            </h3>
            <p className="text-terminal-muted mb-8 max-w-lg mx-auto">
              Clone the repo, add your API key, start querying.
            </p>
            <a
              href="https://github.com/forgequant/context8-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-terminal-cyan text-graphite-950 px-8 py-3 rounded-lg text-base font-semibold hover:bg-terminal-cyan/90 hover:shadow-terminal-cyan transition-all"
            >
              View on GitHub
            </a>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto py-8 border-t border-graphite-800 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-lg">
              <span className="text-terminal-cyan font-semibold">context8</span>
              <span className="text-terminal-muted">&gt;_</span>
            </span>
            <span className="text-xs text-terminal-muted">Crypto Intelligence MCP Server</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-terminal-muted">
            <a href="#" className="hover:text-terminal-text transition-colors">Privacy</a>
            <a href="#" className="hover:text-terminal-text transition-colors">Terms</a>
            <a href="#" className="hover:text-terminal-text transition-colors">Status</a>
            <a href="https://github.com/forgequant/context8-mcp" target="_blank" rel="noopener noreferrer" className="hover:text-terminal-text transition-colors">GitHub</a>
          </nav>
        </div>
        <p className="text-center md:text-left text-xs text-terminal-muted mt-6">
          © 2025 Context8. Not financial advice.
        </p>
      </footer>
    </div>
  )
}
