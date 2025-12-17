import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
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
import { ApiKeySection } from '../components/dashboard/ApiKeySection'

// Section header component
function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-sm text-terminal-cyan flex items-center gap-2 mb-6"
    >
      <span className="text-terminal-muted">{number}</span>
      {title}
    </motion.h2>
  )
}

// Skeleton loader for cards
function SkeletonCard() {
  return (
    <div className="bg-graphite-900 rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-graphite-800 rounded w-32" />
          <div className="h-3 bg-graphite-800 rounded w-48" />
        </div>
        <div className="h-4 bg-graphite-800 rounded w-12" />
      </div>
    </div>
  )
}

// Skeleton loader for subscription
function SubscriptionSkeleton() {
  return (
    <div className="bg-graphite-900 rounded-xl p-6 animate-pulse border border-graphite-800">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-graphite-800 rounded w-24" />
        <div className="h-6 bg-graphite-800 rounded w-16" />
      </div>
      <div className="h-3 bg-graphite-800 rounded w-full mb-2" />
      <div className="h-3 bg-graphite-800 rounded w-2/3" />
    </div>
  )
}

// Data source card component
function DataSourceCard({
  title,
  description,
  tier,
  disabled = false,
  delay = 0
}: {
  title: string
  description: string
  tier: string
  disabled?: boolean
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      className={`bg-graphite-900 rounded-lg p-4 flex items-center justify-between border border-graphite-800 hover:border-terminal-cyan/30 transition-all ${disabled ? 'opacity-60' : ''}`}
    >
      <div>
        <p className="text-sm font-semibold mb-1 text-terminal-text">{title}</p>
        <p className="text-xs text-terminal-muted">{description}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded ${
        tier === 'Free' ? 'bg-terminal-green/20 text-terminal-green' :
        tier === 'Pro' ? 'bg-terminal-cyan/20 text-terminal-cyan' :
        'bg-graphite-800 text-terminal-muted'
      }`}>
        {tier}
      </span>
    </motion.div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [pendingPayment, setPendingPayment] = useState<any>(null)
  const { submitPayment } = usePaymentSubmit()

  // Refs for scroll animations
  const headerRef = useRef(null)
  const subscriptionRef = useRef(null)
  const apiKeyRef = useRef(null)
  const integrationRef = useRef(null)
  const dataSourcesRef = useRef(null)

  const isHeaderInView = useInView(headerRef, { once: true })
  const isSubscriptionInView = useInView(subscriptionRef, { once: true })
  const isApiKeyInView = useInView(apiKeyRef, { once: true })
  const isIntegrationInView = useInView(integrationRef, { once: true })
  const isDataSourcesInView = useInView(dataSourcesRef, { once: true })

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
      <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono flex items-center justify-center relative overflow-hidden">
        <div className="terminal-scanlines" />
        <div className="terminal-grid" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4 relative z-10"
        >
          <div className="w-8 h-8 border-2 border-terminal-cyan border-t-transparent rounded-full animate-spin" />
          <p className="text-terminal-cyan text-sm">Loading dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-6 py-8 md:py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="terminal-scanlines" />
      <div className="terminal-grid" />

      {/* Header */}
      <motion.header
        ref={headerRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isHeaderInView ? 1 : 0, y: isHeaderInView ? 0 : -20 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto mb-12 relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl">
                <span className="text-terminal-cyan font-semibold">context8</span>
                <span className="text-terminal-muted">&gt;_</span>
              </h1>
              <span className="px-3 py-1 bg-graphite-900 border border-graphite-800 rounded text-xs text-terminal-muted">
                Dashboard
              </span>
            </div>
            {user && (
              <p className="text-sm text-terminal-muted">
                Logged in as <span className="text-terminal-cyan">{user.email}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/analytics')}
              className="text-sm bg-graphite-900 px-4 py-2 rounded-lg hover:bg-terminal-cyan/20 transition-colors border border-graphite-800 hover:border-terminal-cyan flex items-center gap-2"
              title="Crypto Analytics Chat"
            >
              <span>📊</span>
              <span>Analytics</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPaymentModal(true)}
              className="text-sm bg-terminal-cyan/20 border border-terminal-cyan/50 text-terminal-cyan px-4 py-2 rounded-lg hover:bg-terminal-cyan/30 transition-colors font-medium"
              title="Upgrade to Pro"
            >
              Pro $8
            </motion.button>
            {user?.user_metadata?.is_admin && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin')}
                className="text-sm bg-terminal-cyan text-graphite-950 px-4 py-2 rounded-lg hover:bg-terminal-cyan/90 transition-colors font-semibold relative"
              >
                Admin
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-terminal-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </motion.button>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-terminal-muted hover:text-terminal-red transition-colors px-4 py-2"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Service Maintenance Notice */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-terminal-red/10 border border-terminal-red/30 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-terminal-red text-lg">⚠️</span>
              <div>
                <p className="text-terminal-red text-sm font-medium">
                  MCP Server under maintenance until December 20th
                </p>
                <p className="text-terminal-muted text-sm mt-1">
                  API integration temporarily unavailable. Daily reports continue at{' '}
                  <a href="/reports/daily" className="text-terminal-cyan hover:underline">
                    /reports/daily
                  </a>
                </p>
                <p className="text-terminal-muted text-sm mt-2">
                  📝 We need your feedback to continue development!{' '}
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSfmaKzi3O-1V6ZAC4zasdQzPA9POclHrXvFM8cQd3gCffSb3g/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terminal-cyan hover:underline"
                  >
                    Please fill out the feedback form
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Subscription section */}
        <motion.section
          ref={subscriptionRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isSubscriptionInView ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionHeader number="01" title="SUBSCRIPTION" />

          {subLoading ? (
            <SubscriptionSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
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
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4"
                >
                  <RenewalReminder
                    daysRemaining={daysRemaining}
                    isInGrace={isInGrace}
                    onRenew={() => setShowPaymentModal(true)}
                  />
                </motion.div>
              )}

              {/* Pending Payment Notice */}
              {pendingPayment && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400">⏳</span>
                    <div>
                      <p className="text-sm text-yellow-200 font-medium">
                        Payment pending admin verification
                      </p>
                      <p className="text-xs text-yellow-300/80 mt-1">
                        Your payment is being reviewed. Pro access will be activated upon approval (typically within 24 hours).
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Upgrade Button (show if not active or no pending payment) */}
              {!isActive && !pendingPayment && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-terminal-cyan text-graphite-950 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-terminal-cyan/90 transition-all hover:shadow-lg hover:shadow-terminal-cyan/20"
                >
                  Upgrade to Pro - $8/month
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.section>

        {/* Payment History section */}
        {payments.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <SectionHeader number="02" title="PAYMENT HISTORY" />
            <PaymentHistory payments={payments} loading={paymentsLoading} />
          </motion.section>
        )}

        {/* API Key section */}
        <motion.section
          ref={apiKeyRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isApiKeyInView ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionHeader number={payments.length > 0 ? "03" : "02"} title="API KEY" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <ApiKeySection />
          </motion.div>
        </motion.section>

        {/* API Integration section */}
        <motion.section
          ref={integrationRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isIntegrationInView ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionHeader number={payments.length > 0 ? "04" : "03"} title="API INTEGRATION" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <MCPInstructions />
          </motion.div>
        </motion.section>

        {/* Data sources section */}
        <motion.section
          ref={dataSourcesRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isDataSourcesInView ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader number={payments.length > 0 ? "05" : "04"} title="DATA SOURCES" />

          <div className="space-y-3">
            <DataSourceCard
              title="Binance Prices"
              description="Spot price, 24h change, 24h volume"
              tier="Free"
              delay={0}
            />
            <DataSourceCard
              title="Crypto News (aggregated)"
              description="Headline feed curated for crypto"
              tier="Free (soon)"
              delay={0.1}
            />
            <DataSourceCard
              title="On-chain Metrics"
              description="Network activity, exchange flows"
              tier="Pro"
              disabled
              delay={0.2}
            />
            <DataSourceCard
              title="Social Signals"
              description="X/Telegram curated signals"
              tier="Pro"
              disabled
              delay={0.3}
            />
          </div>
        </motion.section>

        {/* Footer disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-xs text-terminal-muted mt-12 p-4 bg-graphite-900/50 rounded-lg border border-graphite-800"
        >
          <span className="text-terminal-cyan">Note:</span> Availability depends on your plan. Informational only. Not financial advice.
        </motion.p>
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
