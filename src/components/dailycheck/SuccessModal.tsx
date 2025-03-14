import { motion } from 'framer-motion';
import { FaCheck, FaBook, FaBible, FaPen } from 'react-icons/fa';

interface SuccessModalProps {
  userName: string;
  selectedDate: string;
  qtCount: number;
  bibleReadCount: number;
  qtDone: boolean;
  bibleReadDone: boolean;
  writingDone: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  userName,
  selectedDate,
  qtCount,
  bibleReadCount,
  qtDone,
  bibleReadDone,
  writingDone,
  onClose,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      className="w-full max-w-md overflow-hidden rounded-3xl bg-white tracking-tighter shadow-xl">
      <div className="p-8">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
          <FaCheck className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-900">저장 완료</h2>
        <div className="mb-6 space-y-3 rounded-2xl bg-gray-50 p-4 text-gray-600">
          <p className="font-medium text-gray-900">{userName}님의 기록</p>
          <p>{new Date(selectedDate).toLocaleDateString('ko-KR')} 기록이 저장되었습니다.</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <FaBook className="h-4 w-4 text-indigo-500" />
              <span>큐티 {qtCount}회</span>
              {qtDone && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">완료</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <FaBible className="h-4 w-4 text-indigo-500" />
              <span>말씀 {bibleReadCount}회</span>
              {bibleReadDone && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">완료</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <FaPen className="h-4 w-4 text-indigo-500" />
              <span>필사</span>
              {writingDone && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">완료</span>
              )}
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

export default SuccessModal;
