'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Button } from '@/components/ui/Button';
import { IconBell } from '@/components/icons';
import { useUser } from '@/lib/UserContext';

export default function NotificationsPage() {
  const router = useRouter();
  const { updateUser } = useUser();
  const [marketing, setMarketing] = useState(false);

  function handleAccept() {
    updateUser({ notifPush: true, newsletter: marketing });
    router.push('/compte/profil');
  }

  function handleSkip() {
    updateUser({ notifPush: false, newsletter: false });
    router.push('/compte/profil');
  }

  return (
    <div className={styles.page}>

      <div className={styles.content}>
        <div className={styles.iconWrap}>
          <IconBell size={28} />
        </div>

        <h1 className={styles.title}>Activer les notifications ?</h1>

        <p className={styles.lead}>
          Ne ratez aucune actualité importante : visites, nouvelles annonces et activité de votre compte.
        </p>

        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>
            Recevoir aussi les bons plans, recommandations personnalisées et inspirations
          </span>
          <button
            role="switch"
            aria-checked={marketing}
            type="button"
            className={marketing ? styles.toggleOn : styles.toggle}
            onClick={() => setMarketing((v) => !v)}
          >
            <span className={styles.toggleKnob} />
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          variant="brand"
          className={styles.primaryButton}
          onClick={handleAccept}
        >
          Oui, m&apos;avertir
        </Button>
        <Button
          variant="secondary"
          className={styles.secondaryButton}
          onClick={handleSkip}
        >
          Plus tard
        </Button>
      </div>

    </div>
  );
}
