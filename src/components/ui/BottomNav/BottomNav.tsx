'use client';

import styles from './BottomNav.module.css';
import { cn } from '@/lib/cn';

type NavStyle = 'classic' | 'pill';

interface NavItem {
  icon: React.ReactNode;
  label?: string;
  badge?: number;
  active?: boolean;
  onClick?: () => void;
}

interface BottomNavProps {
  items: NavItem[];
  navStyle?: NavStyle;
  className?: string;
}

export function BottomNav({
  items,
  navStyle = 'classic',
  className,
}: BottomNavProps) {
  return (
    <nav className={cn(styles.nav, styles[navStyle], className)}>
      {items.map((item, i) => (
        <button
          key={i}
          className={cn(styles.tab, item.active && styles.active)}
          onClick={item.onClick}
          type="button"
        >
          <span className={styles.iconWrapper}>
            {item.icon}
            {item.badge !== undefined && item.badge > 0 && (
              <span className={styles.badge}>{item.badge}</span>
            )}
          </span>
          {item.label && <span className={styles.label}>{item.label}</span>}
        </button>
      ))}
    </nav>
  );
}
