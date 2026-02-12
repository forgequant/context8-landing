import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDailyDisagreeReport } from '@/hooks/useDailyDisagreeReport';
import { SIGNAL_DISPLAY, type SignalType } from '@/lib/signals';
import { PriceTicker } from '@/components/disagree/PriceTicker';
import { WSStatusBanner } from '@/components/disagree/WSStatusBanner';
import { SEVERITY_ORDER, type ConflictSeverity } from '@/components/disagree/conflict-types';
import type { ModuleData, ModuleCategory } from '@/components/disagree/ModuleScorecard';

// ── Warm amber palette (from landing page) + AITrader card-layout tokens ──

const SC = {
  surface: '#161210',
  surface2: '#1E1A16',
  border: '#2E2A24',
  borderDim: 'rgba(46, 42, 36, 0.5)',
  text: '#E8E0D4',
  textSecondary: '#9A9080',
  textMuted: '#6B6358',
  accent: '#C49A3C',
  bull: '#4CAF78',
  bear: '#C94D4D',
  neutral: '#7B8FA0',
  bullDim: 'rgba(76, 175, 120, 0.14)',
  bearDim: 'rgba(201, 77, 77, 0.14)',
  neutralDim: 'rgba(123, 143, 160, 0.14)',
  bullBorder: 'rgba(76, 175, 120, 0.25)',
  bearBorder: 'rgba(201, 77, 77, 0.25)',
  neutralBorder: 'rgba(123, 143, 160, 0.25)',
} as const;

const mono = "'JetBrains Mono', monospace";
const heading = "'Inter', sans-serif";

const SIGNAL_TAG: Record<SignalType, { bg: string; color: string; border: string }> = {
  bullish: { bg: SC.bullDim, color: SC.bull, border: SC.bullBorder },
  bearish: { bg: SC.bearDim, color: SC.bear, border: SC.bearBorder },
  neutral: { bg: SC.neutralDim, color: SC.neutral, border: SC.neutralBorder },
};

const SEVERITY_CLR: Record<ConflictSeverity, string> = {
  low: SC.textMuted,
  medium: SC.accent,
  high: '#E8853D',
  critical: SC.bear,
};

const CATEGORY_ORDER: ModuleCategory[] = [
  'Technical', 'Positioning', 'Sentiment', 'On-Chain', 'Macro',
];

// ── Reusable styles ──

const card: React.CSSProperties = {
  background: SC.surface,
  border: `1px solid ${SC.border}`,
  borderRadius: 10,
  padding: '1.25rem',
  overflow: 'hidden',
};

const cardHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
  paddingBottom: '0.75rem',
  borderBottom: `1px solid ${SC.border}`,
};

const cardTitle: React.CSSProperties = {
  fontFamily: heading,
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: SC.textMuted,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: heading,
  fontSize: '1.1rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  marginBottom: '1rem',
  color: SC.text,
};

const numBadge: React.CSSProperties = {
  fontSize: '0.65rem',
  fontWeight: 600,
  color: SC.textMuted,
  background: SC.surface2,
  border: `1px solid ${SC.border}`,
  padding: '0.15rem 0.5rem',
  borderRadius: 4,
  fontFamily: mono,
};

const statRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.4rem 0',
  fontSize: '0.875rem',
  fontFamily: mono,
};

// Table styles (AITrader .tbl pattern)
const th: React.CSSProperties = {
  textAlign: 'left',
  fontWeight: 600,
  color: SC.textMuted,
  padding: '0.5rem 0.5rem',
  borderBottom: `1px solid ${SC.border}`,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontFamily: mono,
};

const td: React.CSSProperties = {
  padding: '0.5rem',
  borderBottom: `1px solid ${SC.borderDim}`,
  fontFamily: mono,
  fontSize: '0.875rem',
};

// ── Helpers ──

function computeDisagreeScore(modules: ModuleData[]): number {
  let bullW = 0, bearW = 0;
  for (const m of modules) {
    if (m.signal === 'bullish') bullW += m.conviction;
    else if (m.signal === 'bearish') bearW += m.conviction;
  }
  const max = Math.max(bullW, bearW);
  if (max === 0) return 0;
  return Math.round((Math.min(bullW, bearW) / max) * 10);
}

