import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* 리소스 힌트 - 성능 최적화 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://vercel.live" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vercel.live" />

        {/* Supabase 리소스 힌트 */}
        <link rel="preconnect" href="https://supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://supabase.co" />

        {/* PWA 메타태그 */}
        <meta name="application-name" content="포도리더스" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="포도리더스" />
        <meta name="description" content="큐티,말씀,필사횟수 기록플랫폼" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* 상태바 색상 설정 */}
        <meta name="theme-color" content="#6366f1" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#4f46e5" media="(prefers-color-scheme: dark)" />

        {/* 아이콘 및 매니페스트 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="192x192" href="/images/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/images/icon-512.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/icon-16.png" />

        {/* PWA 스플래시 스크린 */}
        <meta name="apple-touch-fullscreen" content="yes" />

        {/* 성능 최적화 */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
