import styles from './Badge.module.css';
import { cn } from '@/lib/cn';
import { IconSparkle, IconHeart, IconCheck, IconEye, IconSearch } from '@/components/icons';
import React from 'react';

type BadgeVariant = 'default' | 'ia' | 'small';
type BadgeColor = 'blue' | 'green' | 'orange' | 'amber' | 'purple';

const COLOR_ICONS: Record<BadgeColor, React.ReactNode> = {
  blue:   <IconHeart size={12} />,
  green:  <IconSparkle size={12} />,
  orange: <IconCheck size={12} />,
  amber:  <IconEye size={12} />,
  purple: <IconSearch size={12} />,
};

interface BadgeProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', color, children, className }: BadgeProps) {
  const colorClass = color ? styles[color] : undefined;
  const icon = variant === 'ia' ? (color ? COLOR_ICONS[color] : <IconSparkle size={12} />) : null;

  const badge = (
    <span className={cn(styles.badge, styles[variant], colorClass, className)}>
      {icon}
      {children}
    </span>
  );

  if (variant === 'ia') {
    return <div className={cn(styles.iaWrapper, color ? styles[`${color}Wrapper`] : undefined)}>{badge}</div>;
  }

  return badge;
}
