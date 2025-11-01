import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
}

const BINANCE_BASE = 'https://api.binance.com'

interface Candle {
  time: number // Unix timestamp in seconds
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface Ticker24h {
  lastPrice: number
  priceChangePercent: number
  volume: number
  quoteVolume: number
  highPrice: number
  lowPrice: number
}

interface MarketDataResponse {
  symbol: string
  interval: string
  limit: number
  candles: Candle[]
  ticker24h: Ticker24h
  change7dPct: number | null
  ts: number
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const url = new URL(req.url)

    // Parse and validate parameters
    const symbol = (url.searchParams.get('symbol') || 'BTCUSDT').toUpperCase()
    const interval = url.searchParams.get('interval') || '1h'
    const limitParam = url.searchParams.get('limit') || '200'
    const limit = Math.min(Math.max(parseInt(limitParam, 10), 10), 1000)

    console.log('[binance-proxy] Request:', { symbol, interval, limit })

    // Fetch klines (OHLCV candles)
    const klinesUrl = new URL(`${BINANCE_BASE}/api/v3/klines`)
    klinesUrl.searchParams.set('symbol', symbol)
    klinesUrl.searchParams.set('interval', interval)
    klinesUrl.searchParams.set('limit', String(limit))

    // Fetch 24h ticker stats
    const tickerUrl = new URL(`${BINANCE_BASE}/api/v3/ticker/24hr`)
    tickerUrl.searchParams.set('symbol', symbol)

    // Fetch 8 daily candles for 7d change calculation
    const dailyUrl = new URL(`${BINANCE_BASE}/api/v3/klines`)
    dailyUrl.searchParams.set('symbol', symbol)
    dailyUrl.searchParams.set('interval', '1d')
    dailyUrl.searchParams.set('limit', '8')

    // Parallel fetch
    const [klinesRes, tickerRes, dailyRes] = await Promise.all([
      fetch(klinesUrl.toString()),
      fetch(tickerUrl.toString()),
      fetch(dailyUrl.toString()),
    ])

    if (!klinesRes.ok || !tickerRes.ok) {
      console.error('[binance-proxy] Upstream error:', {
        klinesStatus: klinesRes.status,
        tickerStatus: tickerRes.status,
      })
      return new Response(
        JSON.stringify({
          error: 'upstream_error',
          status: {
            klines: klinesRes.status,
            ticker: tickerRes.status,
          },
        }),
        { status: 502, headers: CORS_HEADERS }
      )
    }

    // Parse responses
    const klinesData = await klinesRes.json()
    const tickerData = await tickerRes.json()

    // Calculate 7d change
    let change7dPct: number | null = null
    if (dailyRes.ok) {
      try {
        const dailyData = await dailyRes.json()
        if (Array.isArray(dailyData) && dailyData.length >= 7) {
          const lastClose = parseFloat(dailyData[dailyData.length - 1][4])
          const sevenAgoClose = parseFloat(dailyData[dailyData.length - 7][4])

          if (
            isFinite(lastClose) &&
            isFinite(sevenAgoClose) &&
            sevenAgoClose !== 0
          ) {
            change7dPct = ((lastClose - sevenAgoClose) / sevenAgoClose) * 100
          }
        }
      } catch (error) {
        console.error('[binance-proxy] Error calculating 7d change:', error)
      }
    }

    // Transform klines to candle format
    const candles: Candle[] = klinesData.map((k: any[]) => ({
      time: Math.floor(k[0] / 1000), // Convert ms to seconds
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }))

    // Build response
    const response: MarketDataResponse = {
      symbol,
      interval,
      limit,
      candles,
      ticker24h: {
        lastPrice: parseFloat(tickerData.lastPrice),
        priceChangePercent: parseFloat(tickerData.priceChangePercent),
        volume: parseFloat(tickerData.volume),
        quoteVolume: parseFloat(tickerData.quoteVolume),
        highPrice: parseFloat(tickerData.highPrice),
        lowPrice: parseFloat(tickerData.lowPrice),
      },
      change7dPct,
      ts: Date.now(),
    }

    console.log('[binance-proxy] Success:', {
      symbol,
      candlesCount: candles.length,
      lastPrice: response.ticker24h.lastPrice,
    })

    return new Response(JSON.stringify(response), {
      headers: CORS_HEADERS,
    })
  } catch (error) {
    console.error('[binance-proxy] Unexpected error:', error)
    return new Response(
      JSON.stringify({
        error: 'bad_request',
        detail: error instanceof Error ? error.message : String(error),
      }),
      { status: 400, headers: CORS_HEADERS }
    )
  }
})
