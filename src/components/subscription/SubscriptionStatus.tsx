import { Subscription } from '../../types/subscription'
import { format } from 'date-fns'

interface SubscriptionStatusProps {
  subscription: Subscription | null
  loading: boolean
  daysRemaining: number
  isInGrace: boolean
}

export function SubscriptionStatus({
  subscription,
  loading,
  daysRemaining,
  isInGrace
}: SubscriptionStatusProps) {
  if (loading) {
    return (
      <div className="bg-graphite-900 rounded-lg p-6">
        <p className="text-sm text-terminal-muted">Loading subscription...</p>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="bg-graphite-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm mb-1">
              Current plan: <span className="font-semibold">Free</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const startDate = format(new Date(subscription.start_date), 'MMM d, yyyy')
  const endDate = format(new Date(subscription.end_date), 'MMM d, yyyy')

  return (
    <div className="bg-graphite-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm mb-1">
            Current plan:{' '}
            <span className="font-semibold text-terminal-cyan">
              {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
            </span>
          </p>
          {isInGrace && (
            <p className="text-xs text-yellow-400 mt-1">Grace period active (48h)</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-terminal-cyan">{daysRemaining}</p>
          <p className="text-xs text-terminal-muted">days remaining</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-terminal-muted mb-1">Start Date</p>
          <p className="font-semibold">{startDate}</p>
        </div>
        <div>
          <p className="text-terminal-muted mb-1">End Date</p>
          <p className="font-semibold">{endDate}</p>
        </div>
      </div>
    </div>
  )
}
