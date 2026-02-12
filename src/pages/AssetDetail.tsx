import { useParams, Link } from 'react-router-dom';
import { useDailyDisagreeReport } from '@/hooks/useDailyDisagreeReport';
import { ModuleScorecard } from '@/components/disagree/ModuleScorecard';
import { CrowdedTradeCard } from '@/components/disagree/CrowdedTradeCard';
import { DD_COLORS } from '@/lib/colors';

// ── Section header ─────────────────────────────────────────────

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

// ── Quick stat card ────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div
      className="rounded-lg p-3"
      style={{ backgroundColor: '#12131A', border: '1px solid #2A2D35' }}
    >
      <div className="text-[10px] font-mono uppercase" style={{ color: '#7B8FA0' }}>
        {label}
      </div>
      <div
        className="font-mono text-lg font-semibold mt-1"
        style={{ color: color ?? '#E8E9EC' }}
      >
        {value}
      </div>
    </div>
  );
}

// ── Loading / Error ────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-24">
      <div
        className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: '#C49A3C33', borderTopColor: '#C49A3C' }}
      />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-24">
      <p className="font-mono text-sm" style={{ color: '#C94D4D' }}>
        {message}
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

export function AssetDetail() {
  const { date, asset } = useParams<{ date: string; asset: string }>();
  const { report, loading, error } = useDailyDisagreeReport(
    date === 'latest' ? undefined : date,
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!report) return <ErrorState message="No report available" />;

  const symbol = asset?.toUpperCase() ?? '';
  const assetSummary = report.assets.find((a) => a.symbol === symbol);
  const crowdedTrade = report.crowdedTrades.find((ct) => ct.symbol === symbol);

  // Filter modules — show all (in real API, would filter to asset-specific modules)
  const modules = report.modules;

  const changeColor = (assetSummary?.change24h ?? 0) >= 0
    ? DD_COLORS.bullish
    : DD_COLORS.bearish;
  const changeSign = (assetSummary?.change24h ?? 0) >= 0 ? '+' : '';

  return (
    <div className="space-y-6">
      {/* Back link + header */}
      <div>
        <Link
          to={`/dashboard/report/${date ?? 'latest'}`}
          className="font-mono text-xs hover:underline"
          style={{ color: '#C49A3C' }}
        >
          &larr; Back to Report
        </Link>

        <div className="flex items-baseline gap-3 mt-3">
          <h1
            className="font-sans font-extrabold"
            style={{ fontSize: '1.75rem', color: '#E8E9EC' }}
          >
            {symbol}
          </h1>
          <span className="font-mono text-sm" style={{ color: '#7B8FA0' }}>
            {report.headline.reportDate}
          </span>
        </div>
      </div>

      {/* Quick Stats Sidebar + Main content */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6">
        {/* Main content */}
        <div className="space-y-6">
          {/* Price Chart placeholder — will use PriceChart from DASH-8 */}
          <div>
            <SectionHeader label="Price Chart" />
            <div
              className="rounded-lg flex items-center justify-center"
              style={{
                height: 400,
                backgroundColor: '#12131A',
                border: '1px solid #2A2D35',
              }}
            >
              <span className="font-mono text-sm" style={{ color: '#7B8FA0' }}>
                Candlestick chart (pending DASH-8)
              </span>
            </div>
          </div>

          {/* Module Scorecard (all modules, will be asset-filtered via API) */}
          <div>
            <SectionHeader label="Module Scorecard" />
            <ModuleScorecard modules={modules} />
          </div>

          {/* Crowded Trade for this asset */}
          {crowdedTrade && (
            <div>
              <SectionHeader label="Crowded Trade Alert" />
              <CrowdedTradeCard {...crowdedTrade} />
            </div>
          )}
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-3">
          <SectionHeader label="Quick Stats" />
          {assetSummary ? (
            <>
              <StatCard
                label="Price"
                value={`$${assetSummary.price.toLocaleString()}`}
              />
              <StatCard
                label="24h Change"
                value={`${changeSign}${assetSummary.change24h.toFixed(1)}%`}
                color={changeColor}
              />
              <StatCard
                label="Volume"
                value={assetSummary.volume}
              />
              <StatCard
                label="Market Cap"
                value={assetSummary.marketCap}
              />
              <StatCard
                label="Verdict"
                value={`${assetSummary.bullCount} Bull / ${assetSummary.bearCount} Bear`}
              />
              <StatCard
                label="Conviction"
                value={`${assetSummary.conviction}/10`}
                color={DD_COLORS.conviction10}
              />
            </>
          ) : (
            <div className="font-mono text-xs" style={{ color: '#7B8FA0' }}>
              No data for {symbol}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
