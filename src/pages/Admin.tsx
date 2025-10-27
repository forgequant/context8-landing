import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePaymentSubmissions } from '../hooks/usePaymentSubmissions'
import { useVerifyPayment } from '../hooks/useVerifyPayment'
import { PaymentSubmissionRow } from '../components/admin/PaymentSubmissionRow'
import { VerificationModal } from '../components/admin/VerificationModal'
import { PaymentSubmission } from '../types/subscription'

export function Admin() {
  const navigate = useNavigate()
  const { user, isAdmin, signOut } = useAuth()
  const { payments, loading, error, refetch } = usePaymentSubmissions()
  const { verifyPayment } = useVerifyPayment()

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

  // Redirect non-admins (additional check - route guard should handle this)
  if (!loading && !isAdmin) {
    navigate('/')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono flex items-center justify-center">
        <p className="text-terminal-cyan">Loading admin panel...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-6 py-8 md:py-12">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-16">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-base">
              <span className="text-terminal-cyan">context8</span>
              <span className="text-terminal-text">&gt;_</span>
              <span className="text-terminal-muted ml-2">admin panel</span>
            </h1>
            {user && (
              <p className="text-sm text-terminal-muted mt-2">
                Logged in as: <span className="text-terminal-cyan">{user.email}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm bg-graphite-900 px-4 py-1.5 rounded hover:bg-graphite-800 transition-colors"
            >
              Dashboard
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
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm text-terminal-muted italic">Pending Payment Verifications</h2>
          <button
            onClick={refetch}
            className="text-sm text-terminal-cyan hover:underline"
          >
            Refresh
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded text-sm text-red-200">
            Error loading payments: {error}
          </div>
        )}

        {/* Payments List */}
        {payments.length === 0 ? (
          <div className="bg-graphite-900 rounded-lg p-8 text-center">
            <p className="text-terminal-muted">No pending payments to verify</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <PaymentSubmissionRow
                key={payment.id}
                payment={payment}
                onVerify={handleVerify}
              />
            ))}
          </div>
        )}

        {/* Info Footer */}
        <p className="text-xs text-terminal-muted mt-8">
          Approving a payment will automatically activate the user's Pro subscription for 30 days.
        </p>
      </div>

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
