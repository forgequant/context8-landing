import { DemoContent } from './types';

/**
 * Demo section content
 *
 * Shows a concrete example of Context8 + LLM analysis (FR-014 stretch goal)
 * Demonstrates value for crypto traders and analysts
 *
 * Example query: BTC/USDT analysis with sentiment
 * Response format: Markdown with structured analysis
 */
export const demoContent: DemoContent = {
  sectionTitle: 'Demo',
  headline: 'See Context8 in Action',
  description:
    'Watch how Context8 transforms your AI assistant into a crypto-aware analyst with real-time data and sentiment analysis.',
  demoType: 'static', // MVP: static demo, interactive is stretch goal
  demo: {
    query: 'Analyze BTC/USDT with current market sentiment',
    response: `**Current Market Data** (updated 60s ago)
- **Price**: $67,432.50 (+2.3% 24h)
- **24h Volume**: $28.4B
- **Market Cap**: $1.32T (#1)

**Technical Analysis**
- **RSI**: 58 (neutral territory)
- **MACD**: Bullish crossover detected
- **Support/Resistance**: Strong support at $65,000, resistance at $70,000

**Social Sentiment** (last 15 min)
- **Twitter Mentions**: 12,400 (+18% vs yesterday)
- **Sentiment Score**: 72/100 (Positive)
- **Trending Topics**: "Bitcoin rally", "institutional adoption"

**On-Chain Metrics**
- **Active Addresses**: 892,000 (+5% 24h)
- **Exchange Inflow**: -2,400 BTC (bullish signal)
- **Whale Activity**: 3 large accumulations detected

**Analysis Summary**
Current technicals show bullish momentum with positive sentiment. On-chain data suggests accumulation phase. Watch $70,000 resistance level for breakout confirmation.`,
    timestamp: 'Generated 2 minutes ago',
  },
  cta: {
    text: 'Try It Yourself',
    href: '/auth/signin',
    variant: 'primary',
    size: 'lg',
  },
};
