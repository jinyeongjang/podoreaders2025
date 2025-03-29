import type { NextConfig } from 'next';
import os from 'os';

// ES2017 문법 적용
// ESM + CommonJS를 혼합 사용할 때 발생하는 타입 문제 해결
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'dynamic-content',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24시간
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\/_next\/image\?url/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-image',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24시간
        },
      },
    },
  ],
});

// CPU 코어 수 계산 함수 수정
const getCpuCount = (): number => {
  try {
    return Math.max(1, os.cpus().length - 1);
  } catch (e) {
    console.warn('CPU 정보를 가져오는데 실패했습니다:', e);
    return 1;
  }
};

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    turbo: {
      // 별칭 설정
      resolveAlias: {
        '@/components': './src/components',
        '@/hooks': './src/hooks',
        '@/context': './src/context',
        '@/utils': './src/utils',
        '@/lib': './src/lib',
      },
      // 빌드 규칙
      rules: {
        '*.worker.js': ['workbox-webpack-plugin'],
        '*.+(css|scss|sass)': ['style-loader', 'css-loader', 'postcss-loader'],
        '*.+(png|jpg|jpeg|gif|webp|avif|ico|svg)': ['url-loader'],
      },
    },
    // 멀티코어 설정
    cpus: getCpuCount(),
  },

  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
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
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },

  // 이미지 최적화 설정
  images: {
    domains: ['opengraph.b-cdn.net'],
  },

  // swcMinify 는 next.13에서 기본값이 true이므로 설정하지 않음

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 클라이언트 사이드에서만 필요한 폴백 설정
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        path: false,
        os: false,
      };
    }

    if (config.optimization && !isServer) {
      config.optimization.runtimeChunk = 'single';

      // splitChunks가 있는지 확인
      if (config.optimization.splitChunks) {
        // 캐시 그룹 설정
        config.optimization.splitChunks = {
          ...(config.optimization.splitChunks || {}),
          chunks: 'all',
          cacheGroups: {
            ...(config.optimization.splitChunks.cacheGroups || {}),
            // 공통 모듈 분리
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              priority: -10,
            },
            // 벤더 최적화
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: (module: any) => {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];
                return packageName ? `vendor.${packageName.replace('@', '')}` : 'vendors';
              },
              chunks: 'all',
              priority: -20,
            },
          },
        };
      }
    }

    return config;
  },
};

module.exports = withPWA(nextConfig);
