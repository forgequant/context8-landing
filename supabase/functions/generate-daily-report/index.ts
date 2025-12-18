// Supabase Edge Function: Generate Daily Market Report
// Fetches data from LunarCrush API and stores in daily_reports table
// Triggered manually or via scheduled cron

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ============================================================================
// TYPES
// ============================================================================

interface ReportMetrics {
  unique_creators: number | null
  unique_creators_change: number | null
  market_sentiment: number | null
  market_sentiment_change: number | null
  defi_engagements: number | null
  defi_engagements_change: number | null
  ai_creators: number | null
  ai_creators_change: number | null
}

interface ExecutiveSummaryItem {
  direction: 'up' | 'down' | 'neutral'
  text: string
}

interface Narrative {
  title: string
  status: 'hot' | 'warm' | 'cold'
  description: string
}

interface TopMover {
  symbol: string
  name: string
  change_24h: number
  change_7d: number | null
  social: 'High' | 'Medium' | 'Low'
  sentiment: number
  comment: string
}

interface Influencer {
  name: string
  followers: number
  engagement: number
  sentiment: 'bullish' | 'bearish' | 'neutral'
  focus: string[]
}

interface Risk {
  level: 'high' | 'medium' | 'low'
  label: string
}

interface DailyReport {
  report_date: string
  metrics: ReportMetrics
  executive_summary: ExecutiveSummaryItem[]
  narratives: Narrative[]
  top_movers: TopMover[]
  influencers: Influencer[]
  risks: Risk[]
  raw_data: Record<string, unknown>
  status: 'draft' | 'published'
}

// LunarCrush API response types
interface LunarCrushCoin {
  id: number
  symbol: string
  name: string
  price: number
  percent_change_24h: number
  percent_change_7d?: number
  galaxy_score: number
  alt_rank: number
  social_volume: number
  social_score: number
  sentiment: number
  interactions_24h: number
  market_cap: number
}

interface LunarCrushTopic {
  topic: string
  title: string
  interactions_24h: number
  social_dominance: number
  sentiment: number
  num_contributors: number
}

interface LunarCrushCreator {
  display_name: string
  followers_count: number
  engagement_rate: number
  influence_level: number
  topics: string[]
}

// ============================================================================
// LUNARCRUSH API CLIENT
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
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!res.ok) {
      console.error(`[LunarCrush] ${endpoint} failed:`, res.status, await res.text())
      return null
    }

    return await res.json()
  } catch (error) {
    console.error(`[LunarCrush] ${endpoint} error:`, error)
    return null
  }
}

async function getCoinsData(apiKey: string): Promise<LunarCrushCoin[]> {
  const data = await fetchLunarCrush<{ data: LunarCrushCoin[] }>(
    '/coins/list',
    apiKey,
    { sort: 'galaxy_score', limit: '100', desc: 'true' }
  )
  return data?.data ?? []
}

async function getTopicData(apiKey: string, topic: string): Promise<LunarCrushTopic | null> {
  const data = await fetchLunarCrush<{ data: LunarCrushTopic }>(
    `/topic/${topic}`,
    apiKey
  )
  return data?.data ?? null
}

async function getTopicCreators(
  apiKey: string,
  topic: string,
  limit = 10
): Promise<LunarCrushCreator[]> {
  const data = await fetchLunarCrush<{ data: LunarCrushCreator[] }>(
    `/topic/${topic}/creators`,
    apiKey,
    { limit: String(limit) }
  )
  return data?.data ?? []
}

// ============================================================================
// DATA PROCESSING
// ============================================================================

function classifySocialVolume(volume: number): 'High' | 'Medium' | 'Low' {
  if (volume > 10000) return 'High'
  if (volume > 1000) return 'Medium'
  return 'Low'
}

function classifySentiment(score: number): 'bullish' | 'bearish' | 'neutral' {
  if (score >= 60) return 'bullish'
  if (score <= 40) return 'bearish'
  return 'neutral'
}

function generateTopMovers(coins: LunarCrushCoin[]): TopMover[] {
  // Sort by 24h change and take top/bottom movers
  const sorted = [...coins].sort((a, b) =>
    Math.abs(b.percent_change_24h) - Math.abs(a.percent_change_24h)
  )

  return sorted.slice(0, 10).map((coin) => ({
    symbol: coin.symbol,
    name: coin.name,
    change_24h: coin.percent_change_24h,
    change_7d: coin.percent_change_7d ?? null,
    social: classifySocialVolume(coin.social_volume),
    sentiment: Math.round(coin.sentiment),
    comment: generateMoverComment(coin),
  }))
}

function generateMoverComment(coin: LunarCrushCoin): string {
  const direction = coin.percent_change_24h >= 0 ? 'up' : 'down'
  const sentiment = classifySentiment(coin.sentiment)

  if (direction === 'up' && sentiment === 'bullish') {
    return `Strong momentum with bullish social sentiment`
  }
  if (direction === 'up' && sentiment === 'bearish') {
    return `Price rising despite negative sentiment - potential reversal`
  }
  if (direction === 'down' && sentiment === 'bearish') {
    return `Downtrend confirmed by negative sentiment`
  }
  if (direction === 'down' && sentiment === 'bullish') {
    return `Pullback amid bullish sentiment - possible buying opportunity`
  }
  return `Mixed signals - monitor closely`
}

