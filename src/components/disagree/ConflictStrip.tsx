import { useMemo } from 'react';
import { DD_COLORS } from '@/lib/colors';
import type { ConflictSeverity } from './conflict-types';

export interface ConflictChip {
  
  symbol: string;
  
  verdictRatio: string;
  
  conviction: number;
  
  severity: ConflictSeverity | null;
}

export interface ConflictStripProps {
  chips: ConflictChip[];
  
  onChipClick?: (symbol: string) => void;
}

const SEVERITY_INTENSITY: Record<ConflictSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const SEVERITY_COLORS: Record<ConflictSeverity, string> = {
  critical: DD_COLORS.conflictCritical,
  high: DD_COLORS.conflictHigh,
  medium: DD_COLORS.conflictMedium,
  low: DD_COLORS.conflictLow,
};


export function ConflictStrip({ chips, onChipClick }: ConflictStripProps) {
  const sorted = useMemo(() => {
    return [...chips].sort((a, b) => {
      const aIntensity = a.severity ? SEVERITY_INTENSITY[a.severity] : 99;
      const bIntensity = b.severity ? SEVERITY_INTENSITY[b.severity] : 99;
      return aIntensity - bIntensity;
    });
  }, [chips]);

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-2"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#2A2D35 transparent' }}
    >
      {sorted.map((chip) => {
        const isHighConflict = chip.severity === 'critical' || chip.severity === 'high';
        const borderColor = chip.severity ? SEVERITY_COLORS[chip.severity] : '#2A2D35';
        const convictionPct = (chip.conviction / 10) * 100;

        return (
          <button
            key={chip.symbol}
            onClick={() => onChipClick?.(chip.symbol)}
            className="shrink-0 rounded-lg p-3 text-left transition-colors hover:bg-white/5"
            style={{
              width: 120,
              height: 80,
              backgroundColor: '#12131A',
              border: `1px solid ${borderColor}`,
              boxShadow: isHighConflict
                ? `0 0 8px ${borderColor}44, 0 0 4px ${borderColor}22`
                : undefined,
            }}
          >
            <div
              className="font-mono text-sm font-semibold leading-none"
              style={{ color: '#E8E9EC' }}
            >
              {chip.symbol}
            </div>

            <div
              className="font-mono text-[10px] mt-1.5"
              style={{ color: '#7B8FA0' }}
            >
              {chip.verdictRatio}
            </div>

            <div
              className="mt-2 rounded-full overflow-hidden"
              style={{ height: 3, backgroundColor: '#1A1C21' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${convictionPct}%`,
                  backgroundColor: DD_COLORS.conviction10,
                  transition: 'width 300ms ease',
                }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
