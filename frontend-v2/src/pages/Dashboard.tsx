import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        navigate('/auth')
        return
      }

      setUser(user)
      setLoading(false)
    }

    checkUser()

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth')
      } else {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono flex items-center justify-center">
        <p className="text-terminal-cyan">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-6 py-8 md:py-12">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-16">
        <div className="flex justify-between items-center">
          <h1 className="text-base">
            <span className="text-terminal-cyan">context8</span>
            <span className="text-terminal-text">&gt;_</span>
          </h1>
          <div className="flex items-center gap-3">
            <button className="text-sm bg-graphite-900 px-4 py-1.5 rounded hover:bg-graphite-800 transition-colors">
              Pro $8
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-terminal-muted hover:text-terminal-red transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto">
        {/* User info */}
        {user && (
          <section className="mb-8">
            <p className="text-sm text-terminal-muted">
              Logged in as: <span className="text-terminal-cyan">{user.email}</span>
            </p>
          </section>
        )}

        {/* Your plan section */}
        <section className="mb-12">
          <h2 className="text-sm text-terminal-muted italic mb-6">Your plan</h2>

          <div className="bg-graphite-900 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm mb-1">Current plan: <span className="font-semibold">Free</span></p>
              </div>
              <div className="text-right text-sm text-terminal-muted">
                Usage: 0 / 100
              </div>
            </div>

            <button className="bg-terminal-cyan text-graphite-950 px-4 py-2 rounded text-sm font-semibold hover:bg-terminal-cyan/90 transition-colors">
              Upgrade to Pro
            </button>
          </div>
        </section>

        {/* Data sources section */}
        <section>
          <h2 className="text-sm text-terminal-muted italic mb-6">Data sources</h2>

          <div className="space-y-3">
            <div className="bg-graphite-900 rounded-lg p-4 flex items-center justify-between hover:bg-graphite-800 transition-colors">
              <div>
                <p className="text-sm font-semibold mb-1">Binance Prices</p>
                <p className="text-xs text-terminal-muted">Spot price, 24h change, 24h volume</p>
              </div>
              <span className="text-xs text-terminal-muted">Free</span>
            </div>

            <div className="bg-graphite-900 rounded-lg p-4 flex items-center justify-between hover:bg-graphite-800 transition-colors">
              <div>
                <p className="text-sm font-semibold mb-1">Crypto News (aggregated)</p>
                <p className="text-xs text-terminal-muted">Headline feed curated for crypto</p>
              </div>
              <span className="text-xs text-terminal-muted">Free (soon)</span>
            </div>

            <div className="bg-graphite-900 rounded-lg p-4 flex items-center justify-between hover:bg-graphite-800 transition-colors opacity-60">
              <div>
                <p className="text-sm font-semibold mb-1">On-chain Metrics</p>
                <p className="text-xs text-terminal-muted">Network activity, exchange flows</p>
              </div>
              <span className="text-xs text-terminal-muted">Pro</span>
            </div>

            <div className="bg-graphite-900 rounded-lg p-4 flex items-center justify-between hover:bg-graphite-800 transition-colors opacity-60">
              <div>
                <p className="text-sm font-semibold mb-1">Social Signals</p>
                <p className="text-xs text-terminal-muted">X/Telegram curated signals</p>
              </div>
              <span className="text-xs text-terminal-muted">Pro</span>
            </div>
          </div>
        </section>

        {/* Footer disclaimer */}
        <p className="text-xs text-terminal-muted mt-16">
          Availability depends on your plan. Informational only. Not financial advice.
        </p>
      </div>
    </div>
  )
}