function deriveVerdict(modules: ModuleData[]) {
  let bull = 0, bear = 0;
  for (const m of modules) {
    if (m.signal === 'bullish') bull++;
    else if (m.signal === 'bearish') bear++;
  }
  const disagree = Math.min(bull, bear);
  if (bear > bull) return { label: 'BEARISH', count: `${bear}-${bull}`, note: `${disagree} modules disagree`, color: SC.bear };
  if (bull > bear) return { label: 'BULLISH', count: `${bull}-${bear}`, note: `${disagree} modules disagree`, color: SC.bull };
  return { label: 'NEUTRAL', count: `${bull}-${bear}`, note: 'evenly split', color: SC.neutral };
}

// ── Small components ──

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 4,
      textTransform: 'uppercase', letterSpacing: '0.05em',
      backgroundColor: `${color}1e`, color, fontFamily: mono,
    }}>
      {label}
    </span>
  );
}

function SignalBadge({ signal }: { signal: SignalType }) {
  const s = SIGNAL_TAG[signal];
  const d = SIGNAL_DISPLAY[signal];
  return (
    <span style={{
      display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 4,
      fontFamily: mono, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em',
      backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {d.icon} {d.label}
    </span>
  );
}

function ConvictionBar({ value, signal }: { value: number; signal: SignalType }) {
  const pct = Math.min(value * 10, 100);
  const fill = signal === 'bullish' ? SC.bull : signal === 'bearish' ? SC.bear : SC.neutral;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 56, height: 4, background: SC.surface2, borderRadius: 2, overflow: 'hidden' }}>
        <span style={{ display: 'block', height: '100%', width: `${pct}%`, backgroundColor: fill, borderRadius: 2 }} />
      </span>
      <span style={{ fontSize: '0.8rem', color: SC.textSecondary, minWidth: 18, textAlign: 'right', fontFamily: mono, fontWeight: 500 }}>
        {value}
      </span>
    </span>
  );
}

function Divider() {
  return (
    <div style={{ height: 1, background: SC.border, margin: '2rem 0', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 120, height: 1, background: `linear-gradient(90deg, ${SC.accent}, transparent)` }} />
    </div>
  );
}

// ── Main Component ──

