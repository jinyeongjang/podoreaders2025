import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileExport } from 'react-icons/fa';

export interface ExportConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

const ExportConfirmModal: React.FC<ExportConfirmModalProps> = ({ onConfirm, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 추후 추출기능은 DB에서 비밀번호 설정 후 비교하는 방식으로 변경 예정
  const handleConfirm = () => {
    if (password === '20251200') {
      onConfirm();
    } else {
      setError('비밀번호가 일치하지 않습니다.');
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
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <FaFileExport className="h-8 w-8 text-slate-600" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            [가족장 권한] <br /> 엑셀 파일로 내보내기
          </h2>
          <div className="mb-6 space-y-3 rounded-2xl bg-gray-50 p-4 text-gray-600">
            현재 큐티, 말씀 읽기, 필사 기록을
            <br />
            모두 엑셀 데이터로 변환합니다.<br></br>
            <hr className="flex border-t border-gray-200"></hr>
            <p>발급받은 비밀번호 4자리를 입력해주세요.</p>
            {/* <p>example_test: 1234</p> */}
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="mb-4 w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="rounded-2xl border border-gray-300 bg-white px-5 py-2.5 text-gray-700 shadow-sm hover:bg-gray-50">
              취소
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className="rounded-2xl bg-slate-500 px-5 py-2.5 text-white shadow-sm hover:bg-slate-600">
              확인
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExportConfirmModal;
