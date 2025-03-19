import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { pretendard } from '../lib/fonts';
import FamilyAccessLoginForm from '../components/family-management/FamilyAccessLoginForm';

export default function FamilyAccessPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 상태 확인 및 리디렉션 처리
  useEffect(() => {
    // 항상 인증 상태를 초기화하여 로그인 페이지를 보여줌
    localStorage.removeItem('familyAuthorized');
  }, [router.query]);

  // 로그인 처리 함수
  const handleAuthorize = async (password: string) => {
    setIsLoading(true);
    setLoginError('');

    // 보안 강화를 위한 지연 효과
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 추후 DB에서 비밀번호 확인 후 인증되도록 수정 예정
    try {
      if (password === '2025') {
        // 인증 성공
        localStorage.setItem('familyAuthorized', 'true');
        localStorage.setItem('familyLastLogin', new Date().toISOString());
        setLoginAttempts(0);
        // 성공 시 FamilyAccessLoginForm 내부에서 /familyManagement로 리디렉션
      } else {
        // 인증 실패
        const attempts = loginAttempts + 1;
        setLoginAttempts(attempts);

        if (attempts >= 5) {
          setLoginError('로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.');
          // 5회 실패 시 30초 동안 잠금
          setTimeout(() => {
            setLoginAttempts(0);
          }, 30000);
        } else {
          setLoginError(`비밀번호가 일치하지 않습니다. (${attempts}/5회 시도)`);
        }
      }
    } catch (err) {
      setLoginError('인증 중 오류가 발생했습니다.');
      console.error('Auth error:', err);
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
