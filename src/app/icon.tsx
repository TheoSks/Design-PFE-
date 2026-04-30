import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import path from 'path';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  const svgData = readFileSync(path.join(process.cwd(), 'public/logo.svg'));
  const base64 = `data:image/svg+xml;base64,${svgData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #5b9fff 0%, #2b7fff 100%)',
          borderRadius: 114,
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={base64} width={768} height={768} alt="" />
      </div>
    ),
    { ...size }
  );
}
