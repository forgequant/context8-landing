import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const SECTION_ROUTES = [
  '/dashboard/report/latest',   // 1
] as const

interface UseKeyboardNavOptions {
  onTogglePalette: () => void
}

/** Global keyboard shortcuts for dashboard navigation. */
export function useKeyboardNav({ onTogglePalette }: UseKeyboardNavOptions) {
  const navigate = useNavigate()
  const { date } = useParams<{ date: string }>()

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const tag = target.tagName

      // Skip when user is typing in an input
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) {
        // Allow Escape to still work inside inputs
        if (e.key === 'Escape') {
          ;(target as HTMLInputElement).blur?.()
          return
        }
        return
      }

      // Ctrl+K / Cmd+K — command palette
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onTogglePalette()
        return
      }

      // Escape — close any open panel (command palette handles its own Escape)
      if (e.key === 'Escape') {
        return
      }

      // 1-4 — section navigation
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= SECTION_ROUTES.length && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        navigate(SECTION_ROUTES[num - 1])
        return
      }

      // Left/Right arrow — prev/next day report
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const direction = e.key === 'ArrowLeft' ? -1 : 1
        const base = date && date !== 'latest' ? new Date(date) : new Date()
        base.setDate(base.getDate() + direction)
        const iso = base.toISOString().split('T')[0]
        e.preventDefault()
        navigate(`/dashboard/report/${iso}`)
        return
      }

      // / — focus search (open command palette)
      if (e.key === '/') {
        e.preventDefault()
        onTogglePalette()
        return
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [navigate, date, onTogglePalette])
}
