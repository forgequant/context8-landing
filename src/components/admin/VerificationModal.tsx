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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-gray-900 rounded-xl border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Verify Payment</h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Payment Details */}
                <div className="bg-graphite-950 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">User</span>
                    <span className="text-sm text-terminal-cyan">{payment.user_email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Chain</span>
                    <span className="text-sm font-semibold">{getChainDisplayName(payment.chain)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Amount</span>
                    <span className="text-sm font-semibold">${payment.amount}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-400">Transaction Hash</span>
                    <code className="text-xs bg-gray-800 px-2 py-1 rounded font-mono break-all">
                      {payment.tx_hash}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Submitted</span>
                    <span className="text-sm">{new Date(payment.submitted_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Notes Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Notes {notes.trim() === '' && <span className="text-red-400">(required for rejection)</span>}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add verification notes or rejection reason..."
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-red-900/20 border border-red-700 rounded text-sm text-red-200">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {isSubmitting ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {isSubmitting ? 'Processing...' : 'Approve'}
                  </button>
                </div>

                {/* Info Text */}
                <p className="text-xs text-gray-400 text-center">
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
