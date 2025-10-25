export interface DataSource {
  id: string
  name: string
  description: string
  category: "price" | "news" | "onchain" | "social"
  updateFrequency: string
}

export const dataSources: DataSource[] = [
  {
    id: "binance-prices",
    name: "Binance Prices",
    description: "Real-time spot prices from Binance",
    category: "price",
    updateFrequency: "1 minute",
  },
  {
    id: "crypto-news",
    name: "Crypto News",
    description: "Curated news from major crypto outlets",
    category: "news",
    updateFrequency: "15 minutes",
  },
  {
    id: "onchain-metrics",
    name: "On-chain Metrics",
    description: "Network activity and wallet metrics",
    category: "onchain",
    updateFrequency: "1 hour",
  },
  {
    id: "social-signals",
    name: "Social Signals",
    description: "Sentiment from Twitter and Reddit",
    category: "social",
    updateFrequency: "30 minutes",
  },
]

export const getDataSourceById = (id: string): DataSource | undefined => {
  return dataSources.find((source) => source.id === id)
}

export const getDataSourcesByCategory = (
  category: DataSource["category"]
): DataSource[] => {
  return dataSources.filter((source) => source.category === category)
}
