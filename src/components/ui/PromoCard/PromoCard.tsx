import React from 'react';
import styles from './PromoCard.module.css';
import { cn } from '@/lib/cn';

interface PromoCardProps {
  title: string;
  description: string;
  linkText: string;
  linkHref?: string;
  imageSrc: string;
  className?: string;
}

export function PromoCard({
  title,
  description,
  linkText,
  linkHref = '#',
  imageSrc,
  className,
}: PromoCardProps) {
  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
        <a href={linkHref} className={styles.link}>{linkText}</a>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageSrc} alt="" className={styles.image} />
    </div>
  );
}
