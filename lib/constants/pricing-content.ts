import { PricingContent } from './types';

/**
 * Pricing section content
 *
 * Shows Free vs Pro plan comparison (FR-012)
 * Highlights value of Pro plan while keeping Free tier viable
 *
 * Free plan: 100 requests/day (enough for hobbyists/learners)
 * Pro plan: 1000 requests/day + priority support
 */
export const pricingContent: PricingContent = {
  sectionTitle: 'Pricing',
  headline: 'Start Free, Upgrade When Ready',
  description:
    'Every plan includes access to all 4 data sources. No hidden fees, no surprise charges.',
  plans: [
    {
      id: 'free',
      name: 'Free',
      price: {
        amount: 0,
        period: null,
        display: '$0',
      },
      description: 'Perfect for trying Context8 and personal projects',
      features: [
        {
          text: '100 requests per day',
          included: true,
        },
        {
          text: 'All 4 data sources',
          included: true,
          tooltip: 'Binance, CoinGecko, On-chain, Sentiment',
        },
        {
          text: '60-second data updates',
          included: true,
        },
        {
          text: 'MCP protocol support',
          included: true,
        },
        {
          text: 'OAuth authentication',
          included: true,
        },
        {
          text: 'Community support',
          included: true,
        },
        {
          text: 'Priority support',
          included: false,
        },
        {
          text: 'Custom rate limits',
          included: false,
        },
      ],
      cta: {
        text: 'Start Free',
        href: '/auth/signin',
        variant: 'secondary',
        size: 'lg',
      },
      highlight: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: {
        amount: 29,
        period: 'month',
        display: '$29',
      },
      description: 'For serious traders and professional analysts',
      features: [
        {
          text: '1,000 requests per day',
          included: true,
        },
        {
          text: 'All 4 data sources',
          included: true,
          tooltip: 'Binance, CoinGecko, On-chain, Sentiment',
        },
        {
          text: '60-second data updates',
          included: true,
        },
        {
          text: 'MCP protocol support',
          included: true,
        },
        {
          text: 'OAuth authentication',
          included: true,
        },
        {
          text: 'Priority email support',
          included: true,
        },
        {
          text: 'Priority support',
          included: true,
          tooltip: '< 24h response time',
        },
        {
          text: 'Custom rate limits',
          included: true,
          tooltip: 'Contact us for enterprise needs',
        },
      ],
      cta: {
        text: 'Upgrade to Pro',
        href: '/auth/signin?plan=pro',
        variant: 'primary',
        size: 'lg',
      },
      highlight: true,
    },
  ],
  comparisonNote:
    'All plans include a 14-day money-back guarantee. Cancel anytime, no questions asked.',
};
