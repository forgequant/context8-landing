import { PaymentSubmission } from '../../types/subscription'
import { getExplorerTxUrl, getChainDisplayName } from '../../lib/blockchain'

interface PaymentSubmissionRowProps {
  payment: PaymentSubmission & { user_email: string }
  onVerify: (payment: PaymentSubmission) => void
}

export function PaymentSubmissionRow({ payment, onVerify }: PaymentSubmissionRowProps) {
  const explorerUrl = getExplorerTxUrl(payment.chain, payment.tx_hash)
  const chainName = getChainDisplayName(payment.chain)

  return (
    <div className="bg-graphite-900 rounded-lg p-4 hover:bg-graphite-800 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {/* User Info */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-terminal-muted">User:</span>
            <span className="text-sm text-terminal-cyan">{payment.user_email}</span>
          </div>

          {/* Chain & Amount */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-terminal-muted">Chain:</span>
              <span className="font-semibold">{chainName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-terminal-muted">Amount:</span>
              <span className="font-semibold">${payment.amount}</span>
            </div>
          </div>

          {/* Transaction Hash */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-terminal-muted">TX:</span>
            <code className="text-xs bg-graphite-950 px-2 py-1 rounded font-mono">
              {payment.tx_hash.slice(0, 10)}...{payment.tx_hash.slice(-8)}
            </code>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-terminal-cyan hover:underline"
            >
              View on Explorer →
            </a>
          </div>

          {/* Submitted At */}
          <div className="text-xs text-terminal-muted">
            Submitted: {new Date(payment.submitted_at).toLocaleString()}
          </div>
        </div>

        {/* Verify Button */}
        <button
          onClick={() => onVerify(payment)}
          className="px-4 py-2 bg-terminal-cyan text-graphite-950 rounded text-sm font-semibold hover:bg-terminal-cyan/90 transition-colors"
        >
          Verify
        </button>
      </div>
    </div>
  )
}
