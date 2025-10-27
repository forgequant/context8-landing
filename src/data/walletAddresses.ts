import { WalletAddresses } from '../types/subscription'

/**
 * Static crypto wallet addresses for receiving subscription payments
 *
 * IMPORTANT: These are placeholder addresses. Replace with your actual wallet addresses before deployment.
 * Each address should support USDT and USDC on the respective network.
 *
 * Security: These addresses are intentionally public (displayed to users for payments).
 * Private keys must NEVER be stored in this codebase.
 */
export const WALLET_ADDRESSES: WalletAddresses = {
  ethereum: {
    usdt: '0x25BFf871800bA09fFf55467e6f0D7ee6dd342c95',
    usdc: '0x25BFf871800bA09fFf55467e6f0D7ee6dd342c95'
  },
  polygon: {
    usdt: '0x25BFf871800bA09fFf55467e6f0D7ee6dd342c95',
    usdc: '0x25BFf871800bA09fFf55467e6f0D7ee6dd342c95'
  },
  bsc: {
    usdt: '0x25BFf871800bA09fFf55467e6f0D7ee6dd342c95',
    usdc: '0x25BFf871800bA09fFf55467e6f0D7ee6dd342c95'
  }
}

/**
 * Get wallet address for specific chain and stablecoin
 */
export function getWalletAddress(chain: keyof WalletAddresses, stablecoin: 'usdt' | 'usdc'): string {
  return WALLET_ADDRESSES[chain][stablecoin]
}
