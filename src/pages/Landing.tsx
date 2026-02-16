import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/* ── Warm amber palette (matches hybrid-amber.html mockup) ── */
const C = {
  bg: '#0C0A08',
  surface: '#161210',
  border: '#2E2A24',
  borderHover: '#443E36',
  text: '#E8E0D4',
  textSecondary: '#9A9080',
  textMuted: '#6B6358',
  accent: '#C49A3C',
  accentDim: 'rgba(196,154,60,0.12)',
  accentBright: '#D4A84B',
  bull: '#4CAF78',
  bear: '#C94D4D',
  bullDim: 'rgba(76,175,120,0.14)',
  bearDim: 'rgba(201,77,77,0.14)',
  radius: '6px',
} as const

const font = {
  sans: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const

/* ── Scorecard data ── */
const modules = [
  { name: 'TA Scanner', signal: 'BULL' as const, detail: 'RSI 58, MACD+', conf: 70 },
  { name: 'Funding', signal: 'BEAR' as const, detail: 'Longs crowded, z:1.4', conf: 80 },
  { name: 'OI Divergence', signal: 'BEAR' as const, detail: 'Shorts accumulating', conf: 65 },
  { name: 'Social', signal: 'BULL' as const, detail: 'Greed index: 72', conf: 55 },
  { name: 'Macro', signal: 'BEAR' as const, detail: 'DXY up, risk-off', conf: 75 },
  { name: 'Fear & Greed', signal: 'BEAR' as const, detail: 'Extreme fear (28)', conf: 60 },
]

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
        <path d="m15 9-6 6" />
      </svg>
    ),
    title: 'Signal Board',
    desc: 'Every module votes bull or bear with a confidence score. You see the full room, not just the loudest voice.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'Crowded Trades',
    desc: 'Z-score rankings of overleveraged positions across exchanges. See where liquidation cascades are building before they trigger.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Divergence Watch',
    desc: 'When sentiment and price disagree, the resolution is often abrupt. We flag the gap and score the conviction.',
  },
]

/* ── Tag component ── */
function SignalTag({ signal }: { signal: 'BULL' | 'BEAR' }) {
  const isBull = signal === 'BULL'
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 3,
        fontFamily: font.mono,
        fontSize: '0.625rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        background: isBull ? C.bullDim : C.bearDim,
        color: isBull ? C.bull : C.bear,
        border: `1px solid ${isBull ? 'rgba(76,175,120,0.25)' : 'rgba(201,77,77,0.25)'}`,
      }}
    >
      {signal}
    </span>
  )
}

/* ── Confidence bar ── */
function ConfBar({ value, signal }: { value: number; signal: 'BULL' | 'BEAR' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 48, height: 4, background: 'rgba(46,42,36,0.8)', borderRadius: 2, overflow: 'hidden' }}>
        <span style={{ display: 'block', height: '100%', width: `${value}%`, borderRadius: 2, background: signal === 'BULL' ? C.bull : C.bear }} />
      </span>
      <span style={{ fontFamily: font.mono, fontSize: '0.6875rem', color: C.textMuted, minWidth: 28, textAlign: 'right' as const }}>{value}%</span>
    </span>
  )
}

