import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          borderRadius: 128,
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: 240,
            fontWeight: 700,
            fontFamily: 'serif',
            letterSpacing: '-8px',
          }}
        >
          L
        </span>
      </div>
    ),
    { ...size }
  );
}
