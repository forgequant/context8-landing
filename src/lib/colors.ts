/**
 * Dashboard design tokens — all color constants for Daily Disagree.
 * Source of truth: docs/plans/2026-02-12-dashboard-design.md (section 3)
 */

export const DD_COLORS = {
  // Signal colors
  bullish: '#4CAF78',
  bearish: '#C94D4D',
  neutral: '#7B8FA0',

  // Conviction gradient (amber scale 0-10)
  conviction0: '#1A1C21',
  conviction3: '#3D3526',
  conviction5: '#6B5D30',
  conviction7: '#9A7E35',
  conviction10: '#C49A3C',

  // Conflict severity
  conflictLow: '#7B8FA0',
  conflictMedium: '#C49A3C',
  conflictHigh: '#E8853D',
  conflictCritical: '#C94D4D',

  // Crowded trade danger scale
  dangerSafe: '#4CAF78',
  dangerCaution: '#C49A3C',
  dangerHigh: '#E8853D',
  dangerExtreme: '#C94D4D',

  // Price movement
  priceUp: '#4CAF78',
  priceDown: '#C94D4D',

  // Module category colors
  categoryOnChain: '#C49A3C',
  categorySentiment: '#7DD3FC',
  categoryTechnical: '#A78BFA',
  categoryDerivatives: '#F59E0B',
  categoryMacro: '#60A5FA',
} as const;

/** Conviction gradient stops for interpolation */
const CONVICTION_STOPS: [number, string][] = [
  [0, DD_COLORS.conviction0],
  [3, DD_COLORS.conviction3],
  [5, DD_COLORS.conviction5],
  [7, DD_COLORS.conviction7],
  [10, DD_COLORS.conviction10],
];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

/** Map a conviction value (0-10) to its amber gradient color */
export function convictionToColor(n: number): string {
  const clamped = Math.max(0, Math.min(10, n));

  for (let i = 0; i < CONVICTION_STOPS.length - 1; i++) {
    const [lo, loHex] = CONVICTION_STOPS[i];
    const [hi, hiHex] = CONVICTION_STOPS[i + 1];
    if (clamped >= lo && clamped <= hi) {
      const t = (clamped - lo) / (hi - lo);
      const [r1, g1, b1] = hexToRgb(loHex);
      const [r2, g2, b2] = hexToRgb(hiHex);
      return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
    }
  }

  return DD_COLORS.conviction10;
}
