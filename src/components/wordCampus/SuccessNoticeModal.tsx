import { motion } from 'framer-motion';
import { FaCheck, FaBullhorn } from 'react-icons/fa';

interface SuccessNoticeModalProps {
  title: string;
  onClose: () => void;
}

const SuccessNoticeModal: React.FC<SuccessNoticeModalProps> = ({ title, onClose }) => (
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
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
          <FaCheck className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-900">등록 완료</h2>
        <div className="mb-6 space-y-3 rounded-2xl bg-gray-50 p-4 text-gray-600">
          <p className="font-medium text-gray-900">공지사항이 등록되었습니다</p>
          <p>{new Date().toLocaleDateString('ko-KR')} 등록</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <FaBullhorn className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">{title}</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-600">완료</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-white shadow-sm hover:bg-emerald-700">
            확인
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default SuccessNoticeModal;
