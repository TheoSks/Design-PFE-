'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PropertyMap, type DrawnZone } from '@/components/ui/Map';
import { cn } from '@/lib/cn';
import { IconLocation, IconBuilding, IconChevronLeft } from '@/components/icons';
import { PROPERTIES } from '@/lib/properties';
import { RENTALS } from '@/lib/rentals';
import styles from './page.module.css';

type Segment = 'all' | 'achat' | 'location';

function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function CartePage() {
  const router = useRouter();
  const [segment, setSegment] = useState<Segment>('all');
  const [drawMode, setDrawMode] = useState(false);
  const [zone, setZone] = useState<DrawnZone | null>(null);

  const sourceList = useMemo(() => {
    if (segment === 'achat') return PROPERTIES;
    if (segment === 'location') return RENTALS;
    return [...PROPERTIES, ...RENTALS];
  }, [segment]);

  const properties = useMemo(() => {
    if (!zone) return sourceList;
    return sourceList.filter((p) => {
      if (!p.coordinates) return false;
      const d = haversineKm(zone.center, [p.coordinates.lng, p.coordinates.lat]);
      return d <= zone.radiusKm;
    });
  }, [sourceList, zone]);

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
      </div>

      <div className={styles.mapStage}>
        <div className={styles.countPill} aria-live="polite">
          {properties.length} bien{properties.length > 1 ? 's' : ''} disponible{properties.length > 1 ? 's' : ''}
          {zone && ` · zone ${zone.radiusKm.toFixed(1)} km`}
        </div>
        <PropertyMap
          properties={properties}
          className={styles.mapFill}
          drawMode={drawMode}
          zone={zone}
          onZoneChange={(z) => {
            setZone(z);
            setDrawMode(false);
          }}
        />

        {/* Zone drawing controls */}
        <div className={styles.zoneControls}>
          {!zone && !drawMode && (
            <button className={styles.zoneButton} type="button" onClick={() => setDrawMode(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
              Tracer une zone
            </button>
          )}
          {drawMode && (
            <div className={styles.zoneDrawing}>
              <span className={styles.zoneHint}>Touchez le centre, puis un point pour le rayon</span>
              <button className={styles.zoneButtonCancel} type="button" onClick={() => setDrawMode(false)}>Annuler</button>
            </div>
          )}
          {zone && !drawMode && (
            <div className={styles.zoneActive}>
              <button className={styles.zoneButtonGhost} type="button" onClick={() => { setZone(null); setDrawMode(true); }}>
                Modifier
              </button>
              <button className={styles.zoneButtonClear} type="button" onClick={() => setZone(null)}>
                Effacer la zone
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
