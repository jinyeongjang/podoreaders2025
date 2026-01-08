import { motion } from 'framer-motion';

interface ParkingSelectorProps {
  parking: 'easy' | 'difficult' | '';
  onParkingChange: (parking: 'easy' | 'difficult') => void;
}

export default function ParkingSelector({ parking, onParkingChange }: ParkingSelectorProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-bold text-gray-800">🅿️ 주차 정보</label>
      <motion.div
        className="grid grid-cols-2 gap-3 tracking-tighter"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}>
        <motion.button
          type="button"
          onClick={() => onParkingChange('easy')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`rounded-2xl border border-white/40 px-4 py-3 text-sm font-semibold shadow-md backdrop-blur-lg transition-all ${
            parking === 'easy'
              ? 'bg-indigo-100/50 ring-2 ring-indigo-400'
              : 'bg-white/30 ring-1 ring-gray-200 hover:bg-gradient-to-r hover:from-indigo-100/60 hover:to-indigo-300/40'
          }`}>
          주차하기 편해요
        </motion.button>
        <motion.button
          type="button"
          onClick={() => onParkingChange('difficult')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`rounded-2xl border border-white/40 px-4 py-3 text-sm font-semibold shadow-md backdrop-blur-lg transition-all ${
            parking === 'difficult'
              ? 'bg-indigo-100/50 ring-2 ring-indigo-400'
              : 'bg-white/30 ring-1 ring-gray-200 hover:bg-gradient-to-r hover:from-indigo-100/60 hover:to-indigo-300/40'
          }`}>
          주차하기 어려워요
        </motion.button>
      </motion.div>
    </div>
  );
}
