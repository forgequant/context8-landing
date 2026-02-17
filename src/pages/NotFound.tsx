import { Link } from 'react-router-dom'

const C = {
  bg: '#0C0A08',
  surface: '#161210',
  border: '#2E2A24',
  text: '#E8E0D4',
  textSecondary: '#9A9080',
  textMuted: '#6B6358',
  accent: '#C49A3C',
  radius: '6px',
} as const

const font = {
  sans: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const

export function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        color: C.text,
        fontFamily: font.sans,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 720,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: C.radius,
          padding: 24,
        }}
      >
        <div
          style={{
            fontFamily: font.mono,
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: C.textMuted,
            marginBottom: 10,
          }}
        >
          404
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          Page not found
        </h1>
        <p style={{ marginTop: 10, marginBottom: 0, color: C.textSecondary, lineHeight: 1.6 }}>
          This URL is not part of the current product surface.
        </p>

        <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 16px',
              background: C.accent,
              color: C.bg,
              borderRadius: C.radius,
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            Go to landing
          </Link>
          <Link
            to="/dashboard/report/latest"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 16px',
              background: 'transparent',
              color: C.textSecondary,
              borderRadius: C.radius,
              border: `1px solid ${C.border}`,
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            Open Daily Disagree
          </Link>
        </div>
      </div>
    </div>
  )
}

