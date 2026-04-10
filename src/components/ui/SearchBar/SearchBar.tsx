import styles from './SearchBar.module.css';
import { cn } from '@/lib/cn';
import { IconSearch } from '@/components/icons';

interface SearchBarProps {
  title: string;
  subtitle: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SearchBar({
  title,
  subtitle,
  active = true,
  onClick,
  className,
}: SearchBarProps) {
  return (
    <button
      className={cn(styles.searchBar, active ? styles.active : styles.off, className)}
      onClick={onClick}
      disabled={!active}
      type="button"
    >
      <span className={styles.icon}>
        <IconSearch size={20} />
      </span>
      <span className={styles.textBlock}>
        <span className={styles.title}>{title}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </span>
    </button>
  );
}
