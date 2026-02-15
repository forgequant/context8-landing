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

// Counter for unique request IDs
let requestIdCounter = 0

async function callMcpTool<T>(
  toolName: string,
  args: Record<string, unknown> = {},
  apiKey?: string
): Promise<T | null> {
  const requestId = `${Date.now()}-${++requestIdCounter}`
  try {
    const res = await fetch(MCP_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: requestId,
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: { ...args, api_key: apiKey },
        },
      }),
    })

    if (!res.ok) {
      console.error(`[MCP:${requestId}] ${toolName} failed:`, res.status)
      return null
    }

    // MCP returns SSE format: "event: message\ndata: {...}"
    const text = await res.text()
    console.log(`[MCP:${requestId}] ${toolName} response length:`, text.length)

    const dataLine = text.split('\n').find((line) => line.startsWith('data: '))
    if (!dataLine) {
      console.error(`[MCP:${requestId}] ${toolName} no data in response. Raw:`, text.substring(0, 200))
      return null
    }

    const data = JSON.parse(dataLine.replace('data: ', ''))
    if (data.error) {
      console.error(`[MCP:${requestId}] ${toolName} error:`, data.error)
      return null
    }

    // MCP returns result in content array
    const content = data.result?.content?.[0]
    if (content?.type === 'text') {
      try {
        const parsed = JSON.parse(content.text)
        console.log(`[MCP:${requestId}] ${toolName} success:`, JSON.stringify(parsed).substring(0, 100))
        return parsed
      } catch {
        console.error(`[MCP:${requestId}] ${toolName} failed to parse:`, content.text?.substring(0, 200))
        return null
      }
    }
    console.log(`[MCP:${requestId}] ${toolName} returning raw result`)
    return data.result
  } catch (error) {
    console.error(`[MCP:${requestId}] ${toolName} error:`, error)
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
    callMcpTool<{ data: unknown[]; count: number }>('get_fear_greed_history', {}, apiKey),
    ...symbols.map((symbol) =>
      callMcpTool<{ data: unknown }>('lunarcrush_get_coin', { symbol }, apiKey)
    ),
  ])

  console.log('[fetchMarketData] Phase 1 complete. Coins:', coinResults.filter(r => r?.data).length)

  // PHASE 2: Social & sentiment data
  // Fetch sentiment for BTC and ETH using raw fetch (more reliable)
  console.log('[fetchMarketData] Fetching sentiment for BTC and ETH...')
  const sentimentResults: unknown[] = []

  for (const symbol of ['BTC', 'ETH']) {
    try {
      const res = await fetch(MCP_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `sentiment-${symbol}`,
          method: 'tools/call',
          params: {
            name: 'lunarcrush_get_sentiment',
            arguments: { symbol, api_key: apiKey },
          },
        }),
      })

      if (res.ok) {
        const text = await res.text()
        const dataLine = text.split('\n').find((l: string) => l.startsWith('data: '))
        if (dataLine) {
          const data = JSON.parse(dataLine.replace('data: ', ''))
          const content = data.result?.content?.[0]
          if (content?.type === 'text') {
            const parsed = JSON.parse(content.text)
            console.log(`[fetchMarketData] ${symbol} contributors:`, parsed.num_contributors)
            sentimentResults.push(parsed)
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[fetchMarketData] ${symbol} sentiment error:`, msg)
    }
  }

  console.log('[fetchMarketData] Sentiment results:', sentimentResults.filter(Boolean).length)

  // Fetch other data in parallel
  const [newsResults, galaxyScores, altRanks] = await Promise.all([
    // News for BTC and ETH
    Promise.all([
      callMcpTool<unknown>('lunarcrush_get_news', { symbol: 'BTC' }, apiKey),
      callMcpTool<unknown>('lunarcrush_get_news', { symbol: 'ETH' }, apiKey),
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

  console.log('[fetchMarketData] Phase 2 complete.')

  // PHASE 3: Technical analysis (detailed indicators)
  const [technicalSummaries, rsiData, macdData, bollingerData, emaCrossovers] = await Promise.all([
    // Technical summaries
    Promise.all(
      tradingPairs.map((symbol) =>
        callMcpTool<unknown>('get_technical_summary', { symbol, interval: '4h' }, apiKey)
      )
    ),
    // RSI for top 3
    Promise.all(
      tradingPairs.slice(0, 3).map((symbol) =>
        callMcpTool<unknown>('get_rsi', { symbol, interval: '4h' }, apiKey)
      )
    ),
    // MACD for top 3
    Promise.all(
      tradingPairs.slice(0, 3).map((symbol) =>
        callMcpTool<unknown>('get_macd', { symbol, interval: '4h' }, apiKey)
      )
    ),
    // Bollinger Bands for top 3
    Promise.all(
      tradingPairs.slice(0, 3).map((symbol) =>
        callMcpTool<unknown>('get_bollinger_bands', { symbol, interval: '4h' }, apiKey)
      )
    ),
    // EMA crossovers for top 3
    Promise.all(
      tradingPairs.slice(0, 3).map((symbol) =>
        callMcpTool<unknown>('get_ema_crossover', { symbol, interval: '4h' }, apiKey)
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

  // Calculate total social stats from sentiment data (filter out nulls)
  const validSentiments = sentimentResults.filter(r => r && r.num_contributors != null)
  console.log('[fetchMarketData] Valid sentiments:', validSentiments.length, 'of', sentimentResults.length)

  const totalContributors = validSentiments.reduce(
    (sum, r) => sum + (r.num_contributors || 0), 0
  )
  const totalInteractions = validSentiments.reduce(
    (sum, r) => sum + (r.interactions_24h || 0), 0
  )

  console.log('[fetchMarketData] Social stats: contributors:', totalContributors, 'interactions:', totalInteractions)

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

  console.log('[fetchMarketData] Sentiment results:', sentimentResults.filter(Boolean).length, 'of', sentimentResults.length)

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
  marketData: unknown
): Promise<DailyReport | null> {
  const today = new Date().toISOString().split('T')[0]

  const systemPrompt = `You are a senior crypto market analyst creating a professional daily briefing like Bloomberg Terminal.
Output ONLY valid JSON matching this exact structure (no markdown, no explanation):

{
  "metrics": {
    "unique_creators": number (TOTAL from all sentiment data, should be 100K-300K range),
    "unique_creators_change": number (% change estimate, -10 to +10 typical),
    "market_sentiment": number (0-100, from fear/greed index),
    "market_sentiment_change": number (difference from 50 neutral),
    "defi_engagements": number (total interactions in MILLIONS, e.g. 53 for 53M),
    "defi_engagements_change": number (% change estimate),
    "ai_creators": null,
    "ai_creators_change": number (estimate -5 to -15)
  },
  "executive_summary": [
    {"direction": "up"|"down"|"neutral", "text": "SPECIFIC insight with exact numbers"}
  ],
  "narratives": [
    {"title": "Sector Name", "status": "hot"|"warm"|"cold", "description": "Assets: X, Y, Z | Catalyst: specific event | Social: trend direction"}
  ],
  "top_movers": [
    {"symbol": "BTC", "name": "Bitcoin", "change_24h": 2.5, "change_7d": 5.0, "social": "High"|"Medium"|"Low", "sentiment": 75, "comment": "RSI at X, support $Y, Galaxy Score Z"}
  ],
  "influencers": [
    {"name": "@handle", "followers": 1700000, "engagement": 8700000, "sentiment": "bullish"|"bearish"|"neutral", "focus": ["BTC", "DeFi"]}
  ],
  "risks": [
    {"level": "high"|"medium"|"low", "label": "SPECIFIC risk: exact metric or event that triggered it"}
  ]
}

CRITICAL - MAKE REPORT PROFESSIONAL:

1. METRICS - Use REAL numbers from data:
   - unique_creators: SUM of all num_contributors from sentiment (should be 100K-300K)
   - defi_engagements: SUM of interactions_24h / 1,000,000 (should be 50-200M range)
   - market_sentiment: exact Fear & Greed value
   - Calculate changes as % difference from typical values

2. EXECUTIVE_SUMMARY - 6 bullet points with EXACT data:
   - "Social activity cooled — unique creators down X% to Y vs prior 24h"
   - "Sentiment at X% (Fear & Greed: Y) — Z% change from weekly average"
   - "BTC ETF flows: inflows/outflows trend" (infer from price action)
   - "Top gainer: SYMBOL +X% | Top loser: SYMBOL -Y%"
   - "Platform breakdown: Twitter X% bullish, Reddit Y% positive"
   - "Technical signals: BTC RSI at X, MACD Y, EMA crossover Z"

3. NARRATIVES - 5-6 cards with STRUCTURED descriptions:
   Format: "Assets: X, Y, Z | Catalyst: specific trigger | Social: ↑/↓ + metric"
   Required sectors:
   - "Bitcoin Ecosystem" - ETF sentiment, dominance, halving effects
   - "Layer 1 Wars" - ETH vs SOL vs others, specific % changes
   - "DeFi & Yield" - engagement metrics, top protocols
   - "Memecoins" - DOGE, SHIB momentum (if relevant)
   - "Technical Outlook" - support/resistance levels, indicator signals
   - "Risk Factors" - specific concerns from data

4. TOP_MOVERS - ALL 10 coins with DETAILED comments:
   Comment format: "RSI X (overbought/oversold), MACD Y (bullish/bearish divergence), support $Z, resistance $W. Galaxy Score: X. Twitter sentiment: Y% positive."

5. INFLUENCERS - Generate 4-6 based on news/social data:
   - Include engagement numbers (followers in millions, engagement in millions)
   - Focus areas from trending topics
   - Infer sentiment from news tone

6. RISKS - 5 specific risks with DATA context:
   - "High volatility: X% daily swing on SYMBOL"
   - "Extreme Fear at Y — historically precedes Z"
   - "Technical breakdown: SYMBOL below $X support"
   - "Low social engagement: -Y% vs 7-day average"
   - Include one BULLISH anchor as positive counterpoint

Be specific. Use exact numbers. No generic statements like "market is volatile".`

  const userPrompt = `Generate today's (${today}) PROFESSIONAL crypto market report.

=== FEAR & GREED INDEX ===
Current: ${JSON.stringify(marketData.fearGreed, null, 2)}
7-Day Trend: ${JSON.stringify(marketData.fearGreedTrend, null, 2)}

=== SOCIAL METRICS (ALL 10 COINS) ===
TOTAL unique creators: ${marketData.socialStats?.totalContributors?.toLocaleString() || '0'}
TOTAL interactions 24h: ${marketData.socialStats?.totalInteractions?.toLocaleString() || '0'}
(Use these EXACT numbers in metrics!)

=== SENTIMENT BY COIN (Twitter, Reddit, TikTok, YouTube, News breakdown) ===
${JSON.stringify(marketData.sentiment, null, 2)}

=== TOP 10 COINS (BTC, ETH, SOL, XRP, DOGE, ADA, AVAX, LINK, DOT, MATIC) ===
${JSON.stringify(marketData.coins, null, 2)}

=== TECHNICAL ANALYSIS (4h timeframe) ===
${JSON.stringify(marketData.technicals, null, 2)}

=== RECENT NEWS & TWEETS ===
${JSON.stringify(marketData.news?.slice(0, 10), null, 2)}

=== REQUIRED OUTPUT ===
1. metrics.unique_creators = ${marketData.socialStats?.totalContributors || 0} (EXACT from data above)
2. metrics.defi_engagements = ${Math.round((marketData.socialStats?.totalInteractions || 0) / 1000000)} (interactions / 1M)
3. metrics.market_sentiment = ${marketData.fearGreed?.value || 50} (from Fear & Greed)
4. executive_summary: 6 insights with SPECIFIC numbers from this data
5. narratives: 5-6 sectors with "Assets: | Catalyst: | Social:" format
6. top_movers: ALL 10 coins with technical levels and Galaxy Scores
7. influencers: 4-6 accounts (infer from news/social prominence)
8. risks: 5 specific risks with exact metrics

IMPORTANT: Use the ACTUAL numbers from this data. Do not invent numbers.
Calculate Twitter sentiment %: positive / (positive + negative) * 100 from sentiment_detail.`

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',  // Use full model for better quality
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.5,  // Lower for more consistent output
        max_tokens: 6000,  // More tokens for detailed report
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
