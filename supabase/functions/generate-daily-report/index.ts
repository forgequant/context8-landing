// Supabase Edge Function: Generate Daily Market Report
// Fetches data from LunarCrush, sends to OpenAI for analysis, stores result
// Triggered manually or via scheduled cron

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ============================================================================
// TYPES
// ============================================================================

interface DailyReport {
  report_date: string
  metrics: {
    unique_creators: number | null
    unique_creators_change: number | null
    market_sentiment: number | null
    market_sentiment_change: number | null
    defi_engagements: number | null
    defi_engagements_change: number | null
    ai_creators: number | null
    ai_creators_change: number | null
  }
  executive_summary: Array<{
    direction: 'up' | 'down' | 'neutral'
    text: string
  }>
  narratives: Array<{
    title: string
    status: 'hot' | 'warm' | 'cold'
    description: string
  }>
  top_movers: Array<{
    symbol: string
    name: string
    change_24h: number
    change_7d: number | null
    social: 'High' | 'Medium' | 'Low'
    sentiment: number
    comment: string
  }>
  influencers: Array<{
    name: string
    followers: number
    engagement: number
    sentiment: 'bullish' | 'bearish' | 'neutral'
    focus: string[]
  }>
  risks: Array<{
    level: 'high' | 'medium' | 'low'
    label: string
  }>
}

// ============================================================================
// LUNARCRUSH API
// ============================================================================

const LUNARCRUSH_BASE = 'https://lunarcrush.com/api4/public'

async function fetchLunarCrush<T>(
  endpoint: string,
  apiKey: string,
  params: Record<string, string> = {}
): Promise<T | null> {
  const url = new URL(`${LUNARCRUSH_BASE}${endpoint}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) {
      console.error(`[LunarCrush] ${endpoint} failed:`, res.status)
      return null
    }
    return await res.json()
  } catch (error) {
    console.error(`[LunarCrush] ${endpoint} error:`, error)
    return null
  }
}

async function fetchMarketData(apiKey: string) {
  const [coinsData, cryptoTopic, defiTopic] = await Promise.all([
    fetchLunarCrush<{ data: any[] }>('/coins/list/v2', apiKey, {
      sort: 'galaxy_score',
      limit: '50',
    }),
    fetchLunarCrush<{ data: any }>('/topic/crypto/v1', apiKey),
    fetchLunarCrush<{ data: any }>('/topic/defi/v1', apiKey),
  ])

  return {
    coins: coinsData?.data ?? [],
    crypto: cryptoTopic?.data ?? null,
    defi: defiTopic?.data ?? null,
  }
}

// ============================================================================
// OPENAI API
// ============================================================================

async function generateReportWithOpenAI(
  openaiKey: string,
  marketData: any
): Promise<DailyReport | null> {
  const today = new Date().toISOString().split('T')[0]

  const systemPrompt = `You are a crypto market analyst. Generate a daily market report based on the provided data.
Output ONLY valid JSON matching this exact structure (no markdown, no explanation):

{
  "metrics": {
    "unique_creators": number or null,
    "unique_creators_change": number or null,
    "market_sentiment": number (0-100) or null,
    "market_sentiment_change": number or null,
    "defi_engagements": number or null,
    "defi_engagements_change": number or null,
    "ai_creators": null,
    "ai_creators_change": null
  },
  "executive_summary": [
    {"direction": "up"|"down"|"neutral", "text": "Brief insight about market"}
  ],
  "narratives": [
    {"title": "Theme name", "status": "hot"|"warm"|"cold", "description": "Brief description"}
  ],
  "top_movers": [
    {"symbol": "BTC", "name": "Bitcoin", "change_24h": 2.5, "change_7d": 5.0, "social": "High"|"Medium"|"Low", "sentiment": 75, "comment": "Brief analysis"}
  ],
  "influencers": [],
  "risks": [
    {"level": "high"|"medium"|"low", "label": "Risk description"}
  ]
}

Rules:
- executive_summary: 3-5 key insights with direction indicators
- narratives: 3-4 trending themes/sectors
- top_movers: Top 5-8 movers by significance (mix of gainers and losers)
- risks: 2-4 risk factors to watch
- Be concise and data-driven
- sentiment is 0-100 scale`

  const userPrompt = `Generate today's (${today}) crypto market report from this LunarCrush data:

TOP COINS BY GALAXY SCORE:
${JSON.stringify(marketData.coins.slice(0, 20), null, 2)}

CRYPTO TOPIC OVERVIEW:
${JSON.stringify(marketData.crypto, null, 2)}

DEFI TOPIC OVERVIEW:
${JSON.stringify(marketData.defi, null, 2)}

Analyze the data and generate a comprehensive daily report.`

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('[OpenAI] API error:', res.status, error)
      return null
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error('[OpenAI] No content in response')
      return null
    }

    // Parse JSON from response (handle potential markdown wrapping)
    let jsonStr = content.trim()
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    const report = JSON.parse(jsonStr)
    return {
      report_date: today,
      ...report,
    }
  } catch (error) {
    console.error('[OpenAI] Error:', error)
    return null
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // Validate authorization
    // Accepts: service role key, webhook secret, internal-trigger, or anon key (for Dashboard)
    const authHeader = req.headers.get('authorization')
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')

    const token = authHeader?.replace('Bearer ', '')

    // Log for debugging (remove in production)
    console.log('[Auth] Token prefix:', token?.substring(0, 20))
    console.log('[Auth] Service key prefix:', serviceRoleKey?.substring(0, 20))

    const isAuthorized =
      token === 'internal-trigger' ||
      (webhookSecret && token === webhookSecret) ||
      (serviceRoleKey && token === serviceRoleKey) ||
      (anonKey && token === anonKey) ||
      token?.startsWith('eyJ') // Accept any valid JWT (Supabase tokens start with eyJ)

    if (!isAuthorized) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const lunarcrushKey = Deno.env.get('LUNARCRUSH_API_KEY')
    const openaiKey = Deno.env.get('OPENAI_API_KEY')

    if (!lunarcrushKey) {
      return new Response('Missing LUNARCRUSH_API_KEY', { status: 500 })
    }
    if (!openaiKey) {
      return new Response('Missing OPENAI_API_KEY', { status: 500 })
    }

    console.log('[generate-daily-report] Fetching market data...')

    // 1. Fetch market data from LunarCrush
    const marketData = await fetchMarketData(lunarcrushKey)

    if (marketData.coins.length === 0) {
      return new Response('Failed to fetch market data', { status: 502 })
    }

    console.log('[generate-daily-report] Generating report with OpenAI...')

    // 2. Generate report with OpenAI
    const report = await generateReportWithOpenAI(openaiKey, marketData)

    if (!report) {
      return new Response('Failed to generate report', { status: 500 })
    }

    console.log('[generate-daily-report] Saving to database...')

    // 3. Save to database
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('daily_reports')
      .upsert(
        {
          report_date: report.report_date,
          metrics: report.metrics,
          executive_summary: report.executive_summary,
          narratives: report.narratives,
          top_movers: report.top_movers,
          influencers: report.influencers,
          risks: report.risks,
          raw_data: marketData,
          status: 'draft',
          generated_at: new Date().toISOString(),
        },
        { onConflict: 'report_date' }
      )
      .select()
      .single()

    if (error) {
      console.error('[generate-daily-report] DB error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    console.log('[generate-daily-report] Success:', data?.id)

    return new Response(
      JSON.stringify({
        success: true,
        report_id: data?.id,
        report_date: report.report_date,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[generate-daily-report] Error:', error)
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
