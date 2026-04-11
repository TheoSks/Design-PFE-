'use client';

import React, { useState } from 'react';
import { IconArrowRight } from '@/components/icons';
import styles from './SpecList.module.css';

interface SpecListProps {
  title: string;
  items: string[];
  maxVisible?: number;
  className?: string;
}

export function SpecList({ title, items, maxVisible = 6, className }: SpecListProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, maxVisible);

  return (
    <div className={`${styles.list} ${className || ''}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.items}>
        {visibleItems.map((item, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.label}>{item}</span>
          </div>
        ))}
      </div>
      {items.length > maxVisible && (
        <button className={styles.seeMore} onClick={() => setExpanded(!expanded)}>
          <span>{expanded ? 'Voir moins' : 'Voir plus'}</span>
          <IconArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
