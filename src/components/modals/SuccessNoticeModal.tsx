import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category: string;
}

interface Category {
  value: string;
  label: string;
}

interface SuccessNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMore: () => void;
  onGoHome: () => void;
  notice: Notice;
  categories: Category[];
  getCategoryBadgeColor: (category: string) => string;
}

const SuccessNoticeModal: React.FC<SuccessNoticeModalProps> = ({
  isOpen,
  onClose,
  notice,
  categories,
  getCategoryBadgeColor,
}) => {
  if (!isOpen || !notice) return null;

  return (
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
            <FaCheckCircle className="h-8 w-8 text-green-500" />
          </div>

          <h2 className="mb-3 text-2xl font-bold text-gray-900">공지사항 등록 완료</h2>

          <div className="mb-6 space-y-3 rounded-2xl bg-gray-50 p-4 text-gray-600">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${getCategoryBadgeColor(notice.category)}`}>
                {categories.find((cat) => cat.value === notice.category)?.label || '일반'}
              </span>
              <h4 className="font-semibold text-gray-800">{notice.title}</h4>
            </div>
            <p className="max-h-24 overflow-y-auto pt-2 text-gray-600">
              {notice.content.length > 100 ? `${notice.content.substring(0, 100)}...` : notice.content}
            </p>
            <div className="pt-2 text-xs text-gray-500">{new Date(notice.createdAt).toLocaleString('ko-KR')}</div>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full rounded-2xl bg-indigo-600 px-5 py-2.5 text-white shadow-sm hover:bg-indigo-700">
              확인
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessNoticeModal;
