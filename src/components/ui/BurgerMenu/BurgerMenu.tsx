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
  { href: '/carte',                   label: 'Carte',    icon: <MapPinIcon /> },
  { href: '/compte',                  label: 'Compte',   icon: <IconUser size={20} /> },
];

function MapPinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 6L9 3L15 6L21 3V18L15 21L9 18L3 21V6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M9 3V18" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M15 6V21" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}

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
          <p className={styles.drawerFooterText}>© 2026 Homely</p>
        </div>
      </nav>
    </>
  );
}
