import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaEdit, FaPlus } from 'react-icons/fa';
import { useTypewriter } from '../../hooks/useTypewriter';

interface CampusStatusMessage {
  message: string;
  updatedAt: string;
}

interface CampusStatusMessageSectionProps {
  statusMessage: CampusStatusMessage;
  onSaveStatus: (message: string) => Promise<void>;
  formatDate: (dateString: string) => string;
}

export default function CampusStatusMessageSection({
  statusMessage,
  onSaveStatus,
  formatDate,
}: CampusStatusMessageSectionProps) {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // 타이프라이터 효과 (상태 메시지용)
  const { displayedText: statusDisplayText, isTyping: isStatusTyping } = useTypewriter({
    text: statusMessage.message || '',
    speed: 50,
  });

  const handleEditClick = () => {
    setNewMessage(statusMessage.message);
    setIsEditingStatus(true);
  };

  const handleSave = async () => {
    await onSaveStatus(newMessage.trim());
    setIsEditingStatus(false);
  };

  const handleCancel = () => {
    setIsEditingStatus(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group relative overflow-hidden rounded-2xl px-4 py-3 shadow-md shadow-emerald-100/30 backdrop-blur-sm transition-all hover:border-emerald-300/80 hover:shadow-lg hover:shadow-emerald-200/40 xs:py-4">
      <div className="relative space-y-2">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-200/50">
                캠퍼스 상태
              </span>
            </div>
            {statusMessage.updatedAt && (
              <p className="text-[10px] font-medium text-emerald-600/60">{formatDate(statusMessage.updatedAt)}</p>
            )}
          </div>
          {!isEditingStatus && (
            <button
              onClick={handleEditClick}
              className="group/btn flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-200/50 transition-all hover:from-emerald-500 hover:to-emerald-600 hover:text-white hover:shadow-md hover:ring-emerald-500">
              <FaEdit className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{statusMessage.message ? '수정' : '등록'}</span>
            </button>
          )}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isEditingStatus ? (
            <motion.div
              key="edit-mode"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="오늘의 메시지를 입력해주세요 ✨"
                maxLength={200}
                className="w-full rounded-xl border-2 border-emerald-200/80 bg-white p-3 text-sm shadow-sm transition-all placeholder:text-emerald-400/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200/50"
                rows={2}
                autoFocus></textarea>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-emerald-600/60">
                  <span className={newMessage.length > 180 ? 'text-orange-500' : ''}>{newMessage.length}</span>
                  /200자
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow xs:px-3">
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!newMessage.trim()}
                    className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300 xs:px-3">
                    <FaCheck className="h-3 w-3" />
                    <span>저장</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : statusMessage.message ? (
            <motion.div
              key="display-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}>
              <div className="rounded-xl p-3">
                <p className="font-bold leading-relaxed text-slate-800 sm:text-base xs:text-sm">
                  {statusDisplayText}
                  {isStatusTyping && <span className="ml-1 inline-block h-4 w-0.5 animate-pulse align-middle" />}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleEditClick}
              className="group/empty cursor-pointer rounded-xl border-2 border-dashed border-emerald-300/40 bg-white/50 py-5 text-center backdrop-blur-sm transition-all hover:border-emerald-400/60 hover:bg-white/70">
              <div className="flex flex-col items-center gap-1.5">
                <div className="rounded-full bg-emerald-100/80 p-2 transition-transform group-hover/empty:scale-110">
                  <FaPlus className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-sm font-semibold text-emerald-700/80">메시지를 등록해보세요</p>
                <p className="text-xs text-emerald-600/50">클릭하여 시작하기</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
