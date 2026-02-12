import type { SignalType } from '@/lib/signals';

export type ConflictSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ConflictModule {
  name: string;
  signal: SignalType;
  conviction: number;
}

export interface Conflict {
  id: string;
  severity: ConflictSeverity;
  moduleA: ConflictModule;
  moduleB: ConflictModule;
  nature: string;
  historicalAnalog?: string;
}

export const SEVERITY_ORDER: Record<ConflictSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};
