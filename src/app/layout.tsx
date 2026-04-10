import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Label — Recherche immobilière',
  description: 'Recherche immobilière augmentée par l\'IA',
  appleWebApp: {
    capable: true,
    title: 'Label',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="light">
      <body className={roboto.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
