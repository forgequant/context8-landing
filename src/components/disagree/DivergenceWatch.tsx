import { DD_COLORS } from '@/lib/colors';

export interface DivergenceItem {
  /** Divergence type e.g. "Sentiment vs Price" */
  type: string;
  /** Asset symbol */
  asset: string;
  /** Strength 1-3 */
  strength: 1 | 2 | 3;
  /** Brief description */
  description: string;
}

export interface DivergenceWatchProps {
  items: DivergenceItem[];
}

function StrengthBars({ strength }: { strength: number }) {
  return (
    <div className="flex items-end gap-0.5">
      {[1, 2, 3].map((level) => (
        <div
          key={level}
          style={{
            width: 3,
            height: 4 + level * 3,
            borderRadius: 1,
            backgroundColor:
              level <= strength ? DD_COLORS.dangerCaution : '#2A2D35',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Compact vertical list of divergence items.
 * Each row shows type, asset, strength bars, and description.
 */
export function DivergenceWatch({ items }: DivergenceWatchProps) {
  if (items.length === 0) {
    return (
      <div className="text-xs" style={{ color: '#7B8FA0' }}>
        No active divergences
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded px-3 py-2"
          style={{ backgroundColor: '#12131A', border: '1px solid #2A2D35' }}
        >
          {/* Strength indicator */}
          <StrengthBars strength={item.strength} />

          {/* Asset */}
          <span
            className="font-mono text-xs font-semibold"
            style={{ color: '#E8E9EC', minWidth: 48 }}
          >
            {item.asset}
          </span>

          {/* Type */}
          <span
            className="text-xs font-medium"
            style={{ color: DD_COLORS.dangerCaution, minWidth: 120 }}
          >
            {item.type}
          </span>

          {/* Description */}
          <span className="text-xs" style={{ color: '#7B8FA0' }}>
            {item.description}
          </span>
        </div>
      ))}
    </div>
  );
}
