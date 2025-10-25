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
    // Fetch BTC and ETH prices from Binance (separate requests)
    const [btcResponse, ethResponse] = await Promise.all([
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT', {
        next: { revalidate: 60 },
      }),
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT', {
        next: { revalidate: 60 },
      }),
    ]);

    if (!btcResponse.ok || !ethResponse.ok) {
      throw new Error('Failed to fetch prices from Binance');
    }

    const data: BinanceTicker[] = await Promise.all([
      btcResponse.json(),
      ethResponse.json(),
    ]);

    // Transform data to our format
    const prices = data.map((ticker) => ({
      symbol: ticker.symbol.replace('USDT', ''),
      price: parseFloat(ticker.lastPrice),
      change24h: parseFloat(ticker.priceChangePercent),
      lastUpdate: new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: prices,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching crypto prices:', error);

    // Return fallback data if API fails
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch prices',
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
