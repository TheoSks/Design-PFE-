import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: 90,
            fontWeight: 700,
            fontFamily: 'serif',
            letterSpacing: '-3px',
          }}
        >
          L
        </span>
      </div>
    ),
    { ...size }
  );
}
