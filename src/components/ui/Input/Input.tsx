'use client';

import { useState, forwardRef } from 'react';
import styles from './Input.module.css';
import { cn } from '@/lib/cn';

type InputState = 'default' | 'error' | 'success';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  inputType?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
  label?: string;
  hint?: string;
  state?: InputState;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      inputType = 'text',
      label,
      hint,
      state,
      iconLeft,
      iconRight,
      className,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = inputType === 'password';
    const resolvedType = isPassword && showPassword ? 'text' : inputType;

    return (
      <div className={cn(styles.wrapper, state && styles[state], className)}>
        {label && <label className={styles.label}>{label}</label>}

        <div className={styles.fieldWrapper}>
          {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}

          <input
            ref={ref}
            className={styles.input}
            type={resolvedType}
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              className={styles.iconRight}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                /* IconEyeOff – inline SVG keeps the component self-contained */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                </svg>
              ) : (
                /* IconEye */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}

          {!isPassword && iconRight && (
            <span className={styles.iconRight}>{iconRight}</span>
          )}
        </div>

        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
export type { InputProps, InputState };
