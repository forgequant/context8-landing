import { useEffect, useRef } from 'react';
import { usePriceStore, type PriceData } from '@/stores/priceStore';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws/!miniTicker@arr';
const STALE_TIMEOUT_MS = 30_000;
const RECONNECT_DELAY_MS = 3_000;


const TRACKED_PAIRS = new Set([
  'btcusdt', 'ethusdt', 'solusdt', 'dogeusdt', 'xrpusdt',
  'adausdt', 'avaxusdt', 'dotusdt', 'linkusdt', 'maticusdt',
]);

interface BinanceMiniTicker {
  s: string;
  c: string;
  o: string;
}

export function useWebSocketPrices() {
  const batchUpdate = usePriceStore((s) => s.batchUpdate);
  const setConnectionStatus = usePriceStore((s) => s.setConnectionStatus);

  const wsRef = useRef<WebSocket | null>(null);
  const bufferRef = useRef<Record<string, Partial<PriceData>>>({});
  const rafRef = useRef<number>(0);
  const staleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    function resetStaleTimer() {
      clearTimeout(staleTimerRef.current);
      staleTimerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setConnectionStatus('reconnecting');
        }
      }, STALE_TIMEOUT_MS);
    }

    function flushBuffer() {
      const buf = bufferRef.current;
      if (Object.keys(buf).length > 0) {
        batchUpdate(buf);
        bufferRef.current = {};
      }
      if (mountedRef.current) {
        rafRef.current = requestAnimationFrame(flushBuffer);
      }
    }

    function connect() {
      if (!mountedRef.current) return;

      const ws = new WebSocket(BINANCE_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) { ws.close(); return; }
        setConnectionStatus('connected');
        resetStaleTimer();
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        resetStaleTimer();
        setConnectionStatus('connected');

        try {
          const tickers: BinanceMiniTicker[] = JSON.parse(event.data);
          for (const t of tickers) {
            const sym = t.s.toLowerCase();
            if (!TRACKED_PAIRS.has(sym)) continue;

            const close = parseFloat(t.c);
            const open = parseFloat(t.o);
            const change24h = open > 0 ? ((close - open) / open) * 100 : 0;
            const displaySymbol = t.s.replace('USDT', '');

            bufferRef.current[displaySymbol] = { price: close, change24h };
          }
        } catch {
          return;
        }
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setConnectionStatus('disconnected');
        reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();
    rafRef.current = requestAnimationFrame(flushBuffer);

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(rafRef.current);
      clearTimeout(staleTimerRef.current);
      clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [batchUpdate, setConnectionStatus]);
}
