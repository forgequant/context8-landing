'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  lastUpdate: Date;
}

/**
 * Live Price Widget
 *
 * Displays real-time BTC and ETH prices from Binance API
 * Updates every 60 seconds
 *
 * Features:
 * - Real-time price updates from Binance
 * - 24h change percentage with trend indicator
 * - Animated transitions
 * - Visual feedback for price changes
 * - Fallback to mock data if API fails
 */
export function LivePriceWidget() {
  const [prices, setPrices] = useState<CryptoPrice[]>([
    { symbol: 'BTC', price: 42150.25, change24h: 2.34, lastUpdate: new Date() },
    { symbol: 'ETH', price: 2234.89, change24h: -1.12, lastUpdate: new Date() },
  ]);
  const [isLive, setIsLive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchPrices = async () => {
    if (isLoading) return;

    console.log('[LivePriceWidget] Fetching prices...', new Date().toLocaleTimeString());
    setIsLoading(true);
    setIsUpdating(true);

    try {
      const response = await fetch('/api/crypto-prices');
      const result = await response.json();

      // Use data even if success is false (fallback data is still useful)
      if (result.data && result.data.length > 0) {
        console.log('[LivePriceWidget] Updated prices:', result.data, 'success:', result.success);
        setPrices(
          result.data.map((item: any) => ({
            symbol: item.symbol,
            price: item.price,
            change24h: item.change24h,
            lastUpdate: new Date(item.lastUpdate),
          }))
        );
        setLastUpdate(new Date());
      }

      // Flash live indicator
      setIsLive(false);
      setTimeout(() => setIsLive(true), 300);
    } catch (error) {
      console.error('[LivePriceWidget] Failed to fetch crypto prices:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsUpdating(false), 500);
    }
  };

  useEffect(() => {
    console.log('[LivePriceWidget] Component mounted, starting auto-refresh...');

    // Fetch prices immediately on mount
    fetchPrices();

    // Fetch prices every 10 seconds for demo (change to 60000 for production)
    const UPDATE_INTERVAL = 10000; // 10 seconds for demo
    console.log(`[LivePriceWidget] Auto-refresh interval: ${UPDATE_INTERVAL / 1000}s`);

    const interval = setInterval(() => {
      console.log('[LivePriceWidget] Auto-refresh triggered');
      fetchPrices();
    }, UPDATE_INTERVAL);

    return () => {
      console.log('[LivePriceWidget] Component unmounted, clearing interval');
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className={`inline-flex items-center gap-6 rounded-xl border px-6 py-3 backdrop-blur-sm transition-all duration-300 ${
        isUpdating
          ? 'border-teal-500/50 bg-teal-900/20 shadow-lg shadow-teal-500/20'
          : 'border-slate-800/50 bg-slate-900/80'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <div className={`relative flex h-2 w-2`}>
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75 ${isLive ? '' : 'opacity-0'}`}
          />
          <span className={`relative inline-flex h-2 w-2 rounded-full transition-all ${isUpdating ? 'bg-teal-400 scale-125' : 'bg-teal-500'}`} />
        </div>
        <span className={`text-xs font-medium transition-colors ${isUpdating ? 'text-teal-300' : 'text-teal-400'}`}>
          {isUpdating ? 'UPDATING...' : 'LIVE'}
        </span>
      </div>

      {/* Price cards */}
      <div className="flex items-center gap-6">
        <AnimatePresence>
          {prices.map((crypto) => (
            <motion.div
              key={crypto.symbol}
              className="flex items-center gap-3"
              layout
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              {/* Symbol */}
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-bold text-white">
                  {crypto.symbol}
                </span>
              </div>

              {/* Price */}
              <motion.div
                className="flex flex-col"
                animate={isUpdating ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className={`text-sm font-semibold transition-colors ${isUpdating ? 'text-teal-400' : 'text-white'}`}
                  animate={isUpdating ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
                >
                  ${crypto.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </motion.span>

                {/* 24h change */}
                <div className="flex items-center gap-1">
                  {crypto.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {crypto.change24h >= 0 ? '+' : ''}
                    {crypto.change24h.toFixed(2)}%
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Update timestamp */}
      <div className="flex flex-col items-end">
        <div className={`text-xs transition-colors ${isUpdating ? 'text-teal-400' : 'text-slate-500'}`}>
          Updated {lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div className="text-[10px] text-slate-600">
          Next: {new Date(lastUpdate.getTime() + 10000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}
