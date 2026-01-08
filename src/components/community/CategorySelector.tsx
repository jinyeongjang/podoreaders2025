import { motion } from 'framer-motion';

interface Category {
  value: string;
  label: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategorySelector({ categories, selectedCategory, onCategoryChange }: CategorySelectorProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-bold text-gray-800">📂 카테고리</label>
      <motion.div
        className="grid grid-cols-5 gap-2 sm:grid-cols-5 xs:grid-cols-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}>
        {categories.map((cat) => (
          <motion.button
            key={cat.value}
            type="button"
            onClick={() => onCategoryChange(cat.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`rounded-2xl border border-white/40 px-2 py-3 text-sm font-semibold shadow-md backdrop-blur-lg transition-all ${
              selectedCategory === cat.value
                ? 'bg-indigo-100/50 ring-2 ring-indigo-400'
                : 'bg-white/30 ring-1 ring-gray-200 hover:bg-gradient-to-r hover:from-indigo-100/60 hover:to-indigo-300/40'
            }`}>
            {cat.label}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
