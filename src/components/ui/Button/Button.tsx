import styles from './Button.module.css';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  iconOnly?: boolean;
  children?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  iconLeft,
  iconRight,
  iconOnly,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        styles.button,
        styles[variant],
        iconOnly && styles.iconOnly,
        className,
      )}
      {...props}
    >
      {iconLeft}
      {!iconOnly && children}
      {iconRight}
    </button>
  );
}
