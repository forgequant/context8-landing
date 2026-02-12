import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { DD_COLORS } from '@/lib/colors';

export interface CrowdedTradeGaugeProps {
  /** Agreement ratio 0-1.0 */
  ratio: number;
}

function ratioToColor(ratio: number): string {
  if (ratio < 0.4) return DD_COLORS.dangerSafe;
  if (ratio < 0.6) return DD_COLORS.dangerCaution;
  if (ratio < 0.8) return DD_COLORS.dangerHigh;
  return DD_COLORS.dangerExtreme;
}

/**
 * Semi-circular gauge for crowded trade agreement ratio.
 * Uses recharts RadialBarChart with startAngle 180 → endAngle 0.
 */
export function CrowdedTradeGauge({ ratio }: CrowdedTradeGaugeProps) {
  const clamped = Math.max(0, Math.min(1, ratio));
  const pct = Math.round(clamped * 100);
  const fill = ratioToColor(clamped);

  const data = [{ value: clamped * 100 }];

  return (
    <div className="relative" style={{ width: 160, height: 100 }}>
      <RadialBarChart
        width={160}
        height={100}
        cx={80}
        cy={90}
        innerRadius={50}
        outerRadius={75}
        startAngle={180}
        endAngle={0}
        data={data}
        barSize={12}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar
          dataKey="value"
          cornerRadius={6}
          fill={fill}
          background={{ fill: '#1A1C21' }}
        />
      </RadialBarChart>
      <span
        className="absolute font-mono font-semibold"
        style={{
          left: '50%',
          bottom: 4,
          transform: 'translateX(-50%)',
          fontSize: '1.125rem',
          color: fill,
        }}
      >
        {pct}%
      </span>
    </div>
  );
}
