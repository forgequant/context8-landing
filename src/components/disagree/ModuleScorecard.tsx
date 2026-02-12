import { useState, useMemo, useCallback, memo } from 'react';
import { DD_COLORS } from '@/lib/colors';
import { SIGNAL_DISPLAY, type SignalType } from '@/lib/signals';
import { ModulePill } from './ModulePill';
import { BullBearBalance } from './BullBearBalance';

// ── Types ────────────────────────────────────────────────────────

export type ModuleCategory = 'Technical' | 'Positioning' | 'Sentiment' | 'Macro' | 'On-Chain';

export interface ModuleData {
  id: string;
  name: string;
  category: ModuleCategory;
  signal: SignalType;
  conviction: number; // 0-10
  hasConflict?: boolean;
}

type FilterMode = 'all' | 'conflicts' | 'highConviction';

// ── Constants ────────────────────────────────────────────────────

const CATEGORY_ORDER: ModuleCategory[] = [
  'Technical',
  'Positioning',
  'Sentiment',
  'Macro',
  'On-Chain',
];

const CATEGORY_COLORS: Record<ModuleCategory, string> = {
  Technical: DD_COLORS.categoryTechnical,
  Positioning: DD_COLORS.categoryDerivatives,
  Sentiment: DD_COLORS.categorySentiment,
  Macro: DD_COLORS.categoryMacro,
  'On-Chain': DD_COLORS.categoryOnChain,
};

const FILTERS: { key: FilterMode; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'conflicts', label: 'Conflicts Only' },
  { key: 'highConviction', label: 'High Conviction' },
];

// ── Helpers ──────────────────────────────────────────────────────

function aggregateVerdict(modules: ModuleData[]): string {
  let bull = 0, bear = 0, neut = 0;
  for (const m of modules) {
    if (m.signal === 'bullish') bull++;
    else if (m.signal === 'bearish') bear++;
    else neut++;
  }
  const max = Math.max(bull, bear, neut);
  let label: string;
  if (max === bull) label = SIGNAL_DISPLAY.bullish.label;
  else if (max === bear) label = SIGNAL_DISPLAY.bearish.label;
  else label = SIGNAL_DISPLAY.neutral.label;
  return `${label} ${bull}-${bear}`;
}

// ── Category Group ───────────────────────────────────────────────

interface CategoryGroupProps {
  category: ModuleCategory;
  modules: ModuleData[];
}

const CategoryGroup = memo(function CategoryGroup({ category, modules }: CategoryGroupProps) {
  const [collapsed, setCollapsed] = useState(false);
  const color = CATEGORY_COLORS[category];
  const verdict = useMemo(() => aggregateVerdict(modules), [modules]);
  const sorted = useMemo(
    () => [...modules].sort((a, b) => b.conviction - a.conviction),
    [modules],
  );

  return (
    <div className="mb-3">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center gap-2 w-full text-left px-1 py-1 rounded hover:bg-white/5 transition-colors"
      >
        <span
          className="w-1 h-4 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs font-semibold tracking-wide uppercase" style={{ color }}>
          {category}
        </span>
        <span className="text-xs font-mono ml-auto" style={{ color: '#7B8FA0' }}>
          {verdict}
        </span>
        <span className="text-[10px]" style={{ color: '#7B8FA0' }}>
          {collapsed ? '\u25B6' : '\u25BC'}
        </span>
      </button>

      {!collapsed && (
        <div className="flex flex-wrap gap-2 mt-1 pl-3">
          {sorted.map((m) => (
            <ModulePill
              key={m.id}
              name={m.name}
              signal={m.signal}
              conviction={m.conviction}
              hasConflict={m.hasConflict}
            />
          ))}
        </div>
      )}
    </div>
  );
});

// ── Main Scorecard ───────────────────────────────────────────────

interface ModuleScorecardProps {
  modules: ModuleData[];
}

export const ModuleScorecard = memo(function ModuleScorecard({ modules }: ModuleScorecardProps) {
  const [filter, setFilter] = useState<FilterMode>('all');

  const filtered = useMemo(() => {
    switch (filter) {
      case 'conflicts':
        return modules.filter((m) => m.hasConflict);
      case 'highConviction':
        return modules.filter((m) => m.conviction >= 7); // >70% on 0-10 scale
      default:
        return modules;
    }
  }, [modules, filter]);

  const grouped = useMemo(() => {
    const map = new Map<ModuleCategory, ModuleData[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const m of filtered) {
      const arr = map.get(m.category);
      if (arr) arr.push(m);
    }
    return map;
  }, [filtered]);

  const allSignals = useMemo(() => modules.map((m) => m.signal), [modules]);

  const handleFilter = useCallback((key: FilterMode) => setFilter(key), []);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex gap-2 mb-3">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFilter(f.key)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: filter === f.key ? '#C49A3C22' : '#1A1C21',
              color: filter === f.key ? DD_COLORS.conviction10 : '#7B8FA0',
              border: `1px solid ${filter === f.key ? DD_COLORS.conviction10 + '44' : '#1A1C2144'}`,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Category groups */}
      {CATEGORY_ORDER.map((cat) => {
        const catModules = grouped.get(cat);
        if (!catModules || catModules.length === 0) return null;
        return <CategoryGroup key={cat} category={cat} modules={catModules} />;
      })}

      {/* Bull/Bear Balance */}
      <div className="mt-4">
        <BullBearBalance signals={allSignals} />
      </div>
    </div>
  );
});
