import { motion } from 'framer-motion'

export function Hero() {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-6 py-8 md:py-12">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center">
        <h1 className="text-base">
          <span className="text-terminal-cyan">context8</span>
          <span className="text-terminal-text">&gt;_</span>
        </h1>
        <a href="#" className="text-sm text-terminal-muted hover:text-terminal-cyan transition-colors">
          Sign in
        </a>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto">
        {/* Hero section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-normal mb-4 text-terminal-text">
            Context8 — OAuth-gated MCP for crypto briefings
          </h2>
          <p className="text-sm md:text-base text-terminal-muted mb-8">
            LLM-ready, minimal, deterministic. Plug one URL.
          </p>
          <button className="bg-terminal-cyan text-graphite-950 px-6 py-2 rounded text-sm font-semibold hover:bg-terminal-cyan/90 transition-colors mb-2">
            Start free (OAuth)
          </button>
          <p className="text-xs text-terminal-muted">
            Informational only. Not financial advice.
          </p>
        </motion.section>

        {/* Usage section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-sm text-terminal-text mb-4">Usage</h3>
          <div className="bg-graphite-900 rounded-lg p-6 text-sm">
            <pre className="text-terminal-muted">
              <code>{`# Connect
MCP_URL="https://api.context8.markets"

# Auth
Open in your LLM client → OAuth (Google/Github)

# Request
"BTC briefing"

# Response (Markdown)
# Context8 Briefing — BTC — 2025-10-26T09:30Z
- Price: $34,260 (+2.8% / 24h)
- Volume (24h): $18B`}</code>
            </pre>
          </div>
        </motion.section>

        {/* Plans section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-sm text-terminal-text mb-4">Plans</h3>
          <p className="text-sm text-terminal-muted mb-6">
            Free — core prices (Binance), basic limits | Pro — $8/mo — full sources (news/on-chain/social), higher limits
          </p>
        </motion.section>

        {/* FAQ section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-sm text-terminal-text mb-6">FAQ</h3>
          <div className="space-y-6 text-sm">
            <div>
              <p className="text-terminal-text font-semibold mb-2">Is the server public?</p>
              <p className="text-terminal-muted">No. OAuth-only, even Free.</p>
            </div>
            <div>
              <p className="text-terminal-text font-semibold mb-2">Can I pick sources?</p>
              <p className="text-terminal-muted">Not in MVP.</p>
            </div>
            <div>
              <p className="text-terminal-text font-semibold mb-2">Do you support stocks?</p>
              <p className="text-terminal-muted">Crypto first; later — stocks/FX.</p>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto text-xs text-terminal-muted flex gap-4 pt-8 border-t border-graphite-800">
        <a href="#" className="hover:text-terminal-cyan transition-colors">Privacy</a>
        <a href="#" className="hover:text-terminal-cyan transition-colors">Terms</a>
        <a href="#" className="hover:text-terminal-cyan transition-colors">Status</a>
        <span className="ml-auto">© 2025 Context8</span>
      </footer>
    </div>
  )
}
