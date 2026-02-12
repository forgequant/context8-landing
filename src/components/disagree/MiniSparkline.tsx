import { useEffect, useRef, memo } from 'react';
import { createChart, type IChartApi, ColorType, LineSeries } from 'lightweight-charts';

interface MiniSparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

export const MiniSparkline = memo(function MiniSparkline({
  data,
  color,
  width = 60,
  height = 20,
}: MiniSparklineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'transparent',
        attributionLogo: false,
      },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      crosshair: { mode: 0 },
      rightPriceScale: { visible: false },
      timeScale: { visible: false },
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addSeries(LineSeries, {
      color,
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });

    const seriesData = data.map((value, i) => ({
      time: (i + 1) as unknown as import('lightweight-charts').Time,
      value,
    }));
    series.setData(seriesData);
    chart.timeScale().fitContent();

    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [data, color, width, height]);

  return <div ref={containerRef} style={{ width, height }} className="shrink-0" />;
});