function processInfluencers(creators: LunarCrushCreator[]): Influencer[] {
  return creators.slice(0, 5).map((creator) => ({
    name: `@${creator.display_name}`,
    followers: creator.followers_count,
    engagement: creator.engagement_rate,
    sentiment: creator.influence_level >= 70 ? 'bullish' :
               creator.influence_level <= 30 ? 'bearish' : 'neutral',
    focus: creator.topics?.slice(0, 3) ?? [],
  }))
}

function generateNarratives(
  cryptoTopic: LunarCrushTopic | null,
  defiTopic: LunarCrushTopic | null,
  nftTopic: LunarCrushTopic | null,
  memesTopic: LunarCrushTopic | null
): Narrative[] {
  const narratives: Narrative[] = []

  const topics = [
    { data: cryptoTopic, title: 'Crypto General' },
    { data: defiTopic, title: 'DeFi' },
    { data: nftTopic, title: 'NFTs' },
    { data: memesTopic, title: 'Memecoins' },
  ]

  for (const { data, title } of topics) {
    if (!data) continue

    const status: Narrative['status'] =
      data.sentiment >= 70 ? 'hot' :
      data.sentiment >= 50 ? 'warm' : 'cold'

    narratives.push({
      title,
      status,
      description: `${data.interactions_24h.toLocaleString()} interactions, ` +
                   `${Math.round(data.social_dominance * 100)}% dominance, ` +
                   `sentiment at ${Math.round(data.sentiment)}%`,
    })
  }

  return narratives
}

function generateExecutiveSummary(
  coins: LunarCrushCoin[],
  cryptoTopic: LunarCrushTopic | null
): ExecutiveSummaryItem[] {
  const summary: ExecutiveSummaryItem[] = []

  // Analyze market movement
  const gainers = coins.filter((c) => c.percent_change_24h > 0).length
  const losers = coins.filter((c) => c.percent_change_24h < 0).length
  const marketDirection = gainers > losers ? 'up' : losers > gainers ? 'down' : 'neutral'

  summary.push({
    direction: marketDirection,
    text: marketDirection === 'up'
      ? `Market showing strength - ${gainers} of ${coins.length} tracked assets in green`
      : marketDirection === 'down'
      ? `Market under pressure - ${losers} of ${coins.length} tracked assets in red`
      : `Mixed market - roughly equal gainers and losers`,
  })

  // Analyze sentiment
  if (cryptoTopic) {
    const sentimentDirection = cryptoTopic.sentiment >= 60 ? 'up' :
                               cryptoTopic.sentiment <= 40 ? 'down' : 'neutral'
    summary.push({
      direction: sentimentDirection,
      text: `Overall sentiment at ${Math.round(cryptoTopic.sentiment)}% - ` +
            `${sentimentDirection === 'up' ? 'bullish bias' :
              sentimentDirection === 'down' ? 'bearish bias' : 'neutral mood'}`,
    })

    // Social activity
    const activityLevel = cryptoTopic.num_contributors > 100000 ? 'high' :
                          cryptoTopic.num_contributors > 50000 ? 'moderate' : 'low'
    summary.push({
      direction: activityLevel === 'high' ? 'up' :
                 activityLevel === 'low' ? 'down' : 'neutral',
      text: `Social activity ${activityLevel} with ${cryptoTopic.num_contributors.toLocaleString()} unique contributors`,
    })
  }

  // Top mover highlight
  const topGainer = [...coins].sort((a, b) => b.percent_change_24h - a.percent_change_24h)[0]
  const topLoser = [...coins].sort((a, b) => a.percent_change_24h - b.percent_change_24h)[0]

  if (topGainer && topGainer.percent_change_24h > 5) {
    summary.push({
      direction: 'up',
      text: `${topGainer.symbol} leads gainers at +${topGainer.percent_change_24h.toFixed(1)}%`,
    })
  }

  if (topLoser && topLoser.percent_change_24h < -5) {
    summary.push({
      direction: 'down',
      text: `${topLoser.symbol} drops ${topLoser.percent_change_24h.toFixed(1)}% - largest decliner`,
    })
  }

  return summary.slice(0, 5)
}

