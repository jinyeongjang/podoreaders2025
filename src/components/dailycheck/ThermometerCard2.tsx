import { motion } from 'framer-motion';
import { FaMedal, FaCrown, FaAward } from 'react-icons/fa';
import NumberFlow from '@number-flow/react';
import { useState, useEffect } from 'react';

interface ThermometerCard2Props {
  userName?: string;
  value: number;
  unit?: string;
  rank?: number;
}

const ThermometerCard2 = ({ userName, value, unit = '°C', rank }: ThermometerCard2Props) => {
  // 애니메이션 상태 추가
  const [isAnimating, setIsAnimating] = useState(false);
  const [showValue, setShowValue] = useState(false);

  // 컴포넌트 마운트 시 순차적으로 애니메이션 적용
  useEffect(() => {
    // 순위에 따른 지연 시간 설정 - 순위가 높은순서대로 먼저 나타나기
    const delay = rank ? Math.min(rank * 100, 5000) : 100;

    // 처음에는 숫자를 보여주지 않음
    const timer1 = setTimeout(() => {
      setIsAnimating(true); // 먼저 컨테이너 애니메이션 시작
    }, delay);

    // 컨테이너 애니메이션 후 숫자 표시 애니메이션 시작
    const timer2 = setTimeout(() => {
      setShowValue(true); // 숫자 표시 애니메이션 시작
    }, delay + 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [rank]);

  // 순위에 따른 스타일 결정
  const getRankStyle = (rank?: number) => {
    if (!rank) return { bgColor: 'bg-gray-200', textColor: 'text-gray-600', icon: null };

    switch (rank) {
      case 1:
        return {
          bgColor: 'bg-gradient-to-r from-yellow-400 to-amber-500',
          textColor: 'text-white',
          icon: <FaCrown className="h-4 w-4 text-white" />,
        };
      case 2:
        return {
          bgColor: 'bg-gradient-to-r from-gray-300 to-gray-400',
          textColor: 'text-white',
          icon: <FaMedal className="h-4 w-4 text-white" />,
        };
      case 3:
        return {
          bgColor: 'bg-gradient-to-r from-amber-500 to-amber-600',
          textColor: 'text-white',
          icon: <FaMedal className="h-4 w-4 text-white" />,
        };
      default:
        return {
          bgColor: rank <= 5 ? 'bg-indigo-100' : 'bg-gray-100',
          textColor: rank <= 5 ? 'text-indigo-600' : 'text-gray-600',
          icon: rank <= 5 ? <FaAward className="h-3.5 w-3.5 text-indigo-500" /> : null,
        };
    }
  };

  const rankStyle = getRankStyle(rank);

  // 온도에 따른 색상 계산
  const getTemperatureColor = (temp: number) => {
    if (temp >= 80) return 'from-red-500 to-red-600';
    if (temp >= 60) return 'from-orange-500 to-amber-500';
    if (temp >= 40) return 'from-yellow-500 to-amber-400';
    if (temp >= 20) return 'from-green-500 to-emerald-400';
    return 'from-blue-500 to-indigo-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isAnimating ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
      transition={{
        duration: 0.7,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      className="relative overflow-hidden rounded-xl bg-white p-3 shadow-md transition-all duration-300 xs:p-1.5 xs:shadow-sm">
      <div className="relative z-10">
        {/* 순위와 이름 영역 */}
        <div className="mb-2 flex items-center justify-between xs:mb-1">
          {userName && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={isAnimating ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[15px] font-bold tracking-tight text-gray-700 xs:max-w-[110px] xs:text-[12px]">
              {userName}
            </motion.span>
          )}

          {rank && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isAnimating ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 500 }}
              className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1 xs:gap-0.5 xs:px-1.5 xs:py-0.5 ${rankStyle.bgColor} ${rankStyle.textColor}`}>
              <span className="xs:hidden">{rankStyle.icon}</span>
              <span className="text-xs font-semibold xs:text-[10px]">{rank}위</span>
            </motion.div>
          )}
        </div>

        {/* 온도계 */}
        <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-gray-100 xs:mt-0.5 xs:h-2">
          <motion.div
            initial={{ width: '0%' }}
            animate={isAnimating ? { width: `${Math.min(value, 100)}%` } : { width: '0%' }}
            transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${getTemperatureColor(value)}`}
          />
        </div>

        {/* 온도 표시 영역 */}
        <div className="mt-2 flex items-center justify-center xs:mt-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={showValue ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center">
            <span className="text-2xl font-bold tracking-tight text-indigo-600 xs:text-lg">
              {showValue ? <NumberFlow value={parseFloat(value.toFixed(1))} /> : '0.0'}
              <span className="ml-0.5 text-sm font-medium text-indigo-400 xs:ml-0 xs:text-[10px]">{unit}</span>
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThermometerCard2;
