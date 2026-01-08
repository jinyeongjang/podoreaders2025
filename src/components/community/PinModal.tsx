import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

interface PinModalProps {
  isOpen: boolean;
  pin: string;
  onPinChange: (pin: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function PinModal({ isOpen, pin, onPinChange, onConfirm, onCancel, isSubmitting }: PinModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="p-6">
          {/* 헤더 */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaLock className="h-8 w-8 text-indigo-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">PIN 번호 설정</h3>
                <p className="text-sm text-gray-600">게시글 수정/삭제 시 사용할 번호를 입력하세요</p>
              </div>
            </div>
            <button onClick={onCancel} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
              <IoMdClose className="h-6 w-6" />
            </button>
          </div>

          {/* PIN 입력 */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">PIN 번호 (4자리)</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => onPinChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              autoFocus
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-2xl tracking-widest transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-2 text-xs text-gray-500">나중에 게시글을 수정하거나 삭제할 때 사용됩니다</p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95">
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={pin.length !== 4 || isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-4 font-medium text-white shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
              <FaLock className="h-4 w-4" />
              {isSubmitting ? '작성 중...' : '확인'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
