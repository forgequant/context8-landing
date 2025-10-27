import { BlockchainNetwork } from '../../types/subscription'
import { getChainDisplayName, getEstimatedGasFee } from '../../lib/blockchain'

interface ChainSelectorProps {
  selectedChain: BlockchainNetwork
  onChainChange: (chain: BlockchainNetwork) => void
}

const CHAINS: BlockchainNetwork[] = ['ethereum', 'polygon', 'bsc']

export function ChainSelector({ selectedChain, onChainChange }: ChainSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
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
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{getChainDisplayName(chain)}</span>
                <span className="text-xs text-gray-400">
                  Gas: {getEstimatedGasFee(chain)}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
