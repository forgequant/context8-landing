import { BlockchainNetwork } from '../../types/subscription'
import { getChainDisplayName } from '../../lib/blockchain'
import { useGasPrices } from '../../hooks/useGasPrices'

interface ChainSelectorProps {
  selectedChain: BlockchainNetwork
  onChainChange: (chain: BlockchainNetwork) => void
}

const CHAINS: BlockchainNetwork[] = ['ethereum', 'polygon', 'bsc']

export function ChainSelector({ selectedChain, onChainChange }: ChainSelectorProps) {
  const { gasPrices } = useGasPrices()

  const formatGasFee = (chain: BlockchainNetwork): string => {
    const price = gasPrices[chain]
    if (price === null) return '~$0.01'
    if (price < 0.01) return '<$0.01'
    if (price < 1) return `~$${price.toFixed(2)}`
    return `~$${price.toFixed(1)}`
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-terminal-muted">
        Select Network
      </label>
      <div className="grid grid-cols-1 gap-2">
        {CHAINS.map((chain) => {
          const isSelected = selectedChain === chain
          return (
            <button
              key={chain}
              type="button"
              onClick={() => onChainChange(chain)}
              className={`
                px-4 py-3 rounded-lg border-2 text-left transition-all
                ${
                  isSelected
                    ? 'border-terminal-cyan bg-terminal-cyan/10 text-terminal-text'
                    : 'border-graphite-800 bg-graphite-950 text-terminal-muted hover:border-graphite-700 hover:text-terminal-text'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{getChainDisplayName(chain)}</span>
                <span className="text-xs text-terminal-muted/70 font-mono">
                  Gas: {formatGasFee(chain)}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
