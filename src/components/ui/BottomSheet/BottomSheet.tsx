'use client';

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import styles from './BottomSheet.module.css';

export interface BottomSheetHandle {
  snapTo: (index: number) => void;
  getSnapIndex: () => number;
}

interface BottomSheetProps {
  /** Snap points in viewport-relative units. Lower = closer to bottom. e.g. [0.12, 0.5, 0.9] */
  snapPoints?: number[];
  defaultSnap?: number;
  children: ReactNode;
  /** Height offset (px) from the top to constrain the sheet (e.g. header height). */
  topOffset?: number;
  onSnapChange?: (index: number) => void;
  className?: string;
  /** Optional title shown in the peek header next to the grab handle */
  peekLabel?: ReactNode;
}

export const BottomSheet = forwardRef<BottomSheetHandle, BottomSheetProps>(function BottomSheet(
  {
    snapPoints = [0.14, 0.5, 0.92],
    defaultSnap = 0,
    children,
    topOffset = 0,
    onSnapChange,
    className,
    peekLabel,
  },
  ref,
) {
  const [snapIndex, setSnapIndex] = useState(defaultSnap);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pointerStartY = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const startedFromScroll = useRef(false);

  useImperativeHandle(ref, () => ({
    snapTo: (index: number) => {
      const clamped = Math.max(0, Math.min(snapPoints.length - 1, index));
      setSnapIndex(clamped);
      onSnapChange?.(clamped);
    },
    getSnapIndex: () => snapIndex,
  }));

  const getViewportHeight = useCallback(() => {
    return typeof window !== 'undefined' ? window.innerHeight - topOffset : 800;
  }, [topOffset]);

  // Compute sheet height in px for a given snap index
  const heightForSnap = useCallback(
    (index: number) => snapPoints[index] * getViewportHeight(),
    [snapPoints, getViewportHeight],
  );

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>, fromHandle: boolean) => {
      // If user starts on the scrollable content and it's scrolled, let it scroll
      if (!fromHandle && scrollRef.current && scrollRef.current.scrollTop > 0) {
        startedFromScroll.current = true;
        return;
      }
      startedFromScroll.current = false;
      pointerStartY.current = e.clientY;
      lastY.current = e.clientY;
      lastTime.current = performance.now();
      velocity.current = 0;
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const now = performance.now();
      const dy = e.clientY - lastY.current;
      const dt = now - lastTime.current || 1;
      velocity.current = dy / dt; // px / ms
      lastY.current = e.clientY;
      lastTime.current = now;

      const delta = e.clientY - pointerStartY.current;
      setDragOffset(delta);
    },
    [isDragging],
  );

  const settleSnap = useCallback(() => {
    const currentHeight = heightForSnap(snapIndex) - dragOffset;
    const ratio = currentHeight / getViewportHeight();

    // Velocity-based snapping: a fast flick overrides the closest-snap heuristic
    let target = snapIndex;
    if (velocity.current < -0.6) {
      target = Math.min(snapPoints.length - 1, snapIndex + 1);
    } else if (velocity.current > 0.6) {
      target = Math.max(0, snapIndex - 1);
    } else {
      // Closest snap
      let bestDist = Infinity;
      snapPoints.forEach((sp, i) => {
        const dist = Math.abs(sp - ratio);
        if (dist < bestDist) {
          bestDist = dist;
          target = i;
        }
      });
    }

    setSnapIndex(target);
    setDragOffset(0);
    if (target !== snapIndex) onSnapChange?.(target);
  }, [snapIndex, dragOffset, heightForSnap, getViewportHeight, snapPoints, onSnapChange]);

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging) {
        startedFromScroll.current = false;
        return;
      }
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      settleSnap();
    },
    [isDragging, settleSnap],
  );

  // Sync external snap changes via window resize
  useEffect(() => {
    const onResize = () => setDragOffset(0);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const baseHeight = heightForSnap(snapIndex);
  const visibleHeight = Math.max(60, baseHeight - dragOffset);

  return (
    <div
      ref={sheetRef}
      className={`${styles.sheet} ${className ?? ''}`}
      style={{
        height: `${visibleHeight}px`,
        transition: isDragging
          ? 'none'
          : 'height 380ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}
      data-snap={snapIndex}
    >
      <div
        className={styles.handleArea}
        onPointerDown={(e) => handlePointerDown(e, true)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className={styles.grabHandle} aria-hidden="true" />
        {peekLabel && <div className={styles.peekLabel}>{peekLabel}</div>}
      </div>
      <div
        ref={scrollRef}
        className={styles.content}
        onPointerDown={(e) => handlePointerDown(e, false)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ overflowY: snapIndex === snapPoints.length - 1 ? 'auto' : 'hidden' }}
      >
        {children}
      </div>
    </div>
  );
});
