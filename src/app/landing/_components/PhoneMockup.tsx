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
import {
  IconSparkle,
  IconHome,
  IconSearch,
  IconBell,
  IconChat,
} from '@/components/icons';

/* Requêtes affichées dans l'écran selon l'onglet actif (section Tabs). */
const SCREENS = [
  'Un 3 pièces lumineux près du centre',
  '60-80 m² · ≤ 260 000 € · Balcon',
  'Estimation : au juste prix du quartier',
  'Écoles & transports à proximité',
];

export function PhoneMockup({
  className,
  activeTab = 0,
  float = true,
}: {
  className?: string;
  activeTab?: number;
  float?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  /* Tilt 3D suivant le curseur (ressort fluide). */
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 150, damping: 18, mass: 0.3 };
  const rotateY = useSpring(useTransform(px, [0, 1], [12, -12]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [-12, 12]), spring);

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

  const query = SCREENS[activeTab] ?? SCREENS[0];

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
        <motion.div
          className={styles.phone}
          style={reduce ? undefined : { rotateX, rotateY }}
        >
          {/* Châssis : boutons latéraux */}
          <span className={styles.btnSilent} />
          <span className={styles.btnVolUp} />
          <span className={styles.btnVolDown} />
          <span className={styles.btnPower} />

          <div className={styles.bezel}>
            <div className={styles.screen}>
              {/* Dynamic Island */}
              <div className={styles.island}>
                <span className={styles.islandCam} />
              </div>
              <div className={styles.gloss} />

              {/* Barre d'état */}
              <div className={styles.statusbar}>
                <span className={styles.time}>9:41</span>
                <span className={styles.statusIcons}>
                  <span className={styles.bars} />
                  <span className={styles.battery} />
                </span>
              </div>

              {/* En-tête app */}
              <div className={styles.appHeader}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="" className={styles.appLogo} />
                <strong>Homely</strong>
                <span className={styles.appBell}><IconBell size={13} /></span>
              </div>

              {/* Requête IA (change selon l'onglet) */}
              <div className={styles.query}>
                <span className={styles.queryIcon}><IconSparkle size={12} /></span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeTab}
                    className={styles.queryText}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {query}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Carte annonce */}
              <div className={styles.card}>
                <div className={styles.cardImg}>
                  <span className={styles.badge}>
                    <IconSparkle size={9} /> Coup de cœur
                  </span>
                  <motion.span
                    className={styles.match}
                    initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 18 }}
                  >
                    98% match
                  </motion.span>
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardTitle}>Belle luminosité</span>
                  <div className={styles.meta}>
                    <span>3 pièces · 68 m²</span>
                    <strong>249 000 €</strong>
                  </div>
                </div>
              </div>

              {/* Barre de navigation */}
              <div className={styles.tabbar}>
                <span className={`${styles.navItem} ${styles.navActive}`}><IconHome size={16} /></span>
                <span className={styles.navItem}><IconSearch size={16} /></span>
                <span className={styles.navItem}><IconChat size={16} /></span>
                <span className={styles.navItem}><IconBell size={16} /></span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
