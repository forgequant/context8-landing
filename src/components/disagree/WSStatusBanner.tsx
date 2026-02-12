import { useEffect, useState, memo } from 'react';
import { usePriceStore, selectConnectionStatus } from '@/stores/priceStore';

const STALE_THRESHOLD_MS = 30_000;

export const WSStatusBanner = memo(function WSStatusBanner() {
  const connectionStatus = usePriceStore(selectConnectionStatus);
  const lastMessageTime = usePriceStore((s) => s.lastMessageTime);
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastMessageTime > 0) {
        setSecondsAgo(Math.floor((Date.now() - lastMessageTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastMessageTime]);

  const isStale = lastMessageTime > 0 && secondsAgo > STALE_THRESHOLD_MS / 1000;
  const isDisconnected = connectionStatus === 'disconnected';
  const isReconnecting = connectionStatus === 'reconnecting';

  if (!isStale && !isDisconnected) return null;

  return (
    <div
      className="w-full px-4 py-2 text-center text-xs font-mono"
      style={{ backgroundColor: '#C94D4D', color: '#FFFFFF' }}
    >
      DATA STALE
      {isStale && <> &mdash; Last update {secondsAgo}s ago</>}
      {(isReconnecting || isDisconnected) && <> &mdash; Reconnecting...</>}
    </div>
  );
});
