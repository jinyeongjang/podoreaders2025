import React, { useState, useEffect } from 'react';
import { pretendard } from '../../lib/fonts';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabase';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useAuthStore } from '../../store/authStore';
import Head from 'next/head';
import Header from '../../components/layout/Header';
import { useAuth, getSiteUrl } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { FaChevronLeft } from 'react-icons/fa';
import { useTypewriter } from '../../hooks/useTypewriter';

const Login: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { checkSession } = useAuthStore();
  const { handleGoogleLogin, loading, authError } = useAuth();

  const welcomeMessage = '포도리더스에 오신것을 환영해요.';
  const guideMessage = '계속하려면 아래 방법 중 하나로 로그인해볼까요?';

  // useTypewriter 사용하여 텍스트 애니메이션

  const { displayedText: typedWelcome } = useTypewriter({
    text: welcomeMessage,
    speed: 50,
  });

  const { displayedText: typedGuide } = useTypewriter({
    text: guideMessage,
    speed: 50,
    delay: welcomeMessage.length * 50 + 300,
  });

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    if (authError) {
      setError(`로그인 오류: ${authError.message}`);
    }
  }, [authError]);

  useEffect(() => {
    const redirectIfLoggedIn = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (data.session?.user) {
          console.log('이미 로그인되어 있어요:', data.session.user.email);
          await checkSession();
          toast.success('이미 로그인되어 있어요');

          const params = new URLSearchParams(window.location.search);
          const redirectPath = params.get('login_redirect') || '/';
          router.push(redirectPath);
        }
      } catch (error) {
        console.error('로그인 상태 확인 중 오류:', error);
      }
    };

    redirectIfLoggedIn();
  }, [router, checkSession]);

  const handleKakaoLogin = async () => {
    if (loading) return;

    setError(null);

    try {
      const siteUrl = getSiteUrl();
      const callbackUrl = `${siteUrl}/auth/callback`;
      console.log('카카오 로그인 시작, 사이트 URL:', siteUrl);
      console.log('콜백 URL:', callbackUrl);

      const isProduction =
        typeof window !== 'undefined' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1';

      console.log('배포 환경 여부:', isProduction ? '배포 환경' : '개발 환경');

      toast.loading('카카오 로그인 페이지로 이동합니다...', { id: 'kakao-login' });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: callbackUrl,
          ...(isProduction && {
            skipBrowserRedirect: false,
          }),
        },
      });

      if (error) {
        console.error('카카오 로그인 오류:', error.message);
        toast.error('로그인 중 오류가 발생했습니다', { id: 'kakao-login' });
        setError(`로그인 실패: ${error.message}`);
        return;
      }

      if (data?.url) {
        console.log('카카오 로그인 URL로 리다이렉트:', data.url);
        toast.dismiss('kakao-login');
        window.location.href = data.url;
      } else {
        throw new Error('리다이렉트 URL을 받지 못했습니다');
      }
    } catch (err: unknown) {
      toast.dismiss('kakao-login');
      console.error('카카오 로그인 오류:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(`로그인 실패: ${errorMessage}`);
      toast.error('로그인에 실패했습니다');
    }
  };

  return (
    <>
      <Head>
        <title>로그인 - 포도리더스</title>
      </Head>

      <div className={`min-h-screen bg-gradient-to-b from-indigo-50 to-white ${pretendard.className}`}>
        {/* Header 컴포넌트 추가 */}
        <Header title="로그인" showBackButton={true} />

        {/* 컨테이너 높이 설정 */}
        <div className="container mx-auto flex min-h-[calc(80vh-64px)] flex-col items-center justify-center px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-indigo-800">
              {typedWelcome}
              <span
                className={`inline-block ${typedWelcome.length < welcomeMessage.length ? 'animate-ping' : 'opacity-0'}`}>
                |
              </span>
            </h1>
            <p className="mt-2 text-gray-600">
              {typedGuide}
              <span
                className={`inline-block ${typedGuide.length < guideMessage.length ? 'animate-ping' : 'opacity-0'}`}>
                |
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                {error}
              </motion.div>
            )}

            <div className="flex w-full flex-col items-center space-y-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGoogleLogin}
                className="flex h-[45px] w-full max-w-xs items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-4 text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-70"
                disabled={loading}
                type="button">
                {loading ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></span>
                    <span>로그인 중...</span>
                  </span>
                ) : (
                  <div className="flex items-center">
                    <Image src="/google_logo.svg" alt="Google login button" width={24} height={24} className="mr-4" />
                    <span className="text-base font-medium">Google 계정으로 로그인</span>
                  </div>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleKakaoLogin}
                className="flex h-full w-full max-w-xs transform items-center justify-center rounded-xl transition-all hover:shadow-md focus:outline-none"
                disabled={loading}
                type="button">
                {loading ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-yellow-400"></span>
                    <span>로그인 중...</span>
                  </span>
                ) : (
                  <Image
                    src="/kakao_login_large_wide.png"
                    alt="Kakao login button"
                    width={350}
                    height={10}
                    className="items-center justify-center rounded-xl"
                  />
                )}
              </motion.button>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-3 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>

            {/* 이전으로 돌아가기 버튼 추가 */}
            <div className="flex items-center justify-center pt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={goBack}
                className="flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-indigo-100 px-6 py-3 text-sm font-semibold text-indigo-800 shadow-md transition-all hover:bg-indigo-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <FaChevronLeft className="h-4 w-4" />
                이전으로 돌아가기
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
