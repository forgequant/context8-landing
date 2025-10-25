import Image from 'next/image';
import { DataSource } from '@/lib/constants/types';
import { cn } from '@/lib/utils';

/**
 * Data Source Badge Component
 *
 * Displays a data source card with:
 * - Logo
 * - Name and category
 * - Update frequency
 * - Metrics provided
 * - Reliability uptime
 *
 * Used in Data Sources section (US2)
 */

interface DataSourceBadgeProps {
  source: DataSource;
  className?: string;
}

export function DataSourceBadge({ source, className }: DataSourceBadgeProps) {
  // Category badge colors
  const categoryColors: Record<
    DataSource['category'],
    { bg: string; text: string }
  > = {
    price: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    news: { bg: 'bg-green-500/10', text: 'text-green-400' },
    onchain: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    sentiment: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  };

  const categoryColor = categoryColors[source.category];

  return (
    <div
      className={cn(
        'group rounded-lg border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-purple-700/50 hover:bg-slate-900',
        className
      )}
    >
      {/* Logo */}
      <div className="mb-4 flex items-center justify-between">
        <div className="relative h-12 w-12">
          <Image
            src={source.logo.src}
            alt={source.logo.alt}
            fill
            className="object-contain"
          />
        </div>
        {/* Category badge */}
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            categoryColor.bg,
            categoryColor.text
          )}
        >
          {source.category}
        </span>
      </div>

      {/* Name */}
      <h3 className="mb-2 text-lg font-semibold text-white">{source.name}</h3>

      {/* Update frequency */}
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
        <svg
          className="h-4 w-4 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{source.updateFrequency}</span>
      </div>

      {/* Metrics */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Metrics
        </p>
        <ul className="space-y-1">
          {source.metrics.map((metric, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {metric}
            </li>
          ))}
        </ul>
      </div>

      {/* Reliability */}
      <div className="border-t border-slate-800 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Reliability</span>
          <span className="text-sm font-semibold text-green-400">
            {source.reliability.label}
          </span>
        </div>
      </div>
    </div>
  );
}
