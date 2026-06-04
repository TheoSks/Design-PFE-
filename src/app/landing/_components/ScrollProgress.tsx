'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import styles from './ScrollProgress.module.css';

/* Fine barre de progression de lecture, fixée en haut de page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return <motion.div className={styles.bar} style={{ scaleX }} aria-hidden />;
}
