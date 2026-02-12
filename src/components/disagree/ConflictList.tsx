import { SEVERITY_ORDER } from './conflict-types';
import type { Conflict } from './conflict-types';
import { ConflictCard } from './ConflictCard';

export interface ConflictListProps {
  conflicts: Conflict[];
}

/** Vertical list of ConflictCards sorted by severity (critical first). */
export function ConflictList({ conflicts }: ConflictListProps) {
  const sorted = [...conflicts].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((c) => (
        <ConflictCard key={c.id} conflict={c} />
      ))}
    </div>
  );
}
