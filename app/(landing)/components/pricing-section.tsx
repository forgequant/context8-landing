import { SectionContainer } from '@/components/landing/section-container';
import { PricingTable } from '@/components/landing/pricing-table';
import { pricingContent } from '@/lib/constants/pricing-content';

/**
 * Pricing Section
 *
 * Shows Free vs Pro plan comparison (US4)
 * Helps visitors make informed decision about which plan to choose
 *
 * Features:
 * - Two-column layout (Free vs Pro)
 * - Feature comparison with checkmarks
 * - Highlighted Pro plan (most popular)
 * - Money-back guarantee note
 */
export function PricingSection() {
  return (
    <SectionContainer id="pricing" className="bg-slate-900/50">
      <div className="mx-auto max-w-6xl">
        {/* Section title */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-purple-400">
            {pricingContent.sectionTitle}
          </p>

          {/* Headline */}
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {pricingContent.headline}
          </h2>

          {/* Description */}
          {pricingContent.description && (
            <p className="mx-auto max-w-3xl text-lg text-slate-400">
              {pricingContent.description}
            </p>
          )}
        </div>

        {/* Pricing cards */}
        <div className="grid gap-8 lg:grid-cols-2">
          {pricingContent.plans.map((plan) => (
            <PricingTable key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Comparison note */}
        {pricingContent.comparisonNote && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-6 py-3">
              <svg
                className="h-5 w-5 flex-shrink-0 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <p className="text-sm text-slate-300">
                {pricingContent.comparisonNote}
              </p>
            </div>
          </div>
        )}

        {/* FAQ note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Questions about pricing?{' '}
            <a
              href="/docs/pricing-faq"
              className="text-purple-400 hover:text-purple-300"
            >
              View pricing FAQ
            </a>
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
