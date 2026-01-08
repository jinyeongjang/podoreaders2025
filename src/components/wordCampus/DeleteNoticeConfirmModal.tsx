import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaExclamationTriangle, FaBullhorn } from 'react-icons/fa';

interface DeleteNoticeConfirmModalProps {
  title: string;
  content: string;
  createdAt: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteNoticeConfirmModal: React.FC<DeleteNoticeConfirmModalProps> = ({
  title,
  content,
  createdAt,
  onConfirm,
  onCancel,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (password === '20251200') {
      onConfirm();
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

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
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <FaExclamationTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-900">삭제 확인</h2>
          <div className="mb-6 space-y-3 rounded-2xl bg-gray-50 p-4 text-gray-600">
            <p className="font-medium text-gray-900">{formatDate(createdAt)} 등록된 공지사항</p>
            <p>현재 공지사항을 삭제합니다. 계속할까요?</p>
            <hr className="flex border-t border-gray-200"></hr>

            <p>발급받은 비밀번호 4자리를 입력해주세요.</p>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-start gap-2">
                <FaBullhorn className="mt-1 h-4 w-4 text-emerald-500" />
                <div className="flex-1">
                  <p className="font-semibold text-emerald-800">{title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{content}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="mb-4 w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="rounded-2xl px-5 py-2.5 text-gray-600 hover:bg-gray-100">
              취소
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className="rounded-2xl bg-red-600 px-5 py-2.5 text-white shadow-sm hover:bg-red-700">
              삭제
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteNoticeConfirmModal;
