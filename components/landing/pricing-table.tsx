import { Check, X, Info } from 'lucide-react';
import { CTAButton } from '@/components/landing/cta-button';
import { PricingPlan } from '@/lib/constants/types';
import { cn } from '@/lib/utils';

/**
 * Pricing Table Component
 *
 * Displays a single pricing plan card with:
 * - Plan name and price
 * - Description
 * - Feature list with checkmarks/crosses
 * - CTA button
 * - Optional highlight styling
 *
 * Used in Pricing section (US4)
 */

interface PricingTableProps {
  plan: PricingPlan;
  className?: string;
}

export function PricingTable({ plan, className }: PricingTableProps) {
  return (
    <div
      className={cn(
        'group relative rounded-xl border p-8 transition-all',
        plan.highlight
          ? 'border-teal-500/50 bg-gradient-to-br from-teal-500/10 via-purple-500/10 to-slate-900/50 shadow-2xl shadow-teal-500/20 hover:shadow-teal-500/30 backdrop-blur-sm'
          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50',
        className
      )}
    >
      {/* Popular badge with gradient */}
      {plan.highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-gradient-to-r from-teal-500 to-purple-500 px-5 py-1.5 text-xs font-bold text-white shadow-lg shadow-teal-500/50 animate-pulse-glow">
            Most Popular
          </div>
        </div>
      )}

      {/* Plan name */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
        <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold text-white">
            {plan.price.display}
          </span>
          {plan.price.period && (
            <span className="text-lg text-slate-400">/{plan.price.period}</span>
          )}
        </div>
      </div>

      {/* CTA with enhanced styling for highlighted plan */}
      <div className="mb-8">
        <CTAButton
          {...plan.cta}
          className={cn(
            'w-full',
            plan.highlight &&
              'bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold shadow-lg shadow-teal-500/50 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/60'
          )}
        />
      </div>

      {/* Features list */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          What's included
        </p>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                {feature.included ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10">
                    <Check className="h-3 w-3 text-green-400" />
                  </div>
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800">
                    <X className="h-3 w-3 text-slate-600" />
                  </div>
                )}
              </div>

              {/* Feature text */}
              <div className="flex-1">
                <span
                  className={cn(
                    'text-sm',
                    feature.included ? 'text-slate-300' : 'text-slate-600'
                  )}
                >
                  {feature.text}
                </span>

                {/* Tooltip */}
                {feature.tooltip && (
                  <div className="group/tooltip relative inline-block ml-2">
                    <Info className="inline h-3 w-3 text-slate-500 cursor-help" />
                    <div className="invisible group-hover/tooltip:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs text-slate-300 shadow-lg z-10">
                      {feature.tooltip}
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
