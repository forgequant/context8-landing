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
      <label className="block text-sm font-medium text-terminal-muted">
        Transaction Hash <span className="text-terminal-red">*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder="0x..."
        className={`
          w-full px-3 py-2 bg-graphite-950 border rounded text-terminal-text font-mono text-sm
          placeholder-terminal-muted/60 focus:outline-none focus:ring-2
          ${
            displayError
              ? 'border-terminal-red/60 focus:ring-terminal-red/30'
              : 'border-graphite-800 focus:ring-terminal-cyan/30'
          }
        `}
      />
      {displayError && (
        <p className="text-xs text-terminal-red font-mono">{displayError}</p>
      )}
      <p className="text-xs text-terminal-muted">
        Enter the transaction hash from your wallet after sending the payment
      </p>
    </div>
  )
}
