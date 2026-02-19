import { describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
  }),
}))

import { normalizeFromCtx8Report, type Ctx8Report } from './useDailyDisagreeReport'

function makeBaseV2Payload() {
  return {
    headline: 'Market is mixed',
    conviction_scores: [
      {
        symbol: 'BTCUSDT',
        score: 6,
        bullish_modules: 2,
        bearish_modules: 1,
        neutral_modules: 0,
        modules: [
          { module: 'funding', bias: 'bearish', confidence: 80, summary: 'Crowded longs' },
          { module: 'social', bias: 'bullish', confidence: 60, summary: 'Narrative rotation' },
          { module: 'macro', bias: 'bullish', confidence: 55, summary: 'Rates steady' },
        ],
      },
    ],
    crowded_trades: [
      {
        symbol: 'DOGEUSDT',
        direction: 'long',
        z_score: 3.1,
        historical_analog: { date: '2026-02-10', outcome_pct: -12, outcome_days: 2 },
      },
    ],
    divergences: [
      {
        symbol: 'ETHUSDT',
        type: 'social_price',
        description: 'Sentiment diverges from price',
        strength: 14,
      },
    ],
    macro_regime: {
      bias: 'mixed',
      feargreed_value: 49,
      dxy_trend: 'flat',
      summary: 'Macro balanced',
    },
  }
}

function makeReport(version: number, payload: unknown): Ctx8Report {
  return {
    id: 'rep-1',
    asset: 'MARKET',
    report_date: '2026-02-19',
    headline: 'Market is mixed',
    payload,
    status: 'published',
    version,
    created_at: '2026-02-19T10:00:00Z',
    published_at: '2026-02-19T10:00:00Z',
  }
}

describe('normalizeFromCtx8Report', () => {
  it('normalizes version 2 payloads', () => {
    const report = normalizeFromCtx8Report(makeReport(2, makeBaseV2Payload()))

    expect(report.version).toBe(2)
    expect(report.modules).toHaveLength(3)
    expect(report.conflicts).toHaveLength(1)
    expect(report.assets[0]?.symbol).toBe('BTC')
    expect(report.riskCallout).toBe('Macro balanced')
  })

  it('normalizes version 3 payloads with collectors/sections/quality', () => {
    const payload = {
      ...makeBaseV2Payload(),
      generated_at: '2026-02-19T10:00:00Z',
      collectors: {
        derivatives: { status: 'ok', confidence: 80, as_of: '2026-02-19T09:58:00Z', sources: ['binance'] },
        macro: { status: 'partial', confidence: 61, as_of: '2026-02-19T09:57:00Z', sources: ['fred'] },
        social: { status: 'unavailable', confidence: 0, as_of: '2026-02-19T09:56:00Z', sources: ['lunarcrush'] },
        flows: { status: 'ok', confidence: 74, as_of: '2026-02-19T09:55:00Z', sources: ['defillama'] },
      },
      sections: {
        trade_setups: [{ symbol: 'BTCUSDT', bias: 'bullish', thesis: 'Funding reset', confidence: 72 }],
        risk_flags: [{ key: 'event-risk', severity: 'medium', summary: 'Macro print in 12h' }],
        narrative_bullets: [{ topic: 'AI beta', summary: 'Volume uptick', sentiment: 'bullish' }],
        avoid_list: [{ symbol: 'DOGEUSDT', reason: 'Crowded long' }],
      },
      quality: {
        overall: 'amber',
        coverage_pct: 76.5,
        warnings: ['social degraded'],
      },
      fallbacks: {
        notes: ['social collector degraded'],
      },
    }

    const report = normalizeFromCtx8Report(makeReport(3, payload))

    expect(report.version).toBe(3)
    expect(report.collectors?.social.status).toBe('unavailable')
    expect(report.sections?.tradeSetups[0]?.symbol).toBe('BTC')
    expect(report.quality?.overall).toBe('amber')
    expect(report.fallbackNotes).toEqual(['social collector degraded'])
    expect(report.v3FallbackUsed).toBeUndefined()
  })

  it('falls back to fallbacks.v2_payload when v3 blocks are malformed', () => {
    const payload = {
      ...makeBaseV2Payload(),
      generated_at: '2026-02-19T10:00:00Z',
      collectors: null,
      sections: null,
      quality: null,
      fallbacks: {
        v2_payload: makeBaseV2Payload(),
        notes: ['fallback used'],
      },
    }

    const report = normalizeFromCtx8Report(makeReport(3, payload))

    expect(report.version).toBe(3)
    expect(report.v3FallbackUsed).toBe(true)
    expect(report.sections).toBeUndefined()
    expect(report.modules).toHaveLength(3)
    expect(report.fallbackNotes).toEqual(['fallback used'])
  })

  it('throws for unsupported versions', () => {
    expect(() => normalizeFromCtx8Report(makeReport(99, makeBaseV2Payload()))).toThrow(/Unsupported report version/i)
  })

  it('throws for malformed v3 payload without fallback', () => {
    const malformedV3 = {
      ...makeBaseV2Payload(),
      generated_at: '2026-02-19T10:00:00Z',
      collectors: null,
      sections: null,
      quality: null,
    }

    expect(() => normalizeFromCtx8Report(makeReport(3, malformedV3))).toThrow(/malformed/i)
  })
})
