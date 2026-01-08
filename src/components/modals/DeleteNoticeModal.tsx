import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

interface DeleteNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  noticeTitle: string;
  noticeContent: string;
  noticeCategory: string;
  categoryLabel: string;
}

const DeleteNoticeModal: React.FC<DeleteNoticeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  noticeTitle,
  noticeContent,
  categoryLabel,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-4 w-full max-w-md overflow-hidden rounded-3xl bg-white tracking-tighter shadow-xl xs:max-h-[95vh] xs:w-[92vw]">
        <div className="p-6 xs:p-4">
          {/* 헤더 영역 */}
          <div className="mb-4 flex items-center justify-between xs:mb-3">
            <div className="flex items-center gap-3 xs:gap-2">
              <FaExclamationTriangle className="h-8 w-8 text-red-500 xs:h-6 xs:w-6" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 xs:text-base">{title}</h3>
                <p className="text-sm text-gray-600 xs:text-xs">삭제한 공지사항은 복구할 수 없어요.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-500"
              title="닫기">
              <IoMdClose className="h-6 w-6 xs:h-5 xs:w-5" />
            </button>
          </div>

          {/* 공지사항 내용 */}
          <div className="mb-6 space-y-3 rounded-xl bg-gray-50 p-4 xs:mb-4 xs:p-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                {categoryLabel}
              </span>
              <p className="text-base font-semibold text-gray-900 xs:text-sm">&quot;{noticeTitle}&quot;</p>
            </div>

            <div className="max-h-24 overflow-y-auto rounded-lg bg-white p-3 text-sm text-gray-700 xs:max-h-20 xs:text-xs">
              {noticeContent.length > 150 ? `${noticeContent.substring(0, 150)}...` : noticeContent}
            </div>
          </div>

          <div className="mb-6 rounded-xl bg-red-50 p-4 xs:mb-4 xs:p-3">
            <p className="text-sm text-red-600 xs:text-xs">
              정말로 이 공지사항을 삭제할까요? 이 작업은 되돌릴 수 없어요.
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="mt-6 grid grid-cols-2 gap-4 xs:mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95 xs:py-3.5 xs:text-sm">
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-4 font-medium text-white shadow-lg transition-all hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:shadow-xl active:scale-95 xs:gap-1.5 xs:py-3.5 xs:text-sm">
              <FaTrash className="h-4 w-4 xs:h-3.5 xs:w-3.5" />
              삭제하기
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteNoticeModal;
