import { useState, useEffect } from 'react'
import { validateTxHash } from '../../lib/subscription'

interface TxHashInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function TxHashInput({ value, onChange, error: externalError }: TxHashInputProps) {
  const [touched, setTouched] = useState(false)
  const [internalError, setInternalError] = useState<string>('')

  useEffect(() => {
    if (touched && value) {
      const validation = validateTxHash(value)
      setInternalError(validation.valid ? '' : validation.error || '')
    } else {
      setInternalError('')
    }
  }, [value, touched])

  const displayError = externalError || internalError

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Transaction Hash <span className="text-red-400">*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder="0x..."
        className={`
          w-full px-3 py-2 bg-gray-800 border rounded text-white font-mono text-sm
          placeholder-gray-500 focus:outline-none focus:ring-2
          ${
            displayError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-700 focus:ring-blue-500'
          }
        `}
      />
      {displayError && (
        <p className="text-xs text-red-400">{displayError}</p>
      )}
      <p className="text-xs text-gray-400">
        Enter the transaction hash from your wallet after sending the payment
      </p>
    </div>
  )
}
