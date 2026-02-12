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

export interface ConflictCardProps {
  conflict: Conflict;
}

export function ConflictCard({ conflict }: ConflictCardProps) {
  const { severity, moduleA, moduleB, nature, historicalAnalog } = conflict;
  const color = SEVERITY_COLOR[severity];
  const isCritical = severity === 'critical';
  const isHigh = severity === 'high' || isCritical;
  const displayA = SIGNAL_DISPLAY[moduleA.signal];
  const displayB = SIGNAL_DISPLAY[moduleB.signal];

  return (
    <div
      className="relative rounded-r-lg px-4 py-3"
      style={{
        borderLeft: `4px solid ${color}`,
        backgroundColor: '#12141A',
        ...(isHigh
          ? {
              boxShadow: `0 0 12px ${color}33, 0 0 4px ${color}22`,
              animation: isCritical ? 'conflictPulse 2s ease-in-out infinite' : undefined,
            }
          : {}),
      }}
    >
      {/* Severity pill */}
      <span
        className="mb-2 inline-block rounded px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wider"
        style={{ backgroundColor: `${color}22`, color }}
      >
        {severity}
      </span>

      {/* Opposing modules */}
      <div className="flex items-center justify-between gap-3">
        {/* Module A */}
        <div className="flex-1 text-left">
          <div className="font-mono text-xs" style={{ color: '#7B8FA0' }}>
            {moduleA.name}
          </div>
          <div className="mt-1 font-mono text-sm font-semibold" style={{ color: displayA.color }}>
            {displayA.icon} {displayA.label}{' '}
            <span style={{ color: '#7B8FA0' }}>(conf: {moduleA.conviction})</span>
          </div>
        </div>

        {/* Lightning bolt separator */}
        <div
          className="flex-shrink-0 font-mono text-lg"
          style={{ color: DD_COLORS.conviction10 }}
          aria-hidden="true"
        >
          &#x26A1;
        </div>

        {/* Module B */}
        <div className="flex-1 text-right">
          <div className="font-mono text-xs" style={{ color: '#7B8FA0' }}>
            {moduleB.name}
          </div>
          <div className="mt-1 font-mono text-sm font-semibold" style={{ color: displayB.color }}>
            <span style={{ color: '#7B8FA0' }}>(conf: {moduleB.conviction})</span>{' '}
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
