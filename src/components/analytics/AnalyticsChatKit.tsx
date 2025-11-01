import { ChatKit, useChatKit } from '@openai/chatkit-react'
import { useState, useCallback, memo } from 'react'
import type { MarketData } from '@/types/analytics'

interface AnalyticsChatKitProps {
  onWidgetData: (data: MarketData) => void
}

const WORKFLOW_ID = (import.meta.env.VITE_CHATKIT_WORKFLOW_ID || '').trim()

export const AnalyticsChatKit = memo(function AnalyticsChatKit({ onWidgetData }: AnalyticsChatKitProps) {
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)


  // Create session with OpenAI ChatKit - wrapped in useCallback for stable reference
  const getClientSecret = useCallback(async (currentSecret: string | null) => {

    if (!WORKFLOW_ID) {
      const errMsg = 'VITE_CHATKIT_WORKFLOW_ID not configured'
      setError(errMsg)
      throw new Error(errMsg)
    }

    if (!import.meta.env.VITE_SUPABASE_URL) {
      const errMsg = 'VITE_SUPABASE_URL not configured'
      setError(errMsg)
      throw new Error(errMsg)
    }

    if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const errMsg = 'VITE_SUPABASE_ANON_KEY not configured'
      setError(errMsg)
      throw new Error(errMsg)
    }

    try {
      // Only set initializing for the first session creation
      if (!currentSecret) {
        setIsInitializing(true)
      }

      // Call Supabase Edge Function to create ChatKit session
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      const response = await fetch(`${supabaseUrl}/functions/v1/chatkit-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          workflow_id: WORKFLOW_ID,
          workflow_version: '3',
          user_id: 'anonymous-' + Date.now(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setError(null)

      // Only clear initializing state after first session
      if (!currentSecret) {
        setIsInitializing(false)
      }

      // ChatKit API returns client_secret directly as a string
      return typeof data.client_secret === 'string'
        ? data.client_secret
        : data.client_secret?.value
    } catch (err) {
      console.error('[AnalyticsChatKit] Failed to create ChatKit session:', err)
      const errMsg = err instanceof Error ? err.message : 'Unknown error creating session'
      setError(errMsg)

      // Only clear initializing state on first session error
      if (!currentSecret) {
        setIsInitializing(false)
      }

      throw err
    }
  }, []) // Empty deps - function doesn't depend on any props/state

  // Note: We don't call getClientSecret in useEffect
  // ChatKit will call it automatically when needed


  const chatkit = useChatKit({
    api: {
      getClientSecret,
    },
    initialThread: null, // Show start screen
    theme: {
      colorScheme: 'dark',
      color: {
        grayscale: {
          hue: 200,
          tint: 3,
          shade: -4,
        },
        accent: {
          primary: '#06b6d4', // terminal-cyan
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
      // Handle Binance market data fetch
      if (invocation.name === 'fetch_binance_marketdata') {
        const symbol = String(invocation.params.symbol || 'BTCUSDT').toUpperCase()
        const interval = String(invocation.params.interval || '1h')
        const limit = Math.min(Math.max(Number(invocation.params.limit || 200), 10), 500)

        try {
          // Fetch data from Supabase Edge Function
          const params = new URLSearchParams({ symbol, interval, limit: String(limit) })
          const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/binance-proxy?${params}`
          const response = await fetch(url)

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const data = await response.json()

          // Trigger widget update via CustomEvent
          window.dispatchEvent(new CustomEvent('crypto:refresh', {
            detail: { symbol, interval, limit, data }
          }))

          // Return formatted markdown summary to agent
          const formatPrice = (price: number) => `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          const formatPercent = (pct: number) => `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`
          const formatVolume = (vol: number) => vol.toLocaleString('en-US', { maximumFractionDigits: 0 })

          const change24h = data.ticker24h.priceChangePercent
          const change7d = data.change7dPct
          const emoji24h = change24h >= 0 ? '🟢' : '🔴'
          const emoji7d = change7d !== null ? (change7d >= 0 ? '🟢' : '🔴') : '⚪'

          const result = `### 📊 ${data.symbol} Market Report

| Metric | Value | 24h Change | 7d Change |
|--------|-------|------------|-----------|
| **Price** | **${formatPrice(data.ticker24h.lastPrice)}** | ${emoji24h} ${formatPercent(change24h)} | ${emoji7d} ${change7d !== null ? formatPercent(change7d) : 'N/A'} |
| **Volume** | ${formatVolume(data.ticker24h.volume)} ${data.symbol.replace('USDT', '')} | — | — |
| **High** | ${formatPrice(data.ticker24h.highPrice)} | 24h peak | — |
| **Low** | ${formatPrice(data.ticker24h.lowPrice)} | 24h floor | — |

---

✅ **Chart updated** with ${data.candles.length} candles (${data.interval} timeframe)`

          return result as any
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.error('[AnalyticsChatKit] Failed to fetch market data:', errorMessage)
          return `✗ Failed to fetch market data: ${errorMessage}` as any
        }
      }

      // Handle legacy widget rendering from LLM
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
