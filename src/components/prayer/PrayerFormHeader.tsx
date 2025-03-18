import { motion } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';

interface PrayerFormHeaderProps {
  onClose: () => void;
}

const PrayerFormHeader: React.FC<PrayerFormHeaderProps> = ({ onClose }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-900">새 기도제목 작성</h2>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
        <IoMdClose />
      </motion.button>
    </div>
  );
};

export default PrayerFormHeader;
