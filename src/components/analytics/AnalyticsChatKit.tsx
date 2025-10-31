import { ChatKit, useChatKit } from '@openai/chatkit-react'
import { useState } from 'react'
import type { MarketData } from '@/types/analytics'

interface AnalyticsChatKitProps {
  onWidgetData: (data: MarketData) => void
}

const WORKFLOW_ID = import.meta.env.VITE_CHATKIT_WORKFLOW_ID || ''

export function AnalyticsChatKit({ onWidgetData }: AnalyticsChatKitProps) {
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Create session with OpenAI ChatKit
  const getClientSecret = async () => {
    console.log('[AnalyticsChatKit] Creating session...', {
      workflowId: WORKFLOW_ID,
      hasApiKey: !!import.meta.env.VITE_OPENAI_API_KEY,
    })

    if (!WORKFLOW_ID) {
      const errMsg = 'VITE_CHATKIT_WORKFLOW_ID not configured'
      setError(errMsg)
      throw new Error(errMsg)
    }

    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      const errMsg = 'VITE_OPENAI_API_KEY not configured'
      setError(errMsg)
      throw new Error(errMsg)
    }

    try {
      setIsInitializing(true)
      const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview',
          workflow: { id: WORKFLOW_ID },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('[AnalyticsChatKit] Session creation failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        })
        throw new Error(`Failed to create session: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('[AnalyticsChatKit] Session created successfully')
      setIsInitializing(false)
      setError(null)
      return data.client_secret.value
    } catch (err) {
      console.error('[AnalyticsChatKit] Failed to create ChatKit session:', err)
      const errMsg = err instanceof Error ? err.message : 'Unknown error creating session'
      setError(errMsg)
      setIsInitializing(false)
      throw err
    }
  }

  const chatkit = useChatKit({
    api: {
      getClientSecret,
    },
    theme: {
      colorScheme: 'dark',
      color: {
        grayscale: {
          hue: 220,
          tint: 6,
          shade: -4,
        },
        accent: {
          primary: '#06b6d4', // terminal-cyan
          level: 1,
        },
      },
      radius: 'round',
    },
    startScreen: {
      greeting: '# Context8 Crypto Analytics\n\nAsk me about crypto market data. I have access to:\n- **fetch** - Complete market reports (orderbook, volume, flows)\n- **search** - Find crypto symbols',
      prompts: [
        {
          label: 'BTC Market Report',
          prompt: 'Show BTC market report',
          icon: 'circle-question',
        },
        {
          label: 'ETH Order Book',
          prompt: 'Get order book for ETHUSDT',
          icon: 'circle-question',
        },
        {
          label: 'Search Symbols',
          prompt: 'Search for Bitcoin symbols',
          icon: 'circle-question',
        },
        {
          label: 'SOL Analysis',
          prompt: 'Analyze SOLUSDT microstructure',
          icon: 'circle-question',
        },
      ],
    },
    composer: {
      placeholder: 'Ask about crypto markets...',
    },
    threadItemActions: {
      feedback: false,
    },
    onClientTool: async (invocation: {
      name: string
      params: Record<string, unknown>
    }) => {
      console.log('[AnalyticsChatKit] Client tool invoked:', invocation)

      // Handle widget rendering from LLM
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
    <div className="relative">
      <div className="bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden h-[600px] relative">
        {isInitializing && (
          <div className="absolute inset-0 flex items-center justify-center bg-graphite-950/80 z-10">
            <div className="text-center">
              <div className="text-terminal-cyan text-sm mb-2">Initializing ChatKit...</div>
              <div className="text-terminal-muted text-xs">Creating session with OpenAI</div>
            </div>
          </div>
        )}
        <ChatKit
          control={chatkit.control}
          className="block h-full w-full"
        />
      </div>

      {error && (
        <div className="mt-4 bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <span className="text-red-500 text-sm">⚠</span>
            <div className="flex-1">
              <p className="text-red-400 text-sm font-semibold mb-1">Error</p>
              <p className="text-red-300/80 text-xs">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-terminal-muted">
        <span className="text-terminal-cyan">$</span> ChatKit session ready (Workflow: {WORKFLOW_ID.slice(0, 12)}...)
      </div>
    </div>
  )
}
