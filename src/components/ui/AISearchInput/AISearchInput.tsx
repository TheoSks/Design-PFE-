'use client';

import { useState, useEffect } from 'react';
import styles from './AISearchInput.module.css';
import { cn } from '@/lib/cn';
import { IconArrowRight } from '@/components/icons';

const PHRASES = [
  '3 pièces avec terrasse à Paris…',
  'Maison avec jardin proche école…',
  'Studio lumineux, petit budget…',
  'Vue mer, 2 chambres, Nice…',
  'Appartement calme Île-de-France…',
  'Proche RER, budget 300 000 €…',
  'Maison familiale avec garage…',
  'Loft industriel centre-ville…',
  'T2 meublé, Paris intra-muros…',
  'Villa avec piscine dans le sud…',
];

interface AISearchInputProps {
  onSubmit?: (value: string) => void;
  className?: string;
}

export function AISearchInput({ onSubmit, className }: AISearchInputProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (value || focused) return;

    const current = PHRASES[phraseIndex];

    if (!isDeleting && charIndex === current.length) {
      const tid = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(tid);
    }

    const delay = isDeleting ? 40 : 70;

    const tid = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      } else {
        if (charIndex > 0) {
          setDisplayText(current.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        } else {
          setIsDeleting(false);
          setPhraseIndex((i) => (i + 1) % PHRASES.length);
        }
      }
    }, delay);

    return () => clearTimeout(tid);
  }, [value, focused, charIndex, isDeleting, phraseIndex]);

  const handleSubmit = () => {
    if (value.trim() && onSubmit) onSubmit(value.trim());
  };

  const showAnimated = !value && !focused;

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.inputArea}>
        {showAnimated && (
          <div className={styles.animatedPlaceholder} aria-hidden>
            {displayText}
            <span className={styles.cursor} />
          </div>
        )}
        <textarea
          className={styles.textarea}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button
          className={styles.sendButton}
          type="button"
          onClick={handleSubmit}
          aria-label="Rechercher"
        >
          <IconArrowRight size={18} color="currentColor" />
        </button>
      </div>
    </div>
  );
}
