import { memo } from 'react';
import { convictionToColor, DD_COLORS } from '@/lib/colors';
import type { SignalType } from '@/lib/signals';

export interface HeatmapCell {
  conviction: number; // 0-10
  signal: SignalType;
}

export interface HeatmapRow {
  moduleName: string;
  /** 7 days of data, index 0 = oldest */
  days: HeatmapCell[];
}

export interface ConvictionHeatmapProps {
  rows: HeatmapRow[];
  dayLabels?: string[];
}

const SIGNAL_COLORS: Record<SignalType, string> = {
  bullish: DD_COLORS.bullish,
  bearish: DD_COLORS.bearish,
  neutral: DD_COLORS.neutral,
};

export const ConvictionHeatmap = memo(function ConvictionHeatmap({
  rows,
  dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}: ConvictionHeatmapProps) {
  return (
    <div className="hidden md:block">
      {/* Header row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '120px repeat(7, 40px)',
          gap: 2,
        }}
      >
        <div />
        {dayLabels.map((label) => (
          <div
            key={label}
            className="text-center text-[10px] font-mono"
            style={{ color: '#7B8FA0', width: 40 }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Data rows */}
      {rows.map((row) => (
        <div
          key={row.moduleName}
          style={{
            display: 'grid',
            gridTemplateColumns: '120px repeat(7, 40px)',
            gap: 2,
            marginTop: 2,
          }}
        >
          <div
            className="text-xs font-medium truncate self-center"
            style={{ color: '#E6E8EC' }}
          >
            {row.moduleName}
          </div>
          {row.days.map((cell, i) => (
            <div
              key={i}
              style={{
                width: 40,
                height: 28,
                backgroundColor: convictionToColor(cell.conviction),
                borderLeft: `3px solid ${SIGNAL_COLORS[cell.signal]}`,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
});
