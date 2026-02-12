import { DD_COLORS } from '@/lib/colors';

export interface ConvictionScoreProps {
  /** Conviction value 0-10 */
  value: number;
}

const SEGMENT_COUNT = 10;
const SEGMENT_WIDTH = 8;
const SEGMENT_HEIGHT = 4;
const SEGMENT_GAP = 2;

/**
 * Conviction numeral + 10-segment horizontal bar.
 * Inverted color logic: low conviction = amber (interesting), high = muted.
 */
export function ConvictionScore({ value }: ConvictionScoreProps) {
  const clamped = Math.max(0, Math.min(10, Math.round(value)));

  return (
    <div className="flex items-center gap-3">
      <span
        className="font-mono font-semibold leading-none"
        style={{ fontSize: '2rem', color: DD_COLORS.conviction10 }}
      >
        {clamped}
      </span>
      <div className="flex items-center" style={{ gap: SEGMENT_GAP }}>
        {Array.from({ length: SEGMENT_COUNT }, (_, i) => (
          <div
            key={i}
            style={{
              width: SEGMENT_WIDTH,
              height: SEGMENT_HEIGHT,
              borderRadius: 1,
              backgroundColor: segmentColor(i, clamped),
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Inverted color: 0-3 amber (highlighted), 4-6 muted, 7-10 very muted */
function segmentColor(index: number, conviction: number): string {
  const isActive = index < conviction;
  if (!isActive) return '#1A1C21';

  if (index < 3) return DD_COLORS.conviction10;   // amber — highlighted
  if (index < 6) return '#7B8FA0';                 // text-secondary — muted
  return '#4A4E5A';                                // text-muted — very muted
}
