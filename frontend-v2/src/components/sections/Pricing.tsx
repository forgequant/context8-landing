import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { pricingTiers } from '../../data/pricing'
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

export function Pricing() {
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
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-terminal-muted max-w-2xl mx-auto">
              Start for free. Scale as you grow. No hidden fees.
            </p>
          </motion.div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                variants={fadeInUp}
                custom={index}
              >
                <Card
                  className={`h-full ${
                    tier.popular
                      ? 'border-terminal-cyan shadow-lg shadow-terminal-cyan/20'
                      : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="px-4 py-2 bg-terminal-cyan/10 border-b border-terminal-cyan/30 text-center">
                      <span className="text-terminal-cyan font-mono text-sm font-semibold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-5xl font-bold font-mono text-terminal-text">
                        {tier.price}
                      </span>
                      {tier.price !== 'Custom' && (
                        <span className="text-terminal-muted">/month</span>
                      )}
                    </div>
                    <p className="mt-2 text-terminal-muted">{tier.description}</p>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-terminal-green mt-1">✓</span>
                          <span className="text-terminal-text">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={tier.popular ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      {tier.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Bottom note */}
          <motion.div variants={fadeInUp} className="text-center mt-12">
            <p className="text-terminal-muted">
              All plans include 24/7 support and 99.9% uptime SLA
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
