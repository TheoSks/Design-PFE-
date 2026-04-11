'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Card.module.css';
import { cn } from '@/lib/cn';
import {
  IconHeart,
  IconLocation,
  IconChevronLeft,
  IconChevronRight,
} from '@/components/icons';

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
  title: string;
  location: string;
  price: string;
  features?: CardFeature[];
  href?: string;
  className?: string;
}

export function Card({
  images,
  imageAlt = '',
  badge,
  isFavorite = false,
  onFavoriteToggle,
  title,
  location,
  price,
  features,
  href,
  className,
}: CardProps) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const prev = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };

  const next = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const dx = Math.abs(touchEnd.x - touchStart.x);
    const dy = Math.abs(touchEnd.y - touchStart.y);
    const minDistance = 30; // mininum pour considérer comme un geste

    // Si le mouvement vertical est plus important que horizontal → naviguer images
    if (dy > dx && dy > minDistance && images.length > 1) {
      e.stopPropagation();
      if (touchEnd.y < touchStart.y) {
        // Swipe vers le haut → image suivante
        next(e);
      } else {
        // Swipe vers le bas → image précédente
        prev(e);
      }
    }
    // Sinon, le carousel gérera le scroll horizontal naturellement

    setTouchStart(null);
  };

  const card = (
    <article
      className={cn(styles.card, className)}
      aria-label={imageAlt}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.imageWrapper} aria-hidden="true">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={cn(styles.image, i === current && styles.imageActive)}
            draggable={false}
          />
        ))}
      </div>
      {/* Top row: badge + favorite */}
      <div className={styles.topRow}>
        {badge && <div>{badge}</div>}
        <button
          className={styles.favoriteButton}
          onClick={onFavoriteToggle}
          type="button"
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <IconHeart size={20} filled={isFavorite} />
        </button>
      </div>

      {/* Nav arrows */}
      {images.length > 1 && (
        <>
          <button
            className={cn(styles.arrow, styles.arrowLeft)}
            onClick={prev}
            type="button"
            aria-label="Image précédente"
          >
            <IconChevronLeft size={16} />
          </button>
          <button
            className={cn(styles.arrow, styles.arrowRight)}
            onClick={next}
            type="button"
            aria-label="Image suivante"
          >
            <IconChevronRight size={16} />
          </button>
        </>
      )}

      {/* Details overlay panel */}
      <div className={styles.contentPanel}>
        <div className={styles.contentLeft}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.locationRow}>
            <IconLocation size={14} />
            <span>{location}</span>
          </div>
          {features && features.length > 0 && (
            <div className={styles.features}>
              {features.map((f, i) => (
                <span key={i} className={styles.feature}>
                  {f.icon}
                  {f.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className={styles.price}>{price}</span>
      </div>

      {/* Pagination dots */}
      {images.length > 1 && (
        <div className={styles.dots}>
          {images.map((_, i) => (
            <span
              key={i}
              className={cn(styles.dot, i === current && styles.dotActive)}
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
