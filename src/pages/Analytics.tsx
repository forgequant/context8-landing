import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { AnalyticsChatKit } from '@/components/analytics/AnalyticsChatKit'
import type { MarketData } from '@/types/analytics'

export function Analytics() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [widgets, setWidgets] = useState<MarketData[]>([])

  console.log('[Analytics] Component rendered', { loading })

  useEffect(() => {
    console.log('[Analytics] useEffect - checking user')
    checkUser()
  }, [])

  async function checkUser() {
    console.log('[Analytics] checkUser called')
    const { data: { user } } = await supabase.auth.getUser()

    console.log('[Analytics] User check result:', { hasUser: !!user, email: user?.email })

    if (!user) {
      console.log('[Analytics] No user, redirecting to /auth')
      navigate('/auth')
      return
    }

    console.log('[Analytics] User authenticated, setting loading=false')
    setLoading(false)
  }

  const handleWidgetData = useCallback((data: MarketData) => {
    setWidgets(prev => [...prev, data])
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-graphite-950 flex items-center justify-center">
        <div className="text-terminal-cyan text-sm font-mono">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono">
      {/* Background effects */}
      <div className="terminal-scanlines" />
      <div className="terminal-grid" />

      {/* Header */}
      <header className="border-b border-graphite-800 bg-graphite-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-terminal-muted hover:text-terminal-cyan transition-colors text-sm"
            >
              ← Dashboard
            </button>
            <h1 className="text-lg font-semibold">
              <span className="text-terminal-cyan">context8</span>
              <span className="text-terminal-muted">/analytics</span>
            </h1>
          </div>
          <div className="text-xs text-terminal-muted">
            <span className="text-terminal-green">●</span> MCP Connected
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat panel - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <AnalyticsChatKit onWidgetData={handleWidgetData} />
          </div>

          {/* Widgets panel - 1 column on large screens */}
          <div className="space-y-4">
            <div className="text-sm text-terminal-muted mb-4">
              <span className="text-terminal-cyan">#</span> Market Widgets
            </div>

            {widgets.length === 0 ? (
              <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-6 text-center">
                <p className="text-terminal-muted text-sm">
                  Ask for market data to see widgets here
                </p>
                <p className="text-terminal-muted/60 text-xs mt-2">
                  Try: "Show BTC market report"
                </p>
              </div>
            ) : (
              widgets.map((widget, idx) => (
                <div
                  key={idx}
                  className="bg-graphite-900 border border-graphite-800 rounded-lg p-4"
                >
                  <div className="text-xs text-terminal-cyan mb-2">
                    {widget.symbol}
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-terminal-muted">Price:</span>
                      <span className="text-terminal-text">${widget.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-terminal-muted">Volume:</span>
                      <span className="text-terminal-text">${widget.volume}</span>
                    </div>
                    {widget.spread && (
                      <div className="flex justify-between">
                        <span className="text-terminal-muted">Spread:</span>
                        <span className="text-terminal-green">{widget.spread}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
