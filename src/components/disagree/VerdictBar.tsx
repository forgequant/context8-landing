import { DD_COLORS } from '@/lib/colors';

export interface VerdictBarProps {
  /** Number of bullish signals (0-12) */
  bullCount: number;
  /** Number of bearish signals (0-12) */
  bearCount: number;
}

/**
 * Tug-of-war bi-directional horizontal bar.
 * Green fills from left (bull), red fills from right (bear).
 * Amber line at the contact point. Even split = glowing center.
 */
export function VerdictBar({ bullCount, bearCount }: VerdictBarProps) {
  const total = bullCount + bearCount;
  const bullPct = total > 0 ? (bullCount / total) * 100 : 50;
  const bearPct = total > 0 ? (bearCount / total) * 100 : 50;
  const isEvenSplit = bullCount === bearCount && total > 0;

  return (
    <div className="flex flex-col gap-1">
      {/* Labels */}
      <div className="flex justify-between font-mono text-xs">
        <span style={{ color: DD_COLORS.bullish }}>
          {bullCount} BULL
        </span>
        <span style={{ color: DD_COLORS.bearish }}>
          BEAR {bearCount}
        </span>
      </div>

      {/* Bar */}
      <div
        className="relative overflow-hidden rounded"
        style={{ width: 200, height: 12, backgroundColor: '#1A1C21' }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${bullPct}%`,
            background: `linear-gradient(to right, ${DD_COLORS.bullish}, ${DD_COLORS.bullish}CC)`,
            transition: 'width 300ms ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: `${bearPct}%`,
            background: `linear-gradient(to left, ${DD_COLORS.bearish}, ${DD_COLORS.bearish}CC)`,
            transition: 'width 300ms ease',
          }}
        />

        {/* Amber contact line */}
        {total > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${bullPct}%`,
              transform: 'translateX(-1px)',
              width: 2,
              height: '100%',
              backgroundColor: DD_COLORS.conviction10,
              ...(isEvenSplit
                ? { boxShadow: `0 0 8px ${DD_COLORS.conviction10}, 0 0 4px ${DD_COLORS.conviction10}88` }
                : {}),
            }}
          />
        )}
      </div>
    </div>
  );
}
