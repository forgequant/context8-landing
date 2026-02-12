import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'
import { FileText, TrendingUp, GitBranch, Clock, Settings, Search } from 'lucide-react'

const NAV_COMMANDS = [
  { label: "Today's Report", route: '/dashboard/report/latest', icon: FileText, group: 'Navigation' },
  { label: 'Crowded Trades', route: '/dashboard/crowded', icon: TrendingUp, group: 'Navigation' },
  { label: 'Divergence Watch', route: '/dashboard/divergence', icon: GitBranch, group: 'Navigation' },
  { label: 'History', route: '/dashboard/history', icon: Clock, group: 'Navigation' },
] as const

const ASSET_COMMANDS = [
  { label: 'BTC — Bitcoin', keywords: ['bitcoin', 'btc'], route: '/dashboard/report/latest' },
  { label: 'ETH — Ethereum', keywords: ['ethereum', 'eth'], route: '/dashboard/report/latest' },
  { label: 'SOL — Solana', keywords: ['solana', 'sol'], route: '/dashboard/report/latest' },
] as const

const ACTION_COMMANDS = [
  { label: 'Settings', route: '/dashboard/settings', icon: Settings },
] as const

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  // Reset search when palette closes
  useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  const select = (route: string) => {
    onOpenChange(false)
    navigate(route)
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      overlayClassName="fixed inset-0 bg-black/60 z-50"
      contentClassName="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
      loop
    >
      <div className="bg-graphite-900 border border-graphite-700 rounded-lg shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-2 px-3 border-b border-graphite-800">
          <Search size={16} className="text-terminal-muted shrink-0" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search assets, commands..."
            className="w-full h-11 bg-transparent text-sm text-terminal-text placeholder:text-terminal-muted outline-none font-mono"
          />
          <kbd className="text-[10px] font-mono text-terminal-muted px-1.5 py-0.5 rounded border border-graphite-800 bg-graphite-950 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <Command.List className="max-h-72 overflow-y-auto p-1.5">
          <Command.Empty className="py-6 text-center text-sm text-terminal-muted font-mono">
            No results found.
          </Command.Empty>

          {/* Navigation group */}
          <Command.Group
            heading="Navigation"
            className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-terminal-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
          >
            {NAV_COMMANDS.map(({ label, route, icon: Icon }) => (
              <Command.Item
                key={route}
                value={label}
                onSelect={() => select(route)}
                className="flex items-center gap-3 px-2 py-2 rounded-md text-sm font-mono text-terminal-text cursor-pointer data-[selected=true]:bg-amber-dim data-[selected=true]:text-amber"
              >
                <Icon size={16} className="shrink-0" />
                {label}
              </Command.Item>
            ))}
          </Command.Group>

          {/* Assets group */}
          <Command.Group
            heading="Assets"
            className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-terminal-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
          >
            {ASSET_COMMANDS.map(({ label, keywords, route }) => (
              <Command.Item
                key={label}
                value={label}
                keywords={[...keywords]}
                onSelect={() => select(route)}
                className="flex items-center gap-3 px-2 py-2 rounded-md text-sm font-mono text-terminal-text cursor-pointer data-[selected=true]:bg-amber-dim data-[selected=true]:text-amber"
              >
                <span className="w-4 h-4 rounded-full bg-graphite-800 shrink-0" />
                {label}
              </Command.Item>
            ))}
          </Command.Group>

          {/* Actions group */}
          <Command.Group
            heading="Actions"
            className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-terminal-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
          >
            {ACTION_COMMANDS.map(({ label, route, icon: Icon }) => (
              <Command.Item
                key={route}
                value={label}
                onSelect={() => select(route)}
                className="flex items-center gap-3 px-2 py-2 rounded-md text-sm font-mono text-terminal-text cursor-pointer data-[selected=true]:bg-amber-dim data-[selected=true]:text-amber"
              >
                <Icon size={16} className="shrink-0" />
                {label}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  )
}
