import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { OrderBookData } from '@/types/analytics'

interface MarketDataWidgetProps {
  data: OrderBookData
  onClose?: () => void
}

export function MarketDataWidget({ data, onClose }: MarketDataWidgetProps) {
  const chartData = [
    ...data.bids.slice(0, 10).reverse().map(([price, volume]) => ({
      price: price.toFixed(2),
      bid: volume,
      ask: 0,
      type: 'bid'
    })),
    ...data.asks.slice(0, 10).map(([price, volume]) => ({
      price: price.toFixed(2),
      bid: 0,
      ask: volume,
      type: 'ask'
    }))
  ]

  const imbalanceColor = data.imbalance > 0
    ? 'text-terminal-green'
    : data.imbalance < 0
    ? 'text-terminal-red'
    : 'text-terminal-text'

  return (
    <div className="bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden">
      <div className="border-b border-graphite-800 bg-graphite-950/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-terminal-cyan text-sm font-semibold">
            {data.symbol}
          </span>
          <span className="text-terminal-muted text-xs">
            Order Book
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-terminal-muted hover:text-terminal-red transition-colors text-xs"
          >
            ✕
          </button>
        )}
      </div>

      <div className="p-4 border-b border-graphite-800">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-terminal-muted mb-1">Spread</div>
            <div className="text-terminal-text font-mono">
              {data.spread.toFixed(2)} bp
            </div>
          </div>
          <div>
            <div className="text-terminal-muted mb-1">Imbalance</div>
            <div className={`font-mono ${imbalanceColor}`}>
              {data.imbalance > 0 ? '+' : ''}{data.imbalance.toFixed(3)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="text-xs text-terminal-muted mb-3">
          Depth Chart (Top 10 levels)
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="price"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              stroke="#334155"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              stroke="#334155"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="bid" fill="#10b981" stackId="a" />
            <Bar dataKey="ask" fill="#ef4444" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="px-4 py-2 bg-graphite-950/30 text-xs text-terminal-muted">
        Updated: {new Date(data.timestamp).toLocaleTimeString()}
      </div>
    </div>
  )
}
