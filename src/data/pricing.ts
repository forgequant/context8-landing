export interface PricingTier {
  id: string
  name: string
  price: number | 'custom'
  period: 'month' | 'year' | 'custom'
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
  popular?: boolean
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for learning and experimentation',
    features: [
      '1 exchange connection',
      'Paper trading unlimited',
      'Basic indicators (SMA, EMA, RSI)',
      'Community support',
      '100 API calls/day',
      'Historical data (30 days)'
    ],
    cta: 'Get Started'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 8,
    period: 'month',
    description: 'For serious traders and algorithm developers',
    features: [
      '5 exchange connections',
      'Live trading enabled',
      'Advanced indicators (50+)',
      'Priority support',
      'Unlimited API calls',
      'Historical data (2 years)',
      'Webhook integrations',
      'Custom strategies'
    ],
    highlighted: true,
    popular: true,
    cta: 'Start Free Trial'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'custom',
    period: 'custom',
    description: 'Custom solutions for institutions and teams',
    features: [
      'Unlimited exchanges',
      'Dedicated infrastructure',
      'All indicators + custom',
      '24/7 premium support',
      'Unlimited everything',
      'Full historical data',
      'White-label option',
      'SLA guarantees',
      'On-premise deployment'
    ],
    cta: 'Contact Sales'
  }
]
