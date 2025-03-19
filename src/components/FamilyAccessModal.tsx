import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCog, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Confetti from 'react-confetti';

interface FamilyAccessModalProps {
  onConfirm: (password: string) => void;
  onClose: () => void;
}

const FamilyAccessModal: React.FC<FamilyAccessModalProps> = ({ onConfirm, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 초기 사이즈 설정
    handleResize();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError('');

    // 로딩 효과를 위한 지연 추가
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 추후 DB에서 비밀번호 확인 후 인증되도록 수정 예정
    if (password === '2025') {
      setSuccess(true);
      setError('');
      setTimeout(() => {
        onConfirm(password);
      }, 2000);
    } else {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      {/* Confetti 추가 */}
      {success && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          gravity={0.4}
          initialVelocityY={30}
          colors={['#6366f1', '#60a5fa', '#4ade80', '#f472b6']}
          numberOfPieces={200}
        />
      )}

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white tracking-tighter shadow-2xl">
        {/* 헤더 영역 */}
        <div className="relative bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-8 text-center text-white">
          <div className="mx-auto mb-8 flex h-12 w-24 items-center justify-center rounded-full">
            <FaUserCog className="h-12 w-12 text-white" />
          </div>
          <h2 className="relative text-2xl font-bold">[가족장 권한] 가족원 열람</h2>
          <p className="relative mt-2 text-amber-100">계속하려면 비밀번호를 입력하세요.</p>
        </div>

        <div className="p-5">
          <div className="space-y-6">
            {/* 상태 정보 */}
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-lg bg-green-50 p-4 text-center">
                <h3 className="text-xl font-bold text-indigo-600">가족장·부가족장님 환영해요! 👋</h3>
                <p className="mt-1 text-green-600">가족원 관리 페이지로 이동합니다...</p>
              </motion.div>
            ) : (
              <div className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-4 text-sm">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-medium text-amber-800">가족장.부가족장 전용 시스템</p>
                    <p className="text-amber-700">권한 확인이 필요합니다.</p>
                  </div>
                </div>
                <FaLock className="h-6 w-6 text-amber-500" />
              </div>
            )}

            {/* 비밀번호 입력 필드 */}
            <div>
              <label htmlFor="familyPassword" className="mb-2 block text-sm font-medium text-gray-700">
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
                  id="familyPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={isLoading || success}
                  maxLength={8}
                  placeholder="가족장 비밀번호를 입력하세요"
                  className={`w-full rounded-lg border ${
                    isFocused ? 'border-amber-500 bg-amber-50/30' : 'border-gray-300 bg-gray-50'
                  } p-4 pl-10 pr-12 text-gray-900 transition-colors duration-200 hover:border-amber-500 focus:outline-none active:border-amber-500 disabled:bg-gray-100 disabled:text-gray-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
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
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-red-500">
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading || success}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-3 text-center font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50">
                취소
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading || success}
                className="relative flex-1 overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-center font-medium text-white shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-95 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400">
                {isLoading ? (
                  <>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="mr-2 h-5 w-5 rounded-full border-2 border-t-2 border-white border-t-transparent"
                      />
                      확인 중...
                    </span>
                    <span className="opacity-0">확인</span>
                  </>
                ) : (
                  <span>확인</span>
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>관리자로부터 발급받은 비밀번호를 사용하세요.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FamilyAccessModal;
