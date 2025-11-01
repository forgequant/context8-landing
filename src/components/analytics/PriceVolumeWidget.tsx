import { useEffect, useRef, useState } from 'react'
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  HistogramData,
  CandlestickSeries,
  HistogramSeries,
} from 'lightweight-charts'

interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface Ticker24h {
  lastPrice: number
  priceChangePercent: number
  volume: number
  quoteVolume: number
  highPrice: number
  lowPrice: number
}

interface MarketDataSnapshot {
  symbol: string
  interval: string
  limit: number
  candles: Candle[]
  ticker24h: Ticker24h
  change7dPct: number | null
  ts: number
}

interface Props {
  fetchUrl?: string
  defaultSymbol?: string
  defaultInterval?: string
  defaultLimit?: number
}

export function PriceVolumeWidget({
  fetchUrl = import.meta.env.VITE_SUPABASE_URL + '/functions/v1/binance-proxy',
  defaultSymbol = 'BTCUSDT',
  defaultInterval = '1h',
  defaultLimit = 200,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<any> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<any> | null>(null)

  const [symbol, setSymbol] = useState(defaultSymbol)
  const [interval, setInterval] = useState(defaultInterval)
  const [limit, setLimit] = useState(defaultLimit)
  const [snapshot, setSnapshot] = useState<MarketDataSnapshot | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Event listener for external updates (from ChatKit client tool)
  useEffect(() => {
    const handleRefresh = (e: Event) => {
      const detail = (e as CustomEvent).detail || {}
      console.log('[PriceVolumeWidget] Refresh event:', detail)

      if (detail.symbol) setSymbol(String(detail.symbol).toUpperCase())
      if (detail.interval) setInterval(String(detail.interval))
      if (detail.limit) setLimit(Number(detail.limit))

      // If data is provided directly, use it
      if (detail.data) {
        setSnapshot(detail.data)
        updateChart(detail.data)
      }
    }

    window.addEventListener('crypto:refresh', handleRefresh as EventListener)
    return () =>
      window.removeEventListener('crypto:refresh', handleRefresh as EventListener)
  }, [])

  // Load data from API
  async function loadData() {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        symbol,
        interval,
        limit: String(limit),
      })

      const url = `${fetchUrl}?${params}`
      console.log('[PriceVolumeWidget] Fetching:', url)

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: MarketDataSnapshot = await response.json()
      console.log('[PriceVolumeWidget] Data loaded:', {
        symbol: data.symbol,
        candlesCount: data.candles.length,
        lastPrice: data.ticker24h.lastPrice,
      })

      setSnapshot(data)
      updateChart(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('[PriceVolumeWidget] Load error:', message)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // Initialize and update chart
  function updateChart(data: MarketDataSnapshot) {
    if (!containerRef.current) return

    // Initialize chart if not exists
    if (!chartRef.current) {
      const chart = createChart(containerRef.current, {
        height: 320,
        layout: {
          background: { color: '#13151a' },
          textColor: '#e5e7eb',
        },
        grid: {
          vertLines: { color: '#252830' },
          horzLines: { color: '#252830' },
        },
        rightPriceScale: {
          borderColor: '#252830',
        },
        timeScale: {
          borderColor: '#252830',
          timeVisible: true,
          secondsVisible: false,
        },
      })

      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
        borderUpColor: '#10b981',
        borderDownColor: '#ef4444',
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      })

      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: '#06b6d4',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      })

      chartRef.current = chart
      candleSeriesRef.current = candleSeries
      volumeSeriesRef.current = volumeSeries
    }

    // Update series data
    const candleData: CandlestickData[] = data.candles.map((c) => ({
      time: c.time as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }))

    const volumeData: HistogramData[] = data.candles.map((c) => ({
      time: c.time as any,
      value: c.volume,
      color: c.close >= c.open ? '#10b981' : '#ef4444',
    }))

    candleSeriesRef.current?.setData(candleData)
    volumeSeriesRef.current?.setData(volumeData)
    chartRef.current?.timeScale().fitContent()
  }

  // Load data on mount and when params change
  useEffect(() => {
    void loadData()
  }, [symbol, interval, limit])

  // Format number with commas
  const formatNum = (n: number, decimals = 2) =>
    n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })

  return (
    <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-3">
          <h3 className="text-terminal-cyan text-sm font-mono font-semibold">
            {symbol}
          </h3>
          <span className="text-terminal-muted text-xs font-mono">{interval}</span>
        </div>
        {loading && (
          <div className="text-terminal-cyan text-xs font-mono animate-pulse">
            Loading...
          </div>
        )}
      </div>

      {/* KPI Panel */}
      {snapshot && (
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-mono">
          <div>
            <span className="text-terminal-muted">Price: </span>
            <span className="text-terminal-text">
              ${formatNum(snapshot.ticker24h.lastPrice)}
            </span>
          </div>
          <div>
            <span className="text-terminal-muted">24h: </span>
            <span
              className={
                snapshot.ticker24h.priceChangePercent >= 0
                  ? 'text-terminal-green'
                  : 'text-red-400'
              }
            >
              {snapshot.ticker24h.priceChangePercent >= 0 ? '+' : ''}
              {formatNum(snapshot.ticker24h.priceChangePercent)}%
            </span>
          </div>
          {snapshot.change7dPct !== null && (
            <div>
              <span className="text-terminal-muted">7d: </span>
              <span
                className={
                  snapshot.change7dPct >= 0 ? 'text-terminal-green' : 'text-red-400'
                }
              >
                {snapshot.change7dPct >= 0 ? '+' : ''}
                {formatNum(snapshot.change7dPct)}%
              </span>
            </div>
          )}
          <div>
            <span className="text-terminal-muted">Vol: </span>
            <span className="text-terminal-text">
              {formatNum(snapshot.ticker24h.volume, 0)}
            </span>
          </div>
          <div>
            <span className="text-terminal-muted">High: </span>
            <span className="text-terminal-text">
              ${formatNum(snapshot.ticker24h.highPrice)}
            </span>
          </div>
          <div>
            <span className="text-terminal-muted">Low: </span>
            <span className="text-terminal-text">
              ${formatNum(snapshot.ticker24h.lowPrice)}
            </span>
          </div>
        </div>
      )}

      {/* Chart */}
      <div
        ref={containerRef}
        className="w-full h-80 bg-graphite-950 border border-graphite-800 rounded mb-3"
      />

      {/* Controls */}
      <div className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          <span className="text-terminal-muted text-xs font-mono">Interval:</span>
          {['1m', '5m', '15m', '30m', '1h', '4h', '1d'].map((iv) => (
            <button
              key={iv}
              onClick={() => setInterval(iv)}
              className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                interval === iv
                  ? 'bg-terminal-cyan text-graphite-950'
                  : 'bg-graphite-800 text-terminal-muted hover:text-terminal-cyan'
              }`}
            >
              {iv}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="text-terminal-muted text-xs font-mono">Candles:</span>
          {[50, 100, 200, 500].map((n) => (
            <button
              key={n}
              onClick={() => setLimit(n)}
              className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                limit === n
                  ? 'bg-terminal-cyan text-graphite-950'
                  : 'bg-graphite-800 text-terminal-muted hover:text-terminal-cyan'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 bg-red-900/20 border border-red-500/50 rounded p-2">
          <span className="text-red-500 text-xs font-mono">ERR: {error}</span>
        </div>
      )}
    </div>
  )
}
