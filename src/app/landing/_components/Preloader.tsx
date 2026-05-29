'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import styles from './Preloader.module.css';

/* Durée d'affichage du preloader (synchronisée avec l'entrée du hero). */
export const PRELOADER_MS = 1900;

export function Preloader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => setDone(true), reduce ? 250 : PRELOADER_MS);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [reduce]);

  useEffect(() => {
    if (done) document.body.style.overflow = '';
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className={styles.root}
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: reduce ? 0 : 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <div className={styles.aura} aria-hidden />

          <motion.div
            className={styles.brand}
            initial={reduce ? false : { opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" className={styles.mark} />
            <span className={styles.word}>Homely</span>
          </motion.div>

          <div className={styles.barTrack} aria-hidden>
            <motion.div
              className={styles.barFill}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduce ? 0.2 : 1.5, ease: [0.45, 0, 0.1, 1] }}
            />
          </div>

          <motion.span
            className={styles.caption}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Recherche immobilière augmentée par l&apos;IA
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
