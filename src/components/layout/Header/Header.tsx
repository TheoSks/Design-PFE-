'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { Logo } from '@/components/ui/Logo';
import { IconMenu } from '@/components/icons';
import { BurgerMenu } from '@/components/ui/BurgerMenu';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <Link href="/" aria-label="Accueil">
          <Logo size="sm" />
        </Link>
        <div className={styles.actions}>
          <button
            className={styles.menuButton}
            type="button"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <IconMenu size={20} />
          </button>
        </div>
      </header>

      <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
