'use client';

import { useState, useRef, useCallback, type PointerEvent as ReactPointerEvent } from 'react';
import Link from 'next/link';
import styles from './Card.module.css';
import { cn } from '@/lib/cn';
import { useDominantColor } from './useDominantColor';
import { useCardContext } from './CardContext';
import { LIFESTYLE, type LifestyleTag } from '@/lib/lifestyle';
import {
  IconHeart,
  IconLocation,
  IconChevronLeft,
  IconChevronRight,
  IconShare,
  IconDoor,
  IconRuler,
  IconBed,
  IconBath,
  IconBuilding,
} from '@/components/icons';

function defaultIconFor(label: string): React.ReactNode {
  const l = label.toLowerCase();
  if (/m²|m2|surface/.test(l)) return <IconRuler size={18} />;
  if (/chambre/.test(l)) return <IconBed size={18} />;
  if (/sdb|salle de bain|bain|douche/.test(l)) return <IconBath size={18} />;
  if (/pièce|piece/.test(l)) return <IconDoor size={18} />;
  if (/étage|etage|niveau/.test(l)) return <IconBuilding size={18} />;
  return null;
}

interface CardFeature {
  icon?: React.ReactNode;
  label: string;
}

interface CardProps {
  images: string[];
  imageAlt?: string;
  badge?: React.ReactNode;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onShare?: () => void;
  title: string;
  location: string;
  price: string;
  features?: CardFeature[];
  lifestyle?: LifestyleTag[];
  href?: string;
  className?: string;
}

// Direction-lock threshold (px) — the first movement that crosses this is locked in.
const DIRECTION_LOCK_PX = 6;
// Distance threshold (ratio of image size) above which we always snap to next/prev.
const SNAP_RATIO = 0.22;
// Velocity threshold (px / ms) — a quick flick always switches even if distance is small.
const FLICK_VELOCITY = 0.45;

