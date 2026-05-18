'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl, { Map as MapLibreMap, Marker, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { PropertyData } from '@/lib/properties';
import styles from './PropertyMap.module.css';

export interface DrawnZone {
  center: [number, number]; // [lng, lat]
  radiusKm: number;
}

interface PropertyMapProps {
  properties: PropertyData[];
  className?: string;
  /** Center fallback [lng, lat]. Defaults to France métropolitaine. */
  initialCenter?: [number, number];
  initialZoom?: number;
  /** Zone drawing mode. When active, taps on the map define a center then a radius point. */
  drawMode?: boolean;
  zone?: DrawnZone | null;
  onZoneChange?: (zone: DrawnZone | null) => void;
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

// Haversine distance in km
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

// Build a GeoJSON polygon approximating a circle around [lng, lat] with radius in km
function circlePolygon(center: [number, number], radiusKm: number, points = 64): GeoJSON.Feature<GeoJSON.Polygon> {
  const [lng, lat] = center;
  const coords: [number, number][] = [];
  const earthRadius = 6371;
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const dLat = (radiusKm / earthRadius) * (180 / Math.PI);
    const dLng = (radiusKm / earthRadius) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180);
    coords.push([lng + dLng * Math.cos(angle), lat + dLat * Math.sin(angle)]);
  }
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [coords] },
  };
}

export function PropertyMap({
  properties,
  className,
  initialCenter = FRANCE_CENTER,
  initialZoom = FRANCE_ZOOM,
  drawMode = false,
  zone = null,
  onZoneChange,
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const popupRef = useRef<Popup | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingCenter, setPendingCenter] = useState<[number, number] | null>(null);
  const drawModeRef = useRef(drawMode);
  const pendingCenterRef = useRef<[number, number] | null>(null);
  const onZoneChangeRef = useRef(onZoneChange);

  useEffect(() => { drawModeRef.current = drawMode; }, [drawMode]);
  useEffect(() => { pendingCenterRef.current = pendingCenter; }, [pendingCenter]);
  useEffect(() => { onZoneChangeRef.current = onZoneChange; }, [onZoneChange]);

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

    // Zone drawing: handle clicks
    map.on('click', (e) => {
      if (!drawModeRef.current) return;
      const lngLat: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      if (!pendingCenterRef.current) {
        setPendingCenter(lngLat);
      } else {
        const radiusKm = Math.max(1, haversineKm(pendingCenterRef.current, lngLat));
        onZoneChangeRef.current?.({ center: pendingCenterRef.current, radiusKm });
        setPendingCenter(null);
      }
    });

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

  // Render/update zone overlay (circle + center marker)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => {
      const sourceId = 'zone-circle';
      const fillLayerId = 'zone-circle-fill';
      const lineLayerId = 'zone-circle-line';

      // Build feature
      const activeCenter = zone?.center ?? pendingCenter;
      const activeRadius = zone?.radiusKm ?? 0;
      let feature: GeoJSON.Feature<GeoJSON.Polygon> | null = null;
      if (zone) {
        feature = circlePolygon(zone.center, zone.radiusKm);
      }

      const data: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: feature ? [feature] : [],
      };

      const existing = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
      if (existing) {
        existing.setData(data);
      } else {
        map.addSource(sourceId, { type: 'geojson', data });
        map.addLayer({
          id: fillLayerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': '#2b7fff',
            'fill-opacity': 0.12,
          },
        });
        map.addLayer({
          id: lineLayerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': '#2b7fff',
            'line-width': 2,
            'line-dasharray': [2, 2],
          },
        });
      }

      // Show or hide center pin (pending or confirmed)
      let pin = document.getElementById('zone-center-pin') as HTMLDivElement | null;
      if (activeCenter) {
        if (!pin) {
          pin = document.createElement('div');
          pin.id = 'zone-center-pin';
          pin.style.cssText = 'width:14px;height:14px;border-radius:50%;background:#2b7fff;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);';
          const pinMarker = new maplibregl.Marker({ element: pin })
            .setLngLat(activeCenter)
            .addTo(map);
          (pin as HTMLElement & { __marker?: Marker }).__marker = pinMarker;
        } else {
          const pinMarker = (pin as HTMLElement & { __marker?: Marker }).__marker;
          pinMarker?.setLngLat(activeCenter);
        }
      } else if (pin) {
        const pinMarker = (pin as HTMLElement & { __marker?: Marker }).__marker;
        pinMarker?.remove();
        pin.remove();
      }
      void activeRadius;
    };

    if (map.loaded() && map.isStyleLoaded()) apply();
    else map.once('load', apply);

    return () => {
      const pin = document.getElementById('zone-center-pin');
      if (pin) {
        const pinMarker = (pin as HTMLElement & { __marker?: Marker }).__marker;
        pinMarker?.remove();
        pin.remove();
      }
    };
  }, [zone, pendingCenter]);

  // Update cursor based on drawMode
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const canvas = map.getCanvas();
    canvas.style.cursor = drawMode ? 'crosshair' : '';
  }, [drawMode]);

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

