export interface MarketData {
  symbol: string
  price: string
  volume: string
  spread?: string
  timestamp: number
}

export interface OrderBookData {
  symbol: string
  bids: Array<[number, number]>
  asks: Array<[number, number]>
  spread: number
  imbalance: number
  timestamp: number
}

export interface VolumeProfile {
  symbol: string
  levels: Array<{
    price: number
    volume: number
  }>
  timestamp: number
}
