import styles from './Tag.module.css';
import { cn } from '@/lib/cn';

type TagSize = 'sm' | 'md' | 'lg';
type TagColor = 'default' | 'focus' | 'danger' | 'warning' | 'success' | 'ghost';

interface TagProps {
  size?: TagSize;
  color?: TagColor;
  children: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
}

export function Tag({
  size = 'md',
  color = 'default',
  children,
  iconLeft,
  iconRight,
  className,
}: TagProps) {
  return (
    <span className={cn(styles.tag, styles[size], styles[color], className)}>
      {iconLeft}
      {children}
      {iconRight}
    </span>
  );
}
