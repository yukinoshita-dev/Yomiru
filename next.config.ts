import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development' || process.env.DISABLE_PWA === '1',
  cacheOnNavigation: true,
  reloadOnOnline: true,
  additionalPrecacheEntries: [
    { url: '/samples/rashomon-akutagawa.aozora.txt', revision: null },
    { url: '/samples/chumon-miyazawa.aozora.txt', revision: null },
    { url: '/samples/kokoro-soseki.aozora.txt', revision: null },
  ],
});

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : 'standalone',
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'dexie'],
  },
};

export default withSerwist(nextConfig);
