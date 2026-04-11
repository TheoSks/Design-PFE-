import React from 'react';
import styles from './EnergyRating.module.css';

type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

interface EnergyRatingProps {
  title: string;
  dpeGrade: Grade;
  dpeValue: number;
  dpeUnit?: string;
  gesGrade: Grade;
  gesValue: number;
  gesUnit?: string;
  className?: string;
}

const DPE_COLORS: Record<Grade, string> = {
  A: '#4f9a83',
  B: '#8bceb9',
  C: '#baefdf',
  D: '#ffdd98',
  E: '#f1bb4e',
  F: '#ff6900',
  G: '#f54900',
};

const GES_COLORS: Record<Grade, string> = {
  A: '#f7e8fe',
  B: '#f2d7ff',
  C: '#e0bbf1',
  D: '#d09fe7',
  E: '#b780d0',
  F: '#9f6bb7',
  G: '#63217c',
};

const GRADES: Grade[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export function EnergyRating({
  title,
  dpeGrade,
  dpeValue,
  dpeUnit = 'kWh/m².an',
  gesGrade,
  gesValue,
  gesUnit = 'kWh/m².an',
  className,
}: EnergyRatingProps) {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.section}>
        <p className={styles.subtitle}>Diagnostic de performance énergétique</p>
        <div className={styles.scaleRow}>
          <div className={styles.grades}>
            {GRADES.map((g) => (
              <div
                key={g}
                className={`${styles.grade} ${g === dpeGrade ? styles.gradeActive : ''}`}
                style={{ backgroundColor: DPE_COLORS[g] }}
              >
                {g}
              </div>
            ))}
          </div>
          <div className={styles.valueBlock}>
            <span className={styles.value}>{dpeValue}</span>
            <span className={styles.unit}>{dpeUnit}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.subtitle}>Émissions de gaz à effet de serre</p>
        <div className={styles.scaleRow}>
          <div className={styles.grades}>
            {GRADES.map((g) => (
              <div
                key={g}
                className={`${styles.grade} ${g === gesGrade ? styles.gradeActive : ''}`}
                style={{ backgroundColor: GES_COLORS[g] }}
              >
                {g}
              </div>
            ))}
          </div>
          <div className={styles.valueBlock}>
            <span className={styles.value}>{gesValue}</span>
            <span className={styles.unit}>{gesUnit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
