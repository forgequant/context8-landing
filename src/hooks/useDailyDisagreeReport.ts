

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { apiFetch, ApiError, API_BASE_URL } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { ModuleData } from '@/components/disagree/ModuleScorecard';
import type { Conflict, ConflictSeverity } from '@/components/disagree/conflict-types';
import type { CrowdedTradeCardProps } from '@/components/disagree/CrowdedTradeCard';
import type { DivergenceItem } from '@/components/disagree/DivergenceWatch';
import type { HeadlineBannerProps, MacroBadge } from '@/components/disagree/HeadlineBanner';
import type { HeatmapRow } from '@/components/disagree/ConvictionHeatmap';
import type { CandlestickData, Time } from 'lightweight-charts';


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

export type CollectorStatus = 'ok' | 'partial' | 'unavailable';
export type QualityOverall = 'green' | 'amber' | 'red';

export interface CollectorFallback {
  mode: string;
  reason: string;
}

export interface CollectorInfo {
  status: CollectorStatus;
  confidence: number;
  asOf: string;
  sources: string[];
  fallback?: CollectorFallback;
  metrics?: Record<string, unknown>;
}

export interface ReportCollectors {
  derivatives: CollectorInfo;
  macro: CollectorInfo;
  social: CollectorInfo;
  flows: CollectorInfo;
}

export interface TradeSetup {
  symbol: string;
  bias: 'bullish' | 'bearish' | 'neutral';
  thesis: string;
  confidence: number;
}

export interface RiskFlag {
  key: string;
  severity: 'low' | 'medium' | 'high';
  summary: string;
}

export interface NarrativeBullet {
  topic: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral' | 'mixed';
}

export interface AvoidListItem {
  symbol: string;
  reason: string;
}

export interface ReportSections {
  tradeSetups: TradeSetup[];
  riskFlags: RiskFlag[];
  narrativeBullets: NarrativeBullet[];
  avoidList: AvoidListItem[];
}

export interface ReportQuality {
  overall: QualityOverall;
  coveragePct: number;
  warnings: string[];
}

export interface DailyDisagreeReport {
  version: number;
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
  generatedAt?: string;
  collectors?: ReportCollectors;
  sections?: ReportSections;
  quality?: ReportQuality;
  v3FallbackUsed?: boolean;
  fallbackNotes?: string[];
}

interface UseDailyDisagreeReportReturn {
  report: DailyDisagreeReport | null;
  loading: boolean;
  error: string | null;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export type Ctx8Report = {
  id: string;
  asset: string;
  report_date: string;
  headline: string;
  payload: unknown;
  status: string;
  version: number;
  created_at: string;
  published_at: string | null;
};


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
  const priceData: CandlestickData<Time>[] = [
    { time: '2026-02-06' as unknown as Time, open: 94200, high: 95800, low: 93100, close: 95400 },
    { time: '2026-02-07' as unknown as Time, open: 95400, high: 96700, low: 94800, close: 95100 },
    { time: '2026-02-08' as unknown as Time, open: 95100, high: 97200, low: 94900, close: 96800 },
    { time: '2026-02-09' as unknown as Time, open: 96800, high: 97600, low: 95200, close: 96100 },
    { time: '2026-02-10' as unknown as Time, open: 96100, high: 98400, low: 95800, close: 97900 },
    { time: '2026-02-11' as unknown as Time, open: 97900, high: 98100, low: 96400, close: 96700 },
    { time: '2026-02-12' as unknown as Time, open: 96700, high: 97800, low: 96200, close: 97432 },
  ];
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
    version: 2,
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


function formatReportDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'MMM d, yyyy');
  } catch {
    return isoDate;
  }
}

