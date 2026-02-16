import { ChatKit, useChatKit } from '@openai/chatkit-react'
import { useState, useCallback, memo } from 'react'
import { apiFetchWithFallback, extractObjectFromResponse } from '@/lib/api'
import type { MarketData } from '@/types/analytics'

interface AnalyticsChatKitProps {
  onWidgetData: (data: MarketData) => void
}

interface MarketDataSnapshot {
  symbol: string
  interval: string
  limit: number
  candles: Array<{
    time: number
    open: number
    high: number
    low: number
    close: number
    volume: number
  }>
  ticker24h: {
    lastPrice: number
    priceChangePercent: number
    volume: number
    quoteVolume: number
    highPrice: number
    lowPrice: number
  }
  change7dPct: number | null
  ts: number
}

const WORKFLOW_ID = (import.meta.env.VITE_CHATKIT_WORKFLOW_ID || '').trim()

const CHATKIT_SESSION_ENDPOINTS = [
  '/api/v1/chatkit/session',
  '/api/v1/chatkit-session',
  '/api/v1/analytics/chatkit/session',
]

const BINANCE_DATA_ENDPOINTS = [
  '/api/v1/analytics/binance-proxy',
  '/api/v1/market-data/binance',
  '/api/v1/binance-proxy',
  '/api/v1/market/binance-proxy',
]

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

function parseCandles(value: unknown): MarketDataSnapshot['candles'] | null {
  if (!Array.isArray(value)) return null

  const parsed: MarketDataSnapshot['candles'] = []
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

function parseTicker24h(value: unknown): MarketDataSnapshot['ticker24h'] | null {
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

function extractClientSecret(response: unknown): string | null {
  if (typeof response === 'string') {
    const secret = response.trim()
    return secret.length > 0 ? secret : null
  }

  const extractSecretString = (value: unknown): string | null => {
    if (typeof value === 'string') return value.trim() || null
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const rec = value as Record<string, unknown>
      if (typeof rec.value === 'string') return rec.value.trim() || null
    }
    return null
  }

  const parsed = extractObjectFromResponse<{
    client_secret?: unknown
    clientSecret?: unknown
    secret?: unknown
  }>(response, ['result', 'data', 'payload'])

  const secret = parsed?.client_secret ?? parsed?.clientSecret ?? parsed?.secret
  const extracted = extractSecretString(secret)
  if (extracted) return extracted

  return null
}

function normalizeMarketSnapshot(
  response: unknown,
  fallback: { symbol: string; interval: string; limit: number },
): MarketDataSnapshot {
  const payload = extractObjectFromResponse<Record<string, unknown>>(response, [
    'data',
    'result',
    'payload',
    'snapshot',
    'report',
  ])

  if (!payload) {
    throw new Error('Invalid market data response from API')
  }

  const candles = parseCandles(payload.candles)
  if (!candles) {
    throw new Error('Invalid market data response from API: missing candles')
  }

  const tickerCandidate = payload.ticker24h ?? payload.ticker ?? payload.ticker_24h
  const ticker24h = parseTicker24h(tickerCandidate)
  if (!ticker24h) {
    throw new Error('Invalid market data response from API: missing ticker24h')
  }

  const symbol = typeof payload.symbol === 'string' && payload.symbol.trim() ? payload.symbol : fallback.symbol
  const interval = typeof payload.interval === 'string' && payload.interval.trim() ? payload.interval : fallback.interval
  const limit = asNumber(payload.limit) ?? fallback.limit
  const ts = asNumber(payload.ts) ?? Date.now()

  const change7dPctRaw = payload.change7dPct ?? payload.change7d_pct
  const change7dPct = change7dPctRaw === null ? null : (asNumber(change7dPctRaw) ?? null)

  return {
    symbol,
    interval,
    limit,
    candles,
    ticker24h,
    change7dPct,
    ts,
  }
}

function toWidgetData(snapshot: MarketDataSnapshot): MarketData {
  return {
    symbol: snapshot.symbol,
    price: snapshot.ticker24h.lastPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    volume: snapshot.ticker24h.volume.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    }),
    spread: ((snapshot.ticker24h.highPrice - snapshot.ticker24h.lowPrice) / snapshot.ticker24h.lowPrice * 100)
      .toFixed(2),
    timestamp: snapshot.ts ?? Date.now(),
  }
}

