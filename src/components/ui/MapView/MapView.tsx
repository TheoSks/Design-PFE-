'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapView.module.css';
import { cn } from '@/lib/cn';

interface MapViewProps {
  lat: number;
  lng: number;
  zoom?: number;
  className?: string;
}

const MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="44" height="56" viewBox="0 0 44 56" fill="none">
  <!-- Soft shadow base -->
  <ellipse cx="22" cy="52" rx="10" ry="4" fill="rgba(43,127,255,0.18)"/>
  <!-- Pin body -->
  <path d="M22 2C13.163 2 6 9.163 6 18c0 10.627 14.118 30.18 15.07 31.49a1.25 1.25 0 0 0 1.86 0C23.882 48.18 38 28.627 38 18 38 9.163 30.837 2 22 2Z" fill="#2b7fff"/>
  <!-- Glossy highlight -->
  <path d="M22 2C13.163 2 6 9.163 6 18c0 2.5.56 4.86 1.56 6.97C9.93 14.46 15.35 8 22 8s12.07 6.46 14.44 16.97C37.44 22.86 38 20.5 38 18 38 9.163 30.837 2 22 2Z" fill="rgba(255,255,255,0.18)"/>
  <!-- White ring -->
  <circle cx="22" cy="18" r="7" fill="white"/>
  <!-- Inner dot -->
  <circle cx="22" cy="18" r="4" fill="#2b7fff"/>
</svg>`;

export function MapView({ lat, lng, zoom = 15, className }: MapViewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom,
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      doubleClickZoom: false,
    });

    // CartoDB Positron — clean, minimal, design-friendly
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }
    ).addTo(map);

    // Minimal attribution bottom-right, re-added styled
    L.control
      .attribution({ position: 'bottomright', prefix: false })
      .addAttribution(
        '© <a href="https://carto.com" target="_blank" rel="noopener">CARTO</a>'
      )
      .addTo(map);

    // Custom SVG pin marker
    const icon = L.divIcon({
      html: MARKER_SVG,
      className: styles.markerWrapper,
      iconSize: [44, 56],
      iconAnchor: [22, 52],
    });

    L.marker([lat, lng], { icon }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, zoom]);

  return (
    <div ref={wrapRef} className={cn(styles.wrap, className)}>
      <div ref={mapRef} className={styles.map} />
      {/* Inner frame overlay – masks tile seams at edges */}
      <div className={styles.frame} aria-hidden="true" />
    </div>
  );
}
