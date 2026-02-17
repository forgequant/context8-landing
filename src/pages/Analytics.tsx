import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AnalyticsChatKit } from '@/components/analytics/AnalyticsChatKit'
import { PriceVolumeWidget } from '@/components/analytics/PriceVolumeWidget'
import type { MarketData } from '@/types/analytics'

export function Analytics() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()
  const [widgets, setWidgets] = useState<MarketData[]>([])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth')
    }
  }, [isLoading, isAuthenticated, navigate])

  const loading = isLoading || !isAuthenticated

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
    <div className="min-h-screen bg-graphite-950 text-terminal-text flex flex-col">
      <header className="border-b border-graphite-800 bg-graphite-950/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-terminal-muted hover:text-terminal-text transition-colors text-sm font-mono"
            >
              ← Dashboard
            </button>
            <h1 className="text-lg font-extrabold tracking-tight">
              <span className="text-terminal-text">Analytics</span>{' '}
              <span className="text-terminal-muted font-mono text-sm font-semibold">MCP</span>
            </h1>
          </div>
          <div className="text-xs text-terminal-muted font-mono">
            <span className="text-terminal-green">●</span> Connected
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-6 py-8">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat panel - 2 columns on large screens */}
            <div className="lg:col-span-2 h-full">
              <AnalyticsChatKit onWidgetData={handleWidgetData} />
            </div>

            {/* Widgets panel - 1 column on large screens */}
            <div className="space-y-4">
              {/* Price/Volume Chart Widget */}
              <PriceVolumeWidget
                defaultSymbol="BTCUSDT"
                defaultInterval="1h"
                defaultLimit={200}
              />

              {/* Legacy Market Widgets */}
              <div className="text-sm text-terminal-muted mb-4 font-mono">
                Market widgets
              </div>

              {widgets.length === 0 ? (
                <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-6 text-center">
                  <p className="text-terminal-muted text-sm">
                    Ask for market data to see widgets here
                  </p>
                  <p className="text-terminal-muted/60 text-xs mt-2 font-mono">
                    Try: "Show BTC market report"
                  </p>
                </div>
              ) : (
                widgets.map((widget, idx) => (
                  <div
                    key={idx}
                    className="bg-graphite-900 border border-graphite-800 rounded-lg p-4"
                  >
                    <div className="text-xs text-terminal-cyan mb-2 font-mono">
                      {widget.symbol}
                    </div>
                    <div className="space-y-2 text-xs font-mono">
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
    </div>
  )
}
