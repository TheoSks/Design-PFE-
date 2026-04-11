'use client';

import Link from 'next/link';
import styles from './Header.module.css';
import { Logo } from '@/components/ui/Logo';
import { IconMenu } from '@/components/icons';

export function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" aria-label="Accueil">
        <Logo size="sm" />
      </Link>
      <div className={styles.actions}>
        <button className={styles.menuButton} type="button" aria-label="Menu">
          <IconMenu size={20} />
        </button>
      </div>
    </header>
  );
}
