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
        <div className="inline-block p-4 bg-white rounded-lg">
          <QRCodeSVG
            value={address}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        <p className="mt-2 text-sm text-gray-400">
          Scan with your {chainName} wallet
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Payment Address
        </label>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 font-mono break-all">
            {address}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="p-3 bg-yellow-900/20 border border-yellow-700 rounded text-sm text-yellow-200">
        <strong>Amount:</strong> 8 USDC or 8 USDT on {chainName}
      </div>
    </div>
  )
}
