import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { PaymentModal } from '../components/payment/PaymentModal'
import { usePaymentSubmit } from '../hooks/usePaymentSubmit'
import { useSubscription } from '../hooks/useSubscription'
import { usePaymentHistory } from '../hooks/usePaymentHistory'
import { usePendingPaymentsCount } from '../hooks/usePendingPaymentsCount'
import { RenewalReminder } from '../components/subscription/RenewalReminder'
import { PaymentHistory } from '../components/subscription/PaymentHistory'
import { MCPInstructions } from '../components/dashboard/MCPInstructions'
import { ApiKeySection } from '../components/dashboard/ApiKeySection'
import type { BlockchainNetwork, StablecoinType, PaymentSubmission } from '../types/subscription'
import { ApiError, apiFetch, apiFetchWithFallback, extractObjectFromResponse, extractArrayFromResponse } from '../lib/api'

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

// Command Bar - Quick Actions
function CommandBar({
  onAnalytics,
  onReport,
  onUpgrade,
  isActive
}: {
  onAnalytics: () => void
  onReport: () => void
  onUpgrade: () => void
  isActive: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-graphite-900/80 backdrop-blur-sm border border-graphite-800 rounded-xl p-3 mb-6"
    >
      <div className="flex items-center gap-2 text-xs text-terminal-muted mb-2">
        <span className="text-terminal-cyan">⌘</span>
        <span>Quick Actions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAnalytics}
          className="flex items-center gap-2 px-4 py-2 bg-graphite-800 hover:bg-graphite-700 border border-graphite-700 hover:border-terminal-cyan/50 rounded-lg text-sm transition-all"
        >
          <span>📊</span>
          <span>Analytics Chat</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReport}
          className="flex items-center gap-2 px-4 py-2 bg-graphite-800 hover:bg-graphite-700 border border-graphite-700 hover:border-terminal-cyan/50 rounded-lg text-sm transition-all"
        >
          <span>📈</span>
          <span>Daily Report</span>
        </motion.button>
        {!isActive && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgrade}
            className="flex items-center gap-2 px-4 py-2 bg-terminal-cyan/20 hover:bg-terminal-cyan/30 border border-terminal-cyan/50 text-terminal-cyan rounded-lg text-sm font-medium transition-all"
          >
            <span>⚡</span>
            <span>Upgrade to Pro</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

// Enhanced Status Card with Progress Bar
function StatusCard({
  isActive,
  daysRemaining,
  planName,
  expiresAt,
  onUpgrade
}: {
  isActive: boolean
  daysRemaining: number
  planName: string
  expiresAt: string | null
  onUpgrade: () => void
}) {
  const progress = isActive ? Math.min((daysRemaining / 30) * 100, 100) : 0
  const progressColor = daysRemaining > 7 ? 'bg-terminal-green' : daysRemaining > 3 ? 'bg-yellow-500' : 'bg-terminal-red'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-graphite-900 rounded-xl border border-graphite-800 p-6 hover:border-terminal-cyan/30 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-terminal-green animate-pulse' : 'bg-terminal-muted'}`} />
            <span className="text-sm font-medium text-terminal-text">
              {isActive ? planName : 'No Active Plan'}
            </span>
          </div>
          <p className="text-xs text-terminal-muted">
            {isActive ? `Renews: ${expiresAt ? new Date(expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}` : 'Upgrade to access Pro features'}
          </p>
        </div>
        {isActive ? (
          <div className="text-right">
            <span className="text-2xl font-bold text-terminal-cyan">{daysRemaining}</span>
            <span className="text-xs text-terminal-muted block">days left</span>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUpgrade}
            className="px-4 py-2 bg-terminal-cyan text-graphite-950 rounded-lg text-sm font-semibold hover:bg-terminal-cyan/90 transition-all"
          >
            $8/mo
          </motion.button>
        )}
      </div>

      {/* Progress Bar */}
      {isActive && (
        <div className="space-y-2">
          <div className="h-2 bg-graphite-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full ${progressColor} rounded-full`}
            />
          </div>
          <div className="flex justify-between text-xs text-terminal-muted">
            <span>Subscription progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Activity Stats Card
function ActivityStats() {
  // Mock data - in real app would come from API
  const apiCalls = 127
  const apiLimit = 1000
  const lastReportTime = '2h ago'
  const lastReportSummary = 'BTC +2.3% • ETH stable'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* API Usage */}
      <div className="bg-graphite-900 rounded-xl border border-graphite-800 p-5 hover:border-terminal-cyan/30 transition-all">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-terminal-cyan">⚡</span>
          <span className="text-xs text-terminal-muted uppercase tracking-wide">API Calls This Month</span>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-bold text-terminal-text">{apiCalls}</span>
          <span className="text-sm text-terminal-muted mb-1">/ {apiLimit}</span>
        </div>
        <div className="h-1.5 bg-graphite-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(apiCalls / apiLimit) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className="h-full bg-terminal-cyan rounded-full"
          />
        </div>
        <p className="text-xs text-terminal-muted mt-2">{((apiCalls / apiLimit) * 100).toFixed(1)}% used</p>
      </div>

      {/* Last Report */}
      <div className="bg-graphite-900 rounded-xl border border-graphite-800 p-5 hover:border-terminal-cyan/30 transition-all">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-terminal-green">📈</span>
          <span className="text-xs text-terminal-muted uppercase tracking-wide">Last Report</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-semibold text-terminal-text">{lastReportTime}</span>
          <span className="px-2 py-0.5 bg-terminal-green/20 text-terminal-green text-xs rounded">Live</span>
        </div>
        <p className="text-sm text-terminal-muted">{lastReportSummary}</p>
        <a
          href="/reports/daily"
          className="inline-flex items-center gap-1 text-xs text-terminal-cyan hover:underline mt-3"
        >
          View full report
          <span>→</span>
        </a>
      </div>
    </motion.div>
  )
}

