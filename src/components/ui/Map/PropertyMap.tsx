'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl, { Map as MapLibreMap, Marker, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { PropertyData } from '@/lib/properties';
import styles from './PropertyMap.module.css';

interface PropertyMapProps {
  properties: PropertyData[];
  className?: string;
  /** Center fallback [lng, lat]. Defaults to France métropolitaine. */
  initialCenter?: [number, number];
  initialZoom?: number;
}

const FRANCE_CENTER: [number, number] = [2.35, 46.6];
const FRANCE_ZOOM = 5.2;

// Raster style — uses Carto Positron tiles (free, no key required, clean look).
const RASTER_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'carto-light': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: 'carto-light-layer',
      type: 'raster',
      source: 'carto-light',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export function PropertyMap({
  properties,
  className,
  initialCenter = FRANCE_CENTER,
  initialZoom = FRANCE_ZOOM,
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const popupRef = useRef<Popup | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Init map (once)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: RASTER_STYLE,
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 4,
      maxZoom: 17,
      attributionControl: { compact: true },
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false, showUserLocation: true }), 'top-right');

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      popupRef.current?.remove();
      popupRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [initialCenter, initialZoom]);

  // Format short price label for marker badge
  const formatPriceShort = useCallback((price: string): string => {
    const num = parseInt(price.replace(/[^\d]/g, ''), 10);
    if (!num) return price;
    if (price.includes('mois') || price.includes('/m')) {
      return `${num.toLocaleString('fr-FR')} €`;
    }
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace('.', ',')} M€`;
    if (num >= 1_000) return `${Math.round(num / 1000)} K€`;
    return `${num} €`;
  }, []);

  // Render markers when properties change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const renderMarkers = () => {
      // Remove existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      popupRef.current?.remove();
      popupRef.current = null;

      if (properties.length === 0) return;

      properties.forEach((property) => {
        if (!property.coordinates) return;

        const el = document.createElement('button');
        el.type = 'button';
        el.className = styles.marker;
        el.setAttribute('aria-label', `${property.cardTitle} – ${property.cardPrice}`);
        el.textContent = formatPriceShort(property.cardPrice);

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedId(property.id);

          // Close existing popup
          popupRef.current?.remove();

          const popupNode = document.createElement('div');
          popupNode.className = styles.popupContent;
          popupNode.innerHTML = `
            <a href="/annonce/${property.id}" class="${styles.popupLink}">
              <div class="${styles.popupImage}" style="background-image:url('${property.images[0]}')"></div>
              <div class="${styles.popupBody}">
                <div class="${styles.popupTitle}">${escapeHtml(property.cardTitle)}</div>
                <div class="${styles.popupLocation}">${escapeHtml(property.cardLocation)}</div>
                <div class="${styles.popupPrice}">${escapeHtml(property.cardPrice)}</div>
              </div>
            </a>
          `;

          const popup = new maplibregl.Popup({
            offset: 28,
            closeButton: false,
            closeOnClick: true,
            className: styles.popup,
            maxWidth: '280px',
          })
            .setLngLat([property.coordinates.lng, property.coordinates.lat])
            .setDOMContent(popupNode)
            .addTo(map);

          popupRef.current = popup;

          popup.on('close', () => {
            setSelectedId((cur) => (cur === property.id ? null : cur));
          });
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([property.coordinates.lng, property.coordinates.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });

      // Auto-fit bounds when 2+ properties (skip if only 1, keeps initial zoom)
      if (properties.length >= 2) {
        const bounds = new maplibregl.LngLatBounds();
        properties.forEach((p) => {
          if (p.coordinates) bounds.extend([p.coordinates.lng, p.coordinates.lat]);
        });
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 60, maxZoom: 12, duration: 800 });
        }
      } else if (properties.length === 1 && properties[0].coordinates) {
        map.flyTo({
          center: [properties[0].coordinates.lng, properties[0].coordinates.lat],
          zoom: 12,
          duration: 800,
        });
      }
    };

    if (map.loaded()) {
      renderMarkers();
    } else {
      map.once('load', renderMarkers);
    }
  }, [properties, formatPriceShort]);

  // Reflect selected state on markers
  useEffect(() => {
    markersRef.current.forEach((marker, i) => {
      const el = marker.getElement();
      if (properties[i] && properties[i].id === selectedId) {
        el.classList.add(styles.markerActive);
      } else {
        el.classList.remove(styles.markerActive);
      }
    });
  }, [selectedId, properties]);

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <div ref={containerRef} className={styles.map} />
      {properties.length === 0 && (
        <div className={styles.emptyOverlay}>
          <p>Aucun bien à afficher sur la carte.</p>
        </div>
      )}
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

