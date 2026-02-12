/**
 * Signal display configuration and type definitions for Daily Disagree.
 * Source of truth: docs/plans/2026-02-12-dashboard-design.md (section 3, Colorblind Safety)
 */

import { DD_COLORS } from './colors';

export type SignalType = 'bullish' | 'bearish' | 'neutral';

export type SubscriptionTier = 'free' | 'pro' | 'whale';

export interface SignalDisplay {
  color: string;
  icon: string;
  label: string;
}

export const SIGNAL_DISPLAY: Record<SignalType, SignalDisplay> = {
  bullish: {
    color: DD_COLORS.bullish,
    icon: '\u25B2', // ▲
    label: 'BULL',
  },
  bearish: {
    color: DD_COLORS.bearish,
    icon: '\u25BC', // ▼
    label: 'BEAR',
  },
  neutral: {
    color: DD_COLORS.neutral,
    icon: '\u25C6', // ◆
    label: 'NEUT',
  },
} as const;
