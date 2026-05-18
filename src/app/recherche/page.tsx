'use client';

import { useState, useMemo, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { cn } from '@/lib/cn';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PropertyMap } from '@/components/ui/Map';
import { BottomSheet, type BottomSheetHandle } from '@/components/ui/BottomSheet';
import { IconBuilding, IconLocation, IconChevronDown, IconMenu, IconHome } from '@/components/icons';
import { PROPERTIES, type PropertyData } from '@/lib/properties';
import { RENTALS } from '@/lib/rentals';

// ── Filter options per mode ─────────────────────────────────
const FILTERS = {
  location: {
    type:   ['Appartement', 'Maison', 'Studio', 'Loft'],
    rooms:  ['1 pièce', '2 pièces', '3 pièces', '4+ pièces'],
    budget: ['< 800 €', '800–1 200 €', '1 200–1 600 €', '> 1 600 €'],
    city:   ['Paris', 'Lyon', 'Bordeaux', 'Nantes', 'Nice', 'Lille'],
  },
  achat: {
    type:   ['Appartement', 'Maison', 'Villa'],
    rooms:  ['1–2 pièces', '3–4 pièces', '5+ pièces'],
    budget: ['< 200 000 €', '200–400 000 €', '400–700 000 €', '> 700 000 €'],
    city:   ['Paris', 'Versailles', 'Nice'],
  },
};

const FILTER_LABELS: Record<string, string> = {
  type: 'Type',
  rooms: 'Pièces',
  budget: 'Budget',
  city: 'Ville',
};

type FilterKey = 'type' | 'rooms' | 'budget' | 'city';

// ── Helpers ─────────────────────────────────────────────────
function parsePrice(str: string): number {
  return parseInt(str.replace(/[^\d]/g, ''), 10) || 0;
}

