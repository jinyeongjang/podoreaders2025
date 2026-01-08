import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Head from 'next/head';
import { useEffect } from 'react';
import { pretendard } from '@/lib/fonts';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabase';
import { useThemeStore } from '../store/themeStore';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { theme } = useThemeStore();

  // 네비게이션 바를 표시하지 않을 경로 목록
  const hideNavbarPaths = [
    '/login',
    '/register',
    '/onboarding',
    // 추가 경로
  ];

  // 현재 경로에 네비게이션 바 표시 여부
  const showNavbar = !hideNavbarPaths.includes(router.pathname);

  // 인증 상태 초기화 - 애플리케이션 시작 시 한 번만 실행
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const currentEmail = localStorage.getItem('userEmail');
          if (currentEmail !== session.user.email) {
            localStorage.setItem('userEmail', session.user.email || '');
          }

          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('login_success') === 'true') {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
          }
        }
      } catch (error) {
        console.error('App: Error initializing auth:', error);
      }
    };

    initializeAuth();

    // 세션 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        localStorage.setItem('userEmail', session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('userEmail');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Pull-to-refresh 기능 최적화
  useEffect(() => {
    let touchStartY = 0;
    const threshold = 150;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touchEndY = event.touches[0].clientY;
      const scrollTop = document.documentElement.scrollTop;

      // 페이지 최상단에서 아래로 스와이프할 때만 새로고침
      if (scrollTop === 0 && touchEndY - touchStartY > threshold) {
        event.preventDefault();
        window.location.reload();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 앱 로드 시 테마 적용
  useEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-blue', 'theme-green', 'theme-amber');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  // Service Worker 등록 (PWA)
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);

          // 업데이트 확인
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // 새 버전 사용 가능
                  console.log('New version available! Please refresh.');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <>
      <Analytics />
      <SpeedInsights />

      <Head>
        <title>포도리더스::기록플랫폼</title>
        <meta name="description" content="큐티,말씀,필사횟수 기록플랫폼" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://podoreaders2025.vercel.app" />
        <meta property="og:title" content="포도리더스::기록플랫폼" />
        <meta property="og:description" content="큐티,말씀,필사횟수 기록플랫폼" />
        <meta property="og:site_name" content="포도리더스" />
        <meta property="og:locale" content="ko_KR" />
        <meta
          property="og:image"
          content="https://opengraph.b-cdn.net/production/images/78070067-7ff7-4428-a8d6-3cf0d110a85e.png?token=40UV1d9UAxn1tGtkHifEDWH8MUwrioYrGe78Qud4qEc&height=600&width=1200&expires=33274150734"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
      </Head>

      <div className={`${pretendard.className} pb-12`}>
        {/* 하단 네비게이션 바 공간 확보 */}
        <Component {...pageProps} />
        {showNavbar && <BottomNavbar />}
      </div>
    </>
  );
}
