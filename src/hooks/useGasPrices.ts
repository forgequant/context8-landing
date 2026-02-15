import { useCallback, useEffect, useState } from 'react'
import { BlockchainNetwork } from '../types/subscription'

interface GasPrices {
  ethereum: number | null
  polygon: number | null
  bsc: number | null
}

interface UseGasPricesReturn {
  gasPrices: GasPrices
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

// Fallback gas prices (realistic estimates, shown immediately)
const FALLBACK_GAS_PRICES: GasPrices = {
  ethereum: 2.5,   // ~$2-3 typical for ETH transfers
  polygon: 0.005,  // ~$0.005 typical for Polygon
  bsc: 0.15        // ~$0.15 typical for BSC
}

// Gas price in Gwei, converted to USD estimate
const GWEI_TO_USD_TRANSFER = {
  ethereum: (gwei: number) => (gwei * 21000 * 0.000000001) * 3500, // ~$3500 ETH price
  polygon: (gwei: number) => (gwei * 21000 * 0.000000001) * 0.9, // ~$0.90 MATIC price
  bsc: (gwei: number) => (gwei * 21000 * 0.000000001) * 600 // ~$600 BNB price
}

// LocalStorage cache keys
const CACHE_KEY = 'context8_gas_prices'
const CACHE_TIMESTAMP_KEY = 'context8_gas_prices_timestamp'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Load cached gas prices from localStorage
 */
function loadCachedPrices(): GasPrices | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)

    if (!cached || !timestamp) return null

    const age = Date.now() - parseInt(timestamp)
    if (age > CACHE_TTL) return null // Cache expired

    return JSON.parse(cached)
  } catch {
    return null
  }
}

/**
 * Save gas prices to localStorage cache
 */
function saveCachedPrices(prices: GasPrices) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(prices))
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Fetches real-time gas prices from public RPC endpoints
 * Updates every 60 seconds
 * Shows cached/fallback values immediately for instant UX
 */
export function useGasPrices(): UseGasPricesReturn {
  // Initialize with cached prices or fallback
  const [gasPrices, setGasPrices] = useState<GasPrices>(
    () => loadCachedPrices() || FALLBACK_GAS_PRICES
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchGasPrice = useCallback(async (chain: BlockchainNetwork): Promise<number | null> => {
    try {
      const rpcUrls: Record<BlockchainNetwork, string> = {
        ethereum: 'https://eth.llamarpc.com',
        polygon: 'https://polygon-rpc.com',
        bsc: 'https://bsc-dataseed.binance.org'
      }

      const response = await fetch(rpcUrls[chain], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_gasPrice',
          params: [],
          id: 1
        })
      })

      if (!response.ok) return null

      const data = await response.json()
      if (!data.result) return null

      // Convert hex to decimal Gwei
      const gasPriceWei = parseInt(data.result, 16)
      const gasPriceGwei = gasPriceWei / 1e9

      // Convert to USD estimate
      const usdEstimate = GWEI_TO_USD_TRANSFER[chain](gasPriceGwei)
      return usdEstimate
    } catch (err) {
      console.error(`Failed to fetch ${chain} gas price:`, err)
      return null
    }
  }, [])

  const fetchAllGasPrices = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [ethereum, polygon, bsc] = await Promise.all([
        fetchGasPrice('ethereum'),
        fetchGasPrice('polygon'),
        fetchGasPrice('bsc')
      ])

      const newPrices = { ethereum, polygon, bsc }

      // Update state
      setGasPrices(newPrices)
      setLastUpdated(new Date())

      // Save to cache
      saveCachedPrices(newPrices)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch gas prices'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [fetchGasPrice])

  useEffect(() => {
    // Initial fetch
    void fetchAllGasPrices()

    // Update every 60 seconds
    const interval = setInterval(fetchAllGasPrices, 60000)

    return () => clearInterval(interval)
  }, [fetchAllGasPrices])

  return {
    gasPrices,
    loading,
    error,
    lastUpdated
  }
}
