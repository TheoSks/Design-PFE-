'use client';

import { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import styles from './MapView.module.css';
import { cn } from '@/lib/cn';

interface MapViewProps {
  lat: number;
  lng: number;
  zoom?: number;
  className?: string;
}

const MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60" fill="none">
  <ellipse cx="24" cy="56" rx="10" ry="4" fill="rgba(43,127,255,0.20)"/>
  <path d="M24 2C14.059 2 6 10.059 6 20 6 32.5 22.4 53.5 23.24 54.57a.99.99 0 0 0 1.52 0C25.6 53.5 42 32.5 42 20 42 10.059 33.941 2 24 2Z" fill="#2b7fff"/>
  <path d="M24 2C14.059 2 6 10.059 6 20c0 2.8.63 5.43 1.74 7.77C10.46 16.5 16.6 10 24 10s13.54 6.5 16.26 17.77C41.37 25.43 42 22.8 42 20 42 10.059 33.941 2 24 2Z" fill="rgba(255,255,255,0.14)"/>
  <circle cx="24" cy="20" r="8" fill="white"/>
  <circle cx="24" cy="20" r="4.5" fill="#2b7fff"/>
</svg>`;

export function MapView({ lat, lng, zoom = 16, className }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maptilersdk.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? '';

    const map = new maptilersdk.Map({
      container: mapRef.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [lng, lat],
      zoom,
      pitch: 50,
      bearing: -20,
      scrollZoom: false,
      doubleClickZoom: false,
      attributionControl: { compact: true },
      pitchWithRotate: false,
    });

    // Custom SVG pin marker
    const el = document.createElement('div');
    el.innerHTML = MARKER_SVG;
    el.className = styles.markerWrapper;

    new maptilersdk.Marker({ element: el })
      .setLngLat([lng, lat])
      .addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, zoom]);

  return (
    <div className={cn(styles.wrap, className)}>
      <div ref={mapRef} className={styles.map} />
      <div className={styles.frame} aria-hidden="true" />
    </div>
  );
}
