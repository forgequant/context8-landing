import { useState, useEffect } from 'react'
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

// Gas price in Gwei, converted to USD estimate
const GWEI_TO_USD_TRANSFER = {
  ethereum: (gwei: number) => (gwei * 21000 * 0.000000001) * 3500, // ~$3500 ETH price
  polygon: (gwei: number) => (gwei * 21000 * 0.000000001) * 0.9, // ~$0.90 MATIC price
  bsc: (gwei: number) => (gwei * 21000 * 0.000000001) * 600 // ~$600 BNB price
}

/**
 * Fetches real-time gas prices from public RPC endpoints
 * Updates every 60 seconds
 */
export function useGasPrices(): UseGasPricesReturn {
  const [gasPrices, setGasPrices] = useState<GasPrices>({
    ethereum: null,
    polygon: null,
    bsc: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchGasPrice = async (chain: BlockchainNetwork): Promise<number | null> => {
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
  }

  const fetchAllGasPrices = async () => {
    setLoading(true)
    setError(null)

    try {
      const [ethereum, polygon, bsc] = await Promise.all([
        fetchGasPrice('ethereum'),
        fetchGasPrice('polygon'),
        fetchGasPrice('bsc')
      ])

      setGasPrices({ ethereum, polygon, bsc })
      setLastUpdated(new Date())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch gas prices'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchAllGasPrices()

    // Update every 60 seconds
    const interval = setInterval(fetchAllGasPrices, 60000)

    return () => clearInterval(interval)
  }, [])

  return {
    gasPrices,
    loading,
    error,
    lastUpdated
  }
}
