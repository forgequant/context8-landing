import { useEffect, useRef, useState, memo } from 'react';
import {
  createChart,
  createSeriesMarkers,
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type SeriesMarker,
  type Time,
} from 'lightweight-charts';

const TIMEFRAMES = ['15m', '1h', '4h', '1D'] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

export interface PriceChartProps {
  data: CandlestickData<Time>[];
  markers?: SeriesMarker<Time>[];
  onTimeframeChange?: (tf: Timeframe) => void;
}

export const PriceChart = memo(function PriceChart({
  data,
  markers,
  onTimeframeChange,
}: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1h');

  // Create chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0B0C0E' },
        textColor: '#7B8FA0',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: '#1A1C2133' },
        horzLines: { color: '#1A1C2133' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#C49A3C44', labelBackgroundColor: '#C49A3C' },
        horzLine: { color: '#C49A3C44', labelBackgroundColor: '#C49A3C' },
      },
      rightPriceScale: {
        borderColor: '#1A1C2144',
      },
      timeScale: {
        borderColor: '#1A1C2144',
        timeVisible: true,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#4CAF78',
      downColor: '#C94D4D',
      borderUpColor: '#4CAF78',
      borderDownColor: '#C94D4D',
      wickUpColor: '#4CAF78',
      wickDownColor: '#C94D4D',
    });

    chartRef.current = chart;
    seriesRef.current = series;

    // Responsive resize
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      chart.applyOptions({ width });
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Update data
  useEffect(() => {
    if (!seriesRef.current) return;
    seriesRef.current.setData(data);
    if (markers && markers.length > 0) {
      createSeriesMarkers(seriesRef.current, markers);
    }
    chartRef.current?.timeScale().fitContent();
  }, [data, markers]);

  function handleTimeframe(tf: Timeframe) {
    setActiveTimeframe(tf);
    onTimeframeChange?.(tf);
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-1 mb-2">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => handleTimeframe(tf)}
            className="px-3 py-1 text-xs font-mono rounded transition-colors"
            style={{
              backgroundColor: activeTimeframe === tf ? '#C49A3C' : '#1A1C21',
              color: activeTimeframe === tf ? '#0B0C0E' : '#7B8FA0',
            }}
          >
            {tf}
          </button>
        ))}
      </div>
      <div ref={containerRef} style={{ width: '100%', height: 400 }} />
    </div>
  );
});
