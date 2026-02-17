interface RenewalReminderProps {
  daysRemaining: number
  isInGrace: boolean
  onRenew: () => void
}

export function RenewalReminder({ daysRemaining, isInGrace, onRenew }: RenewalReminderProps) {
  if (daysRemaining >= 7 && !isInGrace) {
    return null
  }

  const isUrgent = daysRemaining <= 3 || isInGrace

  return (
    <div
      className={`rounded-lg p-4 border ${
        isUrgent
          ? 'bg-red-900/20 border-red-700'
          : 'bg-yellow-900/20 border-yellow-700'
      }`}
    >
      <div className="flex items-start gap-3">
        <svg
          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            isUrgent ? 'text-red-400' : 'text-yellow-400'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <p className={`font-medium text-sm ${isUrgent ? 'text-red-200' : 'text-yellow-200'}`}>
            {isInGrace
              ? '⚠️ Subscription Expired - Grace Period Active'
              : daysRemaining === 0
              ? '⚠️ Subscription Expires Today'
              : `⚠️ Subscription Expiring Soon - ${daysRemaining} ${
                  daysRemaining === 1 ? 'day' : 'days'
                } remaining`}
          </p>
          <p className={`text-xs mt-1 ${isUrgent ? 'text-red-300' : 'text-yellow-300'}`}>
            {isInGrace
              ? 'Your subscription has expired. You have 48 hours to renew before losing Pro access.'
              : 'Renew your subscription to maintain uninterrupted Pro access.'}
          </p>
          <button
            onClick={onRenew}
            className={`mt-3 px-4 py-2 rounded text-sm font-semibold transition-colors ${
              isUrgent
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
          >
            Renew Now
          </button>
        </div>
      </div>
    </div>
  )
}