/* ── Main Landing Page ── */
export function Landing() {
  const navigate = useNavigate()
  const featRef = useRef(null)
  const apiRef = useRef(null)
  const ctaRef = useRef(null)
  const isFeatInView = useInView(featRef, { once: true, margin: '-80px' })
  const isApiInView = useInView(apiRef, { once: true, margin: '-80px' })
  const isCtaInView = useInView(ctaRef, { once: true, margin: '-80px' })

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: font.sans, WebkitFontSmoothing: 'antialiased' }}>

      {/* ── NAV ── */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: 56,
          borderBottom: `1px solid ${C.border}`,
          background: 'rgba(12,10,8,0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: '0.95rem', color: C.text, textDecoration: 'none' }}>
          <span style={{ color: C.accent, fontFamily: font.mono, fontWeight: 600, fontSize: '0.85rem' }}>&#9670;</span>
          Context8
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" style={{ fontSize: '0.875rem', fontWeight: 600, color: C.textSecondary, textDecoration: 'none' }} className="hidden md:inline">Features</a>
          <a href="#api" style={{ fontSize: '0.875rem', fontWeight: 600, color: C.textSecondary, textDecoration: 'none' }} className="hidden md:inline">API</a>
          <button
            onClick={() => navigate('/dashboard/report/latest')}
            style={{
              fontSize: '0.8125rem', fontWeight: 600, color: C.bg, background: C.accent,
              padding: '7px 16px', borderRadius: C.radius, border: 'none', cursor: 'pointer',
            }}
          >
            View Report
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left copy */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px 4px 8px', background: C.accentDim,
                border: '1px solid rgba(196,154,60,0.2)', borderRadius: 100,
                fontSize: '0.75rem', fontWeight: 600, color: C.accent, marginBottom: 20,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, animation: 'pulse 2s ease-in-out infinite' }} />
                Live signal analysis across 23 modules
              </div>

              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: 16 }}>
                Your signals agree.<br />That's the problem.
              </h1>

              <p style={{ display: 'block', color: C.accent, fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
                Agreement is noise. Conflict is signal.
              </p>

              <p style={{ fontSize: '1.0625rem', color: C.textSecondary, lineHeight: 1.6, marginBottom: 28, maxWidth: 440 }}>
                23 independent AI modules score every crypto asset. When they conflict, you see what consensus traders miss. One API call. Full scorecard.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 32 }}>
                {[
                  { num: '23', label: 'AI Modules' },
                  { num: '<200ms', label: 'Response Time' },
                  { num: '5 min', label: 'To First Signal' },
                ].map(s => (
                  <div key={s.label} style={{ border: `1px solid ${C.border}`, borderRadius: C.radius, padding: 16, background: C.surface }}>
                    <div style={{ fontFamily: font.mono, fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 600, color: C.accent, lineHeight: 1, marginBottom: 4, whiteSpace: 'nowrap' }}>{s.num}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/dashboard/report/latest')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '11px 22px', background: C.accent, color: C.bg,
                    fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600,
                    border: 'none', borderRadius: C.radius, cursor: 'pointer',
                  }}
                >
                  View Today's Report
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
                <a
                  href="#api"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '11px 22px', background: 'transparent', color: C.textSecondary,
                    fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600,
                    border: `1px solid ${C.border}`, borderRadius: C.radius, textDecoration: 'none',
                  }}
                >
                  View Docs
                </a>
              </div>
            </motion.div>

            {/* Right: Scorecard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: C.radius, overflow: 'hidden' }}
            >
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 16px', borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{ fontFamily: font.mono, fontSize: '0.6875rem', fontWeight: 600, color: C.textSecondary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Signal Scorecard
                </span>
                <span style={{ fontFamily: font.mono, fontSize: '0.6875rem', color: C.textMuted }}>BTC / USDT</span>
              </div>

              {/* Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Module', 'Signal', 'Confidence', 'Weight'].map(h => (
                      <th key={h} style={{
                        fontFamily: font.mono, fontSize: '0.625rem', fontWeight: 600,
                        color: C.textMuted, textAlign: h === 'Weight' ? 'right' : 'left',
                        padding: '7px 16px', borderBottom: `1px solid ${C.border}`,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modules.map((m, i) => (
                    <tr key={m.name} style={{ background: i % 2 === 0 ? C.surface : 'rgba(22,18,16,0.5)' }}>
                      <td style={{ fontFamily: font.mono, fontSize: '0.8125rem', padding: '7px 16px', color: C.text, fontWeight: 600, whiteSpace: 'nowrap', borderBottom: i < modules.length - 1 ? '1px solid rgba(46,42,36,0.5)' : 'none' }}>
                        {m.name}
                      </td>
                      <td style={{ fontFamily: font.mono, fontSize: '0.8125rem', padding: '7px 16px', borderBottom: i < modules.length - 1 ? '1px solid rgba(46,42,36,0.5)' : 'none' }}>
                        <SignalTag signal={m.signal} />
                      </td>
                      <td style={{ fontFamily: font.mono, fontSize: '0.75rem', padding: '7px 16px', color: C.textMuted, borderBottom: i < modules.length - 1 ? '1px solid rgba(46,42,36,0.5)' : 'none' }}>
                        {m.detail}
                      </td>
                      <td style={{ fontFamily: font.mono, fontSize: '0.8125rem', padding: '7px 16px', textAlign: 'right', borderBottom: i < modules.length - 1 ? '1px solid rgba(46,42,36,0.5)' : 'none' }}>
                        <ConfBar value={m.conf} signal={m.signal} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Verdict */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 16px', borderTop: `1px solid ${C.border}`,
                background: 'rgba(196,154,60,0.04)',
              }}>
                <span style={{ fontFamily: font.mono, fontSize: '0.75rem', fontWeight: 600, color: C.accent }}>
                  BEARISH 4-2 — 4 modules disagree
                </span>
                <span style={{ fontFamily: font.mono, fontSize: '0.6875rem', color: C.textMuted }}>
                  Conviction: 3 / 10
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <motion.section
        id="features"
        ref={featRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isFeatInView ? 1 : 0, y: isFeatInView ? 0 : 20 }}
        transition={{ duration: 0.6 }}
        style={{ paddingBottom: 80 }}
      >
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isFeatInView ? 1 : 0, y: isFeatInView ? 0 : 20 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: C.radius, padding: 24,
                  transition: 'border-color 200ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHover)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
              >
                <div style={{
                  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: C.accentDim, borderRadius: C.radius, marginBottom: 16, color: C.accent,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: 8, color: C.text }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: C.textSecondary, lineHeight: 1.55 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── API PREVIEW ── */}
      <motion.section
        id="api"
        ref={apiRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isApiInView ? 1 : 0, y: isApiInView ? 0 : 20 }}
        transition={{ duration: 0.6 }}
        style={{ paddingBottom: 80 }}
      >
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontFamily: font.mono, fontSize: '0.75rem', fontWeight: 600, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            API
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 24, color: C.text }}>
            One call. Full scorecard.
          </h2>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: C.radius, overflow: 'hidden' }}>
            {/* Window chrome */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
              <span style={{ fontFamily: font.mono, fontSize: '0.75rem', color: C.textSecondary, marginLeft: 8 }}>terminal</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Request */}
              <div style={{ borderRight: undefined }} className="md:border-r" >
                <div style={{ fontFamily: font.mono, fontSize: '0.625rem', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 20px', borderBottom: `1px solid ${C.border}` }}>
                  Request
                </div>
                <div style={{ padding: '16px 20px', fontFamily: font.mono, fontSize: '0.8125rem', lineHeight: 1.7, color: C.textSecondary, overflowX: 'auto' }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre' }}>
                    <span style={{ color: C.text }}>curl</span>{' '}<span style={{ color: C.textSecondary }}>https://api.context8.markets/v1/signals</span>{' \\\n  '}<span style={{ color: C.textMuted }}>-H</span>{' '}<span style={{ color: C.accent }}>"Authorization: Bearer ctx8_sk_..."</span>{' \\\n  '}<span style={{ color: C.textMuted }}>-d</span>{' '}<span style={{ color: C.accent }}>'{`{"asset": "BTC", "modules": "all"}`}'</span>
                  </pre>
                </div>
              </div>

              {/* Response */}
              <div className="border-t md:border-t-0" style={{ borderColor: C.border }}>
                <div style={{ fontFamily: font.mono, fontSize: '0.625rem', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 20px', borderBottom: `1px solid ${C.border}` }}>
                  Response
                </div>
                <div style={{ padding: '16px 20px', fontFamily: font.mono, fontSize: '0.8125rem', lineHeight: 1.7, color: C.textSecondary, overflowX: 'auto' }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre' }}>{`{`}
{'\n  '}<span style={{ color: '#A08060' }}>"asset"</span>: <span style={{ color: C.accent }}>"BTC"</span>,
{'\n  '}<span style={{ color: '#A08060' }}>"verdict"</span>: <span style={{ color: C.bear }}>"BEARISH"</span>,
{'\n  '}<span style={{ color: '#A08060' }}>"score"</span>: <span style={{ color: C.accent }}>"4-2"</span>,
{'\n  '}<span style={{ color: '#A08060' }}>"conviction"</span>: <span style={{ color: C.accentBright }}>3</span>,
{'\n  '}<span style={{ color: '#A08060' }}>"conflicts"</span>: <span style={{ color: C.accentBright }}>4</span>,
{'\n  '}<span style={{ color: '#A08060' }}>"modules"</span>: [
{'\n    '}{`{ `}<span style={{ color: '#A08060' }}>"name"</span>: <span style={{ color: C.accent }}>"ta_scanner"</span>,  <span style={{ color: '#A08060' }}>"signal"</span>: <span style={{ color: C.bull }}>"BULL"</span>, <span style={{ color: '#A08060' }}>"conf"</span>: <span style={{ color: C.accentBright }}>0.70</span>{` }`},
{'\n    '}{`{ `}<span style={{ color: '#A08060' }}>"name"</span>: <span style={{ color: C.accent }}>"funding"</span>,     <span style={{ color: '#A08060' }}>"signal"</span>: <span style={{ color: C.bear }}>"BEAR"</span>, <span style={{ color: '#A08060' }}>"conf"</span>: <span style={{ color: C.accentBright }}>0.80</span>{` }`},
{'\n    '}{`{ `}<span style={{ color: '#A08060' }}>"name"</span>: <span style={{ color: C.accent }}>"oi_diverge"</span>,  <span style={{ color: '#A08060' }}>"signal"</span>: <span style={{ color: C.bear }}>"BEAR"</span>, <span style={{ color: '#A08060' }}>"conf"</span>: <span style={{ color: C.accentBright }}>0.65</span>{` }`},
{'\n    '}{`{ `}<span style={{ color: '#A08060' }}>"name"</span>: <span style={{ color: C.accent }}>"social"</span>,      <span style={{ color: '#A08060' }}>"signal"</span>: <span style={{ color: C.bull }}>"BULL"</span>, <span style={{ color: '#A08060' }}>"conf"</span>: <span style={{ color: C.accentBright }}>0.55</span>{` }`},
{'\n    '}{`{ `}<span style={{ color: '#A08060' }}>"name"</span>: <span style={{ color: C.accent }}>"macro"</span>,       <span style={{ color: '#A08060' }}>"signal"</span>: <span style={{ color: C.bear }}>"BEAR"</span>, <span style={{ color: '#A08060' }}>"conf"</span>: <span style={{ color: C.accentBright }}>0.75</span>{` }`},
{'\n    '}{`{ `}<span style={{ color: '#A08060' }}>"name"</span>: <span style={{ color: C.accent }}>"fear_greed"</span>,  <span style={{ color: '#A08060' }}>"signal"</span>: <span style={{ color: C.bear }}>"BEAR"</span>, <span style={{ color: '#A08060' }}>"conf"</span>: <span style={{ color: C.accentBright }}>0.60</span>{` }`}
{'\n  '}]
{'\n'}{`}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section
        ref={ctaRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isCtaInView ? 1 : 0, y: isCtaInView ? 0 : 20 }}
        transition={{ duration: 0.6 }}
        style={{ padding: '64px 0 80px', textAlign: 'center' }}
      >
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: C.text }}>
            Stop trading on consensus.
          </h2>
          <p style={{ color: C.textSecondary, fontSize: '1rem', marginBottom: 32 }}>
            Free tier. Bearer token auth. JSON response. Ship in five minutes.
          </p>
          <button
            onClick={() => navigate('/dashboard/report/latest')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', background: C.accent, color: C.bg,
              fontFamily: 'inherit', fontSize: '0.9375rem', fontWeight: 600,
              border: 'none', borderRadius: C.radius, cursor: 'pointer',
            }}
          >
            View Today's Report
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </button>
        </div>
      </motion.section>

      {/* ── STATUS ── */}
      <section id="status" style={{ padding: '56px 0 64px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: C.radius,
              padding: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 8,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  letterSpacing: '-0.01em',
                  color: C.text,
                }}
              >
                Status
              </h3>
              <span
                style={{
                  fontFamily: font.mono,
                  fontSize: '0.6875rem',
                  color: C.textMuted,
                  border: `1px solid ${C.border}`,
                  background: 'rgba(22,18,16,0.5)',
                  borderRadius: 999,
                  padding: '3px 10px',
                  whiteSpace: 'nowrap',
                }}
              >
                Beta
              </span>
            </div>
            <p style={{ margin: 0, color: C.textSecondary, fontSize: '0.9375rem', lineHeight: 1.55 }}>
              Public status page is coming soon. For now, local development uses mocked auth and API routes in E2E.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '24px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <span style={{ fontSize: '0.8125rem', color: C.textMuted }}>
              &copy; 2026 Context8. All rights reserved.
            </span>
            <div style={{ display: 'flex', gap: 24 }}>
              {(
                [
                  { label: 'Docs', href: '#api' },
                  { label: 'Status', href: '#status' },
                  { label: 'GitHub', href: 'https://github.com/forgequant/context8-landing' },
                ] as const
              ).map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{ fontSize: '0.8125rem', color: C.textMuted, textDecoration: 'none' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* pulse animation for badge dot */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .md\\:border-r { border-right-color: ${C.border}; }
        .border-t { border-top-color: ${C.border}; }
      `}</style>
    </div>
  )
}
