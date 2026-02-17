import React, { memo } from 'react';
import {
  usePriceStore,
  selectPrice,
  selectConnectionStatus,
  type ConnectionStatus,
} from '@/stores/priceStore';
import { MiniSparkline } from './MiniSparkline';
import { DD_COLORS } from '@/lib/colors';

const DISPLAY_SYMBOLS = [
  'BTC', 'ETH', 'SOL', 'DOGE', 'XRP',
  'ADA', 'AVAX', 'DOT', 'LINK', 'MATIC',
];

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

const STATUS_COLORS: Record<ConnectionStatus, string> = {
  connected: DD_COLORS.bullish,
  reconnecting: '#C49A3C',
  disconnected: DD_COLORS.bearish,
};


const PriceCell = memo(function PriceCell({ symbol }: { symbol: string }) {
  const data = usePriceStore(selectPrice(symbol));
  if (!data) return null;

  const { price, prevPrice, change24h, sparklineData } = data;
  const isUp = price >= prevPrice;
  const changeColor = change24h >= 0 ? DD_COLORS.priceUp : DD_COLORS.priceDown;
  const arrow = change24h >= 0 ? '\u25B2' : '\u25BC';
  const flashClass = isUp ? 'price-flash-up' : 'price-flash-down';

  return (
    <div className="flex items-center gap-2 px-3 shrink-0">
      <span className="text-[#7B8FA0] text-xs font-mono">{symbol}</span>
      <span
        key={price}
        className={`font-mono text-sm font-semibold ${flashClass}`}
        style={{ color: '#E6E8EC' }}
      >
        ${formatPrice(price)}
      </span>
      <span
        className="font-mono text-xs font-medium"
        style={{ color: changeColor }}
      >
        {arrow} {formatChange(change24h)}
      </span>
      {sparklineData.length > 1 && (
        <MiniSparkline data={sparklineData} color={changeColor} />
      )}
    </div>
  );
});

function ConnectionDot() {
  const status = usePriceStore(selectConnectionStatus);
  const color = STATUS_COLORS[status];

  return (
    <div className="flex items-center gap-1.5 px-3 shrink-0">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px] font-mono uppercase" style={{ color }}>
        {status === 'connected' ? 'LIVE' : status === 'reconnecting' ? 'STALE' : 'OFF'}
      </span>
    </div>
  );
}

export function PriceTicker() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center overflow-x-auto border-b"
      style={{
        height: 40,
        backgroundColor: '#121317',
        borderColor: '#1A1C2144',
      }}
    >
      <ConnectionDot />
      <div className="h-4 w-px bg-[#1A1C21] shrink-0" />
      {DISPLAY_SYMBOLS.map((sym) => (
        <PriceCell key={sym} symbol={sym} />
      ))}
    </div>
  );
}
