import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaUserCog, FaEye, FaEyeSlash } from 'react-icons/fa';

interface FamilyAccessFormProps {
  onLogin: (password: string) => Promise<void>;
  isLoading: boolean;
  loginAttempts: number;
  loginError: string;
}

const FamilyAccessForm = ({ onLogin, isLoading, loginAttempts, loginError }: FamilyAccessFormProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Enter키 누를 때 로그인 시도, 로그인 시도 횟수 5번까지
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && loginAttempts < 5) {
      handleSubmit();
    }
  };

  // 로그인 버튼 클릭 핸들러
  const handleSubmit = () => {
    if (!password.trim()) {
      return;
    }
    onLogin(password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-md">
      <div className="overflow-hidden rounded-2xl bg-white tracking-tighter shadow-2xl">
        {/* 로그인 헤더 영역 */}
        <div className="relative bg-gradient-to-r from-yellow-500 to-amber-600 px-8 py-8 text-center text-white xs:py-5">
          <div className="mx-auto mb-8 flex h-12 w-24 items-center justify-center">
            <FaUserCog className="h-12 w-12 text-white" />
          </div>
          <h2 className="relative text-2xl font-bold">[가족장 권한] 가족원 관리</h2>
          <p className="relative mt-2 text-amber-100">계속하려면 가족장 권한을 인증하세요.</p>
        </div>

        <div className="p-5">
          <div className="space-y-6">
            {/* 로그인 상태 정보 */}
            <div className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-4 text-sm">
              <div className="flex items-center gap-2">
                <div>
                  <p className="font-medium text-amber-800">가족장 전용 관리 시스템</p>
                  <p className="text-amber-600">가족원 데이터 열람 및 관리 기능</p>
                </div>
              </div>
              <FaLock className="h-6 w-6 text-amber-400" />
            </div>
            <p className="text-[15px] text-amber-700">관리자로부터 발급받은 비밀번호를 입력해주세요.</p>

            {/* 비밀번호 입력 필드 */}
            <div>
              <label htmlFor="family-password" className="mb-2 block text-sm font-medium text-gray-700">
                가족장 비밀번호
              </label>
              <div className={`relative rounded-lg ${isFocused ? 'ring-1 ring-amber-500' : ''}`}>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <motion.div
                    animate={{ rotate: isLoading ? 0 : 0 }}
                    transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: 'linear' }}>
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
                  disabled={isLoading || loginAttempts >= 5}
                  placeholder="가족장 비밀번호를 입력하세요"
                  className={`w-full rounded-lg border ${
                    isFocused ? 'border-amber-500 bg-amber-50/30' : 'border-gray-300 bg-gray-50'
                  } p-4 pl-10 pr-12 text-gray-900 transition-colors duration-200 hover:border-amber-500 focus:outline-none active:border-amber-500 disabled:bg-gray-100 disabled:text-gray-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  disabled={isLoading}>
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
              disabled={isLoading || loginAttempts >= 5}
              className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4 text-center font-medium text-white shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-95 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400">
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
                <span>가족원 관리 페이지 접속</span>
              )}
            </button>

            <div className="flex items-center justify-center space-x-1 text-center text-sm text-gray-500">
              <p>
                가족장 비밀번호가 기억나지 않으시면 <br />
                관리자에게 문의하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FamilyAccessForm;
