import { motion } from 'framer-motion';
import { getTemperatureColor } from '../../utils/temperatureUtils';

interface ProgressBarProps {
  temperature: number;
}

export default function ProgressBar({ temperature }: ProgressBarProps) {
  const progressPercent = Math.min(temperature, 100);
  const tempStyle = getTemperatureColor(temperature);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-semibold text-gray-800">말씀 온도 진행도</h3>
        <div className="text-sm font-medium text-indigo-600">{Math.round(progressPercent)}%</div>
      </div>

      <div className="mb-2 h-5 overflow-hidden rounded-full bg-gray-100 shadow-xl">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${tempStyle.color}`}
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}>
          {progressPercent > 15 && (
            <div className="flex h-full items-center justify-end bg-slate-400 px-2">
              <span className="text-xs font-semibold text-white">{Math.round(progressPercent)}%</span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="flex justify-between px-1 text-xs text-gray-600">
        <span>0°C</span>
        <span>25°C</span>
        <span>50°C</span>
        <span>75°C</span>
        <span>100°C</span>
      </div>

      {/* 상태별 메시지 */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {temperature === 0 && <p>말씀을 읽고 온도를 기록해보세요!</p>}
        {temperature > 0 && temperature < 25 && <p>첫 걸음을 내딛었어요. 차근차근 말씀 읽기를 이어가볼까요</p>}
        {temperature >= 25 && temperature < 50 && <p>꾸준히 말씀을 읽고 계시네요. 이대로만 계속하세요!</p>}
        {temperature >= 50 && temperature < 75 && <p>너무 뜨거워요 성령의 불타고 있어요!</p>}
        {temperature >= 75 && temperature < 100 && <p>너무 뜨거워요 성령의 불타고 있어요!</p>}
        {temperature >= 100 && <p>100°C 달성! 말씀의 열기로 가득한 삶을 살아가세요!</p>}
      </div>
    </div>
  );
}