function getRooms(p: PropertyData): number {
  const spec = p.specs.find((s) => s.label.includes('pièce'));
  if (!spec) return 0;
  const m = spec.label.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function matchType(title: string, type: string): boolean {
  const lower = title.toLowerCase();
  const t = type.toLowerCase();
  if (t === 'appartement') return lower.includes('appartement') || !!lower.match(/t\d/);
  return lower.includes(t);
}

// ── Inner component ─────────────────────────────────────────
function RechercheInner() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'achat' ? 'achat' : 'location';

  const [mode, setMode] = useState<'location' | 'achat'>(initialMode as 'location' | 'achat');
  const [view, setView] = useState<'list' | 'map'>('list');
  const [selected, setSelected] = useState<Record<FilterKey, Set<string>>>({
    type: new Set(), rooms: new Set(), budget: new Set(), city: new Set(),
  });
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [sheetSnap, setSheetSnap] = useState(0);
  const sheetRef = useRef<BottomSheetHandle | null>(null);

  function switchMode(m: 'location' | 'achat') {
    setMode(m);
    setSelected({ type: new Set(), rooms: new Set(), budget: new Set(), city: new Set() });
    setOpenFilter(null);
  }

  const toggle = useCallback((key: FilterKey, value: string) => {
    setSelected((prev) => {
      const next = new Set(prev[key]);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, [key]: next };
    });
  }, []);

  const clearFilter = useCallback((key: FilterKey) => {
    setSelected((prev) => ({ ...prev, [key]: new Set() }));
  }, []);

  const clearAll = useCallback(() => {
    setSelected({ type: new Set(), rooms: new Set(), budget: new Set(), city: new Set() });
  }, []);

  const totalActive = selected.type.size + selected.rooms.size + selected.budget.size + selected.city.size;

  const config = FILTERS[mode];
  const source = mode === 'location' ? RENTALS : PROPERTIES;

  const filtered = useMemo(() => {
    return source.filter((p) => {
      // Type
      if (selected.type.size > 0) {
        const matches = [...selected.type].some((t) => matchType(p.title, t));
        if (!matches) return false;
      }

      // Rooms
      if (selected.rooms.size > 0) {
        const r = getRooms(p);
        const matchesRoom = [...selected.rooms].some((label) => {
          if (label === '1 pièce') return r === 1;
          if (label === '2 pièces') return r === 2;
          if (label === '3 pièces') return r === 3;
          if (label === '4+ pièces') return r >= 4;
          if (label === '1–2 pièces') return r >= 1 && r <= 2;
          if (label === '3–4 pièces') return r >= 3 && r <= 4;
          if (label === '5+ pièces') return r >= 5;
          return false;
        });
        if (!matchesRoom) return false;
      }

      // Budget
      if (selected.budget.size > 0) {
        const price = parsePrice(p.price);
        const matchesBudget = [...selected.budget].some((label) => {
          if (mode === 'location') {
            if (label === '< 800 €') return price < 800;
            if (label === '800–1 200 €') return price >= 800 && price <= 1200;
            if (label === '1 200–1 600 €') return price >= 1200 && price <= 1600;
            if (label === '> 1 600 €') return price > 1600;
          } else {
            if (label === '< 200 000 €') return price < 200000;
            if (label === '200–400 000 €') return price >= 200000 && price <= 400000;
            if (label === '400–700 000 €') return price >= 400000 && price <= 700000;
            if (label === '> 700 000 €') return price > 700000;
          }
          return false;
        });
        if (!matchesBudget) return false;
      }

      // City
      if (selected.city.size > 0) {
        const loc = (p.cardLocation + ' ' + p.location).toLowerCase();
        const matchesCity = [...selected.city].some((c) => loc.includes(c.toLowerCase()));
        if (!matchesCity) return false;
      }

      return true;
    });
  }, [source, selected, mode]);

  // Active tags for the summary bar
  const activeTags: { key: FilterKey; value: string }[] = [];
  for (const key of ['type', 'rooms', 'budget', 'city'] as FilterKey[]) {
    for (const v of selected[key]) {
      activeTags.push({ key, value: v });
    }
  }

  return (
    <div className={styles.page}>
      <Header />

      {/* Mode toggle */}
      <div className={styles.modeToggle}>
        <div
          className={styles.modeSlider}
          style={{ transform: mode === 'achat' ? 'translateX(100%)' : 'translateX(0)' }}
        />
        <button
          className={cn(styles.modeButton, mode === 'location' && styles.modeButtonActive)}
          onClick={() => switchMode('location')}
          type="button"
        >
          <IconLocation size={16} />
          Location
        </button>
        <button
          className={cn(styles.modeButton, mode === 'achat' && styles.modeButtonActive)}
          onClick={() => switchMode('achat')}
          type="button"
        >
          <IconBuilding size={16} />
          Achat
        </button>
      </div>

      {/* Content area with transition */}
      <div key={mode} className={styles.contentFade}>

      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          {mode === 'location' ? 'Location' : 'Achat'}
        </h1>
        <p className={styles.heroSubtitle}>
          {mode === 'location'
            ? 'Trouvez le logement idéal à louer, partout en France.'
            : 'Trouvez le bien immobilier de vos rêves, partout en France.'}
        </p>
      </section>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterButtons}>
          {(['type', 'rooms', 'budget', 'city'] as FilterKey[]).map((key) => (
            <button
              key={key}
              className={cn(styles.filterButton, selected[key].size > 0 && styles.filterButtonActive, openFilter === key && styles.filterButtonOpen)}
              onClick={() => setOpenFilter(openFilter === key ? null : key)}
              type="button"
            >
              {FILTER_LABELS[key]}
              {selected[key].size > 0 && (
                <span className={styles.filterBadge}>{selected[key].size}</span>
              )}
              <span className={cn(styles.filterArrow, openFilter === key && styles.filterArrowUp)}>
                <IconChevronDown size={14} />
              </span>
            </button>
          ))}

          {totalActive > 0 && (
            <button className={styles.clearAll} onClick={clearAll} type="button">
              Effacer tout
            </button>
          )}
        </div>

        {/* Dropdown panel */}
        {openFilter && (
          <div className={styles.filterPanel}>
            <div className={styles.filterPanelHeader}>
              <span className={styles.filterPanelTitle}>{FILTER_LABELS[openFilter]}</span>
              {selected[openFilter].size > 0 && (
                <button className={styles.filterPanelClear} onClick={() => clearFilter(openFilter)} type="button">
                  Réinitialiser
                </button>
              )}
            </div>
            <div className={styles.filterOptions}>
              {config[openFilter].map((option) => (
                <button
                  key={option}
                  className={`${styles.filterOption} ${selected[openFilter].has(option) ? styles.filterOptionActive : ''}`}
                  onClick={() => toggle(openFilter, option)}
                  type="button"
                >
                  {selected[openFilter].has(option) && (
                    <span className={styles.filterCheck}>✓</span>
                  )}
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active tags */}
      {activeTags.length > 0 && (
        <div className={styles.activeTags}>
          {activeTags.map(({ key, value }) => (
            <button
              key={`${key}-${value}`}
              className={styles.activeTag}
              onClick={() => toggle(key, value)}
              type="button"
            >
              {value}
              <span className={styles.activeTagX}>✕</span>
            </button>
          ))}
        </div>
      )}

      {/* Count (hidden in map view) */}
      {view !== 'map' && (
        <p className={styles.count}>
          {filtered.length} bien{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
        </p>
      )}

      {/* Results */}
      {view === 'map' ? (
        <div className={styles.mapStage}>
          <PropertyMap properties={filtered} className={styles.mapFill} />
          <BottomSheet
            ref={sheetRef}
            snapPoints={[88, 0.5, 0.92]}
            defaultSnap={0}
            onSnapChange={setSheetSnap}
            peekLabel={`${filtered.length} bien${filtered.length > 1 ? 's' : ''} disponible${filtered.length > 1 ? 's' : ''}`}
          >
            <div className={styles.sheetGrid}>
              {filtered.length > 0 ? (
                filtered.map((property) => (
                  <Card
                    key={property.id}
                    images={property.images}
                    imageAlt={property.cardTitle}
                    badge={<Badge variant="ia" color={property.badgeColor}>{property.badgeLabel ?? (mode === 'location' ? 'Location' : 'Achat')}</Badge>}
                    title={property.cardTitle}
                    location={property.cardLocation}
                    price={property.cardPrice}
                    features={property.cardFeatures}
                lifestyle={property.lifestyle}
                    href={`/annonce/${property.id}`}
                  />
                ))
              ) : (
                <div className={styles.empty}>
                  <span className={styles.emptyIcon}>🏠</span>
                  <p className={styles.emptyText}>Aucun bien ne correspond à vos critères.</p>
                </div>
              )}
            </div>
          </BottomSheet>
        </div>
      ) : filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((property) => (
            <Card
              key={property.id}
              images={property.images}
              imageAlt={property.cardTitle}
              badge={<Badge variant="ia" color={property.badgeColor}>{property.badgeLabel ?? (mode === 'location' ? 'Location' : 'Achat')}</Badge>}
              title={property.cardTitle}
              location={property.cardLocation}
              price={property.cardPrice}
              features={property.cardFeatures}
                lifestyle={property.lifestyle}
              href={`/annonce/${property.id}`}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🏠</span>
          <p className={styles.emptyText}>Aucun bien ne correspond à vos critères.</p>
        </div>
      )}

      </div>{/* end contentFade */}

      {/* Floating view toggle — always visible to allow round-trip between list and map */}
      <button
        className={styles.floatingViewToggle}
        onClick={() => setView(view === 'list' ? 'map' : 'list')}
        type="button"
        aria-label={view === 'list' ? 'Afficher la carte' : 'Afficher la liste'}
      >
        {view === 'list' ? (
          <>
            <IconHome size={18} />
            Carte
          </>
        ) : (
          <>
            <IconMenu size={18} />
            Liste
          </>
        )}
      </button>

      {view === 'list' && <Footer />}
    </div>
  );
}

// ── Page wrapper with Suspense ──────────────────────────────
export default function RecherchePage() {
  return (
    <Suspense>
      <RechercheInner />
    </Suspense>
  );
}
