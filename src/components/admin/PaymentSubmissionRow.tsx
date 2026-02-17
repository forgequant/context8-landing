import { motion } from 'framer-motion'
import { PaymentSubmission } from '../../types/subscription'
import { getExplorerTxUrl, getChainDisplayName } from '../../lib/blockchain'

interface PaymentSubmissionRowProps {
  payment: PaymentSubmission & { user_email: string }
  onVerify: (payment: PaymentSubmission) => void
}

export function PaymentSubmissionRow({ payment, onVerify }: PaymentSubmissionRowProps) {
  const explorerUrl = getExplorerTxUrl(payment.chain, payment.tx_hash)
  const chainName = getChainDisplayName(payment.chain)
  const getChainBadge = (chain: string) => {
    switch(chain) {
      case 'ethereum':
        return { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: '⟠' }
      case 'polygon':
        return { color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: '⬡' }
      case 'bsc':
        return { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: '◈' }
      default:
        return { color: 'bg-terminal-muted/20 text-terminal-muted border-terminal-muted/30', icon: '●' }
    }
  }

  const chainBadge = getChainBadge(payment.chain)

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
      className="bg-graphite-900 rounded-xl p-5 border border-graphite-800 hover:border-terminal-cyan/30 transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-graphite-800 flex items-center justify-center text-terminal-cyan text-sm font-semibold">
              {payment.user_email.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-sm font-medium text-terminal-cyan block">{payment.user_email}</span>
              <span className="text-xs text-terminal-muted">User</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${chainBadge.color}`}>
                <span>{chainBadge.icon}</span>
                <span>{chainName}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-terminal-muted">Amount:</span>
              <span className="font-bold text-terminal-green">${payment.amount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-terminal-muted">TX:</span>
            <code className="text-xs bg-graphite-950 px-2 py-1 rounded font-mono text-terminal-text border border-graphite-800">
              {payment.tx_hash.slice(0, 10)}...{payment.tx_hash.slice(-8)}
            </code>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-terminal-cyan hover:text-terminal-text hover:underline transition-colors flex items-center gap-1"
            >
              <span>View on Explorer</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-terminal-muted">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Submitted: {new Date(payment.submitted_at).toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={() => onVerify(payment)}
          className="px-5 py-2.5 bg-terminal-cyan text-graphite-950 rounded-lg text-sm font-semibold hover:bg-terminal-cyan/90 transition-all hover:shadow-lg hover:shadow-terminal-cyan/20 group-hover:scale-105"
        >
          Verify
        </button>
      </div>
    </motion.div>
  )
}
