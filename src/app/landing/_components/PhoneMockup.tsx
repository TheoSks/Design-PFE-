'use client';

import { useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import styles from './PhoneMockup.module.css';

/* Maquette iPhone réaliste affichant de vrais écrans de l'app Homely.
   - `screens` : un visuel par onglet (crossfade synchronisé).
   - `screen`  : un visuel unique (CTA, hero…). */
export function PhoneMockup({
  className,
  screens,
  screen,
  activeTab = 0,
  float = true,
}: {
  className?: string;
  screens?: string[];
  screen?: string;
  activeTab?: number;
  float?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  /* Tilt 3D suivant le curseur (ressort fluide). */
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 150, damping: 18, mass: 0.3 };
  const rotateY = useSpring(useTransform(px, [0, 1], [11, -11]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [-11, 11]), spring);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  const src = screens?.[activeTab] ?? screen ?? screens?.[0] ?? '';

  return (
    <div
      ref={ref}
      className={`${styles.wrap} ${className ?? ''}`}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      <motion.div
        className={styles.floater}
        animate={reduce || !float ? undefined : { y: [0, -12, 0] }}
        transition={reduce || !float ? undefined : { duration: 6, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div className={styles.phone} style={reduce ? undefined : { rotateX, rotateY }}>
          {/* Boutons latéraux */}
          <span className={styles.btnSilent} />
          <span className={styles.btnVolUp} />
          <span className={styles.btnVolDown} />
          <span className={styles.btnPower} />

          <div className={styles.bezel}>
            <div className={styles.screen}>
              <AnimatePresence initial={false}>
                <motion.img
                  key={src}
                  src={src}
                  alt="Aperçu de l'application Homely"
                  className={styles.shot}
                  initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              </AnimatePresence>

              {/* Dynamic Island + reflet, par-dessus l'écran */}
              <div className={styles.island}>
                <span className={styles.islandCam} />
              </div>
              <div className={styles.gloss} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
