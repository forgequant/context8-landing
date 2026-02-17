import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BlockchainNetwork, StablecoinType } from '../../types/subscription'
import { ChainSelector } from './ChainSelector'
import { QRCodeDisplay } from './QRCodeDisplay'
import { TxHashInput } from './TxHashInput'
import { getWalletAddress } from '../../data/walletAddresses'
import { getChainDisplayName } from '../../lib/blockchain'
import { validateTxHash } from '../../lib/subscription'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { chain: BlockchainNetwork; stablecoin: StablecoinType; txHash: string }) => Promise<void>
}

export function PaymentModal({ isOpen, onClose, onSubmit }: PaymentModalProps) {
  const [selectedChain, setSelectedChain] = useState<BlockchainNetwork>('polygon')
  const [selectedStablecoin, setSelectedStablecoin] = useState<StablecoinType>('usdc')
  const [txHash, setTxHash] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  const walletAddress = getWalletAddress(selectedChain, selectedStablecoin)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate transaction hash
    const validation = validateTxHash(txHash)
    if (!validation.valid) {
      setError(validation.error || 'Invalid transaction hash')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        chain: selectedChain,
        stablecoin: selectedStablecoin,
        txHash: txHash.trim()
      })
      // Reset form on success
      setTxHash('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit payment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setTxHash('')
      setError('')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-graphite-900 rounded-xl border border-graphite-800 shadow-2xl max-h-[90vh] overflow-y-auto text-terminal-text"
            >
              {/* Header */}
              <div className="sticky top-0 bg-graphite-900 border-b border-graphite-800 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-extrabold tracking-tight">Upgrade to Pro</h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-terminal-muted hover:text-terminal-text transition-colors disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Price Info */}
                <div className="text-center p-4 bg-terminal-cyan/10 border border-terminal-cyan/30 rounded-lg">
                  <div className="text-3xl font-extrabold tracking-tight">$8</div>
                  <div className="text-sm text-terminal-muted">per month</div>
                </div>

                {/* Chain Selector */}
                <ChainSelector
                  selectedChain={selectedChain}
                  onChainChange={setSelectedChain}
                />

                {/* Stablecoin Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-terminal-muted">
                    Select Stablecoin
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['usdc', 'usdt'] as StablecoinType[]).map((coin) => {
                      const isSelected = selectedStablecoin === coin
                      return (
                        <button
                          key={coin}
                          type="button"
                          onClick={() => setSelectedStablecoin(coin)}
                          className={`
                            px-4 py-2 rounded-lg border-2 font-medium transition-all
                            ${
                              isSelected
                                ? 'border-terminal-cyan bg-terminal-cyan/10 text-terminal-text'
                                : 'border-graphite-800 bg-graphite-950 text-terminal-muted hover:border-graphite-700 hover:text-terminal-text'
                            }
                          `}
                        >
                          {coin.toUpperCase()}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* QR Code Display */}
                <QRCodeDisplay
                  address={walletAddress}
                  chainName={getChainDisplayName(selectedChain)}
                />

                {/* Transaction Hash Input */}
                <TxHashInput
                  value={txHash}
                  onChange={setTxHash}
                  error={error}
                />

                {/* Warning */}
                <div className="p-4 bg-terminal-red/10 border border-terminal-red/30 rounded-lg text-sm text-terminal-text space-y-2">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-terminal-red flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-semibold">Warning: wrong network = permanent loss.</p>
                      <p className="mt-1 text-terminal-muted">
                        Double-check you selected <strong>{getChainDisplayName(selectedChain)}</strong> in your wallet before sending payment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !txHash.trim()}
                  className="w-full px-4 py-3 bg-terminal-cyan hover:bg-terminal-cyan/90 disabled:bg-graphite-800 disabled:text-terminal-muted disabled:cursor-not-allowed text-graphite-950 font-semibold rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Payment'}
                </button>

                {/* Help Text */}
                <p className="text-xs text-terminal-muted text-center">
                  Your subscription will be activated after admin verification (typically within 24 hours)
                </p>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
