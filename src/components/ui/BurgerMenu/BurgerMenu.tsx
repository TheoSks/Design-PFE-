'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './BurgerMenu.module.css';
import { cn } from '@/lib/cn';
import { IconHome, IconLocation, IconBuilding, IconUser } from '@/components/icons';

interface BurgerMenuProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { href: '/',                       label: 'Accueil',  icon: <IconHome size={20} /> },
  { href: '/recherche?mode=location', label: 'Location', icon: <IconLocation size={20} /> },
  { href: '/recherche?mode=achat',    label: 'Achat',    icon: <IconBuilding size={20} /> },
  { href: '/compte',                  label: 'Compte',   icon: <IconUser size={20} /> },
];

export function BurgerMenu({ open, onClose }: BurgerMenuProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(styles.backdrop, open && styles.backdropVisible)}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        className={cn(styles.drawer, open && styles.drawerOpen)}
        aria-label="Navigation"
        aria-hidden={!open}
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Menu</span>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fermer le menu"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navItem}
              onClick={onClose}
            >
              <span className={styles.navItemIcon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.drawerFooter}>
          <p className={styles.drawerFooterText}>© 2026 Immo.ai</p>
        </div>
      </nav>
    </>
  );
}
