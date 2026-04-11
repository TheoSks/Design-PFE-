import React from 'react';
import styles from './FeatureList.module.css';

interface FeatureItem {
  icon: React.ReactNode;
  label: string;
}

interface FeatureListProps {
  title: string;
  items: FeatureItem[];
  className?: string;
}

export function FeatureList({ title, items, className }: FeatureListProps) {
  return (
    <div className={`${styles.list} ${className || ''}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.items}>
        {items.map((item, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.iconCircle}>{item.icon}</div>
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
