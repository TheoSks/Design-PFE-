'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PropertyMap } from '@/components/ui/Map';
import { cn } from '@/lib/cn';
import { IconLocation, IconBuilding, IconChevronLeft } from '@/components/icons';
import { PROPERTIES } from '@/lib/properties';
import { RENTALS } from '@/lib/rentals';
import styles from './page.module.css';

type Segment = 'all' | 'achat' | 'location';

export default function CartePage() {
  const router = useRouter();
  const [segment, setSegment] = useState<Segment>('all');

  const properties = useMemo(() => {
    if (segment === 'achat') return PROPERTIES;
    if (segment === 'location') return RENTALS;
    return [...PROPERTIES, ...RENTALS];
  }, [segment]);

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.toolbar}>
        <button
          className={styles.backButton}
          onClick={() => router.back()}
          type="button"
          aria-label="Retour"
        >
          <IconChevronLeft size={18} />
          Retour
        </button>

        <div className={styles.segmentControl} role="tablist" aria-label="Type de bien">
          <button
            role="tab"
            aria-selected={segment === 'all'}
            className={cn(styles.segment, segment === 'all' && styles.segmentActive)}
            onClick={() => setSegment('all')}
            type="button"
          >
            Tout
          </button>
          <button
            role="tab"
            aria-selected={segment === 'achat'}
            className={cn(styles.segment, segment === 'achat' && styles.segmentActive)}
            onClick={() => setSegment('achat')}
            type="button"
          >
            <IconBuilding size={14} />
            Achat
          </button>
          <button
            role="tab"
            aria-selected={segment === 'location'}
            className={cn(styles.segment, segment === 'location' && styles.segmentActive)}
            onClick={() => setSegment('location')}
            type="button"
          >
            <IconLocation size={14} />
            Location
          </button>
        </div>

        <span className={styles.count}>{properties.length} bien{properties.length > 1 ? 's' : ''}</span>
      </div>

      <div className={styles.mapStage}>
        <PropertyMap properties={properties} className={styles.mapFill} />
      </div>
    </div>
  );
}
