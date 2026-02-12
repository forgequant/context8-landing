import { memo } from 'react';
import { SIGNAL_DISPLAY, type SignalType } from '@/lib/signals';

export interface ModulePillProps {
  name: string;
  signal: SignalType;
  conviction: number; // 0-10
  hasConflict?: boolean;
}

function convictionStyle(n: number): { fontSize: number; opacity: number; fontWeight?: number } {
  if (n <= 3) return { fontSize: 12, opacity: 0.5 };
  if (n <= 6) return { fontSize: 14, opacity: 0.75 };
  return { fontSize: 18, opacity: 1, fontWeight: 700 };
}

export const ModulePill = memo(function ModulePill({
  name,
  signal,
  conviction,
  hasConflict = false,
}: ModulePillProps) {
  const display = SIGNAL_DISPLAY[signal];
  const cStyle = convictionStyle(conviction);

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 rounded-md shrink-0
        ${hasConflict ? 'animate-pulse-border' : ''}
      `}
      style={{
        minWidth: 140,
        height: 36,
        backgroundColor: display.color + '1A', // 10% opacity
        borderLeft: `3px solid ${display.color}`,
        boxShadow: hasConflict ? `0 0 8px 0 #C49A3C88` : undefined,
      }}
    >
      <span className="font-mono text-sm" style={{ color: display.color }}>
        {display.icon}
      </span>

      <span className="text-[#E6E8EC] text-xs font-medium truncate">{name}</span>

      <span
        className="font-mono ml-auto"
        style={{
          color: display.color,
          fontSize: cStyle.fontSize,
          opacity: cStyle.opacity,
          fontWeight: cStyle.fontWeight,
        }}
      >
        {conviction}
      </span>
    </div>
  );
});
