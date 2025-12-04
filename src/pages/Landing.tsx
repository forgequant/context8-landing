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
    text: 'Real-time crypto data for your AI assistant',
    speed: 40,
    delay: 300
  })

  const handleAuth = () => {
    navigate('/auth')
  }

  const features = [
    {
      icon: '⚡',
      title: 'Instant Setup',
      description: 'One URL, one OAuth click. Your AI gets market data in under 60 seconds.'
    },
    {
      icon: '🔌',
      title: 'MCP Protocol',
      description: 'Native Model Context Protocol support. Works with Claude, GPT, and any MCP-compatible client.'
    },
    {
      icon: '📊',
      title: 'Rich Context',
      description: 'Prices, volume, sentiment, on-chain metrics — everything your AI needs for informed analysis.'
    },
    {
      icon: '🔒',
      title: 'Secure by Default',
      description: 'OAuth-only access. Your API key stays safe. No exposed credentials.'
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
            MCP Server for Crypto Intelligence
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
            Connect your AI to live market data via MCP.
            Prices, volume, sentiment — one endpoint, zero config.
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
                <span className="text-2xl mb-4 block">{feature.icon}</span>
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
              { step: '01', title: 'Connect', desc: 'Add the MCP URL to your AI client' },
              { step: '02', title: 'Authenticate', desc: 'One-click OAuth with Google or GitHub' },
              { step: '03', title: 'Query', desc: 'Ask your AI about any crypto market' }
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
              <span className="text-xs text-terminal-muted ml-2">terminal</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm">
                <code>
                  <span className="text-terminal-muted"># Add to your MCP config</span>{'\n'}
                  <span className="text-terminal-cyan">MCP_URL</span><span className="text-terminal-text">=</span><span className="text-terminal-green">"https://api.context8.markets"</span>{'\n\n'}
                  <span className="text-terminal-muted"># Ask your AI</span>{'\n'}
                  <span className="text-terminal-text">"Give me a BTC market briefing"</span>{'\n\n'}
                  <span className="text-terminal-muted"># Response</span>{'\n'}
                  <span className="text-terminal-green">✓</span> <span className="text-terminal-text">BTC $97,234</span> <span className="text-terminal-green">+2.8%</span>{'\n'}
                  <span className="text-terminal-muted">  Volume: $48B | Fear & Greed: 72 (Greed)</span>{'\n'}
                  <span className="text-terminal-muted">  Key levels: Support $95K | Resistance $100K</span>
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
                {[
                  'Core price data (Binance)',
                  '100 requests/day',
                  'Basic market briefings',
                  'Community support'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-terminal-muted">
                    <span className="text-terminal-green mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleAuth}
                className="w-full py-2.5 rounded-lg text-sm font-medium border border-graphite-800 text-terminal-muted hover:border-terminal-cyan hover:text-terminal-text transition-all"
              >
                Get Started
              </button>
            </motion.div>

            {/* Pro tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isPlansInView ? 1 : 0, y: isPlansInView ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-xl bg-graphite-900 border-2 border-terminal-cyan relative"
            >
              <span className="absolute -top-3 left-4 px-2 py-0.5 text-xs font-medium bg-terminal-cyan text-graphite-950 rounded">
                POPULAR
              </span>
              <h4 className="text-lg font-semibold text-terminal-text mb-2">Pro</h4>
              <p className="text-3xl font-bold text-terminal-text mb-4">
                $8<span className="text-sm font-normal text-terminal-muted">/month</span>
              </p>
              <ul className="space-y-3 mb-6 text-sm">
                {[
                  'All Free features, plus:',
                  'Multi-source data (news, on-chain, social)',
                  '10,000 requests/day',
                  'Advanced analytics & sentiment',
                  'Priority support'
                ].map((item, i) => (
                  <li key={item} className={`flex items-start gap-2 ${i === 0 ? 'text-terminal-muted' : 'text-terminal-text'}`}>
                    <span className="text-terminal-cyan mt-0.5">{i === 0 ? '↑' : '✓'}</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleAuth}
                className="w-full py-2.5 rounded-lg text-sm font-semibold bg-terminal-cyan text-graphite-950 hover:bg-terminal-cyan/90 transition-all"
              >
                Upgrade to Pro
              </button>
            </motion.div>
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
                q: 'What is MCP?',
                a: 'Model Context Protocol is an open standard that lets AI assistants securely connect to external data sources. Context8 is an MCP server that provides real-time crypto market data.'
              },
              {
                q: 'Which AI clients are supported?',
                a: 'Any MCP-compatible client works — including Claude Desktop, Cursor, and custom implementations. More clients are adding MCP support regularly.'
              },
              {
                q: 'Is authentication required?',
                a: 'Yes. All access requires OAuth authentication (Google or GitHub) — even on the free tier. This ensures secure, rate-limited access to market data.'
              },
              {
                q: 'What data sources do you use?',
                a: 'Free tier uses Binance for price data. Pro tier adds news aggregation, on-chain metrics, social sentiment, and multi-exchange data.'
              },
              {
                q: 'Do you support stocks or forex?',
                a: 'Not yet. We\'re focused on crypto markets first. Stock and forex data is on the roadmap for future releases.'
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
              Ready to give your AI market intelligence?
            </h3>
            <p className="text-terminal-muted mb-8 max-w-lg mx-auto">
              Connect in under 60 seconds. No credit card required.
            </p>
            <button
              onClick={handleAuth}
              className="bg-terminal-cyan text-graphite-950 px-8 py-3 rounded-lg text-base font-semibold hover:bg-terminal-cyan/90 hover:shadow-terminal-cyan transition-all"
            >
              Get Started Free
            </button>
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
            <span className="text-xs text-terminal-muted">MCP Server for Crypto Data</span>
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
