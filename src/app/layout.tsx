import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#111111',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://yomiru.vercel.app'),
  title: 'Yomiru',
  description: '文節ごとに読書を進めるPWAリーダーアプリ',
  manifest: '/manifest.json',
  robots: { index: true, follow: true },
  keywords: ['電子書籍', 'リーダー', '青空文庫', 'PWA', '文節読み'],
  openGraph: {
    type: 'website',
    url: 'https://yomiru.vercel.app',
    title: 'Yomiru',
    description: '文節ごとに読書を進めるPWAリーダーアプリ',
    images: [{ url: '/og.svg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yomiru',
    description: '文節ごとに読書を進めるPWAリーダーアプリ',
    images: ['/og.svg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Yomiru',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
