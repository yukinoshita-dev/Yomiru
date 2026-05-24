import withPWA from '@ducanh2912/next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    additionalManifestEntries: [
      { url: '/samples/rashomon-akutagawa.aozora.txt', revision: null },
      { url: '/samples/chumon-miyazawa.aozora.txt', revision: null },
      { url: '/samples/kokoro-soseki.aozora.txt', revision: null },
    ],
  },
})(nextConfig);
