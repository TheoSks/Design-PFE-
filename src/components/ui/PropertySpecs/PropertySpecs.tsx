import React from 'react';
import styles from './PropertySpecs.module.css';

interface SpecItem {
  icon: React.ReactNode;
  label: string;
}

interface PropertySpecsProps {
  specs: SpecItem[];
  className?: string;
}

export function PropertySpecs({ specs, className }: PropertySpecsProps) {
  return (
    <div className={`${styles.grid} ${className || ''}`}>
      {specs.map((spec, i) => (
        <div key={i} className={styles.item}>
          <span className={styles.icon}>{spec.icon}</span>
          <span className={styles.label}>{spec.label}</span>
        </div>
      ))}
    </div>
  );
}
