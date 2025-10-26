export interface Feature {
  id: string
  title: string
  description: string
  icon: string // Terminal icon or symbol
  command: string // CLI command example
}

export const features: Feature[] = [
  {
    id: 'real-time-data',
    title: 'Real-Time Market Data',
    description: 'Stream live cryptocurrency prices, order books, and trade data from multiple exchanges with millisecond precision.',
    icon: '⚡',
    command: 'ctx8 stream --exchange binance --pair BTC/USDT'
  },
  {
    id: 'advanced-analytics',
    title: 'Advanced Analytics',
    description: 'Built-in technical indicators, pattern recognition, and custom strategy backtesting with historical data.',
    icon: '📊',
    command: 'ctx8 analyze --strategy macd --timeframe 1h'
  },
  {
    id: 'multi-exchange',
    title: 'Multi-Exchange Support',
    description: 'Connect to 50+ cryptocurrency exchanges through a unified API interface with automatic credential management.',
    icon: '🔗',
    command: 'ctx8 exchanges list --available'
  },
  {
    id: 'risk-management',
    title: 'Risk Management',
    description: 'Automated position sizing, stop-loss management, and portfolio risk analysis to protect your capital.',
    icon: '🛡️',
    command: 'ctx8 risk --portfolio analyze --max-drawdown 15'
  },
  {
    id: 'paper-trading',
    title: 'Paper Trading',
    description: 'Test your strategies risk-free with simulated trading that mirrors real market conditions and execution.',
    icon: '📝',
    command: 'ctx8 paper-trade --strategy momentum --capital 10000'
  },
  {
    id: 'webhooks-alerts',
    title: 'Webhooks & Alerts',
    description: 'Custom price alerts, trade notifications, and webhook integrations with Telegram, Discord, and Slack.',
    icon: '🔔',
    command: 'ctx8 alert create --price BTC>50000 --webhook discord'
  }
]
