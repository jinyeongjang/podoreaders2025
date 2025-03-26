import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { pretendard } from '../lib/fonts';
import FamilyAccessLoginForm from '../components/family-management/FamilyAccessLoginForm';
import { supabase } from '../lib/supabase';

export default function FamilyAccessPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 상태 확인 및 리디렉션 처리
  useEffect(() => {
    // 항상 인증 상태를 초기화하여 로그인 페이지로 나타나게
    localStorage.removeItem('familyAuthorized');
  }, [router.query]);

  // 기존 비밀번호 확인 방식을 Supabase DB에서 비밀번호 확인으로 변경
  const handleAuthorize = async (password: string) => {
    setIsLoading(true);
    setLoginError('');

    // 보안 강화를 위한 지연 효과
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // Supabase에서 비밀번호 설정 가져오기
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'family_access_password')
        .single();

      if (error) {
        throw new Error('비밀번호 확인 중 오류가 발생했습니다.');
      }

      if (!data) {
        throw new Error('비밀번호 설정을 찾을 수 없습니다.');
      }

      // DB에서 가져온 비밀번호와 비교
      if (password === data.value) {
        // 인증 성공
        localStorage.setItem('familyAuthorized', 'true');
        localStorage.setItem('familyLastLogin', new Date().toISOString());
        setLoginAttempts(0);
        // 로그인 성공 시 FamilyAccessLoginForm -> familyManagement로 리디렉션
      } else {
        // 인증 실패
        const attempts = loginAttempts + 1;
        setLoginAttempts(attempts);

        if (attempts >= 5) {
          setLoginError('로그인 시도 횟수를 초과했어요. 잠시 후 다시 시도해주세요.');
          // 5회 실패 시 30초 동안 잠금
          setTimeout(() => {
            setLoginAttempts(0);
          }, 30000);
        } else {
          setLoginError(`비밀번호가 일치하지 않습니다. (${attempts}/5회 시도)`);
        }
      }
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : '인증 중 오류가 발생했어요.');
      console.error('인증 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 via-slate-50 to-white ${pretendard.className}`}>
      <Header title="가족원 관리" showBackButton={true} />

      <main className="container mx-auto px-4 py-5">
        <FamilyAccessLoginForm
          onLogin={handleAuthorize}
          isLoading={isLoading}
          loginAttempts={loginAttempts}
          loginError={loginError}
        />
      </main>
    </div>
  );
}
