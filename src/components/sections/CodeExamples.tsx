import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { CodeTabs } from '../code/CodeTabs'
import { codeExamples } from '../../data/codeExamples'
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

export function CodeExamples() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-24 bg-graphite-950">
      <Container>
        <motion.div
          ref={ref}
          initial="initial"
          animate={isVisible ? "animate" : "initial"}
          variants={staggerContainer}
        >
          {/* Section header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-mono text-terminal-cyan mb-4">
              Simple, Powerful API
            </h2>
            <p className="text-xl text-terminal-muted max-w-2xl mx-auto">
              Write trading strategies in pure Python. No boilerplate, no complexity.
            </p>
          </motion.div>

          {/* Code examples */}
          <motion.div variants={fadeInUp}>
            <CodeTabs examples={codeExamples} />
          </motion.div>

          {/* Bottom text */}
          <motion.div variants={fadeInUp} className="text-center mt-12">
            <p className="text-terminal-muted">
              Built on modern async Python with full type hints and IntelliSense support
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