export function Card({
  images,
  imageAlt = '',
  badge,
  isFavorite = false,
  onFavoriteToggle,
  onShare,
  title,
  location,
  price,
  features,
  lifestyle,
  href,
  className,
}: CardProps) {
  const primaryLifestyle = lifestyle && lifestyle.length > 0 ? lifestyle[0] : undefined;
  const { swipeDirection } = useCardContext();
  const [current, setCurrent] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const gradientColor = useDominantColor(images[current]);

  const pointerStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastPoint = useRef<{ x: number; y: number; time: number } | null>(null);
  const lockedAxis = useRef<'x' | 'y' | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const prev = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.();
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (images.length <= 1) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointerStart.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    lastPoint.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    lockedAxis.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;

    // Direction lock at first significant move
    if (!lockedAxis.current) {
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (absDx < DIRECTION_LOCK_PX && absDy < DIRECTION_LOCK_PX) return;
      lockedAxis.current = absDx > absDy ? 'x' : 'y';

      // If the locked axis isn't the one we care about, abort the gesture
      // and let the browser/parent handle native scrolling.
      const wanted = swipeDirection === 'horizontal' ? 'x' : 'y';
      if (lockedAxis.current !== wanted) {
        pointerStart.current = null;
        return;
      }
      setIsDragging(true);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
    }

    // Active drag: translate the image with the finger
    const delta = swipeDirection === 'horizontal' ? dx : dy;
    setDragOffset(delta);
    lastPoint.current = { x: e.clientX, y: e.clientY, time: performance.now() };

    // Prevent native scroll once we own the gesture
    if (e.cancelable) e.preventDefault();
  };

  const settle = () => {
    if (!pointerStart.current || !lastPoint.current || !lockedAxis.current) {
      pointerStart.current = null;
      lastPoint.current = null;
      lockedAxis.current = null;
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const size = swipeDirection === 'horizontal'
      ? wrapperRef.current?.clientWidth ?? 300
      : wrapperRef.current?.clientHeight ?? 300;
    const dt = lastPoint.current.time - pointerStart.current.time || 1;
    const delta = swipeDirection === 'horizontal'
      ? lastPoint.current.x - pointerStart.current.x
      : lastPoint.current.y - pointerStart.current.y;
    const velocity = delta / dt; // px / ms (signed)
    const ratio = Math.abs(delta) / size;

    let direction: 'next' | 'prev' | null = null;
    if (Math.abs(velocity) >= FLICK_VELOCITY) {
      // For horizontal: swipe left (negative delta) = next image
      // For vertical: swipe up (negative delta) = next image
      direction = velocity < 0 ? 'next' : 'prev';
    } else if (ratio >= SNAP_RATIO) {
      direction = delta < 0 ? 'next' : 'prev';
    }

    if (direction === 'next') next();
    else if (direction === 'prev') prev();

    pointerStart.current = null;
    lastPoint.current = null;
    lockedAxis.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    settle();
  };

  const onPointerCancel = (e: ReactPointerEvent<HTMLDivElement>) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    settle();
  };

  // Compute per-image transform during drag
  const imageStyle = (index: number): React.CSSProperties => {
    const offset = index - current;
    const size = swipeDirection === 'horizontal'
      ? wrapperRef.current?.clientWidth ?? 0
      : wrapperRef.current?.clientHeight ?? 0;
    if (!isDragging || size === 0) {
      return {};
    }
    const base = offset * size + dragOffset;
    const transform = swipeDirection === 'horizontal'
      ? `translateX(${base}px)`
      : `translateY(${base}px)`;
    return { transform, opacity: 1, transition: 'none' };
  };

  const card = (
    <article
      className={cn(styles.card, className)}
      aria-label={imageAlt}
      style={{ ['--card-gradient-color' as string]: gradientColor }}
    >
      <div
        ref={wrapperRef}
        className={cn(styles.imageWrapper, isDragging && styles.imageWrapperDragging)}
        aria-hidden="true"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        style={{
          touchAction: images.length > 1
            ? (swipeDirection === 'horizontal' ? 'pan-y' : 'pan-x')
            : 'auto',
        }}
      >
        {images.map((src, i) => {
          const offset = i - current;
          // Only render adjacent images during drag for perf; show only current otherwise.
          if (!isDragging && i !== current) {
            return (
              <img
                key={src}
                src={src}
                alt=""
                className={cn(styles.image, i === current && styles.imageActive)}
                draggable={false}
              />
            );
          }
          if (isDragging && Math.abs(offset) > 1) return null;
          return (
            <img
              key={src}
              src={src}
              alt=""
              className={cn(styles.image, styles.imageActive)}
              draggable={false}
              style={imageStyle(i)}
            />
          );
        })}
      </div>

      <div className={styles.gradient} aria-hidden="true" />

      {/* Top row: badge + stacked action buttons */}
      <div className={styles.topRow}>
        {badge ? <div>{badge}</div> : <div />}
        <div className={styles.actionButtons}>
          <button
            className={styles.actionButton}
            onClick={handleShare}
            type="button"
            aria-label="Copier le lien"
          >
            <IconShare size={20} />
          </button>
          <button
            className={styles.actionButton}
            onClick={handleFavorite}
            type="button"
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <IconHeart size={20} filled={isFavorite} />
          </button>
        </div>
      </div>

      {/* Nav arrows */}
      {images.length > 1 && (
        <>
          <button
            className={cn(styles.arrow, styles.arrowLeft)}
            onClick={(e) => prev(e)}
            type="button"
            aria-label="Image précédente"
          >
            <IconChevronLeft size={16} />
          </button>
          <button
            className={cn(styles.arrow, styles.arrowRight)}
            onClick={(e) => next(e)}
            type="button"
            aria-label="Image suivante"
          >
            <IconChevronRight size={16} />
          </button>
        </>
      )}

      {/* Details overlay (text directly on gradient, no white panel) */}
      <div className={styles.contentPanel}>
        <div className={styles.headerRow}>
          <div className={styles.contentLeft}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.locationRow}>
              <IconLocation size={16} />
              <span>{location}</span>
            </div>
          </div>
          <span className={styles.price}>{price}</span>
        </div>
        {features && features.length > 0 && (
          <div className={styles.features}>
            {features.map((f, i) => (
              <span key={i} className={styles.feature}>
                {f.icon ?? defaultIconFor(f.label)}
                {f.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Pagination dots — tappable */}
      {images.length > 1 && (
        <div className={styles.dots}>
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={cn(styles.dot, i === current && styles.dotActive)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrent(i);
              }}
              aria-label={`Image ${i + 1}`}
              aria-current={i === current}
            />
          ))}
        </div>
      )}
    </article>
  );

  if (href) {
    return (
      <Link href={href} className={styles.cardLink}>
        {card}
      </Link>
    );
  }

  return card;
}

export type { CardProps, CardFeature };
