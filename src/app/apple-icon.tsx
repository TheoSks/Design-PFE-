import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import path from 'path';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  const svgData = readFileSync(path.join(process.cwd(), 'public/logo.svg'));
  const base64 = `data:image/svg+xml;base64,${svgData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #5b9fff 0%, #2b7fff 100%)',
          borderRadius: 40,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={base64} width={180} height={180} alt="" />
      </div>
    ),
    { ...size }
  );
}
