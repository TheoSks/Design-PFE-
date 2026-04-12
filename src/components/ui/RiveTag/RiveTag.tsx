'use client';

import { useEffect, useRef } from 'react';
import styles from './RiveTag.module.css';

export function RiveTag() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const riveModule = await import('@rive-app/canvas');
      const { Rive, Fit, Alignment, Layout } = riveModule;

      if (cancelled || !canvasRef.current) return;

      riveRef.current = new Rive({
        src: '/character-animation-sm-mobile.riv',
        canvas: canvasRef.current,
        stateMachines: 'Auto Generated State Machine',
        autoplay: true,
        layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
        onLoad: () => {
          riveRef.current?.resizeDrawingSurfaceToCanvas();
        },
      });
    }

    init();

    return () => {
      cancelled = true;
      riveRef.current?.cleanup();
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} width={240} height={80} className={styles.canvas} />
    </div>
  );
}
