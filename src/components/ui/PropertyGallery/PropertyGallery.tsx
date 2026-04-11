'use client';

import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconHeart, IconShare } from '@/components/icons';
import { cn } from '@/lib/cn';
import styles from './PropertyGallery.module.css';

interface PropertyGalleryProps {
  images: string[];
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  className?: string;
}

export function PropertyGallery({
  images,
  isFavorite = false,
  onFavoriteToggle,
  className,
}: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = () => {
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className={cn(styles.gallery, className)}>
      <div className={styles.imageContainer}>
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt={`Photo ${i + 1}`}
            className={cn(styles.image, i === currentIndex && styles.imageActive)}
          />
        ))}
        <div className={styles.gradient} />
      </div>

      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => window.history.back()}>
          <IconChevronLeft size={20} color="var(--text-inverse)" />
        </button>
        <div className={styles.topActions}>
          <button className={styles.actionButton}>
            <IconShare size={20} color="var(--text-inverse)" />
          </button>
          <button className={styles.actionButton} onClick={onFavoriteToggle}>
            <IconHeart size={20} color="var(--text-inverse)" filled={isFavorite} />
          </button>
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button className={cn(styles.arrow, styles.arrowLeft)} onClick={prev}>
            <IconChevronLeft size={16} />
          </button>
          <button className={cn(styles.arrow, styles.arrowRight)} onClick={next}>
            <IconChevronRight size={16} />
          </button>
          <div className={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
