import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { features } from '../../data/features'
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

export function Features() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-24 bg-graphite-900">
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
              Built for Quant Traders
            </h2>
            <p className="text-xl text-terminal-muted max-w-2xl mx-auto">
              Everything you need to develop, test, and deploy algorithmic trading strategies
            </p>
          </motion.div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                variants={fadeInUp}
                custom={index}
              >
                <Card className="h-full hover:border-terminal-cyan transition-colors">
                  <CardHeader>
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-terminal-muted">{feature.description}</p>
                    {feature.highlight && (
                      <div className="mt-4 px-3 py-2 bg-graphite-950 border border-terminal-cyan/30 rounded font-mono text-sm text-terminal-cyan">
                        {feature.highlight}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div variants={fadeInUp} className="text-center mt-16">
            <div className="inline-block px-6 py-3 bg-graphite-950 border border-terminal-green rounded-lg">
              <span className="text-terminal-green font-mono">
                $ pip install context8
              </span>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
