import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaExclamationTriangle, FaBook, FaBible, FaPen } from 'react-icons/fa';

interface DeleteConfirmModalProps {
  date: string;
  userName: string;
  record: {
    qtCount: number;
    bibleReadCount: number;
    qtDone: boolean;
    bibleReadDone: boolean;
    writingDone: boolean;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ date, userName, record, onConfirm, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 추후 삭제는 DB에서 비밀번호 설정 후 비교하는 방식으로 변경 예정
  const handleConfirm = () => {
    if (password === '20251200') {
      onConfirm();
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
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
            <p className="font-medium text-gray-900">
              {userName}님의 {new Date(date).toLocaleDateString('ko-KR')} 기록
            </p>
            <p>현재 기록을 삭제합니다. 계속할까요?</p>
            <hr className="flex border-t border-gray-200"></hr>

            <p>발급받은 비밀번호 4자리를 입력해주세요.</p>
            {/* <p>example_test: 1234</p> */}

            <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 pt-3">
              <div className="flex items-center gap-2">
                <FaBook className="h-4 w-4 text-indigo-500" />
                <span>큐티 {record.qtCount}회</span>
                {record.qtDone && (
                  <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">
                    완료
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <FaBible className="h-4 w-4 text-indigo-500" />
                <span>말씀 {record.bibleReadCount}회</span>
                {record.bibleReadDone && (
                  <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">
                    완료
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <FaPen className="h-4 w-4 text-indigo-500" />
                <span>필사</span>
                {record.writingDone && (
                  <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">
                    완료
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="mb-4 w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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

export default DeleteConfirmModal;
