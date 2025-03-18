import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHourglassHalf } from 'react-icons/fa';

interface LockoutDisplayProps {
  remainingTime: number;
}

const LockoutDisplay = ({ remainingTime }: LockoutDisplayProps) => {
  const [timeDisplay, setTimeDisplay] = useState('');

  // 시간 표시 형식 업데이트
  useEffect(() => {
    if (remainingTime > 0) {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      setTimeDisplay(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    } else {
      setTimeDisplay('0:00');
    }
  }, [remainingTime]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-2xl bg-red-50 px-4 py-4 text-center">
      <div className="flex items-center justify-center gap-2 text-xl font-bold text-red-600">
        <FaHourglassHalf className="h-6 w-6 animate-pulse" />
        <span>일시적으로 로그인이 제한되었습니다</span>
      </div>
      <p className="mt-2 text-sm text-red-500">남은 시간: {timeDisplay}</p>

      {/* 진행 표시줄 */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-red-200">
        <motion.div
          className="h-full bg-red-500"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: remainingTime, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
};

export default LockoutDisplay;
