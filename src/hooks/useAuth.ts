import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  // 인증 상태 확인 함수
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 빠른 UI 업데이트를 위해 로컬 스토리지에서 사용자 정보 먼저 확인
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
          setUser({ email: storedEmail } as User); // 임시 사용자 객체
        }

        // 그 다음 실제 세션 확인
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          console.log('User confirmed from session:', session.user.email);
          setUser(session.user);
          localStorage.setItem('userEmail', session.user.email || '');
        } else if (!storedEmail) {
          // 세션 없을 시 로컬 스토리지에도 없는 경우에 null로 설정
          setUser(null);
          localStorage.removeItem('userEmail');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    // 페이지 로드 시 즉시 확인
    checkAuthStatus();

    // 인증 상태 변경 이벤트 리스너
    const handleAuthChange = () => {
      console.log('auth-state-changed event triggered');
      checkAuthStatus();
    };

    window.addEventListener('auth-state-changed', handleAuthChange);

    // Supabase 인증 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Supabase auth event:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('SIGNED_IN event detected:', session.user.email);
        setUser(session.user);
        localStorage.setItem('userEmail', session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        console.log('SIGNED_OUT event detected');
        setUser(null);
        localStorage.removeItem('userEmail');
      }
    });

    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
      subscription.unsubscribe();
    };
  }, []);

  // 로그아웃 함수
  const handleSignOut = async () => {
    try {
      console.log('로그아웃 중입니다...');

      // 즉시 UI 업데이트
      setUser(null);
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');

      // Supabase 로그아웃 요청
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        return;
      }

      // 알림
      toast.success('로그아웃 되었습니다.');

      console.log('로그아웃 되었습니다.');
    } catch (error) {
      console.error('로그아웃 하는데 문제가 있어요:', error);
    }
  };

  return { user, handleSignOut };
}
