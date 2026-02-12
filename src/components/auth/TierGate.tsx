import { useAuth } from '../../hooks/useAuth'
import type { SubscriptionTier } from '../../lib/auth'

interface TierGateProps {
  children: React.ReactNode
  requiredTier: SubscriptionTier
  featureName: string
}

export function TierGate({ children, requiredTier, featureName }: TierGateProps) {
  const { hasTier, isAuthenticated } = useAuth()

  if (isAuthenticated && hasTier(requiredTier)) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-graphite-900/90 border border-terminal-cyan/30 rounded-lg p-6 text-center max-w-sm">
          <p className="text-terminal-text font-mono text-sm mb-2">
            {featureName} requires <span className="text-terminal-cyan font-bold">{requiredTier}</span> tier
          </p>
          <button
            type="button"
            className="mt-3 px-4 py-2 bg-terminal-cyan/20 border border-terminal-cyan/50 rounded text-terminal-cyan font-mono text-sm hover:bg-terminal-cyan/30 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  )
}
