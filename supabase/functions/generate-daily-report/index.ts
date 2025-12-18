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
// MCP API (Context8)
// ============================================================================

const MCP_BASE = 'https://context8.fastmcp.app/mcp'

async function callMcpTool<T>(
  toolName: string,
  args: Record<string, any> = {},
  apiKey?: string
): Promise<T | null> {
  try {
    const res = await fetch(MCP_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: { ...args, api_key: apiKey },
        },
      }),
    })

    if (!res.ok) {
      console.error(`[MCP] ${toolName} failed:`, res.status)
      return null
    }

    // MCP returns SSE format: "event: message\ndata: {...}"
    const text = await res.text()
    const dataLine = text.split('\n').find((line) => line.startsWith('data: '))
    if (!dataLine) {
      console.error(`[MCP] ${toolName} no data in response`)
      return null
    }

    const data = JSON.parse(dataLine.replace('data: ', ''))
    if (data.error) {
      console.error(`[MCP] ${toolName} error:`, data.error)
      return null
    }

    // MCP returns result in content array
    const content = data.result?.content?.[0]
    if (content?.type === 'text') {
      try {
        return JSON.parse(content.text)
      } catch {
        console.error(`[MCP] ${toolName} failed to parse:`, content.text?.substring(0, 200))
        return null
      }
    }
    return data.result
  } catch (error) {
    console.error(`[MCP] ${toolName} error:`, error)
    return null
  }
}

