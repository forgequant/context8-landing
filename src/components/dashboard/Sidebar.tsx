import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  FileText,
  TrendingUp,
  GitBranch,
  Clock,
  Coins,
  Lock,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/dashboard/report/latest', icon: FileText, label: "Today's Report", locked: false },
  { to: '/dashboard/crowded', icon: TrendingUp, label: 'Crowded Trades', locked: true },
  { to: '/dashboard/divergence', icon: GitBranch, label: 'Divergence Watch', locked: true },
  { to: '/dashboard/history', icon: Clock, label: 'Historical', locked: true },
  { to: '/dashboard/assets', icon: Coins, label: 'Assets', locked: true },
] as const

function isActiveRoute(pathname: string, to: string): boolean {
  if (to === '/dashboard/report/latest') {
    return pathname.startsWith('/dashboard/report')
  }
  return pathname.startsWith(to)
}

/** Desktop sidebar: 48px collapsed, 200px on hover. Mobile: bottom tab bar. */
export function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const { pathname } = useLocation()

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`hidden md:flex flex-col fixed left-0 top-0 h-screen z-40
          bg-graphite-900 border-r border-graphite-800 transition-[width] duration-200 ease-in-out
          ${expanded ? 'w-[200px]' : 'w-12'}`}
      >
        {/* Logo area */}
        <div className="h-14 flex items-center px-3 border-b border-graphite-800 overflow-hidden">
          <span className="text-amber font-sans font-bold text-sm whitespace-nowrap">
            {expanded ? 'Daily Disagree' : 'DD'}
          </span>
        </div>

        {/* Nav items */}
        <div className="flex-1 flex flex-col gap-1 py-2 px-1.5">
          {NAV_ITEMS.map(({ to, icon: Icon, label, locked }) => {
            const active = isActiveRoute(pathname, to)
            const DisplayIcon = locked && !expanded ? Lock : Icon

            if (locked) {
              return (
                <div
                  key={to}
                  aria-disabled="true"
                  title="Coming soon"
                  className={`flex items-center gap-3 rounded-md px-2.5 py-2 text-sm border-l-2 select-none
                    ${active
                      ? 'bg-graphite-800/60 text-terminal-muted border-graphite-700'
                      : 'text-terminal-muted/60 border-transparent'
                    } cursor-not-allowed`}
                >
                  <DisplayIcon size={18} className="shrink-0" />
                  {expanded && (
                    <>
                      <span className="whitespace-nowrap font-mono text-xs">{label}</span>
                      <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono text-terminal-muted uppercase tracking-wider">
                        <Lock size={12} />
                        Soon
                      </span>
                    </>
                  )}
                </div>
              )
            }

            return (
              <NavLink
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors
                  ${active
                    ? 'bg-amber-dim text-amber border-l-2 border-amber'
                    : 'text-terminal-muted hover:text-terminal-text hover:bg-graphite-800 border-l-2 border-transparent'
                  }`}
              >
                <Icon size={18} className="shrink-0" />
                {expanded && (
                  <span className="whitespace-nowrap font-mono text-xs">{label}</span>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-graphite-900 border-t border-graphite-800 flex items-center justify-around h-14 px-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label, locked }) => {
          const active = isActiveRoute(pathname, to)
          const DisplayIcon = locked ? Lock : Icon

          if (locked) {
            return (
              <div
                key={to}
                aria-disabled="true"
                title="Coming soon"
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-[10px] cursor-not-allowed
                  ${active ? 'text-terminal-muted' : 'text-terminal-muted/70'}`}
              >
                <DisplayIcon size={18} />
                <span className="truncate max-w-[56px]">{label}</span>
              </div>
            )
          }

          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-[10px]
                ${active ? 'text-amber' : 'text-terminal-muted'}`}
            >
              <Icon size={18} />
              <span className="truncate max-w-[56px]">{label}</span>
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}