export function DailyReportView() {
  const { date } = useParams<{ date: string }>();
  const [showAllConflicts, setShowAllConflicts] = useState(false);
  const { report, loading, error } = useDailyDisagreeReport(
    date === 'latest' ? undefined : date,
  );

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '96px 0' }}>
      <div style={{ width: 32, height: 32, border: `2px solid ${SC.border}`, borderTopColor: SC.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );
  if (error) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '96px 0' }}>
      <p style={{ fontFamily: mono, fontSize: '0.9rem', color: SC.bear }}>{error}</p>
    </div>
  );
  if (!report) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '96px 0' }}>
      <p style={{ fontFamily: mono, fontSize: '0.9rem', color: SC.bear }}>No report available</p>
    </div>
  );

  const disagreeScore = computeDisagreeScore(report.modules);
  const verdict = deriveVerdict(report.modules);
  const sortedConflicts = [...report.conflicts].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );
  const visibleConflicts = showAllConflicts ? sortedConflicts : sortedConflicts.slice(0, 3);
  const hiddenCount = Math.max(0, sortedConflicts.length - 3);

  // Group modules by category
  const grouped = new Map<ModuleCategory, ModuleData[]>();
  for (const cat of CATEGORY_ORDER) grouped.set(cat, []);
  for (const m of report.modules) grouped.get(m.category)?.push(m);

  // Module counts
  let bullCount = 0, bearCount = 0, neutCount = 0;
  for (const m of report.modules) {
    if (m.signal === 'bullish') bullCount++;
    else if (m.signal === 'bearish') bearCount++;
    else neutCount++;
  }

  const macroLabels = [
    report.headline.macro.regime === 'risk_on' ? 'Risk On' : report.headline.macro.regime === 'risk_off' ? 'Risk Off' : 'Mixed',
    `F&G ${report.headline.macro.fearGreed}`,
    `DXY ${report.headline.macro.dxyTrend === 'up' ? '\u25B2' : report.headline.macro.dxyTrend === 'down' ? '\u25BC' : '\u25C6'}`,
  ];

  return (
    <div style={{ paddingTop: 8 }}>
      <PriceTicker />

      {/* ── HERO ──────────────────────────────────── */}
      <div style={{ padding: '2rem 0 1.5rem', borderBottom: `1px solid ${SC.border}`, marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: -1, left: 0, width: 200, height: 1, background: `linear-gradient(90deg, ${SC.accent}, transparent)` }} />
        <h1 style={{
          fontFamily: heading, fontWeight: 800,
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
          color: SC.text, lineHeight: 1.3, marginBottom: '0.75rem',
        }}>
          {report.headline.headline}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: mono, fontSize: '0.8rem', color: SC.textMuted }}>
            {report.headline.reportDate} &middot; #{report.reportNumber}
          </span>
          {macroLabels.map((label) => <Badge key={label} label={label} color={SC.accent} />)}
        </div>
      </div>

      {/* ── VERDICT BANNER ────────────────────────── */}
      <div style={{
        ...card, marginBottom: '2rem',
        background: `linear-gradient(135deg, ${verdict.color}0d, ${SC.surface} 60%)`,
        border: `1px solid ${verdict.color}33`,
      }}>
        <div style={{ fontFamily: heading, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: SC.accent, marginBottom: '0.5rem' }}>
          Daily Disagree Score
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: heading, fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, color: SC.accent }}>
            {disagreeScore}<span style={{ fontSize: '1.2rem', color: SC.textMuted }}>/10</span>
          </div>
          <div>
            <div style={{ fontFamily: heading, fontSize: '1.5rem', fontWeight: 700, color: verdict.color }}>
              {verdict.label} {verdict.count}
            </div>
            <div style={{ fontSize: '0.875rem', color: SC.textSecondary, marginTop: '0.25rem', fontFamily: mono }}>
              {verdict.note}
            </div>
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          marginTop: '0.75rem', padding: '0.3rem 0.8rem',
          background: SC.surface2, borderRadius: 6, fontSize: '0.8rem', fontFamily: mono,
        }}>
          <span style={{ color: SC.bull }}>{bullCount} Bull</span>
          <span style={{ color: SC.textMuted }}>/</span>
          <span style={{ color: SC.bear }}>{bearCount} Bear</span>
          {neutCount > 0 && <>
            <span style={{ color: SC.textMuted }}>/</span>
            <span style={{ color: SC.neutral }}>{neutCount} Neut</span>
          </>}
        </div>
      </div>

      {/* ── 01 SIGNAL SCORECARD ───────────────────── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={sectionTitle}>
          <span style={numBadge}>01</span>
          Signal Scorecard
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {CATEGORY_ORDER.map((cat) => {
            const modules = grouped.get(cat);
            if (!modules || modules.length === 0) return null;
            const sorted = [...modules].sort((a, b) => b.conviction - a.conviction);
            const catBull = sorted.filter(m => m.signal === 'bullish').length;
            const catBear = sorted.filter(m => m.signal === 'bearish').length;

            return (
              <div key={cat} style={card}>
                <div style={cardHeader}>
                  <span style={cardTitle}>{cat}</span>
                  <span style={{ fontFamily: mono, fontSize: '0.7rem' }}>
                    <span style={{ color: SC.bull }}>{catBull}B</span>
                    <span style={{ color: SC.textMuted }}>{' / '}</span>
                    <span style={{ color: SC.bear }}>{catBear}R</span>
                  </span>
                </div>
                {sorted.map((m, i) => (
                  <div
                    key={m.id}
                    style={{
                      ...statRow,
                      borderTop: i > 0 ? `1px solid ${SC.borderDim}` : undefined,
                    }}
                  >
                    <span style={{ color: SC.text, fontWeight: 600, fontSize: '0.875rem' }}>
                      {m.name}
                      {m.hasConflict && <span style={{ color: SC.accent, marginLeft: 6, fontSize: '0.7rem' }}>&#x26A1;</span>}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <SignalBadge signal={m.signal} />
                      <ConvictionBar value={m.conviction} signal={m.signal} />
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <Divider />

      {/* ── 02 CONFLICTS ──────────────────────────── */}
      {sortedConflicts.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={sectionTitle}>
            <span style={numBadge}>02</span>
            Conflicts
            <Badge label={`${sortedConflicts.length}`} color={SC.bear} />
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {visibleConflicts.map((c) => {
              const sevClr = SEVERITY_CLR[c.severity];
              return (
                <div key={c.id} style={{ ...card, borderLeft: `3px solid ${sevClr}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Badge label={c.severity} color={sevClr} />
                      <span style={{ fontFamily: mono, fontSize: '0.9rem', fontWeight: 600, color: SC.text }}>
                        {c.moduleA.name} <span style={{ color: SC.textMuted }}>vs</span> {c.moduleB.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <SignalBadge signal={c.moduleA.signal} />
                      <SignalBadge signal={c.moduleB.signal} />
                    </div>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: SC.textSecondary, lineHeight: 1.6, fontFamily: mono }}>
                    {c.nature}
                  </p>
                  {c.historicalAnalog && (
                    <div style={{
                      marginTop: '0.6rem', padding: '0.4rem 0.7rem',
                      background: SC.surface2, borderRadius: 6,
                      fontFamily: mono, fontSize: '0.8rem', color: SC.textMuted,
                    }}>
                      Last time: {c.historicalAnalog}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {hiddenCount > 0 && (
            <button
              onClick={() => setShowAllConflicts((v) => !v)}
              style={{
                background: 'none', border: `1px solid ${SC.border}`,
                borderRadius: 6, fontFamily: mono, fontSize: '0.8rem',
                color: SC.accent, cursor: 'pointer', padding: '0.4rem 1rem',
                marginTop: '0.75rem',
              }}
            >
              {showAllConflicts ? 'Show less' : `+${hiddenCount} more`}
            </button>
          )}
        </div>
      )}

      <Divider />

      {/* ── 03 CROWDED TRADES ─────────────────────── */}
      {report.crowdedTrades.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={sectionTitle}>
            <span style={numBadge}>03</span>
            Crowded Trades
          </div>
          <div style={card}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Symbol</th>
                  <th style={th}>Direction</th>
                  <th style={{ ...th, textAlign: 'right' }}>z-Score</th>
                  <th style={th}>Analog</th>
                </tr>
              </thead>
              <tbody>
                {report.crowdedTrades.map((ct, i) => {
                  const dirColor = ct.direction === 'LONGS' ? SC.bull : SC.bear;
                  const zColor = ct.zScore > 3.0 ? SC.bear : ct.zScore > 2.5 ? SC.accent : SC.textSecondary;
                  return (
                    <tr key={ct.symbol}>
                      <td style={{ ...td, fontWeight: 600, color: SC.text, borderBottom: i === report.crowdedTrades.length - 1 ? 'none' : td.borderBottom }}>
                        {ct.symbol}
                      </td>
                      <td style={{ ...td, borderBottom: i === report.crowdedTrades.length - 1 ? 'none' : td.borderBottom }}>
                        <Badge label={ct.direction} color={dirColor} />
                      </td>
                      <td style={{ ...td, textAlign: 'right', fontWeight: 600, color: zColor, borderBottom: i === report.crowdedTrades.length - 1 ? 'none' : td.borderBottom }}>
                        {ct.zScore.toFixed(1)}
                      </td>
                      <td style={{ ...td, color: SC.textMuted, fontSize: '0.8rem', borderBottom: i === report.crowdedTrades.length - 1 ? 'none' : td.borderBottom }}>
                        {ct.analog ? `${ct.analog.date}: ${ct.analog.outcome}` : '\u2014'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Divider />

      {/* ── 04 KEY RISK ───────────────────────────── */}
      {report.riskCallout && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={sectionTitle}>
            <span style={numBadge}>04</span>
            Key Risk
          </div>
          <div style={{
            ...card,
            background: 'rgba(201, 77, 77, 0.06)',
            border: '1px solid rgba(201, 77, 77, 0.2)',
          }}>
            <p style={{ fontFamily: mono, fontSize: '0.9rem', color: SC.textSecondary, lineHeight: 1.6 }}>
              <strong style={{ color: SC.bear }}>Risk: </strong>
              {report.riskCallout}
            </p>
          </div>
        </div>
      )}

      {/* ── 05 WHAT CHANGED ───────────────────────── */}
      {report.changes && report.changes.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={sectionTitle}>
            <span style={numBadge}>05</span>
            What Changed
          </div>
          <div style={card}>
            {report.changes.map((ch, i) => {
              const icon = ch.direction === 'up' ? '\u25B2' : ch.direction === 'down' ? '\u25BC' : ch.direction === 'new' ? '\u25CF' : '\u2014';
              const iconClr = ch.direction === 'up' ? SC.bull : ch.direction === 'down' ? SC.bear : ch.direction === 'new' ? SC.accent : SC.textMuted;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex', gap: '0.6rem', padding: '0.4rem 0',
                    fontSize: '0.875rem', fontFamily: mono, color: SC.textSecondary,
                    borderTop: i > 0 ? `1px solid ${SC.borderDim}` : undefined,
                  }}
                >
                  <span style={{ color: iconClr, width: 16, textAlign: 'center', flexShrink: 0, fontSize: '0.7rem', paddingTop: 3 }}>
                    {icon}
                  </span>
                  <span style={{ lineHeight: 1.6 }}>{ch.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <WSStatusBanner />

      <div style={{ textAlign: 'center', padding: '2rem 0', fontFamily: mono, fontSize: '0.75rem', color: SC.textMuted }}>
        Generated by Context8 &middot; Report #{report.reportNumber} &middot; {report.headline.reportDate}
      </div>
    </div>
  );
}