async function fetchMarketData(apiKey: string) {
  // Top coins to analyze
  const symbols = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'LINK', 'DOT', 'MATIC']
  const tradingPairs = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT']

  console.log('[fetchMarketData] Starting parallel data fetch...')

  // PHASE 1: Core data (coins, fear/greed, fear/greed history)
  const [fearGreed, fearGreedHistory, ...coinResults] = await Promise.all([
    callMcpTool<{ value: number; classification: string }>('get_fear_greed_index', {}, apiKey),
    callMcpTool<{ data: any[]; count: number }>('get_fear_greed_history', {}, apiKey),
    ...symbols.map((symbol) =>
      callMcpTool<{ data: any }>('lunarcrush_get_coin', { symbol }, apiKey)
    ),
  ])

  console.log('[fetchMarketData] Phase 1 complete. Coins:', coinResults.filter(r => r?.data).length)

  // PHASE 2: Social & sentiment data
  const [sentimentResults, newsResults, galaxyScores, altRanks] = await Promise.all([
    // Sentiment for top 5 coins
    Promise.all(
      symbols.slice(0, 5).map((symbol) =>
        callMcpTool<any>('lunarcrush_get_sentiment', { symbol }, apiKey)
      )
    ),
    // News for BTC and ETH
    Promise.all([
      callMcpTool<any>('lunarcrush_get_news', { symbol: 'BTC' }, apiKey),
      callMcpTool<any>('lunarcrush_get_news', { symbol: 'ETH' }, apiKey),
    ]),
    // Galaxy scores for all coins
    Promise.all(
      symbols.map((symbol) =>
        callMcpTool<{ symbol: string; galaxy_score: number }>('lunarcrush_get_galaxy_score', { symbol }, apiKey)
      )
    ),
    // AltRank for all coins
    Promise.all(
      symbols.map((symbol) =>
        callMcpTool<{ symbol: string; alt_rank: number }>('lunarcrush_get_altrank', { symbol }, apiKey)
      )
    ),
  ])

  console.log('[fetchMarketData] Phase 2 complete. Sentiment:', sentimentResults.filter(Boolean).length)

  // PHASE 3: Technical analysis (detailed indicators)
  const [technicalSummaries, rsiData, macdData, bollingerData, emaCrossovers] = await Promise.all([
    // Technical summaries
    Promise.all(
      tradingPairs.map((symbol) =>
        callMcpTool<any>('get_technical_summary', { symbol, interval: '4h' }, apiKey)
      )
    ),
    // RSI for top 3
    Promise.all(
      tradingPairs.slice(0, 3).map((symbol) =>
        callMcpTool<any>('get_rsi', { symbol, interval: '4h' }, apiKey)
      )
    ),
    // MACD for top 3
    Promise.all(
      tradingPairs.slice(0, 3).map((symbol) =>
        callMcpTool<any>('get_macd', { symbol, interval: '4h' }, apiKey)
      )
    ),
    // Bollinger Bands for top 3
    Promise.all(
      tradingPairs.slice(0, 3).map((symbol) =>
        callMcpTool<any>('get_bollinger_bands', { symbol, interval: '4h' }, apiKey)
      )
    ),
    // EMA crossovers for top 3
    Promise.all(
      tradingPairs.slice(0, 3).map((symbol) =>
        callMcpTool<any>('get_ema_crossover', { symbol, interval: '4h' }, apiKey)
      )
    ),
  ])

  console.log('[fetchMarketData] Phase 3 complete. Technicals:', technicalSummaries.filter(Boolean).length)

  // Process coin data with additional metrics
  const coins = coinResults
    .map((r, idx) => {
      if (!r?.data) return null
      const coin = r.data
      const gs = galaxyScores[idx]
      const ar = altRanks[idx]
      return {
        ...coin,
        galaxy_score: gs?.galaxy_score ?? coin.galaxy_score,
        alt_rank: ar?.alt_rank ?? null,
      }
    })
    .filter(Boolean)

  // Calculate total social stats
  const totalContributors = sentimentResults.reduce(
    (sum, r) => sum + (r?.num_contributors || 0), 0
  )
  const totalInteractions = sentimentResults.reduce(
    (sum, r) => sum + (r?.interactions_24h || 0), 0
  )

  // Calculate fear/greed trend
  const fgHistory = fearGreedHistory?.data || []
  const fgTrend = fgHistory.length >= 7
    ? {
        week_ago: fgHistory[6]?.value,
        trend: fgHistory[0]?.value > fgHistory[6]?.value ? 'improving' : 'declining',
        avg_7d: Math.round(fgHistory.slice(0, 7).reduce((s, d) => s + d.value, 0) / 7),
      }
    : null

  // Combine news
  const allNews = [
    ...(newsResults[0]?.data || []),
    ...(newsResults[1]?.data || []),
  ].slice(0, 10)

  // Combine technical data
  const technicals = tradingPairs.slice(0, 3).map((symbol, idx) => ({
    symbol,
    summary: technicalSummaries[idx],
    rsi: rsiData[idx],
    macd: macdData[idx],
    bollinger: bollingerData[idx],
    ema: emaCrossovers[idx],
  }))

  console.log('[fetchMarketData] Data aggregation complete')

  return {
    coins,
    fearGreed: fearGreed ?? null,
    fearGreedTrend: fgTrend,
    technicals,
    sentiment: sentimentResults.filter(Boolean),
    news: allNews,
    socialStats: {
      totalContributors,
      totalInteractions,
    },
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

  const systemPrompt = `You are a senior crypto market analyst creating a professional daily briefing.
Output ONLY valid JSON matching this exact structure (no markdown, no explanation):

{
  "metrics": {
    "unique_creators": number (from total creators data),
    "unique_creators_change": number (estimate % change, can be negative),
    "market_sentiment": number (0-100, from fear/greed),
    "market_sentiment_change": number (estimate vs average),
    "defi_engagements": number (total interactions in millions),
    "defi_engagements_change": number (estimate % change),
    "ai_creators": null,
    "ai_creators_change": null
  },
  "executive_summary": [
    {"direction": "up"|"down"|"neutral", "text": "Specific insight with data points"}
  ],
  "narratives": [
    {"title": "Sector Name", "status": "hot"|"warm"|"cold", "description": "Detailed analysis with specific assets, catalysts, metrics"}
  ],
  "top_movers": [
    {"symbol": "BTC", "name": "Bitcoin", "change_24h": 2.5, "change_7d": 5.0, "social": "High"|"Medium"|"Low", "sentiment": 75, "comment": "Detailed analysis: technicals, sentiment breakdown, key levels"}
  ],
  "influencers": [],
  "risks": [
    {"level": "high"|"medium"|"low", "label": "Specific risk with context"}
  ]
}

CRITICAL REQUIREMENTS:
1. executive_summary: 5-6 insights with SPECIFIC data (numbers, %, asset names)
   - Include platform sentiment breakdown (Twitter vs Reddit trends)
   - Mention technical signals (RSI, MACD, golden/death cross)
   - Reference fear/greed level and what it implies

2. narratives: 4-6 detailed sector cards:
   - "Bitcoin Ecosystem" - ETF flows, dominance, institutional moves
   - "Layer 1 Competition" - SOL, ETH, AVAX performance
   - "DeFi Sector" - engagement trends, top protocols
   - "Technical Outlook" - key support/resistance, signals
   - Add more based on data (AI, Privacy coins if relevant)
   Each narrative needs: specific assets, specific metrics, catalyst if any

3. top_movers: 8-10 coins with DETAILED comments:
   - Reference Galaxy Score, AltRank
   - Mention sentiment % and platform trends
   - Technical levels (support/resistance)
   - Recent catalysts or news if apparent from data

4. risks: 3-5 specific risks with data context

Be analytical, specific, and data-driven. Avoid generic statements.`

  const userPrompt = `Generate today's (${today}) crypto market report from this comprehensive data:

=== FEAR & GREED INDEX ===
Current: ${JSON.stringify(marketData.fearGreed, null, 2)}
Trend: ${JSON.stringify(marketData.fearGreedTrend, null, 2)}

=== SOCIAL METRICS (top 5 coins aggregated) ===
- Total unique creators: ${marketData.socialStats?.totalContributors?.toLocaleString() || 'N/A'}
- Total interactions 24h: ${marketData.socialStats?.totalInteractions?.toLocaleString() || 'N/A'}

=== SENTIMENT BY COIN (with platform breakdown: Twitter, Reddit, YouTube, etc.) ===
${JSON.stringify(marketData.sentiment, null, 2)}

=== TOP 10 COINS (with Galaxy Score, AltRank, price changes) ===
${JSON.stringify(marketData.coins, null, 2)}

=== DETAILED TECHNICAL ANALYSIS (BTC, ETH, SOL - 4h timeframe) ===
${JSON.stringify(marketData.technicals, null, 2)}

=== RECENT NEWS & SOCIAL ACTIVITY ===
${JSON.stringify(marketData.news?.slice(0, 5), null, 2)}

=== INSTRUCTIONS FOR REPORT GENERATION ===
1. Use Fear & Greed current value for market_sentiment metric
2. Use Fear & Greed trend (week_ago, trend direction) in executive_summary
3. Use total creators for unique_creators metric (${marketData.socialStats?.totalContributors?.toLocaleString() || '0'})
4. Use total interactions / 1,000,000 for defi_engagements metric
5. Reference specific RSI, MACD histogram, Bollinger position, EMA crossover signals
6. Mention Galaxy Scores (0-100, higher = stronger social sentiment)
7. Mention AltRank (lower = better, 1 = top altcoin)
8. Analyze sentiment breakdown by platform (Twitter bullish/bearish %, Reddit trends)
9. Include news themes in narratives if relevant
10. Calculate sentiment_change as difference from 50 (neutral)`

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
        max_tokens: 4000,
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
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    const context8Key = Deno.env.get('CONTEXT8_API_KEY')

    if (!openaiKey) {
      return new Response('Missing OPENAI_API_KEY', { status: 500 })
    }
    if (!context8Key) {
      return new Response('Missing CONTEXT8_API_KEY', { status: 500 })
    }

    console.log('[generate-daily-report] Fetching market data from MCP...')

    // 1. Fetch market data via MCP (Context8)
    const marketData = await fetchMarketData(context8Key)

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
          status: 'published',
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