function generateRisks(
  coins: LunarCrushCoin[],
  cryptoTopic: LunarCrushTopic | null
): Risk[] {
  const risks: Risk[] = []

  // Volatility check
  const highVolatility = coins.filter(
    (c) => Math.abs(c.percent_change_24h) > 10
  ).length
  if (highVolatility > 10) {
    risks.push({
      level: 'high',
      label: `High volatility: ${highVolatility} assets moved >10% in 24h`,
    })
  } else if (highVolatility > 5) {
    risks.push({
      level: 'medium',
      label: `Elevated volatility: ${highVolatility} assets with >10% moves`,
    })
  } else {
    risks.push({
      level: 'low',
      label: 'Market volatility within normal range',
    })
  }

  // Sentiment divergence
  if (cryptoTopic) {
    const avgPriceChange = coins.reduce((sum, c) => sum + c.percent_change_24h, 0) / coins.length
    const sentimentBullish = cryptoTopic.sentiment > 60
    const pricesBearish = avgPriceChange < -2

    if (sentimentBullish && pricesBearish) {
      risks.push({
        level: 'medium',
        label: 'Sentiment-price divergence: bullish sentiment despite falling prices',
      })
    }

    // Low engagement warning
    if (cryptoTopic.num_contributors < 30000) {
      risks.push({
        level: 'medium',
        label: 'Low social engagement - reduced market attention',
      })
    }
  }

  // Market concentration
  const topCoinDominance = coins[0]?.market_cap
  const totalMarketCap = coins.reduce((sum, c) => sum + c.market_cap, 0)
  if (topCoinDominance && totalMarketCap) {
    const btcDominance = (topCoinDominance / totalMarketCap) * 100
    if (btcDominance > 60) {
      risks.push({
        level: 'low',
        label: `High BTC dominance at ${btcDominance.toFixed(1)}% - altcoins may lag`,
      })
    }
  }

  return risks.slice(0, 4)
}

function generateMetrics(
  coins: LunarCrushCoin[],
  cryptoTopic: LunarCrushTopic | null,
  defiTopic: LunarCrushTopic | null
): ReportMetrics {
  return {
    unique_creators: cryptoTopic?.num_contributors ?? null,
    unique_creators_change: null, // Would need historical data
    market_sentiment: cryptoTopic ? Math.round(cryptoTopic.sentiment) : null,
    market_sentiment_change: null,
    defi_engagements: defiTopic?.interactions_24h ?? null,
    defi_engagements_change: null,
    ai_creators: null,
    ai_creators_change: null,
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  // Only allow POST requests (for cron/manual triggers)
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // Validate authorization
    const authHeader = req.headers.get('authorization')
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET')

    const isAuthorized =
      authHeader === 'Bearer internal-trigger' ||
      (webhookSecret && authHeader === `Bearer ${webhookSecret}`)

    if (!isAuthorized) {
      console.error('[generate-daily-report] Unauthorized request')
      return new Response('Unauthorized', { status: 401 })
    }

    // Get required environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const lunarcrushApiKey = Deno.env.get('LUNARCRUSH_API_KEY')

    if (!lunarcrushApiKey) {
      console.error('[generate-daily-report] Missing LUNARCRUSH_API_KEY')
      return new Response('Missing LUNARCRUSH_API_KEY', { status: 500 })
    }

    console.log('[generate-daily-report] Starting report generation...')

    // Fetch data from LunarCrush
    const [coins, cryptoTopic, defiTopic, nftTopic, memesTopic, influencers] =
      await Promise.all([
        getCoinsData(lunarcrushApiKey),
        getTopicData(lunarcrushApiKey, 'crypto'),
        getTopicData(lunarcrushApiKey, 'defi'),
        getTopicData(lunarcrushApiKey, 'nft'),
        getTopicData(lunarcrushApiKey, 'memecoins'),
        getTopicCreators(lunarcrushApiKey, 'crypto', 10),
      ])

    console.log('[generate-daily-report] Fetched data:', {
      coinsCount: coins.length,
      hasCryptoTopic: !!cryptoTopic,
      hasDefiTopic: !!defiTopic,
      influencersCount: influencers.length,
    })

    if (coins.length === 0) {
      console.error('[generate-daily-report] No coins data received')
      return new Response('Failed to fetch market data', { status: 502 })
    }

    // Get today's date in ISO format
    const today = new Date().toISOString().split('T')[0]

    // Generate report
    const report: DailyReport = {
      report_date: today,
      metrics: generateMetrics(coins, cryptoTopic, defiTopic),
      executive_summary: generateExecutiveSummary(coins, cryptoTopic),
      narratives: generateNarratives(cryptoTopic, defiTopic, nftTopic, memesTopic),
      top_movers: generateTopMovers(coins),
      influencers: processInfluencers(influencers),
      risks: generateRisks(coins, cryptoTopic),
      raw_data: {
        coins: coins.slice(0, 20), // Store top 20 for reference
        topics: { crypto: cryptoTopic, defi: defiTopic, nft: nftTopic, memes: memesTopic },
        influencers,
        generated_at: new Date().toISOString(),
      },
      status: 'draft',
    }

    // Insert into database
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Upsert to handle re-runs on the same day
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
          raw_data: report.raw_data,
          status: report.status,
          generated_at: new Date().toISOString(),
        },
        { onConflict: 'report_date' }
      )
      .select()
      .single()

    if (error) {
      console.error('[generate-daily-report] Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Database error', detail: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('[generate-daily-report] Report saved:', {
      id: data?.id,
      report_date: report.report_date,
      status: report.status,
    })

    return new Response(
      JSON.stringify({
        success: true,
        report_id: data?.id,
        report_date: report.report_date,
        status: report.status,
        summary: {
          top_movers_count: report.top_movers.length,
          narratives_count: report.narratives.length,
          risks_count: report.risks.length,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('[generate-daily-report] Unexpected error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        detail: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
