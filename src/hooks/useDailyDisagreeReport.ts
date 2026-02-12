/**
 * Hook for fetching the Daily Disagree report from ctx8-api.
 * Stub implementation returning mock data until ctx8-api endpoint is ready.
 */

import { useState, useEffect } from 'react';
import type { ModuleData } from '@/components/disagree/ModuleScorecard';
import type { Conflict, ConflictSeverity } from '@/components/disagree/conflict-types';
import type { CrowdedTradeCardProps } from '@/components/disagree/CrowdedTradeCard';
import type { DivergenceItem } from '@/components/disagree/DivergenceWatch';
import type { HeadlineBannerProps, MacroBadge } from '@/components/disagree/HeadlineBanner';
import type { HeatmapRow } from '@/components/disagree/ConvictionHeatmap';
import type { CandlestickData, Time } from 'lightweight-charts';

// ── Report shape ──────────────────────────────────────────────

export interface DisagreeAssetSummary {
  symbol: string;
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
  bullCount: number;
  bearCount: number;
  topConflictSeverity: ConflictSeverity | null;
  conviction: number;
}

export interface ChangeItem {
  direction: 'up' | 'down' | 'new' | 'unchanged';
  text: string;
}

export interface DailyDisagreeReport {
  date: string;
  reportNumber: number;
  headline: HeadlineBannerProps;
  modules: ModuleData[];
  conflicts: Conflict[];
  crowdedTrades: CrowdedTradeCardProps[];
  divergences: DivergenceItem[];
  macro: MacroBadge;
  assets: DisagreeAssetSummary[];
  priceData: CandlestickData<Time>[];
  heatmapRows: HeatmapRow[];
  changes?: ChangeItem[];
  riskCallout?: string;
}

interface UseDailyDisagreeReportReturn {
  report: DailyDisagreeReport | null;
  loading: boolean;
  error: string | null;
}

// ── Mock data ─────────────────────────────────────────────────

