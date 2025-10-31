import { ChatKit, useChatKit } from '@openai/chatkit-react'
import { useState } from 'react'
import type { MarketData } from '@/types/analytics'

interface AnalyticsChatKitProps {
  onWidgetData: (data: MarketData) => void
}

const MCP_URL = import.meta.env.VITE_CONTEXT8_MCP_URL || 'https://api.context8.markets/sse'
const DOMAIN_KEY = import.meta.env.VITE_CONTEXT8_DOMAIN_KEY || 'context8'

export function AnalyticsChatKit({ onWidgetData }: AnalyticsChatKitProps) {
  const [error, setError] = useState<string | null>(null)

  const chatkit = useChatKit({
    api: {
      url: MCP_URL,
      domainKey: DOMAIN_KEY,
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
      <div className="bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden h-[600px]">
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
        <span className="text-terminal-cyan">$</span> Connected to {MCP_URL}
      </div>
    </div>
  )
}
