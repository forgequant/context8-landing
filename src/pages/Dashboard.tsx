import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/dashboard/Sidebar'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { CommandPalette } from '../components/dashboard/CommandPalette'
import { useKeyboardNav } from '../hooks/useKeyboardNav'

/** Layout shell: sidebar + header + nested route outlet. */
export function Dashboard() {
  const [paletteOpen, setPaletteOpen] = useState(false)

  const togglePalette = useCallback(() => {
    setPaletteOpen(prev => !prev)
  }, [])

  useKeyboardNav({ onTogglePalette: togglePalette })

  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text">
      <Sidebar />

      {/* Main content area — offset by sidebar width on desktop, bottom bar on mobile */}
      <div className="md:ml-12 pb-16 md:pb-0">
        <DashboardHeader />

        <main className="px-4 md:px-6 py-4">
          <Outlet />
        </main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  )
}
