'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Button } from '@/components/ui/Button';

export default function CommunautePage() {
  const router = useRouter();

  return (
    <div className={styles.page}>

      <div className={styles.content}>
        <Image
          src="/logo.svg"
          alt="Homely"
          width={80}
          height={80}
          className={styles.logo}
          priority
        />

        <p className={styles.eyebrow}>Notre engagement communautaire</p>
        <h1 className={styles.title}>
          Homely est une communauté où chacun a sa place
        </h1>

        <p className={styles.lead}>
          Pour le garantir, nous vous demandons de vous engager :
        </p>

        <p className={styles.body}>
          Je m&apos;engage à traiter chaque membre de la communauté Homely avec respect — sans aucun jugement
          ni préjugé — quelle que soit sa race, sa religion, son origine, son ethnie, sa couleur de peau, son
          handicap, son sexe, son identité de genre, son orientation sexuelle ou son âge.
        </p>

        <Link href="#" className={styles.learnMore}>En savoir plus</Link>
      </div>

      <div className={styles.actions}>
        <Button
          variant="brand"
          className={styles.primaryButton}
          onClick={() => router.push('/inscription/notifications')}
        >
          Accepter et continuer
        </Button>
        <Button
          variant="secondary"
          className={styles.secondaryButton}
          onClick={() => router.push('/')}
        >
          Refuser
        </Button>
      </div>

    </div>
  );
}
