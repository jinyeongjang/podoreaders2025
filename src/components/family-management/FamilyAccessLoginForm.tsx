import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaUserCog, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/router';
import BookOpenModal from './BookOpenModal';

interface FamilyAccessLoginFormProps {
  onLogin: (password: string) => Promise<void>;
  isLoading: boolean;
  loginAttempts: number;
  loginError: string;
}

const FamilyAccessLoginForm = ({ onLogin, isLoading, loginAttempts, loginError }: FamilyAccessLoginFormProps) => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  // Enter키 누를 때 로그인 시도
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && loginAttempts < 5) {
      handleSubmit();
    }
  };

  // 로그인 버튼 클릭 핸들러 수정
  const handleSubmit = async () => {
    if (!password.trim() || isLoading || loginAttempts >= 5) {
      return;
    }

    try {
      // 가족장 비밀번호가 맞는지 확인
      if (password === '2025') {
        setSuccess(true);
        setShowBookModal(true); // 책 펼침 모달 표시

        // 성공 애니메이션을 위한 약간의 지연 후 로그인 처리
        setTimeout(async () => {
          await onLogin(password);

          // 로그인 성공 후 familyManagement 페이지로 리디렉션
          setTimeout(() => {
            router.push('/familyManagement');
          }, 2000); // 책 애니메이션을 보여주기 위해 지연시간 증가
        }, 1000);
      } else {
        await onLogin(password);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-md">
      {/* 분리된 책 펼쳐지는 모달 컴포넌트 사용 */}
      <BookOpenModal isOpen={showBookModal} />

      <div className="overflow-hidden rounded-2xl bg-white tracking-tighter shadow-2xl">
        {/* 로그인 헤더 영역 */}
        <div className="relative bg-gradient-to-r from-amber-500 to-amber-700 px-8 py-8 text-center text-white xs:py-5">
          <div className="mx-auto mb-8 flex h-12 w-24 items-center justify-center">
            <FaUserCog className="h-12 w-12 text-white" />
          </div>
          <h2 className="relative text-2xl font-bold">[가족장 권한] 가족원 관리</h2>
          <p className="relative mt-2 text-amber-100">계속하려면 가족장.부가족장 권한을 인증하세요.</p>
        </div>

        <div className="p-5">
          <div className="space-y-6">
            {/* 로그인 상태 정보 */}
            <div className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-4 text-sm">
              <div className="flex items-center gap-2">
                <div>
                  <p className="font-medium text-amber-800">가족장.부가족장 전용 시스템</p>
                  <p className="text-amber-700">안전하게 보호중입니다.</p>
                </div>
              </div>
              <FaLock className="h-5 w-5 text-amber-600" />
            </div>

            {!showBookModal && (
              <>
                <p className="text-[15px] text-amber-700">
                  잘못된 비밀번호로 로그인을 5번이상 시도할 경우<br></br>일시적으로 사용이 제한됩니다.
                </p>
                {/* 비밀번호 입력 필드 */}
                <div>
                  <label htmlFor="family-password" className="mb-2 block text-sm font-medium text-gray-700">
                    가족장 비밀번호
                  </label>
                  <div className={`relative rounded-lg ${isFocused ? 'ring-1 ring-amber-500' : ''}`}>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <motion.div transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: 'linear' }}>
                        <FaLock
                          className={`h-5 w-5 ${isFocused ? 'text-amber-500' : isLoading ? 'text-amber-400' : 'text-gray-400'}`}
                        />
                      </motion.div>
                    </div>
                    <input
                      id="family-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      disabled={isLoading || loginAttempts >= 5 || success}
                      placeholder="가족장 비밀번호를 입력하세요"
                      className={`w-full rounded-lg border ${
                        isFocused ? 'border-amber-500 bg-amber-50/30' : 'border-gray-300 bg-gray-50'
                      } p-4 pl-10 pr-12 text-gray-900 transition-colors duration-200 hover:border-amber-500 focus:outline-none active:border-amber-500 disabled:bg-gray-100 disabled:text-gray-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      tabIndex={-1}
                      disabled={isLoading || success}>
                      {showPassword ? (
                        <FaEyeSlash className={`h-5 w-5 ${isFocused ? 'text-amber-400' : 'text-gray-400'}`} />
                      ) : (
                        <FaEye className={`h-5 w-5 ${isFocused ? 'text-amber-400' : 'text-gray-400'}`} />
                      )}
                    </button>
                  </div>

                  {/* 오류 메시지 */}
                  <AnimatePresence>
                    {loginError && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 text-sm text-red-500">
                        {loginError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* 로그인 버튼 */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || loginAttempts >= 5 || success}
                  className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 text-center font-medium text-white shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-95 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400">
                  {isLoading ? (
                    <>
                      <span className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="mr-2 h-5 w-5 rounded-full border-2 border-t-2 border-white border-t-transparent"
                        />
                        인증 중...
                      </span>
                      <span className="opacity-0">접속하기</span>
                    </>
                  ) : (
                    <span>로그인</span>
                  )}
                </button>
              </>
            )}

            {!showBookModal && (
              <div className="text-center text-sm text-gray-500">
                <p>관리자로부터 발급받은 비밀번호를 사용하세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FamilyAccessLoginForm;
