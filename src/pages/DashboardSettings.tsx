import { useMemo, useState } from 'react'
import { ApiKeySection } from '@/components/dashboard/ApiKeySection'
import { MCPInstructions } from '@/components/dashboard/MCPInstructions'
import { PaymentModal } from '@/components/payment/PaymentModal'
import { PaymentHistory } from '@/components/subscription/PaymentHistory'
import { RenewalReminder } from '@/components/subscription/RenewalReminder'
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus'
import { useAuth } from '@/hooks/useAuth'
import { usePaymentHistory } from '@/hooks/usePaymentHistory'
import { usePaymentSubmit } from '@/hooks/usePaymentSubmit'
import { useSubscription } from '@/hooks/useSubscription'

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1 bg-graphite-800" />
      <h2 className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-terminal-muted">
        {label}
      </h2>
      <div className="h-px flex-1 bg-graphite-800" />
    </div>
  )
}

export function DashboardSettings() {
  const { user, subscriptionTier } = useAuth()
  const { subscription, loading: subLoading, isActive, isInGrace, daysRemaining, refetch: refetchSub } = useSubscription()
  const { payments, loading: paymentsLoading, refetch: refetchPayments } = usePaymentHistory()
  const { submitPayment } = usePaymentSubmit()
  const [paymentOpen, setPaymentOpen] = useState(false)

  const tierLabel = useMemo(() => {
    if (subscriptionTier === 'enterprise') return 'Enterprise'
    if (subscriptionTier === 'pro') return 'Pro'
    return 'Free'
  }, [subscriptionTier])

  const onRenew = () => setPaymentOpen(true)

  const onSubmitPayment = async (data: { chain: 'ethereum' | 'polygon' | 'bsc'; stablecoin: 'usdc' | 'usdt'; txHash: string }) => {
    await submitPayment(data)
    await Promise.all([refetchSub(), refetchPayments()])
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-terminal-text">
          Settings
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {user?.email ? (
            <span className="text-terminal-muted font-mono">{user.email}</span>
          ) : null}
          <span className="px-2.5 py-1 rounded-full border border-graphite-800 bg-graphite-900 text-terminal-cyan text-xs font-mono font-semibold">
            {tierLabel}
          </span>
        </div>
      </header>

      <SectionTitle label="Billing" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <SubscriptionStatus
            subscription={subscription}
            loading={subLoading}
            daysRemaining={daysRemaining}
            isInGrace={isInGrace}
          />
          <RenewalReminder
            daysRemaining={daysRemaining}
            isInGrace={isInGrace}
            onRenew={onRenew}
          />

          {!isActive ? (
            <div className="bg-graphite-900 rounded-lg p-6 border border-graphite-800">
              <p className="text-sm text-terminal-muted mb-4">
                Upgrade to unlock higher API limits and full access.
              </p>
              <button
                type="button"
                onClick={() => setPaymentOpen(true)}
                className="px-4 py-2 bg-terminal-cyan text-graphite-950 rounded-lg text-sm font-semibold hover:bg-terminal-cyan/90 transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>
          ) : null}
        </div>

        <PaymentHistory payments={payments} loading={paymentsLoading} />
      </div>

      <SectionTitle label="Developer" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ApiKeySection />
        <MCPInstructions />
      </div>

      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSubmit={onSubmitPayment}
      />
    </div>
  )
}