// Getting Started Checklist
function GettingStartedChecklist({
  hasApiKey,
  hasMcpSetup,
  hasFirstQuery,
  isActive
}: {
  hasApiKey: boolean
  hasMcpSetup: boolean
  hasFirstQuery: boolean
  isActive: boolean
}) {
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('dashboard_checklist_dismissed') === 'true'
  })

  const steps = [
    { id: 'account', label: 'Create account', done: true },
    { id: 'apikey', label: 'Get API key', done: hasApiKey },
    { id: 'mcp', label: 'Connect MCP server', done: hasMcpSetup },
    { id: 'query', label: 'Run first query', done: hasFirstQuery },
    { id: 'pro', label: 'Upgrade to Pro', done: isActive, optional: true }
  ]

  const completedCount = steps.filter(s => s.done).length
  const progress = (completedCount / steps.length) * 100

  // Don't show if all done or dismissed
  if (isDismissed || completedCount === steps.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-graphite-900 to-graphite-900/50 rounded-xl border border-terminal-cyan/30 p-6 mb-8"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-terminal-cyan flex items-center gap-2">
            <span>🚀</span>
            Getting Started
          </h3>
          <p className="text-xs text-terminal-muted mt-1">Complete setup to unlock full potential</p>
        </div>
        <button
          onClick={() => {
            setIsDismissed(true)
            localStorage.setItem('dashboard_checklist_dismissed', 'true')
          }}
          className="text-terminal-muted hover:text-terminal-text text-xs"
        >
          Hide
        </button>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-terminal-muted mb-1">
          <span>{completedCount}/{steps.length} completed</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-graphite-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-terminal-cyan rounded-full"
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex items-center gap-3 p-2 rounded-lg ${step.done ? 'bg-terminal-green/10' : 'bg-graphite-800/50'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
              step.done
                ? 'bg-terminal-green text-graphite-950'
                : 'bg-graphite-700 text-terminal-muted'
            }`}>
              {step.done ? '✓' : index + 1}
            </span>
            <span className={`text-sm ${step.done ? 'text-terminal-green line-through' : 'text-terminal-text'}`}>
              {step.label}
            </span>
            {step.optional && !step.done && (
              <span className="text-xs text-terminal-muted">(optional)</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
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

export function AccountDashboard() {
  const navigate = useNavigate()
  const auth = useAuth()
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [pendingPayment, setPendingPayment] = useState<PaymentSubmission | null>(null)
  const [hasApiKey, setHasApiKey] = useState(false)
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

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate('/auth')
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate])

  useEffect(() => {
    if (!auth.user) return

    // Fetch pending payment and API key status
    const fetchUserData = async () => {
      setLoading(true)

      const fetchPendingPaymentSelf = async () => {
        const querySelf = new URLSearchParams({
          scope: 'self',
          status: 'pending',
          sort: 'submitted_at:desc',
          limit: '1',
        })

        try {
          return await apiFetch<unknown>(`/api/v1/payments?${querySelf.toString()}`, {
            method: 'GET',
            token: auth.accessToken,
          })
        } catch (err) {
          // Backward compatibility: some backends require explicit user_id filter.
          if (!(err instanceof ApiError) || (err.status !== 400 && err.status !== 404 && err.status !== 422)) {
            throw err
          }

          const queryLegacy = new URLSearchParams({
            user_id: auth.user!.id,
            status: 'pending',
            sort: 'submitted_at:desc',
            limit: '1',
          })
          return await apiFetch<unknown>(`/api/v1/payments?${queryLegacy.toString()}`, {
            method: 'GET',
            token: auth.accessToken,
          })
        }
      }

      const fetchPendingPayment = async () => {
        try {
          const paymentResponse = await fetchPendingPaymentSelf()

          const payments = extractArrayFromResponse<PaymentSubmission>(paymentResponse, [
            'items',
            'data',
            'results',
            'payments',
          ])
          setPendingPayment(payments[0] ?? null)
        } catch {
          setPendingPayment(null)
        }
      }

      const fetchApiKeyStatus = async () => {
        try {
          const keyResponse = await apiFetchWithFallback<unknown>(
            ['/api/v1/api-keys/me', '/api/v1/me/api-keys', '/api/v1/api-keys'],
            {
              method: 'GET',
              token: auth.accessToken,
            },
          )

          const keysList = extractArrayFromResponse<Record<string, unknown>>(
            keyResponse,
            ['keys', 'items', 'data', 'results', 'api_keys'],
            (item): item is Record<string, unknown> =>
              !!item && typeof item === 'object' && !Array.isArray(item) && 'id' in item,
          )
          if (keysList.length > 0) {
            setHasApiKey(true)
            return
          }

          const keyPayload = extractObjectFromResponse<Record<string, unknown>>(keyResponse, [
            'key',
            'api_key',
            'data',
            'result',
            'payload',
          ])

          setHasApiKey(!!(keyPayload && typeof keyPayload.id === 'string' && keyPayload.id.trim()))
        } catch {
          setHasApiKey(false)
        }
      }

      try {
        await Promise.all([fetchPendingPayment(), fetchApiKeyStatus()])
      } finally {
        setLoading(false)
      }
    }

    void fetchUserData()
  }, [auth.user, auth.accessToken])

  // Check for expired subscription (outside grace period) and prompt upgrade
  useEffect(() => {
    if (!subLoading && isExpired && !isInGrace && !pendingPayment) {
      setShowPaymentModal(true)
    }
  }, [subLoading, isExpired, isInGrace, pendingPayment])

  const handlePaymentSubmit = async (data: { chain: BlockchainNetwork; stablecoin: StablecoinType; txHash: string }) => {
    await submitPayment(data)
    if (!auth.user) return
    try {
      const querySelf = new URLSearchParams({
        scope: 'self',
        status: 'pending',
        sort: 'submitted_at:desc',
        limit: '1',
      })
      let paymentResponse: unknown
      try {
        paymentResponse = await apiFetch<unknown>(`/api/v1/payments?${querySelf.toString()}`, {
          method: 'GET',
          token: auth.accessToken,
        })
      } catch (err) {
        if (!(err instanceof ApiError) || (err.status !== 400 && err.status !== 404 && err.status !== 422)) {
          throw err
        }
        const queryLegacy = new URLSearchParams({
          user_id: auth.user.id,
          status: 'pending',
          sort: 'submitted_at:desc',
          limit: '1',
        })
        paymentResponse = await apiFetch<unknown>(`/api/v1/payments?${queryLegacy.toString()}`, {
          method: 'GET',
          token: auth.accessToken,
        })
      }

      const payments = extractArrayFromResponse<PaymentSubmission>(paymentResponse, [
        'items',
        'data',
        'results',
        'payments',
      ])
      setPendingPayment(payments[0] ?? null)
    } catch (err) {
      console.error('Payment was submitted but refresh failed:', err)
    }
  }

  const handleLogout = async () => {
    await auth.logout()
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto mb-6 relative z-10"
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
            {auth.user && (
              <p className="text-sm text-terminal-muted">
                Logged in as <span className="text-terminal-cyan">{auth.user.email}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {auth.isAdmin && (
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
        {/* Command Bar */}
        <CommandBar
          onAnalytics={() => navigate('/analytics')}
          onReport={() => navigate('/reports/daily')}
          onUpgrade={() => setShowPaymentModal(true)}
          isActive={isActive}
        />

        {/* Getting Started Checklist */}
        <GettingStartedChecklist
          hasApiKey={hasApiKey}
          hasMcpSetup={false}
          hasFirstQuery={false}
          isActive={isActive}
        />

        {/* Status & Activity Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <SectionHeader number="01" title="STATUS & ACTIVITY" />

          <div className="space-y-4">
            {/* Status Card */}
            {subLoading ? (
              <div className="bg-graphite-900 rounded-xl p-6 animate-pulse border border-graphite-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 bg-graphite-800 rounded w-24" />
                  <div className="h-8 bg-graphite-800 rounded w-16" />
                </div>
                <div className="h-2 bg-graphite-800 rounded w-full" />
              </div>
            ) : (
              <StatusCard
                isActive={isActive}
                daysRemaining={daysRemaining}
                planName={subscription?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                expiresAt={subscription?.end_date || null}
                onUpgrade={() => setShowPaymentModal(true)}
              />
            )}

            {/* Pending Payment Notice */}
            {pendingPayment && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
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

            {/* Renewal Reminder */}
            {subscription && !subLoading && (daysRemaining < 7 || isInGrace) && (
              <RenewalReminder
                daysRemaining={daysRemaining}
                isInGrace={isInGrace}
                onRenew={() => setShowPaymentModal(true)}
              />
            )}

            {/* Activity Stats */}
            <ActivityStats />
          </div>
        </motion.section>

        {/* Payment History section */}
        {payments.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <SectionHeader number="02" title="PAYMENT HISTORY" />
            <PaymentHistory payments={payments} loading={paymentsLoading} />
          </motion.section>
        )}

        {/* API Key section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <SectionHeader number={payments.length > 0 ? "03" : "02"} title="API KEY" />
          <ApiKeySection />
        </motion.section>

        {/* API Integration section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <SectionHeader number={payments.length > 0 ? "04" : "03"} title="API INTEGRATION" />
          <MCPInstructions />
        </motion.section>

        {/* Data sources section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
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
