import React from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import NumberFlow from '@number-flow/react';
import { motion } from 'framer-motion';
import { useCallback, useState, useEffect } from 'react';

interface CounterButtonProps {
  count: number;
  setCount: (value: number) => void;
  label: string;
  icon?: React.ReactNode;
  min?: number;
  max?: number;
}

const CounterButton: React.FC<CounterButtonProps> = ({ count, setCount, label, icon, min = 0, max = 999 }) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [progress, setProgress] = useState(0);

  // 카운트에 따라 프로세스 바 진행도 계산
  useEffect(() => {
    // 최대 프로세스 바 설정
    const maxGauge = 10;
    const percentage = Math.min(100, (count / maxGauge) * 100);
    setProgress(percentage);
  }, [count]);

  const handleIncrement = useCallback(() => {
    if (count < max) {
      setCount(count + 1);
    }
  }, [count, max, setCount]);

  const handleDecrement = useCallback(() => {
    if (count > min) {
      setCount(count - 1);
    }
  }, [count, min, setCount]);

  const handleDirectInput = () => {
    const num = parseInt(inputValue);
    if (!isNaN(num) && num >= min && num <= max) {
      setCount(num);
      setShowInput(false);
      setInputValue('');
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center bg-white py-4">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>

      <div className="mt-4 flex items-center gap-5 xs:gap-2">
        <div className="flex flex-col items-center gap-2">
          {showInput ? (
            <div className="flex flex-col items-center gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleDirectInput();
                  if (e.key === 'Escape') {
                    setShowInput(false);
                    setInputValue('');
                  }
                }}
                className="w-[80px] rounded-xl border border-gray-300 px-3 py-2 text-center text-2xl font-bold text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                min="0"
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleDirectInput}
                className="h-10 w-full rounded-xl bg-indigo-500 px-4 text-sm font-medium text-white hover:bg-indigo-600">
                확인
              </motion.button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div
                className="w-[100px] rounded-xl text-center text-[70px] font-bold text-gray-900 transition-all hover:scale-105 hover:bg-indigo-100 hover:shadow-xl active:scale-95 xs:w-[70px] xs:text-[50px]"
                onClick={() => setShowInput(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setShowInput(true);
                }}>
                <NumberFlow value={count} />
              </div>

              {/* 프로세스 바 - 물결 효과 추가 */}
              <div className="mt-1 h-3 w-full overflow-hidden rounded-2xl bg-gray-100">
                <motion.div
                  className="relative h-full rounded-2xl bg-gradient-to-r from-indigo-400 to-blue-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                  }}>
                  {/* 물결 효과 오버레이 - 전역 스타일 */}
                  <div className="wave-animation absolute inset-0 opacity-80" />
                </motion.div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleIncrement}
            className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-colors hover:bg-indigo-200 hover:shadow-xl active:bg-indigo-300"
            aria-label={`${label} 횟수 1 증가`}>
            <FaPlus size={15} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleDecrement}
            className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 hover:shadow-xl active:bg-gray-300"
            aria-label={`${label} 횟수 1 감소`}>
            <FaMinus size={15} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CounterButton;
