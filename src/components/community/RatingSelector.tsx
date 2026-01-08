import { motion } from 'framer-motion';

interface RatingSelectorProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export default function RatingSelector({ rating, onRatingChange }: RatingSelectorProps) {
  return (
    <div>
      <label className="mb-4 block text-sm font-bold text-gray-800">⭐ 평점</label>
      <motion.div className="flex flex-col gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((score) => (
            <motion.button
              key={score}
              type="button"
              onClick={() => onRatingChange(score)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`rounded-2xl border border-white/40 px-4 py-3 text-lg font-bold shadow-md backdrop-blur-lg transition-all ${
                rating === score
                  ? 'bg-indigo-100/50 ring-2 ring-indigo-400'
                  : 'bg-white/30 ring-1 ring-gray-200 hover:bg-gradient-to-r hover:from-indigo-100/60 hover:to-indigo-300/40'
              }`}>
              {score}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
