import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LogOut, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

function formatReportDate(date: string | undefined): string {
  if (!date || date === 'latest') return 'Latest Report'
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return date
  }
}


export function DashboardHeader() {
  const navigate = useNavigate()
  const { date } = useParams<{ date: string }>()
  const { logout } = useAuth()

  const navigateDay = (direction: -1 | 1) => {
    const base = date && date !== 'latest' ? new Date(date) : new Date()
    base.setDate(base.getDate() + direction)
    const iso = base.toISOString().split('T')[0]
    navigate(`/dashboard/report/${iso}`)
  }

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-graphite-800 bg-graphite-900 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="font-sans font-bold text-sm text-amber">DD</span>
        <span className="hidden sm:inline text-xs text-terminal-muted font-mono">
          Daily Disagree
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigateDay(-1)}
          className="p-1 rounded hover:bg-graphite-800 text-terminal-muted hover:text-terminal-text transition-colors"
          aria-label="Previous day"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs font-mono text-terminal-text min-w-[110px] text-center">
          {formatReportDate(date)}
        </span>
        <button
          onClick={() => navigateDay(1)}
          className="p-1 rounded hover:bg-graphite-800 text-terminal-muted hover:text-terminal-text transition-colors"
          aria-label="Next day"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3 text-terminal-muted">
        <div className="flex items-center gap-1.5">
          <Search size={14} />
          <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded border border-graphite-800 bg-graphite-900">
            Ctrl+K
          </kbd>
        </div>

        <button
          type="button"
          onClick={() => void logout()}
          className="inline-flex items-center gap-1.5 text-terminal-muted hover:text-terminal-red transition-colors"
          aria-label="Logout"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline text-[11px] font-mono">Logout</span>
        </button>
      </div>
    </header>
  )
}
