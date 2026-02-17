import { PaymentSubmission } from '../../types/subscription'
import { getExplorerTxUrl, getChainDisplayName } from '../../lib/blockchain'
import { format } from 'date-fns'

interface PaymentHistoryProps {
  payments: PaymentSubmission[]
  loading: boolean
}

export function PaymentHistory({ payments, loading }: PaymentHistoryProps) {
  if (loading) {
    return (
      <div className="bg-graphite-900 rounded-lg p-6">
        <p className="text-sm text-terminal-muted">Loading payment history...</p>
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="bg-graphite-900 rounded-lg p-6 text-center">
        <p className="text-sm text-terminal-muted">No payment history</p>
      </div>
    )
  }

  return (
    <div className="bg-graphite-900 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-graphite-950">
            <tr>
              <th className="text-left px-4 py-3 text-terminal-muted font-semibold">Date</th>
              <th className="text-left px-4 py-3 text-terminal-muted font-semibold">Chain</th>
              <th className="text-left px-4 py-3 text-terminal-muted font-semibold">Amount</th>
              <th className="text-left px-4 py-3 text-terminal-muted font-semibold">Status</th>
              <th className="text-left px-4 py-3 text-terminal-muted font-semibold">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const submittedDate = format(new Date(payment.submitted_at), 'MMM d, yyyy')
              const explorerUrl = getExplorerTxUrl(payment.chain, payment.tx_hash)
              const chainName = getChainDisplayName(payment.chain)

              const statusColor =
                payment.status === 'verified'
                  ? 'text-green-400'
                  : payment.status === 'rejected'
                  ? 'text-red-400'
                  : 'text-yellow-400'

              return (
                <tr key={payment.id} className="border-t border-graphite-800 hover:bg-graphite-800/50">
                  <td className="px-4 py-3">{submittedDate}</td>
                  <td className="px-4 py-3">{chainName}</td>
                  <td className="px-4 py-3 font-semibold">${payment.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`${statusColor} capitalize`}>{payment.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terminal-cyan hover:underline text-xs"
                    >
                      {payment.tx_hash.slice(0, 8)}...{payment.tx_hash.slice(-6)}
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {payments.some((p) => p.status === 'rejected' && p.verification_notes) && (
        <div className="border-t border-graphite-800 p-4">
          <p className="text-xs text-terminal-muted mb-2">Verification Notes:</p>
          {payments
            .filter((p) => p.status === 'rejected' && p.verification_notes)
            .map((payment) => (
              <div key={payment.id} className="text-xs mb-2">
                <span className="text-terminal-muted">
                  {format(new Date(payment.submitted_at), 'MMM d, yyyy')}:
                </span>{' '}
                <span className="text-red-300">{payment.verification_notes}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
