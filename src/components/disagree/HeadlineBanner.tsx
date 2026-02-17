import { ConvictionScore } from './ConvictionScore';

export type MacroRegime = 'risk_on' | 'risk_off' | 'mixed';
export type DxyTrend = 'up' | 'down' | 'flat';

export interface MacroBadge {
  regime: MacroRegime;
  fearGreed: number;
  dxyTrend: DxyTrend;
}

export interface HeadlineBannerProps {
  
  headline: string;
  
  conviction: number;
  
  reportDate: string;
  
  reportNumber: number;
  
  macro: MacroBadge;
}

const REGIME_LABELS: Record<MacroRegime, string> = {
  risk_on: 'RISK ON',
  risk_off: 'RISK OFF',
  mixed: 'MIXED',
};

const DXY_LABELS: Record<DxyTrend, string> = {
  up: 'DXY \u25B2',
  down: 'DXY \u25BC',
  flat: 'DXY \u25C6',
};

export function HeadlineBanner({
  headline,
  conviction,
  reportDate,
  reportNumber,
  macro,
}: HeadlineBannerProps) {
  return (
    <div
      className="w-full px-4 md:px-6 flex flex-col justify-center"
      style={{
        height: 120,
        backgroundColor: '#121317',
        borderBottom: '1px solid #1A1C2144',
      }}
    >
      <div className="flex items-center gap-4 min-w-0">
        <h1
          className="font-sans font-extrabold leading-tight truncate flex-1 min-w-0"
          style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
          title={headline}
        >
          {headline}
        </h1>
        <div className="shrink-0">
          <ConvictionScore value={conviction} />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <span className="font-mono text-xs text-[#7B8FA0]">
          {reportDate} &middot; Report #{reportNumber}
        </span>

        <div className="flex items-center gap-2">
          <Badge label={REGIME_LABELS[macro.regime]} />
          <Badge label={`F&G ${macro.fearGreed}`} />
          <Badge label={DXY_LABELS[macro.dxyTrend]} />
        </div>
      </div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[0.625rem] font-semibold uppercase tracking-wide"
      style={{
        backgroundColor: 'rgba(196, 154, 60, 0.10)',
        color: '#C49A3C',
      }}
    >
      {label}
    </span>
  );
}
