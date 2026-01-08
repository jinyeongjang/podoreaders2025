import { useState } from 'react';

// 비밀번호별 리디렉션 경로 매핑
const passwordRedirects: Record<string, Record<string, string>> = {
  prayer: {
    '1234': '/campusSelect/prayerCampus01', // prayer 캠퍼스 + 비밀번호 1234 => prayer01 페이지
    '5678': '/campusSelect/prayerCampus02', // prayer 캠퍼스 + 비밀번호 5678 => prayer02 페이지
    default: '/campusSelect/prayerCampus01', // 기본값도 prayer01으로 설정
  },
  word_minhwa: {
    '1234': '/campusSelect/wordCampus_minhwa', // word_minhwa 캠퍼스 + 비밀번호 1234 => 민화 가족장
    default: '/campusSelect/wordCampus_minhwa', // 기본값도 민화 가족장으로 설정
  },
  word_uiwan: {
    '5678': '/campusSelect/wordCampus_uiwan', // word_uiwan 캠퍼스 + 비밀번호 5678 => 의완 가족장
    default: '/campusSelect/wordCampus_uiwan', // 기본값도 의완 가족장으로 설정
  },
  // 이전 버전과의 호환성 유지
  word: {
    '1234': '/campusSelect/wordCampus_minhwa',
    '5678': '/campusSelect/wordCampus02',
    default: '/campusSelect/wordCampus_minhwa',
  },
  test: {
    '1234': '/test01',
    '5678': '/test02',
    default: '/test',
  },
  default: {
    default: '/',
  },
};

export function useCampusLogin(selectedCampus: string | null) {
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [remainingLockoutTime, setRemainingLockoutTime] = useState<number>(0);
  const [redirectPath, setRedirectPath] = useState<string>('/');

  // 비밀번호로 리디렉션 경로 결정
  const getRedirectPathByPassword = (campusId: string, password: string): string => {
    const campusRedirects = passwordRedirects[campusId] || passwordRedirects['default'];
    return campusRedirects[password] || campusRedirects['default'];
  };

  // 캠퍼스 로그인 처리
  const handleCampusLogin = async (password: string, campusId: string) => {
    setIsLoading(true);
    setLoginError('');

    // 보안 강화를 위한 지연 효과
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // 비밀번호 확인 및 리디렉션 경로 설정
      // 일반 비밀번호(1234, 5678) 처리
      if (password === '1234' || password === '5678') {
        const redirectTo = getRedirectPathByPassword(campusId, password);
        console.log(`로그인 성공 - 캠퍼스: ${campusId}, 비밀번호: ${password}, 리디렉션: ${redirectTo}`);
        setRedirectPath(redirectTo);
        handleLoginSuccess(campusId, password);
        return;
      }

      // 개발 단계에서는 위 로직 대신 간단한 검증만 수행
      handleLoginFailure();
    } catch (err) {
      console.error('Campus login error:', err);
      setLoginError(err instanceof Error ? err.message : '인증 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 성공 처리
  const handleLoginSuccess = (campusId: string, password: string) => {
    // 인증 성공
    localStorage.setItem('selectedCampus', campusId);
    localStorage.setItem('campusAuthorized', 'true');
    localStorage.setItem('campusLastLogin', new Date().toISOString());
    localStorage.setItem('lastPassword', password); // 마지막 비밀번호 저장

    setLoginAttempts(0);
  };

  // 로그인 실패 처리
  const handleLoginFailure = () => {
    // 인증 실패
    const attempts = loginAttempts + 1;
    setLoginAttempts(attempts);

    if (attempts >= 5) {
      setLoginError('로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.');
      setIsLockedOut(true);
      setRemainingLockoutTime(30); // 30초 동안 잠금

      // 로그인 실패 기록
      logLoginFailure(selectedCampus || 'unknown', '잠금 적용');

      // 30초 후 잠금 해제
      setTimeout(() => {
        setIsLockedOut(false);
        setLoginAttempts(0);
      }, 30000);
    } else {
      // 남은 시도 횟수 계산
      const remainingAttempts = 5 - attempts;

      // 시도 횟수에 따라 다른 메시지 표시
      if (remainingAttempts <= 1) {
        setLoginError(`비밀번호가 일치하지 않습니다. 마지막 시도 기회입니다. (${attempts}/5회 시도)`);
      } else {
        setLoginError(
          `비밀번호가 일치하지 않습니다. ${remainingAttempts}회 시도 기회가 남았습니다. (${attempts}/5회 시도)`,
        );
      }

      // 로그인 실패 기록
      logLoginFailure(selectedCampus || 'unknown', `${attempts}회 시도`);
    }
  };

  // 로그인 실패 로그 기록 함수
  const logLoginFailure = (campusId: string, reason: string) => {
    // 콘솔에 로그 기록
    console.warn(`로그인 실패: ${campusId} 캠퍼스, 사유: ${reason}, 시간: ${new Date().toISOString()}`);
  };

  return {
    loginAttempts,
    loginError,
    isLoading,
    isLockedOut,
    remainingLockoutTime,
    redirectPath,
    handleCampusLogin,
    handleLoginSuccess,
    handleLoginFailure,
    logLoginFailure,
  };
}
