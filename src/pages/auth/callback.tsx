import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../utils/supabase';
import { getSiteUrl } from '../../hooks/useAuth';

export default function AuthCallback() {
  const router = useRouter();
  const { checkSession } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState<string>('초기화 중...');

  useEffect(() => {
    async function handleAuthCallback() {
      // 로딩 표시
      toast.loading('로그인 진행 중...', { id: 'auth-callback' });

      try {
        // 사이트 URL 확인
        const siteUrl = getSiteUrl();

        // 배포 환경인지 감지
        const isProduction =
          typeof window !== 'undefined' &&
          window.location.hostname !== 'localhost' &&
          window.location.hostname !== '127.0.0.1';

        // 환경 정보 로깅
        console.log('Callback Environment:', {
          hostname: window.location.hostname,
          origin: window.location.origin,
          siteUrl: siteUrl,
          isProduction: isProduction,
          envSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
          vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
          nodeEnv: process.env.NODE_ENV,
          supabaseAvailable: !!supabase,
        });

        setDebugInfo('URL 파라미터 확인 중...');
        // URL 파라미터 확인
        const params = new URLSearchParams(window.location.search);
        const provider = params.get('provider');
        const error = params.get('error');
        const code = params.get('code');
        const errorDescription = params.get('error_description');
        const type = params.get('type'); // Supabase가 추가하는 파라미터

        // 구글 로그인 관련 추가 디버깅
        if (provider === 'google' || code) {
          console.log('구글 로그인 콜백 처리:', {
            code: code ? '존재함' : '없음',
            hasSearchParams: window.location.search.length > 0,
            type: type || 'none',
          });
        }

        // URL 디버깅 정보
        const hasHash = window.location.hash.length > 0;
        const fullUrl = window.location.href;
        console.log('Callback URL:', fullUrl);
        console.log('Query parameters:', { provider, code, error, errorDescription, hasHash, type });

        setDebugInfo(
          `환경: ${isProduction ? '배포' : '개발'}, 파라미터: ${provider || 'none'}, 코드: ${code ? '있음' : '없음'}, 에러: ${error || 'none'}`,
        );

        // 에러가 있는 경우 처리
        if (error) {
          console.error('Auth error from provider:', error);
          if (errorDescription) {
            console.error('Error description:', errorDescription);
          }
          toast.error('로그인 중 오류가 발생했습니다', { id: 'auth-callback' });
          router.push('/auth/login');
          return;
        }

        // Supabase 처리 타입이 recovery인 경우 (비밀번호 재설정 등)
        if (type === 'recovery' || type === 'signup') {
          console.log(`${type} 타입 콜백 감지, 별도 처리 필요`);
          // 여기서 필요한 처리 추가
        }

        // 코드가 있지만 provider가 명시되지 않은 경우 (구글 로그인 일 수 있음)
        if (code && !provider) {
          console.log('코드는 있지만 provider가 없음, 구글 로그인 처리 중...');
          setDebugInfo('구글 인증 코드 처리 중...');
        }

        setDebugInfo('Supabase 세션 확인 중...');

        // Supabase 세션 확인 (최대 3번 시도)
        let session = null;
        let tryCount = 0;
        const maxTries = 3;
        const delayMs = 1000; // 1초 대기

        while (!session && tryCount < maxTries) {
          try {
            tryCount++;
            console.log(`Supabase 세션 확인 시도 #${tryCount}`);

            // Supabase 세션 가져오기
            const { data, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
              console.error(`세션 확인 오류 (시도 #${tryCount}):`, sessionError);
              await new Promise((resolve) => setTimeout(resolve, delayMs));
              continue;
            }

            session = data.session;

            if (session) {
              console.log('세션 찾음:', session.user.email);

              // 세션이 있을 때 명시적으로 로컬 스토리지 업데이트
              localStorage.setItem('userEmail', session.user.email || '');

              // 이전에 로그아웃 관련 잔여 데이터가 있으면 제거
              const keysToCheck = ['signOut', 'logout', 'signed-out'];
              keysToCheck.forEach((key) => {
                if (localStorage.getItem(key)) {
                  localStorage.removeItem(key);
                  console.log(`잔여 로그아웃 데이터 제거: ${key}`);
                }
              });

              break;
            } else {
              console.log(`세션 없음 (시도 #${tryCount})`);

              // 첫 번째 시도에서 실패하고 코드가 있으면 처리 시도
              if (code && tryCount === 1) {
                console.log('코드로 세션 교환 시도 중...');

                // 해시 파라미터가 있는 경우
                if (hasHash) {
                  console.log('해시 파라미터 처리 시도');
                  try {
                    // 해시 URL 처리 시도
                    const { data: hashData } = await supabase.auth.getUser();
                    if (hashData?.user) {
                      console.log('해시에서 사용자 발견:', hashData.user.email);
                      session = await supabase.auth.getSession().then((res) => res.data.session);
                      if (session) break;
                    }
                  } catch (e) {
                    console.error('해시 처리 실패:', e);
                  }
                }

                try {
                  // 현재 코드와 URL에서 세션을 생성하려고 시도
                  const user = await supabase.auth.getUser().then((res) => res.data.user);
                  if (user) {
                    console.log('사용자 정보 가져옴:', user.email);
                    // 세션 다시 확인
                    session = await supabase.auth.getSession().then((res) => res.data.session);
                    if (session) break;
                  }
                } catch (e) {
                  console.error('사용자 정보 요청 실패:', e);
                }

                // 배포 환경에서는 URL 새로고침 시도
                if (isProduction) {
                  try {
                    console.log('배포 환경에서 페이지 새로고침 시도');
                    window.location.reload();
                    return; // 함수 종료, 새로고침 후 다시 실행됨
                  } catch (e) {
                    console.error('페이지 새로고침 실패:', e);
                  }
                }
              }

              await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
          } catch (e) {
            console.error(`세션 확인 예외 (시도 #${tryCount}):`, e);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        }

        setDebugInfo(`세션 ${session ? '찾음' : '못찾음'} (${tryCount}/${maxTries}번 시도)`);

        // 세션 및 사용자 정보 확인
        if (session?.user) {
          // 세션 유효, 전역 상태에도 저장
          const user = await checkSession();

          if (!user) {
            console.warn('세션은 있지만 checkSession에서 사용자를 반환하지 않음');
            // 세션 재생성 시도
            await supabase.auth.refreshSession();
            await checkSession();
          }

          console.log(`${provider || 'OAuth'} 로그인 성공!`);
          toast.success('로그인 되었습니다', { id: 'auth-callback' });

          // 홈으로 리디렉션 (지연 추가)
          setTimeout(() => {
            router.push('/');
          }, 1000);
          return;
        }

        // 세션이 없는 경우 - Zustand 스토어 체크
        setDebugInfo('유효한 세션 없음, Zustand 스토어 확인 중...');
        const user = await checkSession();

        if (user) {
          console.log('Zustand 스토어에서 사용자 찾음');
          toast.success('로그인 되었습니다', { id: 'auth-callback' });

          setTimeout(() => {
            router.push('/');
          }, 1000);
          return;
        }

        // 마지막 수단: 해시 파라미터 수동 처리
        if (hasHash || code) {
          console.log('해시 또는 코드 파라미터 있음, 수동 처리 시도 중');
          setDebugInfo('수동 인증 처리 시도 중...');

          try {
            // URL에서 Supabase가 자동으로 처리해야 하는 정보 새로고침
            window.location.reload();
            return;
          } catch (manualError) {
            console.error('수동 인증 처리 실패:', manualError);
          }
        }

        // 모든 시도 실패
        setDebugInfo('로그인 실패, 로그인 페이지로 돌아갑니다');
        console.warn('유효한 세션을 찾을 수 없습니다');
        toast.error('로그인에 실패했습니다. 다시 시도해주세요.', { id: 'auth-callback' });

        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } catch (error) {
        console.error('Callback processing error:', error);
        setDebugInfo(`오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        toast.error('로그인 처리 중 오류가 발생했습니다', { id: 'auth-callback' });

        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    }

    handleAuthCallback();
  }, [router, checkSession]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="text-lg text-gray-700">로그인 처리 중입니다...</p>
        <p className="mt-2 text-sm text-gray-500">잠시만 기다려주세요.</p>
        <p className="mt-4 max-w-md text-xs text-gray-400">{debugInfo}</p>
      </div>
    </div>
  );
}
