import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { useTypewriter } from '@/hooks/useTypewriter'

export function Landing() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const usageRef = useRef(null)
  const plansRef = useRef(null)
  const faqRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: true, margin: '-100px' })
  const isUsageInView = useInView(usageRef, { once: true, margin: '-100px' })
  const isPlansInView = useInView(plansRef, { once: true, margin: '-100px' })
  const isFaqInView = useInView(faqRef, { once: true, margin: '-100px' })

  const { displayText: heroText, isComplete: heroComplete } = useTypewriter({
    text: 'Context8 — OAuth-gated MCP for crypto briefings',
    speed: 50,
    delay: 500
  })

  const handleAuth = () => {
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-6 py-8 md:py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="terminal-scanlines" />
      <div className="terminal-grid" />

      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center relative z-10">
        <h1 className="text-base">
          <span className="text-terminal-cyan">context8</span>
          <span className="text-terminal-text">&gt;_</span>
        </h1>
        <button
          onClick={handleAuth}
          className="text-sm text-terminal-muted hover:text-terminal-cyan transition-colors group"
        >
          <span className="group-hover:hidden">Sign in</span>
          <span className="hidden group-hover:inline">$ sign-in_</span>
        </button>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto relative z-10">
        {/* Hero section - simplified flat style */}
        <motion.section
          ref={heroRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHeroInView ? 1 : 0, y: isHeroInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="space-y-4">
            {/* Connection status */}
            <p className="text-terminal-muted text-sm">
              # Connecting to Context8 MCP Server...
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-terminal-green text-sm"
            >
              ✓ Connected to api.context8.markets
            </motion.p>

            {/* Typewriter headline - smaller size */}
            <div className="pt-4">
              <h2 className="text-xl md:text-2xl font-normal mb-4 text-terminal-text">
                {heroText}
                {!heroComplete && <span className="animate-cursor">_</span>}
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: heroComplete ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className="text-sm text-terminal-muted mb-8"
              >
                LLM-ready, minimal, deterministic. Plug one URL.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: heroComplete ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <button
                  onClick={handleAuth}
                  className="bg-terminal-cyan text-graphite-950 px-6 py-2 rounded text-sm font-semibold hover:bg-terminal-cyan/90 transition-all group"
                >
                  <span className="group-hover:hidden">Start free (OAuth)</span>
                  <span className="hidden group-hover:inline">$ start-free --oauth_</span>
                </button>
                <div className="mt-4 space-y-2">
                  <a
                    href="/reports/daily"
                    className="inline-block text-sm text-terminal-cyan hover:underline"
                  >
                    → Daily BTC Report (Oct 31)
                  </a>
                  <p className="text-xs text-terminal-muted">
                    Informational only. Not financial advice.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Usage section - flat style */}
        <motion.section
          ref={usageRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isUsageInView ? 1 : 0, y: isUsageInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-sm text-terminal-text mb-4">$ cat usage.txt</h3>
          <div className="bg-graphite-900 rounded-lg border border-graphite-800 p-6">
            <div className="overflow-x-auto">
              <pre className="text-terminal-muted text-sm">
                <motion.code
                  initial="hidden"
                  animate={isUsageInView ? 'visible' : 'hidden'}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2
                      }
                    }
                  }}
                >
                  {`# Connect
MCP_URL="https://api.context8.markets"

# Auth
Open in your LLM client → OAuth (Google/Github)

# Request
"BTC briefing"

# Response (Markdown)
# Context8 Briefing — BTC — 2025-10-26T09:30Z
- Price: $34,260 (+2.8% / 24h)
- Volume (24h): $18B`.split('\n').map((line, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 }
                      }}
                    >
                      {line}
                      {'\n'}
                    </motion.span>
                  ))}
                </motion.code>
              </pre>
            </div>
          </div>
        </motion.section>

        {/* Plans section with terminal output style */}
        <motion.section
          ref={plansRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isPlansInView ? 1 : 0, y: isPlansInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-sm text-terminal-text mb-4">$ show-plans</h3>
          <div className="bg-graphite-900 rounded-lg border border-graphite-800 p-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: isPlansInView ? 1 : 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-terminal-muted"
            >
              <span className="text-terminal-green">→</span> Free — core prices (Binance), basic limits
              <br />
              <span className="text-terminal-cyan">→</span> Pro — $8/mo — full sources (news/on-chain/social), higher limits
            </motion.p>
          </div>
        </motion.section>

        {/* FAQ section with terminal output style */}
        <motion.section
          ref={faqRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isFaqInView ? 1 : 0, y: isFaqInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-sm text-terminal-text mb-6">$ cat faq.txt</h3>
          <motion.div
            className="space-y-6 text-sm"
            initial="hidden"
            animate={isFaqInView ? 'visible' : 'hidden'}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.2
                }
              }
            }}
          >
            {[
              {
                q: '$ is-server-public?',
                a: 'No. OAuth-only, even Free.'
              },
              {
                q: '$ can-pick-sources?',
                a: 'Not in MVP.'
              },
              {
                q: '$ support-stocks?',
                a: 'Crypto first; later — stocks/FX.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="border-l-2 border-terminal-cyan pl-4"
              >
                <p className="text-terminal-cyan font-semibold mb-2">{item.q}</p>
                <p className="text-terminal-muted">
                  <span className="text-terminal-green">✓</span> {item.a}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto text-xs text-terminal-muted flex gap-4 pt-8 border-t border-graphite-800 relative z-10">
        <a href="#" className="hover:text-terminal-cyan transition-colors group">
          <span className="group-hover:hidden">Privacy</span>
          <span className="hidden group-hover:inline">&gt; privacy</span>
        </a>
        <a href="#" className="hover:text-terminal-cyan transition-colors group">
          <span className="group-hover:hidden">Terms</span>
          <span className="hidden group-hover:inline">&gt; terms</span>
        </a>
        <a href="#" className="hover:text-terminal-cyan transition-colors group">
          <span className="group-hover:hidden">Status</span>
          <span className="hidden group-hover:inline">&gt; status</span>
        </a>
        <span className="ml-auto">© 2025 Context8</span>
      </footer>
    </div>
  )
}
