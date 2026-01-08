import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

interface DecisionSuccessModalProps {
  userName: string;
  isEdit: boolean;
  decisionText: string;
  onClose: () => void;
}

const DecisionSuccessModal: React.FC<DecisionSuccessModalProps> = ({ userName, isEdit, decisionText, onClose }) => (
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
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
          <FaCheck className="h-8 w-8 text-indigo-500" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-900">{isEdit ? '수정 완료' : '저장 완료'}</h2>
        <div className="mb-6 space-y-3 rounded-2xl bg-gray-50 p-4 text-gray-600">
          <p className="font-medium text-gray-900">
            {userName} 님의 한주간의 결단이 {isEdit ? '수정' : '저장'}되었습니다
          </p>
          <p>
            {new Date().toLocaleDateString('ko-KR')} {isEdit ? '수정' : '등록'}
          </p>
          <div className="flex flex-wrap items-start gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">결단 내용</span>
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">
                  {isEdit ? '수정됨' : '완료'}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-gray-700">{decisionText}</p>
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

export default DecisionSuccessModal;
