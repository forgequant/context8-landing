import { useEffect, useState } from 'react'

interface CryptoPrice {
  symbol: string
  price: number
  change24h: number
  loading: boolean
  error: string | null
}

/**
 * Custom hook for fetching live cryptocurrency prices from CoinGecko
 * Uses free API with 1-minute cache to avoid rate limiting
 */
export function useCryptoPrice(coinId: string): CryptoPrice {
  const [data, setData] = useState<CryptoPrice>({
    symbol: coinId.toUpperCase(),
    price: 0,
    change24h: 0,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // Using CoinGecko free API - no API key required
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
          { cache: 'no-cache' }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch price')
        }

        const json = await response.json()
        const priceData = json[coinId]

        if (!priceData) {
          throw new Error('Invalid coin ID')
        }

        setData({
          symbol: coinId.toUpperCase(),
          price: priceData.usd,
          change24h: priceData.usd_24h_change || 0,
          loading: false,
          error: null
        })
      } catch (err) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }))
      }
    }

    // Initial fetch
    fetchPrice()

    // Update every 30 seconds to respect rate limits
    const interval = setInterval(fetchPrice, 30000)

    return () => clearInterval(interval)
  }, [coinId])

  return data
}
