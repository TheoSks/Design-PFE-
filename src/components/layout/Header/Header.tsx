'use client';

import styles from './Header.module.css';
import { Logo } from '@/components/ui/Logo';
import { IconMenu } from '@/components/icons';

export function Header() {
  return (
    <header className={styles.header}>
      <Logo size="sm" />
      <div className={styles.actions}>
        <button className={styles.menuButton} type="button" aria-label="Menu">
          <IconMenu size={20} />
        </button>
      </div>
    </header>
  );
}
