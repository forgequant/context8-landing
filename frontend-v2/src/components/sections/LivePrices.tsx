import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { TerminalWindow, TerminalOutput } from '../terminal'
import { useCryptoPrice } from '../../hooks/useCryptoPrice'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

function PriceWidget({ coinId }: { coinId: string }) {
  const { symbol, price, change24h, loading, error } = useCryptoPrice(coinId)

  if (loading) {
    return (
      <TerminalOutput className="text-terminal-muted">
        Loading {symbol}...
      </TerminalOutput>
    )
  }

  if (error) {
    return (
      <TerminalOutput className="text-terminal-red">
        Error: {error}
      </TerminalOutput>
    )
  }

  const changeColor = change24h >= 0 ? 'text-terminal-green' : 'text-terminal-red'
  const changeSymbol = change24h >= 0 ? '+' : ''

  return (
    <TerminalOutput>
      <span className="text-terminal-cyan">{symbol}</span>
      <span className="text-terminal-muted"> → </span>
      <span className="text-terminal-text font-bold">${price.toLocaleString()}</span>
      <span className={`ml-4 ${changeColor}`}>
        {changeSymbol}{change24h.toFixed(2)}%
      </span>
    </TerminalOutput>
  )
}

export function LivePrices() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-24 bg-graphite-950">
      <Container maxWidth="lg">
        <motion.div
          ref={ref}
          initial="initial"
          animate={isVisible ? "animate" : "initial"}
          variants={staggerContainer}
        >
          {/* Section header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-mono text-terminal-cyan mb-4">
              Real-Time Market Data
            </h2>
            <p className="text-xl text-terminal-muted max-w-2xl mx-auto">
              Live prices from major exchanges, updated every second
            </p>
          </motion.div>

          {/* Live price terminal */}
          <motion.div variants={fadeInUp}>
            <TerminalWindow title="context8-market-stream">
              <TerminalOutput className="text-terminal-muted">
                # Streaming live prices from CoinGecko API
              </TerminalOutput>
              <TerminalOutput className="text-terminal-muted mb-4">
                # Updates every 30 seconds
              </TerminalOutput>

              <PriceWidget coinId="bitcoin" />
              <PriceWidget coinId="ethereum" />
              <PriceWidget coinId="solana" />

              <div className="mt-4 pt-4 border-t border-graphite-800">
                <TerminalOutput className="text-terminal-muted text-sm">
                  ✓ Connected • Low latency • Real-time updates
                </TerminalOutput>
              </div>
            </TerminalWindow>
          </motion.div>

          {/* Bottom stats */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-terminal-cyan">500+</div>
              <div className="text-sm text-terminal-muted">Trading Pairs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-terminal-green">20+</div>
              <div className="text-sm text-terminal-muted">Exchanges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-terminal-cyan">1s</div>
              <div className="text-sm text-terminal-muted">Update Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-terminal-green">100%</div>
              <div className="text-sm text-terminal-muted">Historical Data</div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
