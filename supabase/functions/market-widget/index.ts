import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

const BINANCE_BASE = 'https://api.binance.com'

interface MarketWidgetRequest {
  symbol?: string
  interval?: string
  limit?: number
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    // Parse request
    const body: MarketWidgetRequest = await req.json()
    const symbol = (body.symbol || 'BTCUSDT').toUpperCase()
    const interval = body.interval || '1h'
    const limit = Math.min(Math.max(body.limit || 200, 10), 1000)

    console.log('[market-widget] Request:', { symbol, interval, limit })

    // Fetch klines and ticker in parallel
    const klinesUrl = new URL(`${BINANCE_BASE}/api/v3/klines`)
    klinesUrl.searchParams.set('symbol', symbol)
    klinesUrl.searchParams.set('interval', interval)
    klinesUrl.searchParams.set('limit', String(limit))

    const tickerUrl = new URL(`${BINANCE_BASE}/api/v3/ticker/24hr`)
    tickerUrl.searchParams.set('symbol', symbol)

    const dailyUrl = new URL(`${BINANCE_BASE}/api/v3/klines`)
    dailyUrl.searchParams.set('symbol', symbol)
    dailyUrl.searchParams.set('interval', '1d')
    dailyUrl.searchParams.set('limit', '8')

    const [klinesRes, tickerRes, dailyRes] = await Promise.all([
      fetch(klinesUrl.toString()),
      fetch(tickerUrl.toString()),
      fetch(dailyUrl.toString()),
    ])

    if (!klinesRes.ok || !tickerRes.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch market data' }),
        { status: 502, headers: CORS_HEADERS }
      )
    }

    const tickerData = await tickerRes.json()

    // Calculate 7d change
    let change7dPct: number | null = null
    if (dailyRes.ok) {
      try {
        const dailyData = await dailyRes.json()
        if (Array.isArray(dailyData) && dailyData.length >= 7) {
          const lastClose = parseFloat(dailyData[dailyData.length - 1][4])
          const sevenAgoClose = parseFloat(dailyData[dailyData.length - 7][4])
          if (isFinite(lastClose) && isFinite(sevenAgoClose) && sevenAgoClose !== 0) {
            change7dPct = ((lastClose - sevenAgoClose) / sevenAgoClose) * 100
          }
        }
      } catch {}
    }

    // Build ChatKit Widget Card
    const price = parseFloat(tickerData.lastPrice)
    const change24h = parseFloat(tickerData.priceChangePercent)
    const volume = parseFloat(tickerData.volume)
    const high24h = parseFloat(tickerData.highPrice)
    const low24h = parseFloat(tickerData.lowPrice)

    const formatPrice = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const formatVolume = (val: number) => val.toLocaleString('en-US', { maximumFractionDigits: 0 })

    const widget = {
      type: 'Card',
      key: 'market-card',
      padding: 0,
      children: [
        // Header section
        {
          type: 'Box',
          padding: 5,
          background: 'surface-tertiary',
          children: [
            {
              type: 'Row',
              justify: 'between',
              align: 'center',
              children: [
                {
                  type: 'Col',
                  gap: 1,
                  children: [
                    {
                      type: 'Title',
                      value: symbol,
                      size: 'lg',
                      weight: 'semibold',
                    },
                    {
                      type: 'Text',
                      value: `${interval} • ${limit} candles`,
                      size: 'xs',
                      color: 'tertiary',
                    },
                  ],
                },
                {
                  type: 'Badge',
                  value: `${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`,
                  variant: change24h >= 0 ? 'success' : 'error',
                },
              ],
            },
            {
              type: 'Row',
              gap: 2,
              align: 'baseline',
              margin: { top: 3 },
              children: [
                {
                  type: 'Title',
                  value: `$${formatPrice(price)}`,
                  size: 'xl',
                  weight: 'bold',
                },
                {
                  type: 'Text',
                  value: '24h',
                  size: 'sm',
                  color: 'tertiary',
                },
              ],
            },
          ],
        },

        // Stats section
        {
          type: 'Box',
          padding: 5,
          gap: 3,
          children: [
            // Range row
            {
              type: 'Row',
              gap: 3,
              children: [
                {
                  type: 'Box',
                  padding: 3,
                  radius: 'lg',
                  background: 'surface-secondary',
                  flex: '1',
                  children: [
                    {
                      type: 'Col',
                      gap: 1,
                      children: [
                        {
                          type: 'Text',
                          value: '24h High',
                          size: 'xs',
                          color: 'tertiary',
                        },
                        {
                          type: 'Text',
                          value: `$${formatPrice(high24h)}`,
                          weight: 'semibold',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'Box',
                  padding: 3,
                  radius: 'lg',
                  background: 'surface-secondary',
                  flex: '1',
                  children: [
                    {
                      type: 'Col',
                      gap: 1,
                      children: [
                        {
                          type: 'Text',
                          value: '24h Low',
                          size: 'xs',
                          color: 'tertiary',
                        },
                        {
                          type: 'Text',
                          value: `$${formatPrice(low24h)}`,
                          weight: 'semibold',
                        },
                      ],
                    },
                  ],
                },
              ],
            },

            // Volume and 7d change row
            {
              type: 'Row',
              gap: 3,
              children: [
                {
                  type: 'Box',
                  padding: 3,
                  radius: 'lg',
                  background: 'surface-secondary',
                  flex: '1',
                  children: [
                    {
                      type: 'Col',
                      gap: 1,
                      children: [
                        {
                          type: 'Text',
                          value: '24h Volume',
                          size: 'xs',
                          color: 'tertiary',
                        },
                        {
                          type: 'Text',
                          value: `${formatVolume(volume)} ${symbol.replace('USDT', '')}`,
                          weight: 'semibold',
                        },
                      ],
                    },
                  ],
                },
                change7dPct !== null
                  ? {
                      type: 'Box',
                      padding: 3,
                      radius: 'lg',
                      background: 'surface-secondary',
                      flex: '1',
                      children: [
                        {
                          type: 'Col',
                          gap: 1,
                          children: [
                            {
                              type: 'Text',
                              value: '7d Change',
                              size: 'xs',
                              color: 'tertiary',
                            },
                            {
                              type: 'Row',
                              gap: 2,
                              align: 'center',
                              children: [
                                {
                                  type: 'Text',
                                  value: `${change7dPct >= 0 ? '+' : ''}${change7dPct.toFixed(2)}%`,
                                  weight: 'semibold',
                                  color: change7dPct >= 0 ? 'success' : 'error',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    }
                  : {
                      type: 'Box',
                      padding: 3,
                      radius: 'lg',
                      background: 'surface-secondary',
                      flex: '1',
                      children: [],
                    },
              ],
            },
          ],
        },
      ],
    }

    console.log('[market-widget] Widget created successfully')

    return new Response(JSON.stringify(widget), {
      headers: CORS_HEADERS,
    })
  } catch (error) {
    console.error('[market-widget] Error:', error)
    return new Response(
      JSON.stringify({
        error: 'bad_request',
        detail: error instanceof Error ? error.message : String(error),
      }),
      { status: 400, headers: CORS_HEADERS }
    )
  }
})
