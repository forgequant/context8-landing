import { DD_COLORS } from '@/lib/colors';
import { CrowdedTradeGauge } from './CrowdedTradeGauge';

export interface HistoricalAnalog {
  date: string;
  outcome: string;
}

export interface CrowdedTradeCardProps {
  
  symbol: string;
  
  direction: 'LONGS' | 'SHORTS';
  
  zScore: number;
  
  ratio: number;
  
  modules: string[];
  
  totalModules: number;
  
  analog?: HistoricalAnalog;
}


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

      <div className="flex justify-center mb-3">
        <CrowdedTradeGauge ratio={ratio} />
      </div>

      <div className="text-xs mb-2" style={{ color: '#7B8FA0' }}>
        Contributing:{' '}
        <span style={{ color: '#C0C3CC' }}>
          {modules.join(', ')} ({modules.length}/{totalModules})
        </span>
      </div>

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
