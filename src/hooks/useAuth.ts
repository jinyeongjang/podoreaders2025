import { useState, useEffect } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { toast } from 'react-hot-toast';

// 현재 배포 환경에 맞는 URL을 획득하는 함수
export const getSiteUrl = () => {
  // 환경 변수에서 사이트 URL을 가져옵니다
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

  // 배포된 애플리케이션의 URL
  const productionUrl = 'https://podoreaders2025.vercel.app';

  // 개발 환경에서는 localhost 주소 사용
  if (typeof window !== 'undefined') {
    // 브라우저 환경
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('개발 환경 감지, localhost URL 사용');
      return window.location.origin;
    }

    // 배포 환경이지만 window 객체 사용 가능
    console.log('배포 환경 감지, 실제 호스트 URL 사용:', window.location.origin);
    return window.location.origin;
  }

  // 서버 사이드 렌더링 환경에서는 환경 변수 또는 기본 URL 사용
  if (envUrl) {
    // 환경 변수 URL이 http:// 또는 https://로 시작하는지 확인
    if (envUrl.startsWith('http')) {
      return envUrl;
    }
    // http:// 또는 https://로 시작하지 않으면 https://를 추가
    return `https://${envUrl}`;
  }

  // 모든 방법이 실패하면 하드코딩된 URL 반환
  console.log('환경 변수 없음, 기본 프로덕션 URL 사용');
  return productionUrl;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  // Supabase 인증 상태 확인 함수
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Supabase 세션 가져오기
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Supabase session error:', error);
          return;
        }

        if (data.session?.user) {
          console.log('Supabase session found:', data.session.user.email);
          setUser(data.session.user);
          // 로컬 스토리지에 이메일 저장 (빠른 UI 업데이트용)
          localStorage.setItem('userEmail', data.session.user.email || '');
        } else {
          console.log('No active Supabase session');
          setUser(null);
          localStorage.removeItem('userEmail');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    // 페이지 로드 시 즉시 확인
    checkAuthStatus();

    // Supabase 인증 상태 변경 이벤트 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Supabase auth event:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('SIGNED_IN event detected:', session.user.email);
        setUser(session.user);
        localStorage.setItem('userEmail', session.user.email || '');

        // 인증 상태 변경 이벤트 발생 (다른 컴포넌트 알림용)
        window.dispatchEvent(new CustomEvent('auth-state-changed'));
      } else if (event === 'SIGNED_OUT') {
        console.log('SIGNED_OUT event detected');
        setUser(null);
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');

        // 인증 상태 변경 이벤트 발생
        window.dispatchEvent(new CustomEvent('auth-state-changed'));
      }
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 로그아웃 함수
  const handleSignOut = async () => {
    setLoading(true);
    try {
      console.log('로그아웃 중입니다...');

      // Supabase 로그아웃 요청
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        toast.error('로그아웃 중 오류가 발생했습니다');
        return;
      }

      // 즉시 UI 업데이트
      setUser(null);
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');

      // 알림
      toast.success('로그아웃 되었습니다.');
      console.log('로그아웃 되었습니다.');
    } catch (error) {
      console.error('로그아웃 하는데 문제가 있어요:', error);
      toast.error('로그아웃 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 구글 로그인 함수
  const handleGoogleLogin = async () => {
    setLoading(true);
    setAuthError(null);

    try {
      const siteUrl = getSiteUrl();
      const callbackUrl = `${siteUrl}/auth/callback`;
      console.log('구글 로그인 시작, 사이트 URL:', siteUrl);
      console.log('콜백 URL:', callbackUrl);

      // 배포 환경인지 감지
      const isProduction =
        typeof window !== 'undefined' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1';

      console.log('배포 환경 여부:', isProduction ? '배포 환경' : '개발 환경');

      // 로그인 요청
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            prompt: 'select_account', // 항상 계정 선택 화면 표시
          },
          // 배포 환경에 따른 추가 옵션
          ...(isProduction && {
            skipBrowserRedirect: false, // 브라우저 리다이렉트 허용
          }),
        },
      });

      if (error) {
        console.error('구글 로그인 오류:', error);
        setAuthError(error);
        toast.error('구글 로그인 중 오류가 발생했습니다');
        return;
      }

      if (data?.url) {
        console.log('구글 로그인 URL로 리다이렉트:', data.url);
        // 구글 로그인 페이지로 리다이렉트
        window.location.href = data.url;
      } else {
        throw new Error('구글 로그인 URL을 받지 못했습니다');
      }
    } catch (error) {
      console.error('구글 로그인 처리 중 예외 발생:', error);
      toast.error('로그인 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    authError,
    handleSignOut,
    handleGoogleLogin,
  };
}
