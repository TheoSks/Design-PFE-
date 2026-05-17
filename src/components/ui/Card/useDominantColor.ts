'use client';

import { useEffect, useState } from 'react';

const cache = new Map<string, string>();
const FALLBACK = 'rgb(38, 36, 33)';

type RGB = { r: number; g: number; b: number };

function rgbToHsl({ r, g, b }: RGB): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
        break;
      case gn:
        h = ((bn - rn) / d + 2) * 60;
        break;
      default:
        h = ((rn - gn) / d + 4) * 60;
    }
  }
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function extractColor(img: HTMLImageElement): string | null {
  const W = 32;
  const H = 32;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  try {
    ctx.drawImage(img, 0, 0, W, H);
    // Sample bottom 40% of the image (where the gradient is most opaque)
    const startY = Math.floor(H * 0.6);
    const data = ctx.getImageData(0, startY, W, H - startY).data;

    const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 200) continue;

      const { s, l } = rgbToHsl({ r, g, b });
      // Skip near-white, near-black, and washed-out grays
      if (l > 0.9 || l < 0.1) continue;
      if (s < 0.08 && (l > 0.75 || l < 0.2)) continue;

      // Quantize to buckets of 32 to group similar colors
      const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
      const bucket = buckets.get(key);
      // Weight by saturation so vibrant-but-not-extreme colors win over greys
      const weight = 1 + Math.min(s, 0.6) * 2;
      if (bucket) {
        bucket.count += weight;
        bucket.r += r;
        bucket.g += g;
        bucket.b += b;
      } else {
        buckets.set(key, { count: weight, r, g, b });
      }
    }

    if (buckets.size === 0) return null;

    let best: { count: number; r: number; g: number; b: number } | null = null;
    for (const bucket of buckets.values()) {
      if (!best || bucket.count > best.count) best = bucket;
    }
    if (!best) return null;

    const pixelCount = best.count;
    const avg: RGB = {
      r: Math.round(best.r / Math.max(1, Math.floor(pixelCount))),
      g: Math.round(best.g / Math.max(1, Math.floor(pixelCount))),
      b: Math.round(best.b / Math.max(1, Math.floor(pixelCount))),
    };

    // Heavily desaturate and darken for a moody, premium backdrop that never overpowers the image
    const hsl = rgbToHsl(avg);
    const targetSat = Math.min(hsl.s * 0.35, 0.18);
    const targetLight = 0.16;
    const tuned = hslToRgb(hsl.h, targetSat, targetLight);

    return `rgb(${tuned.r}, ${tuned.g}, ${tuned.b})`;
  } catch {
    return null;
  }
}

export function useDominantColor(src: string | undefined): string {
  const [color, setColor] = useState<string>(() => (src && cache.get(src)) || FALLBACK);

  useEffect(() => {
    if (!src) {
      setColor(FALLBACK);
      return;
    }
    const cached = cache.get(src);
    if (cached) {
      setColor(cached);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      if (cancelled) return;
      const extracted = extractColor(img) ?? FALLBACK;
      cache.set(src, extracted);
      setColor(extracted);
    };
    img.onerror = () => {
      if (!cancelled) setColor(FALLBACK);
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return color;
}
