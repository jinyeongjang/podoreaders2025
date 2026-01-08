import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { useRouter } from 'next/router';
import CampusAttemptCounter from './login/CampusAttemptCounter';
import CampusLockoutDisplay from './login/CampusLockoutDisplay';
import CampusSuccessDisplay from './login/CampusSuccessDisplay';

interface CampusAccessLoginFormProps {
  onLogin: (password: string, campusId: string) => Promise<void>;
  isLoading: boolean;
  loginAttempts: number;
  loginError: string;
  selectedCampus: string;
  campusName: string;
  lockoutTime?: number;
  isLockedOut?: boolean;
  remainingLockoutTime?: number;
  redirectPath?: string;
}

const CampusAccessLoginForm = ({
  onLogin,
  isLoading,
  loginAttempts,
  loginError,
  selectedCampus,
  campusName,
  isLockedOut = false,
  remainingLockoutTime = 0,
  redirectPath = '/', // 기본값으로 홈페이지 설정
}: CampusAccessLoginFormProps) => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [success, setSuccess] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [shake, setShake] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(true);

  // 저장된 비밀번호 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedCampus) {
      const savedPassword = localStorage.getItem(`campus_password_${selectedCampus}`);
      if (savedPassword) {
        setPassword(savedPassword);
        setRememberPassword(true);
      }
    }
  }, [selectedCampus]);

  // 윈도우 크기 업데이트
  useEffect(() => {
    // 클라이언트 사이드에서만 실행되도록 수정
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // 비밀번호가 틀렸을 때 호출될 함수
  useEffect(() => {
    if (loginError && !isLoading) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [loginError, isLoading]);

  // Enter키 누를 때 로그인 시도
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && !isLockedOut) {
      handleSubmit();
    }
  };

  // 로그인 버튼 클릭 핸들러
  const handleSubmit = async () => {
    if (!password.trim() || isLoading || isLockedOut) {
      return;
    }

    try {
      // 선택된 캠퍼스와 비밀번호 인증 요청
      await onLogin(password, selectedCampus);

      // onLogin 함수가 에러 없이 완료되었다면 인증 성공
      setSuccess(true);

      // 비밀번호 저장 여부 처리
      if (typeof window !== 'undefined') {
        if (rememberPassword) {
          localStorage.setItem(`campus_password_${selectedCampus}`, password);
        } else {
          localStorage.removeItem(`campus_password_${selectedCampus}`);
        }
      }

      // 리디렉션 경로 확인
      let targetPath = redirectPath;

      // 비밀번호에 따른 경로 설정
      if (selectedCampus === 'prayer') {
        if (password === '5678') {
          targetPath = '/campusSelect/prayerCampus02';
        } else if (password === '1234') {
          targetPath = '/campusSelect/prayerCampus01';
        }
      } else if (selectedCampus === 'word_minhwa') {
        if (password === '1234') {
          targetPath = '/campusSelect/wordCampus_minhwa';
        }
      } else if (selectedCampus === 'word_uiwan') {
        if (password === '5678') {
          targetPath = '/campusSelect/wordCampus_uiwan';
        }
      } else if (selectedCampus === 'word') {
        // 레거시 호환성
        if (password === '1234') {
          targetPath = '/campusSelect/wordCampus_minhwa';
        }
      }

      console.log('로그인 성공. 리디렉션 경로:', targetPath);

      // 성공 애니메이션을 위한 약간의 지연 후 리디렉션
      setTimeout(() => {
        router.push(targetPath);
      }, 1500);
    } catch (error) {
      console.error('Campus login error:', error);
    }
  };

  // 캠퍼스별 배경 그라데이션 색상 결정
  const getBgGradient = () => {
    switch (selectedCampus) {
      case 'prayer':
        return 'from-indigo-500 to-blue-500';
      case 'word':
      case 'word_minhwa':
      case 'word_uiwan':
        return 'from-emerald-500 to-teal-500';
      case 'test':
        return 'from-purple-500 to-violet-600';
      default:
        return 'from-amber-500 to-amber-700';
    }
  };

  // 캠퍼스별 텍스트 색상 결정
  const getTextColor = () => {
    switch (selectedCampus) {
      case 'prayer':
        return 'text-indigo-100';
      case 'word':
      case 'word_minhwa':
      case 'word_uiwan':
        return 'text-emerald-100';
      case 'test':
        return 'text-purple-100';
      default:
        return 'text-amber-100';
    }
  };

  // 캠퍼스별 강조 색상 결정
  const getAccentColor = () => {
    switch (selectedCampus) {
      case 'prayer':
        return 'text-indigo-500';
      case 'word':
      case 'word_minhwa':
      case 'word_uiwan':
        return 'text-emerald-500';
      case 'test':
        return 'text-purple-500';
      default:
        return 'text-amber-500';
    }
  };

  // 캠퍼스별 배경 색상 결정
  const getBgAccentColor = () => {
    switch (selectedCampus) {
      case 'prayer':
        return 'bg-indigo-50';
      case 'word':
      case 'word_minhwa':
      case 'word_uiwan':
        return 'bg-emerald-50';
      case 'test':
        return 'bg-purple-50';
      default:
        return 'bg-amber-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-md">
      {/* 성공 시 Confetti 효과 */}
      {success && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          gravity={0.4}
          initialVelocityY={30}
          colors={['#4F46E5', '#6366F1', '#818CF8', '#E0E7FF']}
          numberOfPieces={200}
        />
      )}

      <div className="overflow-hidden rounded-2xl bg-white tracking-tighter shadow-2xl">
        {/* 로그인 헤더 영역 */}
        <div className={`relative bg-gradient-to-r ${getBgGradient()} px-8 py-8 text-center text-white xs:py-5`}>
          <div className="mx-auto mb-8 flex h-12 w-24 items-center justify-center"></div>
          <h2 className="relative text-2xl font-bold">{campusName} 캠퍼스 로그인</h2>
          <p className={`relative mt-2 ${getTextColor()}`}>캠퍼스 페이지로 접속하기 위해 인증해주세요.</p>
        </div>

        <div className="p-5">
          <div className="space-y-6">
            {/* 로그인 상태 정보 */}
            {success ? (
              <CampusSuccessDisplay campusName={campusName} />
            ) : isLockedOut ? (
              <CampusLockoutDisplay remainingTime={remainingLockoutTime} />
            ) : (
              <div className={`flex items-center justify-between rounded-lg ${getBgAccentColor()} px-4 py-4 text-sm`}>
                <div className="flex items-center gap-2">
                  <div>
                    <p className={`font-medium ${getAccentColor()}`}>캠퍼스 관리 시스템</p>
                    <p className={getAccentColor()}>안전하게 보호중입니다.</p>
                  </div>
                </div>
                <FaLock className={`h-5 w-5 ${getAccentColor()}`} />
              </div>
            )}

            {/* 로그인 시도 횟수 표시 */}
            {loginAttempts > 0 && !success && !isLockedOut && (
              <CampusAttemptCounter attempts={loginAttempts} maxAttempts={5} accentColor={getAccentColor()} />
            )}

            {!success && !isLockedOut && (
              <>
                <p className={`text-[15px] ${getAccentColor()}`}>
                  잘못된 비밀번호로 로그인을 5번이상 시도할 경우<br></br>일시적으로 사용이 제한됩니다.
                </p>

                {/* 비밀번호 입력 필드 */}
                <div>
                  <label htmlFor="campus-password" className="mb-2 block text-sm font-medium text-gray-700">
                    캠퍼스 접속 비밀번호
                  </label>
                  <motion.div
                    animate={shake ? { x: [-10, 10, -10, 10, -5, 5, -2, 2, 0] } : {}}
                    transition={shake ? { duration: 0.5 } : {}}
                    className={`relative rounded-lg ${isFocused ? `ring-1 ring-${selectedCampus === 'prayer' ? 'indigo' : selectedCampus === 'word' ? 'emerald' : selectedCampus === 'test' ? 'purple' : 'amber'}-500` : ''}`}>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <motion.div
                        animate={{ rotate: isLoading ? 0 : 0 }}
                        transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: 'linear' }}>
                        <FaLock
                          className={`h-5 w-5 ${isFocused ? getAccentColor() : isLoading ? getAccentColor() : 'text-gray-400'}`}
                        />
                      </motion.div>
                    </div>
                    <input
                      id="campus-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      disabled={isLoading || isLockedOut || success}
                      placeholder="캠퍼스 비밀번호를 입력하세요"
                      className={`w-full rounded-lg border ${
                        isFocused
                          ? `border-${selectedCampus === 'prayer' ? 'indigo' : selectedCampus === 'word' ? 'emerald' : selectedCampus === 'test' ? 'purple' : 'amber'}-500 ${getBgAccentColor()}/30`
                          : 'border-gray-300 bg-gray-50'
                      } p-4 pl-10 pr-12 text-gray-900 transition-colors duration-200 hover:border-${
                        selectedCampus === 'prayer'
                          ? 'indigo'
                          : selectedCampus === 'word'
                            ? 'emerald'
                            : selectedCampus === 'test'
                              ? 'purple'
                              : 'amber'
                      }-500 focus:outline-none active:border-${
                        selectedCampus === 'prayer'
                          ? 'indigo'
                          : selectedCampus === 'word'
                            ? 'emerald'
                            : selectedCampus === 'test'
                              ? 'purple'
                              : 'amber'
                      }-500 disabled:bg-gray-100 disabled:text-gray-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      tabIndex={-1}
                      disabled={isLoading || success}>
                      {showPassword ? (
                        <FaEyeSlash className={`h-5 w-5 ${isFocused ? getAccentColor() : 'text-gray-400'}`} />
                      ) : (
                        <FaEye className={`h-5 w-5 ${isFocused ? getAccentColor() : 'text-gray-400'}`} />
                      )}
                    </button>
                  </motion.div>

                  {/* 오류 메시지 */}
                  <AnimatePresence>
                    {loginError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className={`mt-2 rounded-md ${
                          loginAttempts >= 4 ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-800'
                        } p-2`}>
                        <div className="flex items-start">
                          <div
                            className={`mr-2 mt-0.5 h-5 w-5 ${loginAttempts >= 4 ? 'text-red-600' : 'text-amber-600'}`}>
                            {loginAttempts >= 4 ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <p className="text-sm font-medium">{loginError}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 비밀번호 저장 체크박스 */}
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3">
                  <label
                    htmlFor="remember-password"
                    className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 transition-all hover:bg-gray-50">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="remember-password"
                        checked={rememberPassword}
                        onChange={(e) => setRememberPassword(e.target.checked)}
                        className="peer sr-only"
                        disabled={isLoading || success}
                      />
                      <motion.div
                        className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                          rememberPassword
                            ? `border-${selectedCampus === 'prayer' ? 'indigo' : selectedCampus === 'word' || selectedCampus === 'word_minhwa' || selectedCampus === 'word_uiwan' ? 'emerald' : selectedCampus === 'test' ? 'purple' : 'amber'}-500 bg-gradient-to-br ${getBgGradient()}`
                            : 'border-gray-300 bg-white group-hover:border-gray-400'
                        }`}
                        whileTap={{ scale: 0.9 }}>
                        <AnimatePresence>
                          {rememberPassword && (
                            <motion.svg
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className="h-3.5 w-3.5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </motion.svg>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                    <span className="select-none text-sm font-medium text-gray-700 transition-colors group-hover:text-gray-900">
                      비밀번호 저장
                    </span>
                  </label>
                </motion.div>

                {/* 로그인 버튼 */}
                <CampusLoginButton
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  isDisabled={isLoading || isLockedOut || success}
                  attempts={loginAttempts}
                  campusId={selectedCampus}
                />
              </>
            )}

            {isLockedOut && (
              <div className="flex justify-center">
                <button
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100"
                  onClick={() => router.push('/')}>
                  메인으로 돌아가기
                </button>
              </div>
            )}

            <div className="text-center text-sm text-gray-500">
              <p>
                {success
                  ? '인증중입니다 잠시기다려주세요.'
                  : isLockedOut
                    ? '로그인 시도 횟수를 초과했습니다.'
                    : '관리자로부터 발급받은 비밀번호를 사용하세요.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 로그인 버튼 컴포넌트
interface CampusLoginButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  attempts: number;
  campusId: string;
}

const CampusLoginButton = ({ onClick, isLoading, isDisabled, attempts, campusId }: CampusLoginButtonProps) => {
  // 캠퍼스 및 시도 횟수에 따라 버튼 색상 변경
  const getButtonGradient = () => {
    if (attempts >= 4) return 'from-red-500 to-red-600';

    switch (campusId) {
      case 'prayer':
        return 'from-indigo-500 to-blue-600';
      case 'word':
        return 'from-indigo-500 to-violet-600';
      default:
        return attempts >= 2 ? 'from-amber-600 to-amber-700' : 'from-amber-500 to-amber-600';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`relative w-full overflow-hidden rounded-lg bg-gradient-to-r ${getButtonGradient()} px-6 py-4 text-center font-medium text-white shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-${
        campusId === 'prayer' ? 'indigo' : campusId === 'word' ? 'emerald' : campusId === 'test' ? 'purple' : 'amber'
      }-500 disabled:opacity-50`}>
      {isLoading ? (
        <svg
          className="mx-auto h-5 w-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      ) : (
        '로그인'
      )}
    </button>
  );
};

export default CampusAccessLoginForm;
