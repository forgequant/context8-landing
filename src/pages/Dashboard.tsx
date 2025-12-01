import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { PaymentModal } from '../components/payment/PaymentModal'
import { usePaymentSubmit } from '../hooks/usePaymentSubmit'
import { useSubscription } from '../hooks/useSubscription'
import { usePaymentHistory } from '../hooks/usePaymentHistory'
import { usePendingPaymentsCount } from '../hooks/usePendingPaymentsCount'
import { SubscriptionStatus } from '../components/subscription/SubscriptionStatus'
import { RenewalReminder } from '../components/subscription/RenewalReminder'
import { PaymentHistory } from '../components/subscription/PaymentHistory'
import { MCPInstructions } from '../components/dashboard/MCPInstructions'

export function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [pendingPayment, setPendingPayment] = useState<any>(null)
  const { submitPayment } = usePaymentSubmit()

  // Subscription data
  const {
    subscription,
    loading: subLoading,
    isActive,
    isExpired,
    isInGrace,
    daysRemaining
  } = useSubscription()

  // Payment history data
  const { payments, loading: paymentsLoading } = usePaymentHistory()

  // Pending payments count (for admin badge)
  const { count: pendingCount } = usePendingPaymentsCount()

  useEffect(() => {
    // Check if user is authenticated and fetch pending payment
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        navigate('/auth')
        return
      }

      setUser(user)

      // Check for pending payment
      const { data: payment } = await supabase
        .from('payment_submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single()

      setPendingPayment(payment)
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

  // Check for expired subscription (outside grace period) and prompt upgrade
  useEffect(() => {
    if (!subLoading && isExpired && !isInGrace && !pendingPayment) {
      setShowPaymentModal(true)
    }
  }, [subLoading, isExpired, isInGrace, pendingPayment])

  const handlePaymentSubmit = async (data: any) => {
    await submitPayment(data)
    // Refresh pending payment status
    const { data: payment } = await supabase
      .from('payment_submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single()
    setPendingPayment(payment)
  }

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
            <button
              onClick={() => navigate('/analytics')}
              className="text-sm bg-graphite-900 px-4 py-1.5 rounded hover:bg-terminal-cyan/20 transition-colors border border-graphite-800 hover:border-terminal-cyan"
              title="Crypto Analytics Chat"
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="text-sm bg-graphite-900 px-4 py-1.5 rounded hover:bg-graphite-800 transition-colors"
              title="Upgrade to Pro"
            >
              Pro $8
            </button>
            {user?.user_metadata?.is_admin && (
              <button
                onClick={() => navigate('/admin')}
                className="text-sm bg-terminal-cyan text-graphite-950 px-4 py-1.5 rounded hover:bg-terminal-cyan/90 transition-colors font-semibold relative"
              >
                Admin
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-terminal-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}
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

        {/* Service Maintenance Notice */}
        <section className="mb-8">
          <div className="bg-terminal-red/10 border-l-4 border-terminal-red rounded p-4">
            <p className="text-terminal-red text-sm">
              ⚠️ MCP Server under maintenance until December 20th
            </p>
            <p className="text-terminal-muted text-sm mt-1">
              API integration temporarily unavailable. Daily reports continue at{' '}
              <a href="/reports/daily" className="text-terminal-cyan hover:underline">
                /reports/daily
              </a>
            </p>
            <p className="text-terminal-muted text-sm mt-2">
              📝 We need your feedback to continue development!{' '}
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSfmaKzi3O-1V6ZAC4zasdQzPA9POclHrXvFM8cQd3gCffSb3g/viewform" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">
                Please fill out the feedback form
              </a>
            </p>
          </div>
        </section>

        {/* Subscription section */}
        <section className="mb-12">
          <h2 className="text-sm text-terminal-muted italic mb-6">Your subscription</h2>

          {/* Subscription Status */}
          <div className="mb-4">
            <SubscriptionStatus
              subscription={subscription}
              loading={subLoading}
              daysRemaining={daysRemaining}
              isInGrace={isInGrace}
            />
          </div>

          {/* Renewal Reminder */}
          {subscription && !subLoading && (daysRemaining < 7 || isInGrace) && (
            <div className="mb-4">
              <RenewalReminder
                daysRemaining={daysRemaining}
                isInGrace={isInGrace}
                onRenew={() => setShowPaymentModal(true)}
              />
            </div>
          )}

          {/* Pending Payment Notice */}
          {pendingPayment && (
            <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <p className="text-sm text-yellow-200">
                ⏳ Payment pending admin verification
              </p>
              <p className="text-xs text-yellow-300 mt-1">
                Your payment is being reviewed. Pro access will be activated upon approval (typically within 24 hours).
              </p>
            </div>
          )}

          {/* Upgrade Button (show if not active or no pending payment) */}
          {!isActive && !pendingPayment && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-terminal-cyan text-graphite-950 px-4 py-2 rounded text-sm font-semibold hover:bg-terminal-cyan/90 transition-colors"
            >
              Upgrade to Pro - $8/month
            </button>
          )}
        </section>

        {/* Payment History section */}
        {payments.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm text-terminal-muted italic mb-6">Payment history</h2>
            <PaymentHistory payments={payments} loading={paymentsLoading} />
          </section>
        )}

        {/* API Integration section */}
        <section className="mb-12">
          <h2 className="text-sm text-terminal-muted italic mb-6">API Integration</h2>
          <MCPInstructions />
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  )
}
