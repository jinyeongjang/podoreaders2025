import type { NextConfig } from 'next';

// 러닝 캐시 전략
const runtimeCaching =
  process.env.NODE_ENV === 'development'
    ? []
    : [
        {
          urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2)$/i,
          // 폰트 파일 캐시 전략
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-font-assets',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
        {
          // 이미지 파일 캐시 전략
          urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-image-assets',
            expiration: {
              maxEntries: 64,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        {
          // Next.js 이미지 캐시 전략
          urlPattern: /\/_next\/image\?url=.+/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'next-image',
            expiration: {
              maxEntries: 64,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        {
          // JavaScript 파일 캐시 전략
          urlPattern: /\.(?:js|css)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-js-assets',
            expiration: {
              maxEntries: 32,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        {
          // Next.js 데이터 파일 캐시 전략
          urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'next-data',
            expiration: {
              maxEntries: 32,
              maxAgeSeconds: 60 * 60 * 24, // 24 hours
            },
          },
        },
        {
          // API 응답 캐시 전략
          urlPattern: /^\/api\/.*$/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-responses',
            expiration: {
              maxEntries: 16,
              maxAgeSeconds: 60 * 60 * 24, // 24 hours
            },
            networkTimeoutSeconds: 10,
          },
        },
        {
          // 네트워크 응답 캐시 전략
          urlPattern: /.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'others',

            expiration: {
              maxEntries: 32,
              maxAgeSeconds: 60 * 60 * 24, // 24 hours
            },
            networkTimeoutSeconds: 10,
          },
        },
      ];

// PWA 설정
const withPWA = require('next-pwa')({
  dest: 'public', // 파일 저장 위치
  register: false, // 수동으로 등록
  skipWaiting: true, // 서비스워커 업데이트
  disable: false, // process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/, /build-manifest\.json$/, /_next\/static\/chunks\/.*\.js\.map$/], // 빌드 시 제외할 파일
  publicExcludes: ['!robots.txt', '!sitemap.xml', '!manifest.json'], // 공개 파일 제외
  // 최적화된 캐시 전략
  runtimeCaching,
  importScripts: ['/sw-push.js'],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 컴파일러 설정
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
  // PWA 관련 헤더 설정
  headers: async () => {
    const isDev = process.env.NODE_ENV === 'development';
    const noCache = 'no-store, must-revalidate';

    return [
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
            value: isDev ? noCache : 'public, max-age=0, must-revalidate',
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
            value: isDev ? noCache : 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: isDev ? noCache : 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
