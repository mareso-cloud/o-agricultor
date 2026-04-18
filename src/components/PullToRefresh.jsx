import { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const THRESHOLD = 70;

export default function PullToRefresh({ onRefresh, children }) {
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (startY.current === null || refreshing) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0 && window.scrollY === 0) {
        setPullY(Math.min(delta * 0.5, THRESHOLD + 20));
      }
    };

    const onTouchEnd = async () => {
      if (pullY >= THRESHOLD) {
        setRefreshing(true);
        setPullY(THRESHOLD);
        await onRefresh();
        setRefreshing(false);
      }
      setPullY(0);
      startY.current = null;
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [pullY, refreshing, onRefresh]);

  const triggered = pullY >= THRESHOLD || refreshing;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Pull indicator */}
      <div
        style={{
          height: refreshing ? THRESHOLD : pullY,
          overflow: 'hidden',
          transition: refreshing || pullY === 0 ? 'height 0.3s ease' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <RefreshCw
          className={`w-5 h-5 text-primary transition-all ${refreshing ? 'animate-spin' : ''}`}
          style={{ opacity: pullY > 10 ? 1 : 0, transform: `rotate(${(pullY / THRESHOLD) * 180}deg)` }}
        />
      </div>
      {children}
    </div>
  );
}