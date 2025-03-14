import { motion } from 'framer-motion';
import NumberFlow from '@number-flow/react';

interface ThermometerCardProps {
  title: string;
  value: number;
  unit: string;
}

const ThermometerCard = ({ title, value, unit }: ThermometerCardProps) => {
  return (
    <motion.div className="relative w-full overflow-hidden rounded-2xl bg-white p-6 text-gray-800 shadow-lg xs:p-4">
      <div className="flex w-full flex-col gap-2">
        {/* 상단 제목 */}
        <div className="flex items-center gap-2">
          <p className="text-base font-medium text-gray-800 xs:text-sm">{title}</p>
        </div>

        {/* 가로 온도계 */}
        <div className="relative flex items-center">
          <div className="relative h-8 w-full xs:h-6">
            {/* 온도계 배경 */}
            <div className="absolute h-full w-full rounded-full bg-gray-100"></div>
            {/* 온도계 수치 표시 */}
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min((value / 1000) * 100, 100)}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute h-full rounded-full bg-indigo-500"
            />
          </div>

          {/* 눈금 */}
          <div className="absolute flex w-full justify-between px-2">
            <span className="text-xs font-medium text-gray-400 xs:text-[10px]">0</span>
            <span className="text-xs font-medium text-gray-400 xs:text-[10px]">500</span>
            <span className="text-xs font-medium text-gray-400 xs:text-[10px]">1000</span>
          </div>
        </div>

        {/* 수치 표시 */}
        <div className="flex items-center justify-between">
          <div className="text-[42px] font-bold tracking-tight text-gray-800 xs:text-[22px]">
            <NumberFlow value={value} />
            <span className="ml-1 text-[25px] xs:text-[20px]">{unit}</span>
          </div>
          <div className="text-sm font-medium text-indigo-500 xs:text-xs">
            진행률: {Math.min(Math.round((value / 1000) * 100), 100)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThermometerCard;
