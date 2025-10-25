import { NextResponse } from 'next/server';

/**
 * Crypto Prices API Route
 *
 * Fetches real-time BTC and ETH prices from CoinGecko API
 * Returns price and 24h change data
 */

interface CoinGeckoPrice {
  usd: number;
  usd_24h_change: number;
}

interface CoinGeckoResponse {
  bitcoin: CoinGeckoPrice;
  ethereum: CoinGeckoPrice;
}

export async function GET() {
  try {
    console.log('[API] Fetching prices from CoinGecko...');

    // Fetch BTC and ETH prices from CoinGecko (free tier, no API key required)
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    console.log('[API] CoinGecko Response:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`CoinGecko API returned ${response.status}`);
    }

    const data: CoinGeckoResponse = await response.json();
    console.log('[API] Received data:', data);

    // Transform data to our format
    const prices = [
      {
        symbol: 'BTC',
        price: data.bitcoin.usd,
        change24h: data.bitcoin.usd_24h_change,
        lastUpdate: new Date().toISOString(),
      },
      {
        symbol: 'ETH',
        price: data.ethereum.usd,
        change24h: data.ethereum.usd_24h_change,
        lastUpdate: new Date().toISOString(),
      },
    ];

    console.log('[API] Returning prices:', prices);

    return NextResponse.json({
      success: true,
      data: prices,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Error fetching crypto prices:', error);

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