export const AnalyticsChatKit = memo(function AnalyticsChatKit({ onWidgetData }: AnalyticsChatKitProps) {
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const getClientSecret = useCallback(async (currentSecret: string | null) => {
    if (!WORKFLOW_ID) {
      const errMsg = 'VITE_CHATKIT_WORKFLOW_ID not configured'
      setIsInitializing(false)
      setError(errMsg)
      throw new Error(errMsg)
    }

    if (!currentSecret) {
      setIsInitializing(true)
    }

    try {
      const body = JSON.stringify({
        workflow_id: WORKFLOW_ID,
        workflow_version: '3',
        user_id: `web-${Date.now()}`,
      })

      const data = await apiFetchWithFallback<unknown>(CHATKIT_SESSION_ENDPOINTS, {
        method: 'POST',
        body,
      })

      const clientSecret = extractClientSecret(data)
      if (!clientSecret) {
        throw new Error('Session API did not return a client_secret')
      }

      setError(null)
      setIsInitializing(false)

      return clientSecret
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to create ChatKit session'
      setError(errMsg)
      if (!currentSecret) {
        setIsInitializing(false)
      }
      throw err
    }
  }, [])

  const loadBinanceMarketData = async (symbol: string, interval: string, limit: number) => {
    const params = new URLSearchParams({
      symbol,
      interval,
      limit: String(limit),
    })
    const query = params.toString()

    const paths = BINANCE_DATA_ENDPOINTS.map((path) => `${path}?${query}`)
    const response = await apiFetchWithFallback<unknown>(paths, { method: 'GET' })
    return normalizeMarketSnapshot(response, { symbol, interval, limit })
  }

  const chatkit = useChatKit({
    api: {
      getClientSecret,
    },
    initialThread: null,
    theme: {
      colorScheme: 'dark',
      color: {
        grayscale: {
          hue: 200,
          tint: 3,
          shade: -4,
        },
        accent: {
          primary: '#06b6d4',
          level: 2,
        },
      },
      radius: 'sharp',
      density: 'normal',
      typography: {
        baseSize: 14,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontFamilyMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      },
    },
    startScreen: {
      greeting: '',
      prompts: [
        {
          label: '$ btc report',
          prompt: 'Show BTC market report',
        },
        {
          label: '$ eth orderbook',
          prompt: 'Get order book for ETHUSDT',
        },
        {
          label: '$ search btc',
          prompt: 'Search for Bitcoin symbols',
        },
        {
          label: '$ analyze sol',
          prompt: 'Analyze SOLUSDT microstructure',
        },
      ],
    },
    composer: {
      placeholder: '> query markets_',
    },
    threadItemActions: {
      feedback: false,
    },
    onClientTool: async (invocation: {
      name: string
      params: Record<string, unknown>
    }) => {
      if (invocation.name === 'fetch_binance_marketdata') {
        const symbol = String(invocation.params.symbol || 'BTCUSDT').toUpperCase()
        const interval = String(invocation.params.interval || '1h')
        const limit = Math.min(Math.max(Number(invocation.params.limit || 200), 10), 500)

        try {
          const data = await loadBinanceMarketData(symbol, interval, limit)

          window.dispatchEvent(new CustomEvent('crypto:refresh', {
            detail: {
              symbol,
              interval,
              limit,
              data,
            },
          }))

          onWidgetData(toWidgetData(data))

          const formatPrice = (price: number) =>
            `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          const formatPercent = (pct: number) =>
            `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`
          const formatVolume = (vol: number) =>
            vol.toLocaleString('en-US', { maximumFractionDigits: 0 })

          const change24h = data.ticker24h.priceChangePercent
          const change7d = data.change7dPct
          const emoji24h = change24h >= 0 ? '🟢' : '🔴'
          const emoji7d = change7d !== null ? (change7d >= 0 ? '🟢' : '🔴') : '⚪'

          const report = `### 📊 ${data.symbol} Market Report

| Metric | Value | 24h Change | 7d Change |
|--------|-------|------------|-----------|
| **Price** | **${formatPrice(data.ticker24h.lastPrice)}** | ${emoji24h} ${formatPercent(change24h)} | ${emoji7d} ${change7d !== null ? formatPercent(change7d) : 'N/A'} |
| **Volume** | ${formatVolume(data.ticker24h.volume)} ${data.symbol.replace('USDT', '')} | — | — |
| **High** | ${formatPrice(data.ticker24h.highPrice)} | 24h peak | — |
| **Low** | ${formatPrice(data.ticker24h.lowPrice)} | 24h floor | — |

---

✅ **Chart updated** with ${data.candles.length} candles (${data.interval} timeframe)`
          return {
            success: true,
            message: report,
          }
        } catch (clientErr) {
          const message = clientErr instanceof Error ? clientErr.message : 'Unknown error'
          console.error('[AnalyticsChatKit] Failed to fetch market data:', message)
          return {
            success: false,
            message: `✗ Failed to fetch market data: ${message}`,
          }
        }
      }

      if (invocation.name === 'render_market_widget') {
        const { symbol, price, volume, spread } = invocation.params
        const marketData: MarketData = {
          symbol: String(symbol || 'UNKNOWN'),
          price: String(price || '0'),
          volume: String(volume || '0'),
          spread: spread ? String(spread) : undefined,
          timestamp: Date.now(),
        }

        onWidgetData(marketData)
        return { success: true, message: 'Widget rendered' }
      }

      return { success: false, message: 'Unknown client tool' }
    },
    onResponseEnd: () => {
      setError(null)
    },
    onError: ({ error }) => {
      console.error('[AnalyticsChatKit] Error:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    },
  })

  return (
    <div className="h-full flex flex-col min-h-[600px]">
      <div className="flex-1 bg-graphite-900 border border-graphite-800 rounded overflow-hidden relative min-h-[600px]">
        {isInitializing && (
          <div className="absolute inset-0 flex items-center justify-center bg-graphite-950/90 z-50">
            <div className="text-center">
              <div className="text-terminal-cyan text-sm font-mono mb-2">
                <span className="animate-pulse">█</span> initializing_session
              </div>
              <div className="text-terminal-muted text-xs font-mono">connecting...</div>
            </div>
          </div>
        )}
        <ChatKit
          control={chatkit.control}
          className="block h-full w-full min-h-[600px]"
        />
      </div>

      {error && (
        <div className="mt-3 bg-red-900/20 border border-red-500/50 rounded p-3">
          <div className="flex items-start gap-2">
            <span className="text-red-500 text-xs font-mono">ERR</span>
            <p className="text-red-300 text-xs font-mono flex-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
})
