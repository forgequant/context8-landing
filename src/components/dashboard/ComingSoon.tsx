import { Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ComingSoonProps {
  title: string
  description?: string
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto pt-10">
      <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-graphite-800 bg-graphite-950 text-terminal-muted font-mono text-[11px]">
          <Lock size={14} />
          Coming soon
        </div>

        <h1 className="mt-4 text-xl font-extrabold tracking-tight text-terminal-text">
          {title}
        </h1>
        <p className="mt-2 text-sm text-terminal-muted leading-relaxed">
          {description ?? 'This section will be available soon.'}
        </p>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => navigate('/dashboard/report/latest')}
            className="px-4 py-2 rounded-lg bg-amber text-graphite-950 text-sm font-semibold hover:opacity-95 transition-opacity"
          >
            Back to Today&apos;s Report
          </button>
        </div>
      </div>
    </div>
  )
}

