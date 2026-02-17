import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaymentSubmission } from '../../types/subscription'
import { getChainDisplayName } from '../../lib/blockchain'

interface VerificationModalProps {
  isOpen: boolean
  payment: PaymentSubmission & { user_email: string } | null
  onClose: () => void
  onApprove: (notes: string) => Promise<void>
  onReject: (notes: string) => Promise<void>
}

export function VerificationModal({
  isOpen,
  payment,
  onClose,
  onApprove,
  onReject
}: VerificationModalProps) {
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  const handleApprove = async () => {
    setError('')
    setIsSubmitting(true)
    try {
      await onApprove(notes)
      setNotes('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve payment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!notes.trim()) {
      setError('Please provide a reason for rejection')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await onReject(notes)
      setNotes('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject payment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setNotes('')
      setError('')
      onClose()
    }
  }

  if (!payment) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-lg bg-graphite-900 rounded-xl border border-graphite-800 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-graphite-900 border-b border-graphite-800 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-terminal-text flex items-center gap-2">
                  <span className="w-2 h-2 bg-terminal-cyan rounded-full" />
                  Verify Payment
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-terminal-muted hover:text-terminal-text transition-colors disabled:opacity-50 p-1 rounded hover:bg-graphite-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-graphite-950 rounded-lg p-4 space-y-3 border border-graphite-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-terminal-muted">User</span>
                    <span className="text-sm text-terminal-cyan font-medium">{payment.user_email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-terminal-muted">Chain</span>
                    <span className="text-sm font-semibold text-terminal-text">{getChainDisplayName(payment.chain)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-terminal-muted">Amount</span>
                    <span className="text-sm font-semibold text-terminal-green">${payment.amount}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-terminal-muted">Transaction Hash</span>
                    <code className="text-xs bg-graphite-900 px-2 py-1.5 rounded font-mono break-all text-terminal-text border border-graphite-800">
                      {payment.tx_hash}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-terminal-muted">Submitted</span>
                    <span className="text-sm text-terminal-text">{new Date(payment.submitted_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-terminal-text">
                    Notes {notes.trim() === '' && <span className="text-terminal-red">(required for rejection)</span>}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add verification notes or rejection reason..."
                    rows={4}
                    className="w-full px-3 py-2 bg-graphite-950 border border-graphite-800 rounded-lg text-terminal-text text-sm placeholder-terminal-muted/50 focus:outline-none focus:ring-2 focus:ring-terminal-cyan/50 focus:border-terminal-cyan/50 resize-none transition-all"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-terminal-red/10 border border-terminal-red/30 rounded-lg text-sm text-terminal-red"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-terminal-red/20 hover:bg-terminal-red/30 border border-terminal-red/30 hover:border-terminal-red/50 disabled:bg-graphite-800 disabled:border-graphite-700 disabled:cursor-not-allowed text-terminal-red disabled:text-terminal-muted font-medium rounded-lg transition-all"
                  >
                    {isSubmitting ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-terminal-green hover:bg-terminal-green/90 disabled:bg-graphite-800 disabled:cursor-not-allowed text-graphite-950 disabled:text-terminal-muted font-semibold rounded-lg transition-all"
                  >
                    {isSubmitting ? 'Processing...' : 'Approve'}
                  </button>
                </div>

                <p className="text-xs text-terminal-muted text-center">
                  Approving will activate the user's Pro subscription immediately
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
