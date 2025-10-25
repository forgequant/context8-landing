import { DataSourcesContent } from './types';

/**
 * Data Sources section content
 *
 * Showcases the 4 primary data sources (FR-002):
 * - Binance: Real-time price feeds
 * - Polymarket: Prediction markets and event odds
 * - On-chain: Blockchain metrics
 * - Social Sentiment: Twitter/Reddit analysis
 */
export const dataSourcesContent: DataSourcesContent = {
  sectionTitle: 'Data Sources',
  headline: 'Powered by 4 Trusted Data Sources',
  description:
    'Context8 aggregates data from multiple industry-leading providers, giving your AI assistant a complete view of the crypto market.',
  sources: [
    {
      id: 'binance',
      name: 'Binance',
      logo: {
        src: '/images/data-source-logos/binance.svg',
        alt: 'Binance logo',
      },
      category: 'price',
      updateFrequency: 'Every 60 seconds',
      updateFrequencyMs: 60000,
      metrics: ['Price', '24h Volume', 'Market Cap', 'Bid/Ask Spread'],
      reliability: {
        uptime: 99.9,
        label: '99.9% uptime',
      },
    },
    {
      id: 'polymarket',
      name: 'Polymarket',
      logo: {
        src: '/images/data-source-logos/polymarket.svg',
        alt: 'Polymarket logo',
      },
      category: 'price',
      updateFrequency: 'Every 5 minutes',
      updateFrequencyMs: 300000,
      metrics: ['Prediction Markets', 'Event Odds', 'Trading Volume', 'Market Sentiment'],
      reliability: {
        uptime: 99.5,
        label: '99.5% uptime',
      },
    },
    {
      id: 'onchain',
      name: 'On-Chain Metrics',
      logo: {
        src: '/images/data-source-logos/onchain.svg',
        alt: 'On-chain data logo',
      },
      category: 'onchain',
      updateFrequency: 'Every block (~10 min)',
      updateFrequencyMs: 600000,
      metrics: [
        'Active Addresses',
        'Transaction Volume',
        'Network Hash Rate',
        'Whale Movements',
      ],
      reliability: {
        uptime: 99.0,
        label: '99.0% uptime',
      },
    },
    {
      id: 'sentiment',
      name: 'Social Sentiment',
      logo: {
        src: '/images/data-source-logos/sentiment.svg',
        alt: 'Social sentiment logo',
      },
      category: 'sentiment',
      updateFrequency: 'Every 15 minutes',
      updateFrequencyMs: 900000,
      metrics: [
        'Twitter Mentions',
        'Reddit Activity',
        'Sentiment Score',
        'Trending Topics',
      ],
      reliability: {
        uptime: 98.5,
        label: '98.5% uptime',
      },
    },
  ],
};
