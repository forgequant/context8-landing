import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { usePaymentSubmissions } from '../hooks/usePaymentSubmissions'
import { useVerifyPayment } from '../hooks/useVerifyPayment'
import { PaymentSubmissionRow } from '../components/admin/PaymentSubmissionRow'
import { VerificationModal } from '../components/admin/VerificationModal'
import { PaymentSubmission } from '../types/subscription'

// Skeleton loader component
function SkeletonCard() {
  return (
    <div className="bg-graphite-900 rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-graphite-800 rounded w-1/3" />
          <div className="flex gap-4">
            <div className="h-4 bg-graphite-800 rounded w-24" />
            <div className="h-4 bg-graphite-800 rounded w-20" />
          </div>
          <div className="h-3 bg-graphite-800 rounded w-2/3" />
        </div>
        <div className="h-8 w-20 bg-graphite-800 rounded" />
      </div>
    </div>
  )
}

export function Admin() {
  const navigate = useNavigate()
  const { user, isAdmin, signOut } = useAuth()
  const { payments, loading, error, refetch } = usePaymentSubmissions()
  const { verifyPayment } = useVerifyPayment()

  const headerRef = useRef(null)
  const contentRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  const isContentInView = useInView(contentRef, { once: true })

  const [selectedPayment, setSelectedPayment] = useState<
    (PaymentSubmission & { user_email: string }) | null
  >(null)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const handleVerify = (payment: PaymentSubmission & { user_email: string }) => {
    setSelectedPayment(payment)
  }

  const handleApprove = async (notes: string) => {
    if (!selectedPayment) return
    await verifyPayment(selectedPayment.id, 'verified', notes)
    await refetch()
  }

  const handleReject = async (notes: string) => {
    if (!selectedPayment) return
    await verifyPayment(selectedPayment.id, 'rejected', notes)
    await refetch()
  }

  // Redirect non-admins
  if (!loading && !isAdmin) {
    navigate('/')
    return null
  }

  const pendingCount = payments.length
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

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
        className="max-w-6xl mx-auto mb-12 relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl">
                <span className="text-terminal-cyan font-semibold">context8</span>
                <span className="text-terminal-muted">&gt;_</span>
              </h1>
              <span className="px-3 py-1 bg-graphite-900 border border-graphite-800 rounded text-xs text-terminal-muted">
                Admin Panel
              </span>
            </div>
            {user && (
              <p className="text-sm text-terminal-muted">
                Logged in as <span className="text-terminal-cyan">{user.email}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm bg-graphite-900 border border-graphite-800 px-4 py-2 rounded-lg hover:border-terminal-cyan/30 hover:bg-graphite-800 transition-all"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-terminal-muted hover:text-terminal-red transition-colors px-4 py-2"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHeaderInView ? 1 : 0, y: isHeaderInView ? 0 : 10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-4 mt-6 p-4 bg-graphite-900 rounded-xl border border-graphite-800"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-sm text-terminal-muted">Pending:</span>
            <span className="text-sm font-semibold text-yellow-400">{pendingCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-terminal-cyan" />
            <span className="text-sm text-terminal-muted">Date:</span>
            <span className="text-sm font-semibold text-terminal-cyan">{today}</span>
          </div>
        </motion.div>
      </motion.header>

      {/* Main content */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isContentInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm text-terminal-cyan flex items-center gap-2">
            <span className="text-terminal-muted">01</span>
            PAYMENT VERIFICATION
          </h2>
          <button
            onClick={refetch}
            className="text-sm text-terminal-cyan hover:text-terminal-text transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-terminal-red/10 border border-terminal-red/30 rounded-lg text-sm text-terminal-red"
          >
            Error loading payments: {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : payments.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-graphite-900 rounded-xl border border-graphite-800 p-12 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-graphite-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-terminal-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-terminal-text mb-2">All caught up!</h3>
            <p className="text-terminal-muted text-sm">No pending payments to verify</p>
          </motion.div>
        ) : (
          /* Payments List */
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="space-y-3"
          >
            {payments.map((payment, index) => (
              <motion.div
                key={payment.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.3 }}
              >
                <PaymentSubmissionRow
                  payment={payment}
                  onVerify={handleVerify}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Info Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isContentInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xs text-terminal-muted mt-8 p-4 bg-graphite-900/50 rounded-lg border border-graphite-800"
        >
          <span className="text-terminal-cyan">Tip:</span> Approving a payment will automatically activate the user's Pro subscription for 30 days.
        </motion.p>
      </motion.div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={selectedPayment !== null}
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}
