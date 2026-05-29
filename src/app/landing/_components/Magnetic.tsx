'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/* Effet magnétique : le contenu est attiré vers le curseur,
   ressort fluide au relâchement. Désactivé si mouvement réduit. */
export function Magnetic({ children, className, strength = 0.35 }: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 200, damping: 15, mass: 0.2 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  function handleMove(e: React.MouseEvent<HTMLSpanElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy, display: 'inline-flex' }}
    >
      {children}
    </motion.span>
  );
}
