import { NextResponse } from 'next/server';

/**
 * Crypto Prices API Route
 *
 * Fetches real-time BTC and ETH prices from Binance API
 * Returns price and 24h change data
 */

interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

export async function GET() {
  try {
    console.log('[API] Fetching prices from Binance...');

    // Fetch BTC and ETH prices from Binance (separate requests)
    const [btcResponse, ethResponse] = await Promise.all([
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT', {
        cache: 'no-store',
      }),
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT', {
        cache: 'no-store',
      }),
    ]);

    console.log('[API] BTC Response:', btcResponse.status, btcResponse.statusText);
    console.log('[API] ETH Response:', ethResponse.status, ethResponse.statusText);

    if (!btcResponse.ok || !ethResponse.ok) {
      const btcError = !btcResponse.ok ? await btcResponse.text() : '';
      const ethError = !ethResponse.ok ? await ethResponse.text() : '';
      console.error('[API] Binance API Error:', { btcError, ethError });
      throw new Error(`Failed to fetch prices from Binance: BTC=${btcResponse.status}, ETH=${ethResponse.status}`);
    }

    const data: BinanceTicker[] = await Promise.all([
      btcResponse.json(),
      ethResponse.json(),
    ]);

    console.log('[API] Received data:', data);

    // Transform data to our format
    const prices = data.map((ticker) => ({
      symbol: ticker.symbol.replace('USDT', ''),
      price: parseFloat(ticker.lastPrice),
      change24h: parseFloat(ticker.priceChangePercent),
      lastUpdate: new Date().toISOString(),
    }));

    console.log('[API] Returning prices:', prices);

    return NextResponse.json({
      success: true,
      data: prices,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('[API] Error fetching crypto prices:', errorMessage);
    console.error('[API] Error stack:', errorStack);

    // Return fallback data if API fails
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        errorDetails: errorStack,
        data: [
          { symbol: 'BTC', price: 42150.25, change24h: 2.34, lastUpdate: new Date().toISOString() },
          { symbol: 'ETH', price: 2234.89, change24h: -1.12, lastUpdate: new Date().toISOString() },
        ],
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
