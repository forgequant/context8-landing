import { BlockchainNetwork, BlockchainExplorers } from '../types/subscription'

/**
 * Blockchain explorer configurations for transaction verification
 */
export const BLOCKCHAIN_EXPLORERS: BlockchainExplorers = {
  ethereum: {
    name: 'Etherscan',
    baseUrl: 'https://etherscan.io',
    txUrl: (txHash: string) => `https://etherscan.io/tx/${txHash}`,
    addressUrl: (address: string) => `https://etherscan.io/address/${address}`
  },
  polygon: {
    name: 'Polygonscan',
    baseUrl: 'https://polygonscan.com',
    txUrl: (txHash: string) => `https://polygonscan.com/tx/${txHash}`,
    addressUrl: (address: string) => `https://polygonscan.com/address/${address}`
  },
  bsc: {
    name: 'BSCScan',
    baseUrl: 'https://bscscan.com',
    txUrl: (txHash: string) => `https://bscscan.com/tx/${txHash}`,
    addressUrl: (address: string) => `https://bscscan.com/address/${address}`
  }
}

/**
 * Get blockchain explorer transaction URL
 */
export function getExplorerTxUrl(chain: BlockchainNetwork, txHash: string): string {
  return BLOCKCHAIN_EXPLORERS[chain].txUrl(txHash)
}

/**
 * Get blockchain explorer address URL
 */
export function getExplorerAddressUrl(chain: BlockchainNetwork, address: string): string {
  return BLOCKCHAIN_EXPLORERS[chain].addressUrl(address)
}

/**
 * Get blockchain explorer name
 */
export function getExplorerName(chain: BlockchainNetwork): string {
  return BLOCKCHAIN_EXPLORERS[chain].name
}

/**
 * Get human-readable chain name
 */
export function getChainDisplayName(chain: BlockchainNetwork): string {
  const names: Record<BlockchainNetwork, string> = {
    ethereum: 'Ethereum',
    polygon: 'Polygon',
    bsc: 'Binance Smart Chain (BSC)'
  }
  return names[chain]
}

/**
 * Estimated gas fees for each network (in USD, approximate)
 * These are rough estimates and should be updated based on current network conditions
 */
export function getEstimatedGasFee(chain: BlockchainNetwork): string {
  const fees: Record<BlockchainNetwork, string> = {
    ethereum: '$5-15',
    polygon: '$0.01-0.10',
    bsc: '$0.10-0.50'
  }
  return fees[chain]
}