function reportNumberFromDate(isoDate: string): number {
  const n = Number(isoDate.replace(/-/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function stripQuoteSuffix(sym: string): string {
  return sym.toUpperCase().replace(/USDT$/, '');
}

function biasToSignal(bias: unknown): 'bullish' | 'bearish' | 'neutral' {
  if (bias === 'bullish') return 'bullish';
  if (bias === 'bearish') return 'bearish';
  return 'neutral';
}

function confidenceToConviction(confidence: unknown): number {
  const n = typeof confidence === 'number' ? confidence : Number(confidence);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(10, Math.round(n / 10)));
}

function moduleNameToCategory(moduleId: string): ModuleData['category'] {
  switch (moduleId) {
    case 'ta_scanner':
      return 'Technical';
    case 'funding':
    case 'oi_divergence':
      return 'Positioning';
    case 'social':
      return 'Sentiment';
    case 'macro':
    case 'feargreed':
      return 'Macro';
    default:
      return 'On-Chain';
  }
}

function moduleNameToLabel(moduleId: string): string {
  switch (moduleId) {
    case 'ta_scanner':
      return 'TA Scanner';
    case 'oi_divergence':
      return 'Open Interest';
    case 'feargreed':
      return 'Fear & Greed';
    default:
      return moduleId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

function quantizeStrength(strength: unknown): 1 | 2 | 3 {
  const n = typeof strength === 'number' ? strength : Number(strength);
  if (!Number.isFinite(n)) return 1;
  if (n >= 20) return 3;
  if (n >= 10) return 2;
  return 1;
}

class UnsupportedReportVersionError extends Error {
  constructor(version: unknown) {
    super(`Unsupported report version: ${String(version)}. Expected version 2 or 3.`);
    this.name = 'UnsupportedReportVersionError';
  }
}

function isCollectorStatus(value: unknown): value is CollectorStatus {
  return value === 'ok' || value === 'partial' || value === 'unavailable';
}

function isQualityOverall(value: unknown): value is QualityOverall {
  return value === 'green' || value === 'amber' || value === 'red';
}

function asFiniteNumber(value: unknown): number | null {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function parseCollector(raw: unknown): CollectorInfo | null {
  if (!isRecord(raw)) return null;
  if (!isCollectorStatus(raw.status)) return null;
  const confidence = asFiniteNumber(raw.confidence);
  if (confidence === null) return null;
  if (typeof raw.as_of !== 'string') return null;
  if (!Array.isArray(raw.sources) || raw.sources.some((s) => typeof s !== 'string')) return null;
  const fallback =
    isRecord(raw.fallback) && typeof raw.fallback.mode === 'string' && typeof raw.fallback.reason === 'string'
      ? { mode: raw.fallback.mode, reason: raw.fallback.reason }
      : undefined;
  return {
    status: raw.status,
    confidence,
    asOf: raw.as_of,
    sources: raw.sources as string[],
    fallback,
    metrics: isRecord(raw.metrics) ? raw.metrics : undefined,
  };
}

function parseCollectors(raw: unknown): ReportCollectors | null {
  if (!isRecord(raw)) return null;
  const derivatives = parseCollector(raw.derivatives);
  const macro = parseCollector(raw.macro);
  const social = parseCollector(raw.social);
  const flows = parseCollector(raw.flows);
  if (!derivatives || !macro || !social || !flows) return null;
  return { derivatives, macro, social, flows };
}

function parseSections(raw: unknown): ReportSections | null {
  if (!isRecord(raw)) return null;
  if (!Array.isArray(raw.trade_setups) || !Array.isArray(raw.risk_flags) || !Array.isArray(raw.narrative_bullets) || !Array.isArray(raw.avoid_list)) {
    return null;
  }
  const tradeSetups: TradeSetup[] = [];
  for (const item of raw.trade_setups) {
    if (!isRecord(item) || typeof item.symbol !== 'string' || typeof item.thesis !== 'string') return null;
    const confidence = asFiniteNumber(item.confidence);
    if (confidence === null) return null;
    tradeSetups.push({
      symbol: stripQuoteSuffix(item.symbol),
      bias: biasToSignal(item.bias),
      thesis: item.thesis,
      confidence,
    });
  }
  const riskFlags: RiskFlag[] = [];
  for (const item of raw.risk_flags) {
    if (!isRecord(item) || typeof item.key !== 'string' || typeof item.summary !== 'string') return null;
    if (item.severity !== 'low' && item.severity !== 'medium' && item.severity !== 'high') return null;
    riskFlags.push({ key: item.key, severity: item.severity, summary: item.summary });
  }
  const narrativeBullets: NarrativeBullet[] = [];
  for (const item of raw.narrative_bullets) {
    if (!isRecord(item) || typeof item.topic !== 'string' || typeof item.summary !== 'string') return null;
    if (item.sentiment !== 'bullish' && item.sentiment !== 'bearish' && item.sentiment !== 'neutral' && item.sentiment !== 'mixed') return null;
    narrativeBullets.push({ topic: item.topic, summary: item.summary, sentiment: item.sentiment });
  }
  const avoidList: AvoidListItem[] = [];
  for (const item of raw.avoid_list) {
    if (!isRecord(item) || typeof item.symbol !== 'string' || typeof item.reason !== 'string') return null;
    avoidList.push({ symbol: stripQuoteSuffix(item.symbol), reason: item.reason });
  }
  return { tradeSetups, riskFlags, narrativeBullets, avoidList };
}

function parseQuality(raw: unknown): ReportQuality | null {
  if (!isRecord(raw)) return null;
  if (!isQualityOverall(raw.overall)) return null;
  const coveragePct = asFiniteNumber(raw.coverage_pct);
  if (coveragePct === null) return null;
  if (!Array.isArray(raw.warnings) || raw.warnings.some((warning) => typeof warning !== 'string')) return null;
  return {
    overall: raw.overall,
    coveragePct,
    warnings: raw.warnings as string[],
  };
}

function parseFallbackNotes(payload: Record<string, unknown>): string[] | undefined {
  if (!isRecord(payload.fallbacks) || !Array.isArray(payload.fallbacks.notes)) return undefined;
  const notes = payload.fallbacks.notes.filter((item): item is string => typeof item === 'string');
  return notes.length > 0 ? notes : undefined;
}

function extractFallbackV2Payload(payload: Record<string, unknown>): Record<string, unknown> | null {
  if (!isRecord(payload.fallbacks)) return null;
  return isRecord(payload.fallbacks.v2_payload) ? payload.fallbacks.v2_payload : null;
}

function normalizeLegacyPayload(
  payload: Record<string, unknown>,
  reportDate: string,
  fallbackHeadline: string,
  version: number,
): DailyDisagreeReport {
  const reportNumber = reportNumberFromDate(reportDate);
  if (Array.isArray(payload.modules) && payload.headline) {
    return {
      ...payload,
      version: typeof payload.version === 'number' ? payload.version : version,
      date: (payload.date as string | undefined) ?? reportDate,
      reportNumber: (payload.reportNumber as number | undefined) ?? reportNumber,
    } as DailyDisagreeReport;
  }
  const convictionScores = Array.isArray(payload.conviction_scores) ? payload.conviction_scores : [];
  const featured = convictionScores.reduce<unknown>((best, cur) => {
    const curRec = isRecord(cur) ? cur : {};
    const bestRec = isRecord(best) ? best : {};
    const curScore = typeof curRec.score === 'number' ? curRec.score : Number(curRec.score);
    const bestScore = typeof bestRec.score === 'number' ? bestRec.score : Number(bestRec.score);
    if (!Number.isFinite(bestScore)) return cur;
    if (!Number.isFinite(curScore)) return best;
    return curScore < bestScore ? cur : best;
  }, convictionScores[0]);

  const featuredModules = isRecord(featured) && Array.isArray(featured.modules) ? featured.modules : [];
  const modules: ModuleData[] = featuredModules.map((m): ModuleData => {
    const rec = isRecord(m) ? m : {};
    const moduleId = String(rec.module ?? 'unknown');
    return {
      id: moduleId,
      name: moduleNameToLabel(moduleId),
      category: moduleNameToCategory(moduleId),
      signal: biasToSignal(rec.bias),
      conviction: confidenceToConviction(rec.confidence),
    };
  });

  const hasBull = modules.some((m) => m.signal === 'bullish');
  const hasBear = modules.some((m) => m.signal === 'bearish');
  const withConflicts = modules.map((m) => ({
    ...m,
    hasConflict: (m.signal === 'bullish' && hasBear) || (m.signal === 'bearish' && hasBull),
  }));

  const bullishTop = withConflicts
    .filter((m) => m.signal === 'bullish')
    .sort((a, b) => b.conviction - a.conviction)[0];
  const bearishTop = withConflicts
    .filter((m) => m.signal === 'bearish')
    .sort((a, b) => b.conviction - a.conviction)[0];

  const conflicts: Conflict[] =
    bullishTop && bearishTop
      ? [
          {
            id: 'auto-1',
            severity: (Math.max(bullishTop.conviction, bearishTop.conviction) >= 8
              ? 'critical'
              : Math.max(bullishTop.conviction, bearishTop.conviction) >= 7
                ? 'high'
                : 'medium') as ConflictSeverity,
            moduleA: { name: bullishTop.name, signal: bullishTop.signal, conviction: bullishTop.conviction },
            moduleB: { name: bearishTop.name, signal: bearishTop.signal, conviction: bearishTop.conviction },
            nature: 'Top bullish vs bearish module disagreement (auto-derived from conviction scores).',
          },
        ]
      : [];

  const crowdedTradesRaw = Array.isArray(payload.crowded_trades) ? payload.crowded_trades : [];
  const crowdedTrades: CrowdedTradeCardProps[] = crowdedTradesRaw.map((ct): CrowdedTradeCardProps => {
    const rec = isRecord(ct) ? ct : {};
    const direction = rec.direction === 'short' ? 'SHORTS' : 'LONGS';
    const z = typeof rec.z_score === 'number' ? rec.z_score : Number(rec.z_score);
    const sym = stripQuoteSuffix(String(rec.symbol ?? ''));
    const analog = isRecord(rec.historical_analog)
      ? {
          date: String(rec.historical_analog.date ?? ''),
          outcome: `${(rec.historical_analog as Record<string, unknown>).outcome_pct ?? '?'}% in ${(rec.historical_analog as Record<string, unknown>).outcome_days ?? '?'} days`,
        }
      : undefined;
    return {
      symbol: sym,
      direction,
      zScore: Number.isFinite(z) ? z : 0,
      ratio: 0.5,
      modules: ['Funding'],
      totalModules: 6,
      analog,
    };
  });

  const divergencesRaw = Array.isArray(payload.divergences) ? payload.divergences : [];
  const divergences: DivergenceItem[] = divergencesRaw.map((d): DivergenceItem => {
    const rec = isRecord(d) ? d : {};
    return {
      type: String(rec.type ?? 'Divergence'),
      asset: stripQuoteSuffix(String(rec.symbol ?? '')),
      strength: quantizeStrength(rec.strength),
      description: String(rec.description ?? ''),
    };
  });

  const macroRegime = isRecord(payload.macro_regime) ? payload.macro_regime : {};
  const macro: MacroBadge = {
    regime: macroRegime.bias === 'risk_on' ? 'risk_on' : macroRegime.bias === 'risk_off' ? 'risk_off' : 'mixed',
    fearGreed: typeof macroRegime.feargreed_value === 'number' ? macroRegime.feargreed_value : Number(macroRegime.feargreed_value ?? 0),
    dxyTrend: macroRegime.dxy_trend === 'up' ? 'up' : macroRegime.dxy_trend === 'down' ? 'down' : 'flat',
  };

  const conviction =
    isRecord(featured) && typeof featured.score === 'number' ? featured.score : Number(isRecord(featured) ? featured.score ?? 0 : 0);

  const headline: HeadlineBannerProps = {
    headline: String(payload.headline ?? fallbackHeadline),
    conviction: Number.isFinite(conviction) ? conviction : 0,
    reportDate: formatReportDate(reportDate),
    reportNumber,
    macro,
  };

  const assets: DisagreeAssetSummary[] = convictionScores.map((s) => {
    const rec = isRecord(s) ? s : {};
    return {
      symbol: stripQuoteSuffix(String(rec.symbol ?? '')),
      price: 0,
      change24h: 0,
      volume: '\u2014',
      marketCap: '\u2014',
      bullCount: typeof rec.bullish_modules === 'number' ? rec.bullish_modules : Number(rec.bullish_modules ?? 0),
      bearCount: typeof rec.bearish_modules === 'number' ? rec.bearish_modules : Number(rec.bearish_modules ?? 0),
      topConflictSeverity: null,
      conviction: typeof rec.score === 'number' ? rec.score : Number(rec.score ?? 0),
    };
  });

  const riskCallout =
    typeof macroRegime.summary === 'string' && macroRegime.summary.trim() !== ''
      ? macroRegime.summary
      : crowdedTrades[0]?.analog
        ? `Crowded ${crowdedTrades[0].direction} on ${crowdedTrades[0].symbol} (z=${crowdedTrades[0].zScore.toFixed(1)}).`
        : undefined;

  return {
    version,
    date: reportDate,
    reportNumber,
    headline,
    modules: withConflicts,
    conflicts,
    crowdedTrades,
    divergences,
    macro,
    assets,
    priceData: [],
    heatmapRows: [],
    riskCallout,
  };
}

export function normalizeFromCtx8Report(ctx8: Ctx8Report): DailyDisagreeReport {
  const payload = isRecord(ctx8.payload) ? ctx8.payload : {};
  const version = typeof ctx8.version === 'number' ? ctx8.version : Number(ctx8.version);
  if (version === 2) {
    return normalizeLegacyPayload(payload, ctx8.report_date, ctx8.headline, 2);
  }
  if (version === 3) {
    const generatedAt = typeof payload.generated_at === 'string' ? payload.generated_at : null;
    const collectors = parseCollectors(payload.collectors);
    const sections = parseSections(payload.sections);
    const quality = parseQuality(payload.quality);
    if (generatedAt && collectors && sections && quality) {
      return {
        ...normalizeLegacyPayload(payload, ctx8.report_date, ctx8.headline, 3),
        version: 3,
        generatedAt,
        collectors,
        sections,
        quality,
        fallbackNotes: parseFallbackNotes(payload),
      };
    }
    const fallbackPayload = extractFallbackV2Payload(payload);
    if (fallbackPayload) {
      return {
        ...normalizeLegacyPayload(fallbackPayload, ctx8.report_date, ctx8.headline, 3),
        version: 3,
        v3FallbackUsed: true,
        fallbackNotes: parseFallbackNotes(payload),
      };
    }
    throw new Error('MARKET payload v3 is malformed and has no fallbacks.v2_payload');
  }
  throw new UnsupportedReportVersionError(ctx8.version);
}

export function useDailyDisagreeReport(date?: string): UseDailyDisagreeReportReturn {
  const [report, setReport] = useState<DailyDisagreeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { accessToken, isAuthenticated, isLoading: authLoading, login } = useAuth();

  useEffect(() => {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    const controller = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);
      if (authLoading) return;

      if (!isAuthenticated || !accessToken) {
        setError('Not authenticated. Redirecting to sign-in...');
        setLoading(false);
        try {
          await login(returnTo);
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Failed to start sign-in redirect';
          setError(msg);
        }
        return;
      }

      try {
        const asset = 'MARKET';
        const path = date
          ? `/api/v1/reports/${encodeURIComponent(asset)}/${encodeURIComponent(date)}`
          : `/api/v1/reports/${encodeURIComponent(asset)}/latest`;
        const ctx8 = await apiFetch<Ctx8Report>(path, { token: accessToken, signal: controller.signal });
        setReport(normalizeFromCtx8Report(ctx8));
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setError('Session expired. Redirecting to sign-in...');
          try {
            await login(returnTo);
          } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to start sign-in redirect';
            setError(msg);
          }
          return;
        }
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (import.meta.env.DEV && (!API_BASE_URL || API_BASE_URL.trim() === '') && err instanceof TypeError) {
          setReport(buildMockReport());
          setError(null);
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to fetch report');
      } finally {
        setLoading(false);
      }
    }

    void run();
    return () => controller.abort();
  }, [accessToken, authLoading, date, isAuthenticated, location.hash, location.pathname, location.search, login]);

  return { report, loading, error };
}
