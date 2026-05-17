'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Card.module.css';
import { cn } from '@/lib/cn';
import { useDominantColor } from './useDominantColor';
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
  href?: string;
  className?: string;
}

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
  href,
  className,
}: CardProps) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const gradientColor = useDominantColor(images[current]);

  const prev = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };

  const next = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  };

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
    const minDistance = 30;

    if (dy > dx && dy > minDistance && images.length > 1) {
      e.stopPropagation();
      if (touchEnd.y < touchStart.y) {
        next(e);
      } else {
        prev(e);
      }
    }

    setTouchStart(null);
  };

  const card = (
    <article
      className={cn(styles.card, className)}
      aria-label={imageAlt}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ ['--card-gradient-color' as string]: gradientColor }}
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
