import { motion } from 'framer-motion';
import { FaCheck, FaPen } from 'react-icons/fa';

interface PrayerSuccessModalProps {
  user_name: string;
  content: string;
  onClose: () => void;
}

const PrayerSuccessModal: React.FC<PrayerSuccessModalProps> = ({ user_name, content, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      className="w-full max-w-md overflow-hidden rounded-3xl bg-white tracking-tighter shadow-xl xs:px-2">
      <div className="p-8">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
          <FaCheck className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="mb-3 text-[18px] font-bold text-gray-900 xs:text-[18px]">가족장에게 기도제목이 전송되었어요.</h2>

        <div className="mb-6 space-y-3 rounded-2xl bg-gray-50 p-4 text-gray-600">
          <p className="text-gray-900">{user_name}님의 기도제목입니다.</p>
          <hr className="flex border-t border-gray-200"></hr>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <FaPen className="h-4 w-4 text-indigo-500" />
              <span className="text-gray-700">{content}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="rounded-2xl bg-indigo-600 px-5 py-2.5 text-white shadow-sm hover:bg-indigo-700">
            확인
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default PrayerSuccessModal;
