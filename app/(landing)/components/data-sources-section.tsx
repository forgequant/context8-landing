'use client';

import { SectionContainer } from '@/components/landing/section-container';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { DataSourceBadge } from '@/components/landing/data-source-badge';
import { dataSourcesContent } from '@/lib/constants/data-sources';

/**
 * Data Sources Section
 *
 * Showcases the 4 data sources that power Context8 (FR-002):
 * - Binance (price data)
 * - CoinGecko (market data)
 * - On-chain metrics
 * - Social sentiment
 *
 * Each source displays update frequency, metrics, and reliability.
 */
export function DataSourcesSection() {
  return (
    <SectionContainer id="data-sources">
      <div className="mx-auto max-w-6xl">
        {/* Section title */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-purple-400">
            {dataSourcesContent.sectionTitle}
          </p>

          {/* Headline */}
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {dataSourcesContent.headline}
          </h2>

          {/* Description */}
          {dataSourcesContent.description && (
            <p className="mx-auto max-w-3xl text-lg text-slate-400">
              {dataSourcesContent.description}
            </p>
          )}
        </div>

        {/* Data sources grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {dataSourcesContent.sources.map((source) => (
            <DataSourceBadge key={source.id} source={source} />
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            All data sources are monitored 24/7 for reliability and accuracy
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
