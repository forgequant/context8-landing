import { DD_COLORS } from '@/lib/colors';
import { SIGNAL_DISPLAY } from '@/lib/signals';
import type { Conflict, ConflictSeverity } from './conflict-types';

export type { Conflict, ConflictModule, ConflictSeverity } from './conflict-types';

const SEVERITY_COLOR: Record<ConflictSeverity, string> = {
  low: DD_COLORS.conflictLow,
  medium: DD_COLORS.conflictMedium,
  high: DD_COLORS.conflictHigh,
  critical: DD_COLORS.conflictCritical,
};

/** Severity as a 0-3 scale for visual sizing */
const SEVERITY_LEVEL: Record<ConflictSeverity, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

export interface ConflictCardProps {
  conflict: Conflict;
}

/**
 * Enhanced conflict card with visual severity hierarchy.
 *
 * Visual enhancements over the original:
 * - Severity meter: 4 dots (like signal strength) filled up to current severity
 * - Background heat gradient: higher severity = more red/warm tint
 * - Left border scales in width with severity (2px low -> 6px critical)
 * - Conviction tension bar between the two modules showing relative strength
 * - Critical cards get pulsing border + background heartbeat
 */
export function ConflictCard({ conflict }: ConflictCardProps) {
  const { severity, moduleA, moduleB, nature, historicalAnalog } = conflict;
  const color = SEVERITY_COLOR[severity];
  const level = SEVERITY_LEVEL[severity];
  const isCritical = severity === 'critical';
  const isHigh = severity === 'high' || isCritical;
  const displayA = SIGNAL_DISPLAY[moduleA.signal];
  const displayB = SIGNAL_DISPLAY[moduleB.signal];

  // Border width scales with severity
  const borderWidth = 2 + level * 1.5; // 2, 3.5, 5, 6.5

  // Background heat: more severe = warmer tint
  const bgHeat = isCritical
    ? `linear-gradient(135deg, ${color}12 0%, #12141A 60%)`
    : isHigh
      ? `linear-gradient(135deg, ${color}0a 0%, #12141A 50%)`
      : '#12141A';

  // Conviction tension: relative bar between A and B
  const totalConviction = moduleA.conviction + moduleB.conviction;
  const aPct = totalConviction > 0 ? (moduleA.conviction / totalConviction) * 100 : 50;

  return (
    <div
      className="relative rounded-r-lg px-4 py-3 overflow-hidden"
      style={{
        borderLeft: `${borderWidth}px solid ${color}`,
        background: bgHeat,
        ...(isHigh
          ? {
              boxShadow: `0 0 12px ${color}33, 0 0 4px ${color}22`,
              animation: isCritical ? 'conflictPulse 2s ease-in-out infinite' : undefined,
            }
          : {}),
      }}
    >
      {/* Top row: severity pill + severity meter dots */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-block rounded px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wider"
          style={{ backgroundColor: `${color}22`, color }}
        >
          {severity}
        </span>

        {/* Severity meter: 4 dots like signal strength */}
        <div className="flex items-end gap-0.5 ml-1">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="rounded-sm"
              style={{
                width: 4,
                height: 6 + i * 3, // 6, 9, 12, 15 - ascending height
                backgroundColor: i <= level ? color : '#2A2D35',
                opacity: i <= level ? 1 : 0.3,
                boxShadow: i <= level && isHigh ? `0 0 4px ${color}66` : undefined,
              }}
            />
          ))}
        </div>
      </div>

      {/* Opposing modules with conviction tension bar */}
      <div className="flex items-center justify-between gap-3">
        {/* Module A */}
        <div className="flex-1 text-left">
          <div className="font-mono text-xs" style={{ color: '#7B8FA0' }}>
            {moduleA.name}
          </div>
          <div className="mt-1 font-mono text-sm font-semibold" style={{ color: displayA.color }}>
            {displayA.icon} {displayA.label}
          </div>
        </div>

        {/* Center: conviction tension bar + lightning */}
        <div className="flex flex-col items-center gap-1 shrink-0" style={{ width: 80 }}>
          <div
            className="font-mono text-sm"
            style={{ color: DD_COLORS.conviction10 }}
            aria-hidden="true"
          >
            &#x26A1;
          </div>
          {/* Tension bar: A's conviction vs B's conviction */}
          <div className="w-full h-1.5 rounded-full overflow-hidden flex" style={{ backgroundColor: '#1A1C21' }}>
            <div
              className="h-full rounded-l-full"
              style={{
                width: `${aPct}%`,
                backgroundColor: displayA.color,
              }}
            />
            <div
              className="h-full rounded-r-full"
              style={{
                width: `${100 - aPct}%`,
                backgroundColor: displayB.color,
              }}
            />
          </div>
          <div className="flex justify-between w-full">
            <span className="font-mono text-[0.55rem]" style={{ color: displayA.color }}>
              {moduleA.conviction}
            </span>
            <span className="font-mono text-[0.55rem]" style={{ color: displayB.color }}>
              {moduleB.conviction}
            </span>
          </div>
        </div>

        {/* Module B */}
        <div className="flex-1 text-right">
          <div className="font-mono text-xs" style={{ color: '#7B8FA0' }}>
            {moduleB.name}
          </div>
          <div className="mt-1 font-mono text-sm font-semibold" style={{ color: displayB.color }}>
            {displayB.label} {displayB.icon}
          </div>
        </div>
      </div>

      {/* Nature description */}
      <p className="mt-2 text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
        {nature}
      </p>

      {/* Historical analog hint */}
      {historicalAnalog && (
        <div
          className="mt-2 rounded px-2 py-1 font-mono text-xs"
          style={{ backgroundColor: '#1A1C21', color: '#7B8FA0' }}
        >
          Last time: {historicalAnalog}
        </div>
      )}

      {/* Pulse animation for critical severity */}
      {isCritical && (
        <style>{`
          @keyframes conflictPulse {
            0%, 100% { box-shadow: 0 0 12px ${color}33, 0 0 4px ${color}22; }
            50% { box-shadow: 0 0 20px ${color}55, 0 0 8px ${color}44; }
          }
        `}</style>
      )}
    </div>
  );
}
