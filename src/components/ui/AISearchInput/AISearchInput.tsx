'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import styles from './AISearchInput.module.css';
import { cn } from '@/lib/cn';
import { IconArrowRight, IconSparkle } from '@/components/icons';

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

const EXAMPLES = [
  'Appartement Paris 19 3 chambres avec balcon et parquet',
  'Villa avec vue mer sur la Côte d\'Azur, max 800 000 €',
  'Appartement avec terrasse à Lyon Croix-Rousse',
  'Maison familiale vers Orléans, proche gare, jardin',
  'Maison à moins de 30 minutes de Paris, budget 400 000 €',
  'Studio à rénover, max 250 000 €',
];

const STORAGE_KEY = 'ai_recent_searches';

function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  const prev = getRecent().filter((q) => q !== query);
  const next = [query, ...prev].slice(0, 5);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

interface AISearchInputProps {
  onSubmit?: (value: string) => void;
  className?: string;
}

export function AISearchInput({ onSubmit, className }: AISearchInputProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [value, setValue] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setModalOpen(false);
    }, 360);
  };

  // Typewriter animation on trigger
  useEffect(() => {
    if (modalOpen) return;
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
  }, [modalOpen, charIndex, isDeleting, phraseIndex]);

  // Lock scroll & focus textarea when modal opens
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
      setRecent(getRecent());
      setTimeout(() => textareaRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  const handleSubmit = (query = value) => {
    const q = query.trim();
    if (!q) return;
    saveRecent(q);
    closeModal();
    setValue('');
    if (onSubmit) onSubmit(q);
    router.push(`/chat?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* ── Trigger pill ─────────────────────────────────── */}
      <div
        className={cn(styles.wrapper, className)}
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Ouvrir la recherche IA"
        onKeyDown={(e) => e.key === 'Enter' && setModalOpen(true)}
      >
        <div className={styles.inputArea}>
          <div className={styles.animatedPlaceholder} aria-hidden>
            {displayText}
            <span className={styles.cursor} />
          </div>
          {/* Fake textarea for visual only */}
          <div className={styles.textareaDummy} />
          <div className={styles.sendButton} aria-hidden>
            <IconArrowRight size={18} color="currentColor" />
          </div>
        </div>
      </div>

      {/* ── Modal overlay — rendered via portal to escape transform stacking context ── */}
      {modalOpen && typeof document !== 'undefined' && createPortal(
        <>
          <div
            className={`${styles.backdrop} ${closing ? styles.backdropOut : ''}`}
            onClick={closeModal}
            aria-hidden
          />
          <div
            className={`${styles.modal} ${closing ? styles.modalOut : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Recherche IA"
          >
            {/* Handle */}
            <div className={styles.modalHandle} aria-hidden />

            {/* Header row */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Écrivez ce que vous voulez</h2>
              <button
                className={styles.modalClose}
                type="button"
                aria-label="Fermer"
                onClick={() => closeModal()}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Textarea */}
              <div className={styles.modalInputArea}>
                <textarea
                  ref={textareaRef}
                  className={styles.modalTextarea}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Ex : Appartement 3 pièces avec balcon à Paris..."
                  rows={4}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <button
                  className={styles.modalSendButton}
                  type="button"
                  onClick={() => handleSubmit()}
                  aria-label="Rechercher"
                  disabled={!value.trim()}
                >
                  <IconArrowRight size={18} color="currentColor" />
                </button>
              </div>

              {/* Recent searches */}
              {recent.length > 0 && (
                <div className={styles.section}>
                  <p className={styles.sectionTitle}>Mes recherches</p>
                  {recent.map((q, i) => (
                    <button
                      key={i}
                      className={styles.searchItem}
                      type="button"
                      onClick={() => handleSubmit(q)}
                    >
                      <span className={styles.searchItemIcon}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </span>
                      <span className={styles.searchItemText}>{q}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Examples — chip grid */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Quelques exemples</p>
                <div className={styles.examplesGrid}>
                  {EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      className={styles.exampleChip}
                      type="button"
                      onClick={() => handleSubmit(ex)}
                    >
                      <span className={styles.chipIcon}>
                        <IconSparkle size={13} />
                      </span>
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
