import styles from './Badge.module.css';
import { cn } from '@/lib/cn';
import { IconSparkle } from '@/components/icons';

type BadgeVariant = 'default' | 'ia' | 'small';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[variant], className)}>
      {variant === 'ia' && <IconSparkle size={12} />}
      {children}
      {variant === 'ia' && <IconSparkle size={12} />}
    </span>
  );
}
