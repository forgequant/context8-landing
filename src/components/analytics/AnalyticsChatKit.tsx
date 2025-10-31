import { ChatKit, useChatKit } from '@openai/chatkit-react'
import { useState, useEffect } from 'react'
import type { MarketData } from '@/types/analytics'

interface AnalyticsChatKitProps {
  onWidgetData: (data: MarketData) => void
}

const WORKFLOW_ID = (import.meta.env.VITE_CHATKIT_WORKFLOW_ID || '').trim()

export function AnalyticsChatKit({ onWidgetData }: AnalyticsChatKitProps) {
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  console.log('[AnalyticsChatKit] Component mounted', {
    hasWorkflowId: !!WORKFLOW_ID,
    hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    workflowIdPrefix: WORKFLOW_ID.slice(0, 15),
  })

  // Create session with OpenAI ChatKit
  const getClientSecret = async (currentSecret: string | null) => {
    console.log('[AnalyticsChatKit] getClientSecret called', {
      currentSecret: currentSecret ? 'exists' : 'null',
      workflowId: WORKFLOW_ID,
      hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    })

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
      setIsInitializing(true)

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
          user_id: 'anonymous-' + Date.now(),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorData: any = {}
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { raw: errorText }
        }
        console.error('[AnalyticsChatKit] Session creation failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          endpoint: 'supabase/functions/v1/chatkit-session',
          requestBody: {
            workflow_id: WORKFLOW_ID,
            user_id: 'anonymous',
          },
        })
        throw new Error(`Failed to create session: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      console.log('[AnalyticsChatKit] Session created successfully', {
        hasClientSecret: !!data.client_secret,
        expiresAfter: data.expires_after,
      })
      setIsInitializing(false)
      setError(null)

      // ChatKit API returns client_secret directly as a string
      return typeof data.client_secret === 'string'
        ? data.client_secret
        : data.client_secret?.value
    } catch (err) {
      console.error('[AnalyticsChatKit] Failed to create ChatKit session:', err)
      const errMsg = err instanceof Error ? err.message : 'Unknown error creating session'
      setError(errMsg)
      setIsInitializing(false)
      throw err
    }
  }

  // Initialize session on mount
  useEffect(() => {
    console.log('[AnalyticsChatKit] useEffect - initializing session')

    const initSession = async () => {
      try {
        const secret = await getClientSecret(null)
        setClientSecret(secret)
        console.log('[AnalyticsChatKit] Initial session created in useEffect')
      } catch (err) {
        console.error('[AnalyticsChatKit] Failed to initialize session in useEffect:', err)
      }
    }

    initSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
