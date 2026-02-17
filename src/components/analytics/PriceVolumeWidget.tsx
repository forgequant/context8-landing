import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  type CandlestickData,
  type HistogramData,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts'
import { apiFetchWithFallback, extractObjectFromResponse } from '@/lib/api'

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

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value)
    if (Number.isFinite(n)) return n
  }
  return null
}

function parseTicker24h(value: unknown): Ticker24h | null {
  const rec = asRecord(value)
  if (!rec) return null

  const lastPrice = asNumber(rec.lastPrice ?? rec.last_price)
  const priceChangePercent = asNumber(rec.priceChangePercent ?? rec.price_change_percent)
  const volume = asNumber(rec.volume)
  const quoteVolume = asNumber(rec.quoteVolume ?? rec.quote_volume)
  const highPrice = asNumber(rec.highPrice ?? rec.high_price)
  const lowPrice = asNumber(rec.lowPrice ?? rec.low_price)

  if (
    lastPrice === null ||
    priceChangePercent === null ||
    volume === null ||
    quoteVolume === null ||
    highPrice === null ||
    lowPrice === null
  ) {
    return null
  }

  return { lastPrice, priceChangePercent, volume, quoteVolume, highPrice, lowPrice }
}

function parseCandles(value: unknown): Candle[] | null {
  if (!Array.isArray(value)) return null
  const parsed: Candle[] = []
  for (const item of value) {
    const rec = asRecord(item)
    if (!rec) continue
    const time = asNumber(rec.time)
    const open = asNumber(rec.open)
    const high = asNumber(rec.high)
    const low = asNumber(rec.low)
    const close = asNumber(rec.close)
    const volume = asNumber(rec.volume)
    if (time === null || open === null || high === null || low === null || close === null || volume === null) {
      continue
    }
    parsed.push({ time, open, high, low, close, volume })
  }
  return parsed.length > 0 ? parsed : null
}

export function PriceVolumeWidget({
  fetchUrl = '/api/v1/market/spot/binance-proxy',
  defaultSymbol = 'BTCUSDT',
  defaultInterval = '1h',
  defaultLimit = 200,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)

  const [symbol, setSymbol] = useState(defaultSymbol)
  const [interval, setInterval] = useState(defaultInterval)
  const [limit, setLimit] = useState(defaultLimit)
  const [snapshot, setSnapshot] = useState<MarketDataSnapshot | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateChart = useCallback((data: MarketDataSnapshot) => {
    if (!containerRef.current) return

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

    const candleData: CandlestickData[] = data.candles.map((c) => ({
      time: c.time as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }))

    const volumeData: HistogramData[] = data.candles.map((c) => ({
      time: c.time as UTCTimestamp,
      value: c.volume,
      color: c.close >= c.open ? '#10b981' : '#ef4444',
    }))

    candleSeriesRef.current?.setData(candleData)
    volumeSeriesRef.current?.setData(volumeData)
    chartRef.current?.timeScale().fitContent()
  }, [])
  useEffect(() => {
    const handleRefresh = (e: Event) => {
      const detail = (e as CustomEvent).detail || {}
      if (detail.symbol) setSymbol(String(detail.symbol).toUpperCase())
      if (detail.interval) setInterval(String(detail.interval))
      if (detail.limit) setLimit(Number(detail.limit))

      if (detail.data) {
        setSnapshot(detail.data)
        updateChart(detail.data)
      }
    }

    window.addEventListener('crypto:refresh', handleRefresh as EventListener)
    return () =>
      window.removeEventListener('crypto:refresh', handleRefresh as EventListener)
  }, [updateChart])

  const parsePayload = useCallback((raw: unknown): MarketDataSnapshot => {
    const payload = extractObjectFromResponse<Record<string, unknown>>(raw, [
      'data',
      'result',
      'payload',
      'snapshot',
      'report',
    ])

    if (!payload) {
      throw new Error('Invalid market data payload')
    }

    const candles = parseCandles(payload.candles)
    if (!candles) {
      throw new Error('Invalid market data payload: missing candles')
    }

    const tickerCandidate = payload.ticker24h ?? payload.ticker ?? payload.ticker_24h
    const ticker24h = parseTicker24h(tickerCandidate)
    if (!ticker24h) {
      throw new Error('Invalid market data payload: missing ticker24h')
    }

    const ts = asNumber(payload.ts) ?? Date.now()
    const change7dPctRaw = payload.change7dPct ?? payload.change7d_pct
    const change7dPct =
      change7dPctRaw === null ? null : (asNumber(change7dPctRaw) ?? null)

    const symbolValue = typeof payload.symbol === 'string' && payload.symbol.trim() ? payload.symbol : symbol
    const intervalValue = typeof payload.interval === 'string' && payload.interval.trim() ? payload.interval : interval
    const limitValue = asNumber(payload.limit) ?? limit

    return {
      symbol: symbolValue,
      interval: intervalValue,
      limit: limitValue,
      candles,
      ticker24h,
      change7dPct,
      ts,
    }
  }, [interval, limit, symbol])
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        symbol,
        interval,
        limit: String(limit),
      })
      const query = params.toString()

      const paths = [
        `${fetchUrl}?${query}`,
        `/api/v1/analytics/market-data/binance-proxy?${query}`,
        `/api/v1/market-data/binance-proxy?${query}`,
        `/api/v1/binance-proxy?${query}`,
        `/api/v1/market/binance-proxy?${query}`,
      ]

      const response = await apiFetchWithFallback<unknown>(paths, { method: 'GET' })
      const data = parsePayload(response)

      setSnapshot(data)
      updateChart(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('[PriceVolumeWidget] Load error:', message)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [fetchUrl, interval, limit, symbol, parsePayload, updateChart])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const formatNum = (n: number, decimals = 2) =>
    n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })

  return (
    <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
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

      <div
        ref={containerRef}
        className="w-full h-80 bg-graphite-950 border border-graphite-800 rounded mb-3"
      />

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

      {error && (
        <div className="mt-3 bg-red-900/20 border border-red-500/50 rounded p-2">
          <span className="text-red-500 text-xs font-mono">ERR: {error}</span>
        </div>
      )}
    </div>
  )
}
