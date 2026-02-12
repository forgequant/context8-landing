import { create } from 'zustand';

export interface PriceData {
  price: number;
  prevPrice: number;
  change24h: number;
  lastUpdate: number;
  sparklineData: number[];
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

interface PriceState {
  prices: Record<string, PriceData>;
  connectionStatus: ConnectionStatus;
  lastMessageTime: number;
  batchUpdate: (updates: Record<string, Partial<PriceData>>) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
}

export const usePriceStore = create<PriceState>((set) => ({
  prices: {},
  connectionStatus: 'disconnected',
  lastMessageTime: 0,

  batchUpdate: (updates) =>
    set((state) => {
      const next = { ...state.prices };
      for (const [symbol, data] of Object.entries(updates)) {
        const existing = next[symbol];
        const price = data.price ?? existing?.price ?? 0;
        const sparkline = existing?.sparklineData ?? [];
        const updatedSparkline =
          data.price != null
            ? [...sparkline.slice(-59), price]
            : sparkline;

        next[symbol] = {
          price,
          prevPrice: existing?.price ?? price,
          change24h: data.change24h ?? existing?.change24h ?? 0,
          lastUpdate: Date.now(),
          sparklineData: updatedSparkline,
        };
      }
      return { prices: next, lastMessageTime: Date.now() };
    }),

  setConnectionStatus: (status) => set({ connectionStatus: status }),
}));

/** Per-symbol selector — minimizes re-renders to only the subscribing PriceCell */
export const selectPrice = (symbol: string) => (state: PriceState) =>
  state.prices[symbol];

export const selectConnectionStatus = (state: PriceState) =>
  state.connectionStatus;
