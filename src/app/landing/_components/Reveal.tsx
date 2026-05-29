'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /* Décalage initial pré-scroll (sert à l'entrée du hero après le preloader). */
  entrance?: boolean;
};

/* Apparition douce à l'entrée dans le viewport (fade + translation),
   easing premium, respecte prefers-reduced-motion. */
export function Reveal({ children, className, delay = 0, y = 30, entrance = false }: RevealProps) {
  const reduce = useReducedMotion();

  const initial = reduce ? false : { opacity: 0, y };
  const transition = { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] as const };

  if (entrance) {
    return (
      <motion.div
        className={className}
        initial={initial}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
