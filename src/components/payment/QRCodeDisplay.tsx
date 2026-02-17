import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

interface QRCodeDisplayProps {
  address: string
  chainName: string
}

export function QRCodeDisplay({ address, chainName }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="inline-block p-4 bg-white rounded-lg border border-graphite-800">
          <QRCodeSVG
            value={address}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        <p className="mt-2 text-sm text-terminal-muted">
          Scan with your {chainName} wallet
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-terminal-muted">
          Payment Address
        </label>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 bg-graphite-950 border border-graphite-800 rounded text-xs text-terminal-muted font-mono break-all">
            {address}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 bg-terminal-cyan hover:bg-terminal-cyan/90 text-graphite-950 rounded text-sm font-semibold transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="p-3 bg-terminal-cyan/10 border border-terminal-cyan/30 rounded text-sm text-terminal-text">
        <strong className="text-terminal-cyan">Amount:</strong> 8 USDC or 8 USDT on {chainName}
      </div>
    </div>
  )
}