function buildMockReport(): DailyDisagreeReport {
  const modules: ModuleData[] = [
    { id: 'rsi', name: 'RSI', category: 'Technical', signal: 'bearish', conviction: 7, hasConflict: true },
    { id: 'macd', name: 'MACD', category: 'Technical', signal: 'bearish', conviction: 6 },
    { id: 'ichimoku', name: 'Ichimoku Cloud', category: 'Technical', signal: 'bullish', conviction: 5 },
    { id: 'ema-cross', name: 'EMA Cross', category: 'Technical', signal: 'bullish', conviction: 4 },
    { id: 'funding', name: 'Funding Rate', category: 'Positioning', signal: 'bearish', conviction: 8, hasConflict: true },
    { id: 'oi', name: 'Open Interest', category: 'Positioning', signal: 'bearish', conviction: 7 },
    { id: 'liq-levels', name: 'Liquidation Levels', category: 'Positioning', signal: 'bearish', conviction: 6 },
    { id: 'social-vol', name: 'Social Volume', category: 'Sentiment', signal: 'bullish', conviction: 7, hasConflict: true },
    { id: 'fear-greed', name: 'Fear & Greed', category: 'Sentiment', signal: 'bullish', conviction: 9 },
    { id: 'funding-sent', name: 'Funding Sentiment', category: 'Sentiment', signal: 'bearish', conviction: 5 },
    { id: 'whale', name: 'Whale Activity', category: 'On-Chain', signal: 'bullish', conviction: 8 },
    { id: 'exchange-flow', name: 'Exchange Flow', category: 'On-Chain', signal: 'bearish', conviction: 6 },
    { id: 'utxo', name: 'UTXO Age', category: 'On-Chain', signal: 'bullish', conviction: 4 },
    { id: 'dxy', name: 'DXY Correlation', category: 'Macro', signal: 'bearish', conviction: 5 },
    { id: 'rates', name: 'Rate Expectations', category: 'Macro', signal: 'neutral', conviction: 3 },
    { id: 'sp500', name: 'S&P 500 Corr', category: 'Macro', signal: 'bullish', conviction: 4 },
  ];

  const conflicts: Conflict[] = [
    {
      id: 'c1',
      severity: 'critical',
      moduleA: { name: 'Funding Rate', signal: 'bearish', conviction: 8 },
      moduleB: { name: 'Social Volume', signal: 'bullish', conviction: 7 },
      nature: 'Funding shows crowded longs but social sentiment remains euphoric at 78%',
      historicalAnalog: 'Jan 18 — Funding was right (-14% in 3 days)',
    },
    {
      id: 'c2',
      severity: 'high',
      moduleA: { name: 'RSI', signal: 'bearish', conviction: 7 },
      moduleB: { name: 'Fear & Greed', signal: 'bullish', conviction: 9 },
      nature: 'Technical overbought while retail greed index at 82',
      historicalAnalog: 'Dec 5 — RSI was right, 8% correction over 5 days',
    },
    {
      id: 'c3',
      severity: 'medium',
      moduleA: { name: 'Exchange Flow', signal: 'bearish', conviction: 6 },
      moduleB: { name: 'Whale Activity', signal: 'bullish', conviction: 8 },
      nature: 'Exchange inflows increasing but whales accumulating off-exchange',
    },
    {
      id: 'c4',
      severity: 'low',
      moduleA: { name: 'DXY Correlation', signal: 'bearish', conviction: 5 },
      moduleB: { name: 'S&P 500 Corr', signal: 'bullish', conviction: 4 },
      nature: 'Dollar strengthening but equities holding, mixed macro picture',
    },
  ];

  const crowdedTrades: CrowdedTradeCardProps[] = [
    {
      symbol: 'BTC',
      direction: 'LONGS',
      zScore: 2.8,
      ratio: 0.72,
      modules: ['Funding', 'OI', 'Social'],
      totalModules: 6,
      analog: { date: 'Jan 18', outcome: '-14% in 3 days' },
    },
    {
      symbol: 'DOGE',
      direction: 'LONGS',
      zScore: 3.2,
      ratio: 0.87,
      modules: ['Funding', 'OI', 'Social', 'Whale'],
      totalModules: 6,
      analog: { date: 'Jan 22', outcome: '-22% in 5 days' },
    },
    {
      symbol: 'SOL',
      direction: 'SHORTS',
      zScore: 1.9,
      ratio: 0.45,
      modules: ['Funding', 'OI'],
      totalModules: 6,
    },
  ];

  const divergences: DivergenceItem[] = [
    { type: 'Sentiment vs Price', asset: 'BTC', strength: 3, description: 'Social euphoria while price stalls at resistance' },
    { type: 'Volume vs OI', asset: 'ETH', strength: 2, description: 'Declining volume with rising open interest' },
    { type: 'On-chain vs Technical', asset: 'SOL', strength: 1, description: 'Whale accumulation during technical downtrend' },
  ];

  const assets: DisagreeAssetSummary[] = [
    { symbol: 'BTC', price: 97432, change24h: 2.1, volume: '$42.3B', marketCap: '$1.91T', bullCount: 5, bearCount: 7, topConflictSeverity: 'critical', conviction: 3 },
    { symbol: 'ETH', price: 3841, change24h: -0.3, volume: '$18.7B', marketCap: '$461B', bullCount: 4, bearCount: 5, topConflictSeverity: 'medium', conviction: 5 },
    { symbol: 'SOL', price: 198.4, change24h: 5.4, volume: '$8.2B', marketCap: '$89.2B', bullCount: 6, bearCount: 3, topConflictSeverity: 'low', conviction: 7 },
    { symbol: 'DOGE', price: 0.312, change24h: -1.8, volume: '$3.1B', marketCap: '$45.1B', bullCount: 2, bearCount: 8, topConflictSeverity: 'high', conviction: 2 },
    { symbol: 'XRP', price: 2.41, change24h: 1.2, volume: '$5.6B', marketCap: '$138B', bullCount: 5, bearCount: 4, topConflictSeverity: null, conviction: 6 },
  ];

  // Mock candlestick data (7 days of daily candles)
  const priceData: CandlestickData<Time>[] = [
    { time: '2026-02-06' as unknown as Time, open: 94200, high: 95800, low: 93100, close: 95400 },
    { time: '2026-02-07' as unknown as Time, open: 95400, high: 96700, low: 94800, close: 95100 },
    { time: '2026-02-08' as unknown as Time, open: 95100, high: 97200, low: 94900, close: 96800 },
    { time: '2026-02-09' as unknown as Time, open: 96800, high: 97600, low: 95200, close: 96100 },
    { time: '2026-02-10' as unknown as Time, open: 96100, high: 98400, low: 95800, close: 97900 },
    { time: '2026-02-11' as unknown as Time, open: 97900, high: 98100, low: 96400, close: 96700 },
    { time: '2026-02-12' as unknown as Time, open: 96700, high: 97800, low: 96200, close: 97432 },
  ];

  // Mock heatmap rows (7 days per module)
  const heatmapRows: HeatmapRow[] = [
    { moduleName: 'RSI', days: [{ conviction: 5, signal: 'bearish' }, { conviction: 6, signal: 'bearish' }, { conviction: 4, signal: 'neutral' }, { conviction: 7, signal: 'bearish' }, { conviction: 6, signal: 'bearish' }, { conviction: 8, signal: 'bearish' }, { conviction: 7, signal: 'bearish' }] },
    { moduleName: 'Funding', days: [{ conviction: 6, signal: 'bearish' }, { conviction: 7, signal: 'bearish' }, { conviction: 7, signal: 'bearish' }, { conviction: 8, signal: 'bearish' }, { conviction: 9, signal: 'bearish' }, { conviction: 8, signal: 'bearish' }, { conviction: 8, signal: 'bearish' }] },
    { moduleName: 'Social', days: [{ conviction: 4, signal: 'bullish' }, { conviction: 5, signal: 'bullish' }, { conviction: 6, signal: 'bullish' }, { conviction: 7, signal: 'bullish' }, { conviction: 6, signal: 'bullish' }, { conviction: 8, signal: 'bullish' }, { conviction: 7, signal: 'bullish' }] },
    { moduleName: 'Whale', days: [{ conviction: 7, signal: 'bullish' }, { conviction: 6, signal: 'bullish' }, { conviction: 8, signal: 'bullish' }, { conviction: 7, signal: 'bullish' }, { conviction: 9, signal: 'bullish' }, { conviction: 8, signal: 'bullish' }, { conviction: 8, signal: 'bullish' }] },
    { moduleName: 'DXY', days: [{ conviction: 3, signal: 'neutral' }, { conviction: 4, signal: 'bearish' }, { conviction: 5, signal: 'bearish' }, { conviction: 4, signal: 'bearish' }, { conviction: 5, signal: 'bearish' }, { conviction: 6, signal: 'bearish' }, { conviction: 5, signal: 'bearish' }] },
  ];

  const changes: ChangeItem[] = [
    { direction: 'up', text: 'Funding Rate conviction rose from 6 → 8 (crowding intensified)' },
    { direction: 'up', text: 'Fear & Greed jumped 65 → 72 — deeper into Greed zone' },
    { direction: 'down', text: 'RSI moved deeper into overbought on 4H timeframe' },
    { direction: 'unchanged', text: 'Whale accumulation continues for 5th consecutive day' },
    { direction: 'new', text: 'DOGE crowded longs now at z=3.2 (was 2.1 yesterday)' },
  ];

  return {
    date: '2026-02-12',
    reportNumber: 42,
    headline: {
      headline: '78% of crypto Twitter is bullish BTC. 4 of 6 Context8 modules disagree.',
      conviction: 3,
      reportDate: 'Feb 12, 2026',
      reportNumber: 42,
      macro: { regime: 'mixed', fearGreed: 72, dxyTrend: 'up' },
    },
    modules,
    conflicts,
    crowdedTrades,
    divergences,
    macro: { regime: 'mixed', fearGreed: 72, dxyTrend: 'up' },
    assets,
    priceData,
    heatmapRows,
    changes,
    riskCallout: 'BTC funding is crowded at z=2.8 — last time this happened (Jan 18), price dropped 14% in 3 days.',
  };
}

// ── Hook ──────────────────────────────────────────────────────

export function useDailyDisagreeReport(date?: string): UseDailyDisagreeReportReturn {
  const [report, setReport] = useState<DailyDisagreeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulate API fetch with mock data
    const timer = setTimeout(() => {
      try {
        setReport(buildMockReport());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch report');
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [date]);

  return { report, loading, error };
}
