import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

interface LoginAttemptCounterProps {
  attempts: number;
  maxAttempts: number;
}

const LoginAttemptCounter = ({ attempts, maxAttempts }: LoginAttemptCounterProps) => {
  // 시도 횟수에 따른 색상
  const getAttemptStatusColor = () => {
    if (attempts === 1) return 'text-yellow-500';
    if (attempts === 2) return 'text-yellow-600';
    if (attempts === 3) return 'text-orange-500';
    if (attempts >= 4) return 'text-red-500';
    return 'text-gray-400';
  };

  // 프로그레스 바 색상
  const getProgressBarColor = () => {
    if (attempts >= 4) return 'animate-pulse bg-red-500';
    if (attempts >= 3) return 'bg-orange-500';
    if (attempts >= 2) return 'bg-yellow-500';
    return 'bg-yellow-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between rounded-lg bg-yellow-50 px-4 py-3">
      <div className="flex items-center gap-2">
        <FaExclamationTriangle className={`h-5 w-5 ${getAttemptStatusColor()}`} />
        <p className={`text-sm font-medium ${getAttemptStatusColor()}`}>
          로그인 시도: {attempts}회 / {maxAttempts}회
        </p>
      </div>
      <div className="flex w-24 overflow-hidden rounded-full bg-gray-200">
        <div className={`h-2 ${getProgressBarColor()}`} style={{ width: `${(attempts / maxAttempts) * 100}%` }} />
      </div>
    </motion.div>
  );
};

export default LoginAttemptCounter;
