import { DD_COLORS } from '@/lib/colors';
import { CrowdedTradeGauge } from './CrowdedTradeGauge';

export interface HistoricalAnalog {
  date: string;
  outcome: string;
}

export interface CrowdedTradeCardProps {
  /** Asset symbol e.g. "DOGE" */
  symbol: string;
  /** "LONGS" or "SHORTS" */
  direction: 'LONGS' | 'SHORTS';
  /** Z-score value */
  zScore: number;
  /** Agreement ratio 0-1.0 for gauge */
  ratio: number;
  /** Contributing module names */
  modules: string[];
  /** Total available modules */
  totalModules: number;
  /** Historical analog reference */
  analog?: HistoricalAnalog;
}

/**
 * Crowded trade alert card with gauge, z-score, and historical analog.
 * Severity visuals: z>2.5 pulsing amber border, z>3.0 bear-dim background.
 */
export function CrowdedTradeCard({
  symbol,
  direction,
  zScore,
  ratio,
  modules,
  totalModules,
  analog,
}: CrowdedTradeCardProps) {
  const directionColor =
    direction === 'LONGS' ? DD_COLORS.bullish : DD_COLORS.bearish;

  const borderStyle =
    zScore > 2.5
      ? {
          border: `1px solid ${DD_COLORS.dangerCaution}`,
          animation: zScore > 2.5 ? 'pulse-border 2s ease-in-out infinite' : undefined,
        }
      : { border: '1px solid #2A2D35' };

  const bgColor = zScore > 3.0 ? '#1A0F0F' : '#12131A';

  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: bgColor,
        ...borderStyle,
      }}
    >
      {/* Header: symbol + direction */}
      <div className="flex items-baseline justify-between mb-3">
        <span
          className="font-mono leading-none"
          style={{ fontWeight: 600, fontSize: '1.25rem', color: '#E8E9EC' }}
        >
          {symbol}
        </span>
        <span
          className="font-mono text-xs font-semibold tracking-wider"
          style={{ color: directionColor }}
        >
          Crowded {direction}
        </span>
      </div>

      {/* Z-score */}
      <div className="mb-2">
        <span className="text-xs" style={{ color: '#7B8FA0' }}>
          z-score:{' '}
        </span>
        <span
          className="font-mono font-semibold"
          style={{ color: zScore > 3.0 ? DD_COLORS.dangerExtreme : DD_COLORS.dangerCaution }}
        >
          {zScore.toFixed(1)}
        </span>
      </div>

      {/* Gauge */}
      <div className="flex justify-center mb-3">
        <CrowdedTradeGauge ratio={ratio} />
      </div>

      {/* Contributing modules */}
      <div className="text-xs mb-2" style={{ color: '#7B8FA0' }}>
        Contributing:{' '}
        <span style={{ color: '#C0C3CC' }}>
          {modules.join(', ')} ({modules.length}/{totalModules})
        </span>
      </div>

      {/* Historical analog */}
      {analog && (
        <div
          className="text-xs rounded px-2 py-1 mt-2"
          style={{ backgroundColor: '#1A1C21', color: '#7B8FA0' }}
        >
          Last Time:{' '}
          <span style={{ color: DD_COLORS.dangerCaution }}>{analog.date}</span>
          : {analog.outcome}
        </div>
      )}

      {/* Pulse animation (inline keyframes) */}
      {zScore > 2.5 && (
        <style>{`
          @keyframes pulse-border {
            0%, 100% { box-shadow: 0 0 0 0 ${DD_COLORS.dangerCaution}33; }
            50% { box-shadow: 0 0 8px 2px ${DD_COLORS.dangerCaution}66; }
          }
        `}</style>
      )}
    </div>
  );
}
