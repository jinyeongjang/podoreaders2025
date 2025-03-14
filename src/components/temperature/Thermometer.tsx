import { motion } from 'framer-motion';
import { getTemperatureColor } from '../../utils/temperatureUtils';

interface ThermometerProps {
  temperature: number;
}

export default function Thermometer({ temperature }: ThermometerProps) {
  const progressPercent = Math.min(temperature, 100);
  const tempStyle = getTemperatureColor(temperature);

  return (
    <div className="relative h-64 w-24">
      {/* 온도계 외관 */}
      <div className="absolute inset-0 rounded-full bg-gray-50 shadow-inner"></div>
      <div className="absolute bottom-0 left-1/2 h-3/4 w-2 -translate-x-1/2 rounded-t-full bg-gray-200"></div>
      <div className="absolute bottom-0 left-1/2 h-16 w-10 -translate-x-1/2 rounded-full bg-gray-200 shadow-inner"></div>

      {/* 눈금 표시 */}
      {[0, 25, 50, 75, 100].map((mark) => (
        <div
          key={mark}
          className="absolute left-1/2 flex w-full -translate-x-1/2 items-center"
          style={{ bottom: `${mark * 0.75}%` }}>
          <div className="h-px w-2 bg-gray-300"></div>
          <span className="pl-3 text-xs text-gray-500">{mark}°C</span>
        </div>
      ))}

      {/* 온도 측정부 */}
      <div className="absolute bottom-0 left-1/2 h-3/4 w-2 -translate-x-1/2 overflow-hidden rounded-t-full">
        <motion.div
          className={`absolute bottom-0 w-full bg-gradient-to-t ${tempStyle.color}`}
          initial={{ height: '0%' }}
          animate={{ height: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}></motion.div>
      </div>

      {/* 온도계 구체 */}
      <div className="absolute bottom-0 left-1/2 h-16 w-10 -translate-x-1/2 overflow-hidden rounded-full">
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${tempStyle.color}`}
          animate={{
            background:
              temperature >= 100
                ? ['linear-gradient(to right, #f87171, #ef4444)', 'linear-gradient(to right, #ef4444, #dc2626)']
                : undefined,
          }}
          transition={{
            duration: 1,
            repeat: temperature >= 100 ? Infinity : 0,
            repeatType: 'reverse',
          }}></motion.div>
      </div>

      {/* 현재 온도 표시 */}
      <motion.div
        className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[40px] shadow-lg"
        key={temperature}
        initial={{ scale: 0.8, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
        <span className="font-bold text-gray-800">{temperature.toFixed(1)}°C</span>
      </motion.div>

      {/* 온도 상태 표시 */}
      {temperature > 0 && (
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-xs font-medium text-white shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}>
          {tempStyle.text}
        </motion.div>
      )}
    </div>
  );
}
