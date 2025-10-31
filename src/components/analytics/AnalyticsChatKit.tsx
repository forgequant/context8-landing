import { ChatKit, useChatKit } from '@openai/chatkit-react'
import { useState, useEffect, useRef, useCallback, memo } from 'react'
import type { MarketData } from '@/types/analytics'

interface AnalyticsChatKitProps {
  onWidgetData: (data: MarketData) => void
}

const WORKFLOW_ID = (import.meta.env.VITE_CHATKIT_WORKFLOW_ID || '').trim()

export const AnalyticsChatKit = memo(function AnalyticsChatKit({ onWidgetData }: AnalyticsChatKitProps) {
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  console.log('[AnalyticsChatKit] Component mounted', {
    hasWorkflowId: !!WORKFLOW_ID,
    hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    workflowIdPrefix: WORKFLOW_ID.slice(0, 15),
  })

  // Create session with OpenAI ChatKit - wrapped in useCallback for stable reference
  const getClientSecret = useCallback(async (currentSecret: string | null) => {
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
        isFirstSession: !currentSecret,
      })

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

  // Check if ChatKit web component is loaded
  useEffect(() => {
    const checkWebComponent = () => {
      const hasComponent = typeof window !== 'undefined' &&
        window.customElements?.get('openai-chatkit')

      console.log('[AnalyticsChatKit] Web component check:', {
        hasCustomElements: !!window.customElements,
        hasChatkitComponent: !!hasComponent,
        windowDefined: typeof window !== 'undefined',
      })
    }

    checkWebComponent()

    // Check again after a delay
    const timer = setTimeout(checkWebComponent, 2000)
    return () => clearTimeout(timer)
  }, [])

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

  // Log chatkit control state
  useEffect(() => {
    console.log('[AnalyticsChatKit] ChatKit control state:', {
      hasControl: !!chatkit.control,
      isInitializing,
      hasError: !!error,
    })
  }, [chatkit.control, isInitializing, error])

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
