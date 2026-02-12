import { useParams, useNavigate } from 'react-router-dom';
import { useDailyDisagreeReport } from '@/hooks/useDailyDisagreeReport';
import type { DisagreeAssetSummary } from '@/hooks/useDailyDisagreeReport';
import { HeadlineBanner } from '@/components/disagree/HeadlineBanner';
import { ConflictStrip } from '@/components/disagree/ConflictStrip';
import type { ConflictChip } from '@/components/disagree/ConflictStrip';
import { ModuleScorecard } from '@/components/disagree/ModuleScorecard';
import { ConflictList } from '@/components/disagree/ConflictList';
import { CrowdedTradeCard } from '@/components/disagree/CrowdedTradeCard';
import { DivergenceWatch } from '@/components/disagree/DivergenceWatch';
import { PriceTicker } from '@/components/disagree/PriceTicker';
import { PriceChart } from '@/components/disagree/PriceChart';
import { ConvictionHeatmap } from '@/components/disagree/ConvictionHeatmap';
import { WSStatusBanner } from '@/components/disagree/WSStatusBanner';

// ── Section header helper ──────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <h2
      className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.06em] mb-3"
      style={{ color: '#7B8FA0' }}
    >
      {label}
    </h2>
  );
}

// ── Loading state ──────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <div
          className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: '#C49A3C33', borderTopColor: '#C49A3C' }}
        />
        <span className="font-mono text-sm" style={{ color: '#7B8FA0' }}>
          Loading report...
        </span>
      </div>
    </div>
  );
}

// ── Error state ────────────────────────────────────────────────

function ErrorState({ error }: { error: string }) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <p className="font-mono text-sm" style={{ color: '#C94D4D' }}>
          {error}
        </p>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────

function buildConflictChips(assets: DisagreeAssetSummary[]): ConflictChip[] {
  return assets.map((a) => ({
    symbol: a.symbol,
    verdictRatio: `${a.bullCount}-${a.bearCount} ${a.bullCount > a.bearCount ? 'BULL' : a.bearCount > a.bullCount ? 'BEAR' : 'EVEN'}`,
    conviction: a.conviction,
    severity: a.topConflictSeverity,
  }));
}

// ── Main Component ─────────────────────────────────────────────

export function DailyReportView() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { report, loading, error } = useDailyDisagreeReport(
    date === 'latest' ? undefined : date,
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!report) return <ErrorState error="No report available" />;

  const conflictChips = buildConflictChips(report.assets);

  const handleChipClick = (symbol: string) => {
    navigate(`/dashboard/report/${report.date}/${symbol}`);
  };

  return (
    <div className="space-y-6">
      {/* Price Ticker (fixed at top, rendered by Dashboard layout) */}
      <PriceTicker />

      {/* Headline Banner */}
      <HeadlineBanner {...report.headline} />

      {/* Conflict Strip */}
      <div>
        <SectionHeader label="Asset Conflicts" />
        <ConflictStrip chips={conflictChips} onChipClick={handleChipClick} />
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6">
        {/* Left Column (60%) */}
        <div className="space-y-6">
          {/* Module Scorecard */}
          <div>
            <SectionHeader label="Module Scorecard" />
            <ModuleScorecard modules={report.modules} />
          </div>

          {/* Conflict Cards */}
          <div>
            <SectionHeader label="Conflicts" />
            <ConflictList conflicts={report.conflicts} />
          </div>
        </div>

        {/* Right Column (40%) */}
        <div className="space-y-6">
          {/* Crowded Trade Alerts */}
          <div>
            <SectionHeader label="Crowded Trades" />
            <div className="flex flex-col gap-3">
              {report.crowdedTrades.map((ct) => (
                <CrowdedTradeCard key={ct.symbol} {...ct} />
              ))}
            </div>
          </div>

          {/* Divergence Watch */}
          <div>
            <SectionHeader label="Divergence Watch" />
            <DivergenceWatch items={report.divergences} />
          </div>
        </div>
      </div>

      {/* Full-width sections below the 2-column layout */}
      <div>
        <SectionHeader label="Price Chart" />
        <PriceChart data={report.priceData} />
      </div>

      <div>
        <SectionHeader label="Conviction Heatmap" />
        <ConvictionHeatmap rows={report.heatmapRows} />
      </div>

      {/* WS Status Banner (shows only when data stale) */}
      <WSStatusBanner />
    </div>
  );
}
