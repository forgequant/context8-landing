import { memo, useMemo } from 'react';
import { BarChart, Bar, XAxis, Cell, LabelList } from 'recharts';
import { DD_COLORS } from '@/lib/colors';
import type { SignalType } from '@/lib/signals';

interface BullBearBalanceProps {
  signals: SignalType[];
}

export const BullBearBalance = memo(function BullBearBalance({ signals }: BullBearBalanceProps) {
  const counts = useMemo(() => {
    let bull = 0, neutral = 0, bear = 0;
    for (const s of signals) {
      if (s === 'bullish') bull++;
      else if (s === 'bearish') bear++;
      else neutral++;
    }
    return { bull, neutral, bear, total: signals.length };
  }, [signals]);

  if (counts.total === 0) return null;
  const data = [{ bull: counts.bull, neutral: counts.neutral, bear: counts.bear }];

  const COLORS = [DD_COLORS.bullish, DD_COLORS.neutral, DD_COLORS.bearish] as const;
  const KEYS = ['bull', 'neutral', 'bear'] as const;

  return (
    <div className="w-full">
      <BarChart
        width={600}
        height={48}
        data={data}
        layout="vertical"
        barCategoryGap={0}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        style={{ width: '100%' }}
      >
        <XAxis type="number" domain={[0, counts.total]} hide />
        {KEYS.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="balance"
            fill={COLORS[i]}
            isAnimationActive={false}
            radius={
              i === 0
                ? [4, 0, 0, 4]
                : i === 2
                  ? [0, 4, 4, 0]
                  : undefined
            }
          >
            <Cell fill={COLORS[i]} />
            <LabelList
              dataKey={key}
              position="center"
              style={{ fill: '#E6E8EC', fontSize: 12, fontFamily: 'monospace' }}
              formatter={(v: number) => (v > 0 ? String(v) : '')}
            />
          </Bar>
        ))}
      </BarChart>

      <p className="text-center text-xs font-mono mt-1" style={{ color: '#7B8FA0' }}>
        {counts.bull} Bull / {counts.neutral} Neutral / {counts.bear} Bear
      </p>
    </div>
  );
});
