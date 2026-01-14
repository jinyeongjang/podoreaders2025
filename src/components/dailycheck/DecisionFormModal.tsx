import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import DecisionUserDropdown from './components/DecisionUserDropdown';

interface DecisionFormModalProps {
  isOpen: boolean;
  isEdit: boolean;
  users: string[];
  selectedUser: string;
  decisionText: string;
  onUserChange: (user: string) => void;
  onDecisionTextChange: (text: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const DecisionFormModal: React.FC<DecisionFormModalProps> = ({
  isOpen,
  isEdit,
  users,
  selectedUser,
  decisionText,
  onUserChange,
  onDecisionTextChange,
  onSubmit,
  onClose,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  if (!isOpen) return null;

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
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white tracking-tighter shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
          <h3 className="text-xl font-bold text-gray-900">{isEdit ? '결단 수정하기' : '한주간의 결단 작성하기'}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-all hover:bg-white/50 hover:text-gray-700">
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* 폼 내용 */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* 사용자 선택 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">가족원 선택</label>
              <DecisionUserDropdown
                users={users}
                selectedUser={selectedUser}
                onUserChange={onUserChange}
                disabled={isEdit}
              />
            </div>

            {/* 결단 내용 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">결단 내용</label>
              <textarea
                value={decisionText}
                onChange={(e) => onDecisionTextChange(e.target.value)}
                placeholder="이번 주 실천할 결단을 구체적으로 작성해주세요."
                className="h-40 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl">
              {isEdit ? '수정하기' : '저장하기'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border-2 border-gray-300 px-6 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50">
              취소
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DecisionFormModal;
