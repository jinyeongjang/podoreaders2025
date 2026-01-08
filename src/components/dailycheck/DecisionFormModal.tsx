import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaChevronDown, FaTimes } from 'react-icons/fa';

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
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => !isEdit && setShowUserDropdown(!showUserDropdown)}
                  disabled={isEdit}
                  whileHover={!isEdit ? { scale: 1.01 } : {}}
                  whileTap={!isEdit ? { scale: 0.99 } : {}}
                  animate={{
                    background: selectedUser
                      ? [
                          'linear-gradient(0deg, #818cf8, #a5b4fc)',
                          'linear-gradient(120deg, #818cf8, #a5b4fc)',
                          'linear-gradient(240deg, #818cf8, #a5b4fc)',
                          'linear-gradient(360deg, #818cf8, #a5b4fc)',
                        ]
                      : undefined,
                  }}
                  transition={{
                    background: {
                      repeat: Infinity,
                      duration: 8,
                      ease: 'linear',
                    },
                  }}
                  className={`group relative flex w-full items-center justify-between overflow-hidden rounded-xl border px-4 py-3 text-left shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-indigo-200 ${
                    selectedUser
                      ? 'border-indigo-400 text-white shadow-indigo-200'
                      : 'border-gray-300 bg-white text-gray-500 hover:border-indigo-300 hover:shadow-lg'
                  } ${isEdit ? 'cursor-not-allowed opacity-60' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative z-10 flex items-center gap-3">
                    <div
                      className={`rounded-full p-2 transition-all ${
                        selectedUser
                          ? 'bg-white/20 shadow-lg backdrop-blur-sm'
                          : 'bg-gray-100 group-hover:bg-indigo-100'
                      }`}>
                      <FaUser
                        className={`h-4 w-4 ${selectedUser ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'}`}
                      />
                    </div>
                    <span className={`font-semibold ${selectedUser ? 'text-white drop-shadow-md' : 'text-slate-800'}`}>
                      {selectedUser || '가족원을 선택해주세요'}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: showUserDropdown ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10">
                    <FaChevronDown
                      className={`h-5 w-5 transition-colors ${
                        selectedUser ? 'text-white' : 'text-gray-500 group-hover:text-indigo-400'
                      }`}
                    />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {showUserDropdown && !isEdit && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute left-0 right-0 top-full z-20 mt-2 max-h-[300px] w-full overflow-hidden rounded-xl border-2 border-indigo-200 bg-white/95 shadow-2xl shadow-indigo-100 backdrop-blur-sm">
                      <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: '300px' }}>
                        {users.map((user, index) => (
                          <motion.button
                            key={user}
                            type="button"
                            onClick={() => {
                              onUserChange(user);
                              setShowUserDropdown(false);
                            }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03, duration: 0.2 }}
                            whileHover={{ x: 4 }}
                            className={`group relative flex w-full items-center gap-4 border-b border-gray-100 px-4 py-3 text-left transition-all last:border-b-0 ${
                              selectedUser === user
                                ? 'bg-gradient-to-r from-indigo-100 via-indigo-50 to-indigo-50 text-indigo-800'
                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-50'
                            }`}>
                            <div
                              className={`absolute left-0 top-0 h-full w-1 transition-all ${
                                selectedUser === user
                                  ? 'bg-gradient-to-b from-indigo-500 to-indigo-500'
                                  : 'bg-transparent group-hover:bg-gradient-to-b group-hover:from-indigo-400 group-hover:to-indigo-400'
                              }`}
                            />

                            <div
                              className={`rounded-full p-2 transition-all ${
                                selectedUser === user
                                  ? 'bg-gradient-to-br from-indigo-400 to-indigo-500 shadow-lg shadow-indigo-200'
                                  : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-indigo-400 group-hover:to-indigo-500'
                              }`}>
                              <FaUser
                                className={`h-3 w-3 transition-colors ${
                                  selectedUser === user ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                }`}
                              />
                            </div>
                            <span
                              className={`flex-1 font-medium transition-colors ${
                                selectedUser === user ? 'text-indigo-900' : 'group-hover:text-indigo-700'
                              }`}>
                              {user}
                            </span>
                            {selectedUser === user && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-500 shadow-lg">
                                <svg
                                  className="h-3 w-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
