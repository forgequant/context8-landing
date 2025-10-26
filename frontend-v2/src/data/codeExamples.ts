export interface CodeExample {
  id: string
  title: string
  language: string
  code: string
  description: string
}

export const codeExamples: CodeExample[] = [
  {
    id: 'quick-start',
    title: 'Quick Start',
    language: 'python',
    description: 'Get started with Context8 in under 5 minutes',
    code: `from context8 import Client

# Initialize client
client = Client(api_key="your_api_key")

# Stream real-time data
@client.on("ticker")
def handle_ticker(data):
    print(f"\{data.symbol}: $\{data.price}")

# Start streaming
client.stream("BTC/USDT", exchange="binance")`
  },
  {
    id: 'strategy',
    title: 'Simple Strategy',
    language: 'python',
    description: 'Build a momentum trading strategy with risk management',
    code: `from context8 import Strategy, Indicator

class MomentumStrategy(Strategy):
    def init(self):
        self.sma_fast = Indicator.SMA(period=10)
        self.sma_slow = Indicator.SMA(period=30)

    def next(self):
        if self.sma_fast > self.sma_slow:
            self.buy(size=0.1, stop_loss=0.02)
        elif self.sma_fast < self.sma_slow:
            self.sell()

# Backtest strategy
strategy = MomentumStrategy()
results = strategy.backtest(
    symbol="ETH/USDT",
    start="2023-01-01",
    capital=10000
)`
  },
  {
    id: 'multi-exchange',
    title: 'Multi-Exchange',
    language: 'python',
    description: 'Arbitrage opportunities across multiple exchanges',
    code: `from context8 import Client

client = Client()

# Monitor multiple exchanges
exchanges = ["binance", "coinbase", "kraken"]
pair = "BTC/USDT"

prices = {}
for exchange in exchanges:
    ticker = client.get_ticker(pair, exchange)
    prices[exchange] = ticker.price

# Find arbitrage opportunity
best_buy = min(prices, key=prices.get)
best_sell = max(prices, key=prices.get)
spread = prices[best_sell] - prices[best_buy]

print(f"Buy on \{best_buy}, sell on \{best_sell}")
print(f"Potential profit: $\{spread:.2f}")`
  },
  {
    id: 'webhooks',
    title: 'Alerts & Webhooks',
    language: 'python',
    description: 'Set up custom price alerts with webhook notifications',
    code: `from context8 import Client, Alert

client = Client()

# Create price alert
alert = Alert.create(
    condition="BTC/USDT > 50000",
    webhook_url="https://discord.com/webhook/...",
    message="🚀 Bitcoin crossed $50k!"
)

# Monitor custom conditions
@client.on("candle_close")
def check_rsi(candle):
    rsi = candle.indicators.rsi(period=14)
    if rsi > 70:
        client.notify(
            channel="telegram",
            message=f"⚠️ \{candle.symbol} RSI overbought: \{rsi}"
        )`
  }
]
