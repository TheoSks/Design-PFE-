import React from 'react';
import styles from './DetailTable.module.css';

interface DetailRow {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

interface DetailTableProps {
  title: string;
  rows: DetailRow[];
  className?: string;
}

export function DetailTable({ title, rows, className }: DetailTableProps) {
  return (
    <div className={`${styles.table} ${className || ''}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.rows}>
        {rows.map((row, i) => (
          <div key={i} className={styles.row}>
            <div className={styles.rowLabel}>
              {row.icon && <span className={styles.rowIcon}>{row.icon}</span>}
              <span className={styles.labelText}>{row.label}</span>
            </div>
            <span className={styles.rowValue}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
