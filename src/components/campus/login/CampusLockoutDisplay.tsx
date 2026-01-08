import { useState, useEffect } from 'react';
import { FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface CampusLockoutDisplayProps {
  remainingTime: number;
}

const CampusLockoutDisplay = ({ remainingTime }: CampusLockoutDisplayProps) => {
  const [secondsLeft, setSecondsLeft] = useState(remainingTime);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // 남은 시간을 분:초 형식으로 변환
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg bg-red-50 p-5 shadow">
      <div className="flex flex-col items-center text-center">
        <motion.div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}>
          <FaLock className="h-8 w-8 text-red-500" />
        </motion.div>

        <h3 className="mb-1 text-lg font-semibold text-red-800">계정이 일시적으로 잠겼습니다</h3>

        <p className="mb-4 text-red-600">
          비밀번호 입력 시도가 너무 많아 보안을 위해 일시적으로 로그인이 제한되었습니다.
        </p>

        {secondsLeft > 0 ? (
          <>
            <div className="mb-2 text-center">
              <span className="font-mono text-xl font-bold text-red-700">{formatTime(secondsLeft)}</span>
              <p className="text-sm text-red-600">후에 다시 시도할 수 있습니다</p>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-red-200">
              <motion.div
                className="h-full bg-red-500"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: remainingTime, ease: 'linear' }}
              />
            </div>
          </>
        ) : (
          <div className="mt-2">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600">
              이제 다시 로그인을 시도할 수 있습니다
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-3 rounded-md bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-200"
              onClick={() => window.location.reload()}>
              새로고침
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CampusLockoutDisplay;
