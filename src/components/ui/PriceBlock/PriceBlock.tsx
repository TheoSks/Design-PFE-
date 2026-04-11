import React from 'react';
import styles from './PriceBlock.module.css';

interface PriceBlockProps {
  price: string;
  pricePerM2: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
}

export function PriceBlock({
  price,
  pricePerM2,
  ctaLabel = 'Contactez-nous',
  onCtaClick,
  className,
}: PriceBlockProps) {
  return (
    <div className={`${styles.block} ${className || ''}`}>
      <div className={styles.priceInfo}>
        <span className={styles.price}>{price}</span>
        <span className={styles.pricePerM2}>{pricePerM2}</span>
      </div>
      <button className={styles.cta} onClick={onCtaClick}>
        {ctaLabel}
      </button>
    </div>
  );
}
