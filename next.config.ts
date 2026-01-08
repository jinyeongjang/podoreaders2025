import type { NextConfig } from 'next';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // 빌드 속도 최적화
  buildExcludes: [/middleware-manifest\.json$/, /build-manifest\.json$/],
  publicExcludes: ['!robots.txt', '!sitemap.xml'],
  // 캐시 전략 간소화
  runtimeCaching: [
    {
      urlPattern: /^https?.*\.(png|jpg|jpeg|webp|avif|gif|svg|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
        },
      },
    },
    {
      urlPattern: /^https?.*\.(js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
      },
    },
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'others',
        networkTimeoutSeconds: 3, // 10초에서 3초로 단축하여 빠른 폴백 유도
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 빌드 최적화
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.kakaocdn.net',
        pathname: '/**',
      },
    ],
  },

  // 성능 최적화
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'framer-motion', 'react-icons'],
    scrollRestoration: true, // 새로고침 시 스크롤 위치 즉시 복원
  },

  // 빌드 출력 최적화
  output: 'standalone',

  // PWA 관련 헤더 설정
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'Service-Worker-Allowed',
          value: '/',
        },
      ],
    },
    {
      source: '/sw.js',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate',
        },
        {
          key: 'Service-Worker-Allowed',
          value: '/',
        },
      ],
    },
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=2592000, stale-while-revalidate=86400',
        },
      ],
    },
  ],
};

module.exports = withPWA(nextConfig);
