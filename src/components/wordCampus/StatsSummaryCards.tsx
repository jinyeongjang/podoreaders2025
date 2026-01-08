import { motion } from 'framer-motion';
import NumberFlow from '@number-flow/react';

interface StatsSummaryCardsProps {
  totalQt: number;
  totalBible: number;
  totalWriting: number;
  totalDawnPrayer: number;
}

export default function StatsSummaryCards({
  totalQt,
  totalBible,
  totalWriting,
  totalDawnPrayer,
}: StatsSummaryCardsProps) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-4 px-2 lg:grid-cols-4 xs:grid-cols-2">
      <motion.div
        animate={{
          background: ['linear-gradient(0deg, #10b981, #34d399)', 'linear-gradient(360deg, #10b981, #34d399)'],
        }}
        transition={{
          background: {
            repeat: Infinity,
            duration: 5,
            ease: 'linear',
          },
        }}
        className="rounded-3xl p-6 text-white shadow-lg">
        <p className="text-sm font-medium text-emerald-100">총 QT 횟수</p>
        <div className="mt-2 text-[45px] font-bold drop-shadow-xl">
          <NumberFlow value={totalQt} />
          <span className="text-[25px]">회</span>
        </div>
      </motion.div>

      <motion.div
        animate={{
          background: ['linear-gradient(0deg, #3b82f6, #60a5fa)', 'linear-gradient(360deg, #3b82f6, #60a5fa)'],
        }}
        transition={{
          background: {
            repeat: Infinity,
            duration: 5,
            ease: 'linear',
          },
        }}
        className="rounded-3xl p-6 text-white shadow-lg">
        <p className="text-sm font-medium text-blue-100">총 말씀 읽기</p>
        <div className="mt-2 text-[45px] font-bold drop-shadow-xl">
          <NumberFlow value={totalBible} />
          <span className="text-[25px]">장</span>
        </div>
      </motion.div>

      <motion.div
        animate={{
          background: ['linear-gradient(0deg, #8b5cf6, #a78bfa)', 'linear-gradient(360deg, #8b5cf6, #a78bfa)'],
        }}
        transition={{
          background: {
            repeat: Infinity,
            duration: 5,
            ease: 'linear',
          },
        }}
        className="rounded-3xl p-6 text-white shadow-lg">
        <p className="text-sm font-medium text-purple-100">총 필사 횟수</p>
        <div className="mt-2 text-[45px] font-bold drop-shadow-xl">
          <NumberFlow value={totalWriting} />
          <span className="text-[25px]">회</span>
        </div>
      </motion.div>

      <motion.div
        animate={{
          background: ['linear-gradient(0deg, #f97316, #fb923c)', 'linear-gradient(360deg, #f97316, #fb923c)'],
        }}
        transition={{
          background: {
            repeat: Infinity,
            duration: 5,
            ease: 'linear',
          },
        }}
        className="rounded-3xl p-6 text-white shadow-lg">
        <p className="text-sm font-medium text-orange-100">총 새벽기도</p>
        <div className="mt-2 text-[45px] font-bold drop-shadow-xl">
          <NumberFlow value={totalDawnPrayer} />
          <span className="text-[25px]">회</span>
        </div>
      </motion.div>
    </div>
  );
}
