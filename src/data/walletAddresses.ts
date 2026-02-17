import { WalletAddresses } from '../types/subscription'


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


export function getWalletAddress(chain: keyof WalletAddresses, stablecoin: 'usdt' | 'usdc'): string {
  return WALLET_ADDRESSES[chain][stablecoin]
}
