import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const SECTION_ROUTES = [
  '/dashboard/report/latest',
] as const

interface UseKeyboardNavOptions {
  onTogglePalette: () => void
}


export function useKeyboardNav({ onTogglePalette }: UseKeyboardNavOptions) {
  const navigate = useNavigate()
  const { date } = useParams<{ date: string }>()

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) {
        if (e.key === 'Escape') {
          ;(target as HTMLInputElement).blur?.()
          return
        }
        return
      }
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onTogglePalette()
        return
      }
      if (e.key === 'Escape') {
        return
      }
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= SECTION_ROUTES.length && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        navigate(SECTION_ROUTES[num - 1])
        return
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const direction = e.key === 'ArrowLeft' ? -1 : 1
        const base = date && date !== 'latest' ? new Date(date) : new Date()
        base.setDate(base.getDate() + direction)
        const iso = base.toISOString().split('T')[0]
        e.preventDefault()
        navigate(`/dashboard/report/${iso}`)
        return
      }
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
