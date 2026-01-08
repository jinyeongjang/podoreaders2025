import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserEdit, FaEdit, FaCheckCircle } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

interface FamilyMember {
  id: string;
  name: string;
  createdAt: string;
}

interface EditFamilyMemberModalProps {
  member: FamilyMember;
  onClose: () => void;
  onSave: (editedMember: { id: string; name: string; createdAt: string }) => void;
}

// 완료 안내 모달 컴포넌트
function CompleteModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl xs:p-5">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.7, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full xs:h-14 xs:w-14">
            <FaCheckCircle className="h-10 w-10 text-green-500 xs:h-8 xs:w-8" />
          </motion.div>
          <h3 className="mb-2 text-xl font-bold text-gray-800 xs:text-lg">수정 완료!</h3>
          <p className="mb-6 text-gray-600 xs:mb-5 xs:text-sm">
            가족원 정보가 수정되었어요. <br />
          </p>
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-4 font-medium text-white shadow-lg transition-all hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl active:scale-95 xs:gap-1.5 xs:py-3.5 xs:text-sm">
            확인
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function EditFamilyMemberModal({ member, onClose, onSave }: EditFamilyMemberModalProps) {
  const [name, setName] = useState(member.name);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('이름은 필수 입력 항목입니다.');
      return;
    }

    // 완료 모달 표시 후 저장
    setShowCompleteModal(true);
  };

  const handleConfirmSave = () => {
    // 완료 모달 닫고 변경사항 저장
    setShowCompleteModal(false);
    onSave({
      id: member.id,
      name,
      createdAt: member.createdAt,
    });
  };

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
        onClick={(e) => e.stopPropagation()}
        className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex flex-col p-6 xs:p-5">
          {/* 헤더 영역 */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3 xs:gap-2">
              <FaUserEdit className="h-7 w-7 text-indigo-600 xs:h-6 xs:w-6" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 xs:text-lg">가족원 수정하기</h3>
                <p className="mt-0.5 text-sm text-gray-600 xs:text-xs">가족원 정보를 수정합니다</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700"
              title="닫기">
              <IoMdClose className="h-5 w-5" />
            </button>
          </div>

          {/* 폼 내용 */}
          <form onSubmit={handleSubmit} className="mt-2 space-y-5 xs:mt-0 xs:space-y-4">
            <div>
              <label htmlFor="edit-name" className="mb-1.5 block text-sm font-semibold text-gray-700">
                이름
              </label>
              <input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-base shadow-sm transition-all hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 xs:p-2.5 xs:text-sm"
                placeholder="가족원 이름"
                autoFocus
              />
            </div>
          </form>

          {/* 푸터 */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-3 font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95 xs:text-sm">
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg active:scale-95 xs:gap-1.5 xs:text-sm">
              <FaEdit className="h-4 w-4 xs:h-3.5 xs:w-3.5" />
              수정하기
            </button>
          </div>
        </div>
      </motion.div>

      {/* 완료 안내 모달 */}
      <AnimatePresence>{showCompleteModal && <CompleteModal onClose={handleConfirmSave} />}</AnimatePresence>
    </motion.div>
  );
}
