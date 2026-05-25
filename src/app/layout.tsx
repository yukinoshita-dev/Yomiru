import type { Metadata, Viewport } from 'next';
import { Shippori_Mincho, Noto_Sans_JP, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const shipporiMincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mincho-loaded',
  display: 'swap',
  preload: false,
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jp-loaded',
  display: 'swap',
  preload: false,
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-roman-loaded',
  display: 'swap',
  preload: false,
});

export const viewport: Viewport = {
  themeColor: '#0a0807',
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
    <html
      lang="ja"
      className={`${shipporiMincho.variable} ${notoSansJP.variable} ${cormorantGaramond.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
