import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStickyNote, FaEdit, FaCheckCircle, FaChevronDown } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

interface CategoryOption {
  value: string;
  label: string;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category: string;
}

interface EditNoticeModalProps {
  notice: Notice;
  onClose: () => void;
  onSave: (editedNotice: { title: string; content: string; category: string }) => void;
  categories: CategoryOption[];
}

// 완료 안내 모달 컴포넌트
function CompleteModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-4 w-full max-w-md overflow-hidden rounded-xl bg-white p-6 shadow-xl xs:p-5">
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
            공지사항이 수정되었어요. <br />
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

export default function EditNoticeModal({ notice, onClose, onSave, categories }: EditNoticeModalProps) {
  const [title, setTitle] = useState(notice.title);
  const [content, setContent] = useState(notice.content);
  const [category, setCategory] = useState(notice.category);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // 바깥 영역 클릭시 드롭다운 닫기 이벤트 등록
  useEffect(() => {
    const handleClickOutside = () => {
      if (showCategoryDropdown) setShowCategoryDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showCategoryDropdown]);

  // 카테고리 선택 핸들러
  const handleCategorySelect = (value: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setCategory(value);
    setShowCategoryDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용은 필수 입력 항목입니다.');
      return;
    }

    // 완료 모달 표시 후 저장
    setShowCompleteModal(true);
  };

  const handleConfirmSave = () => {
    // 완료 모달 닫고 변경사항 저장
    setShowCompleteModal(false);
    onSave({ title, content, category });
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
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white tracking-tighter shadow-xl xs:max-h-[95vh] xs:w-[92vw] xs:overflow-auto">
        <div className="p-6 xs:p-4">
          {/* 헤더 영역 */}
          <div className="mb-4 flex items-center justify-between xs:mb-3">
            <div className="flex items-center gap-3 xs:gap-2">
              <FaStickyNote className="h-8 w-8 text-indigo-600 xs:h-6 xs:w-6" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 xs:text-base">공지사항 수정하기</h3>
                <p className="text-sm text-gray-600 xs:text-xs">공지사항 정보를 수정합니다</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-500"
              title="닫기">
              <IoMdClose className="h-6 w-6 xs:h-5 xs:w-5" />
            </button>
          </div>

          {/* 폼 내용 */}
          <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-3">
            <div>
              <label
                htmlFor="edit-category"
                className="mb-2 block text-sm font-medium text-gray-700 xs:mb-1.5 xs:text-xs">
                카테고리
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCategoryDropdown(!showCategoryDropdown);
                  }}
                  className="relative flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-base text-gray-700 shadow-sm transition-all hover:border-indigo-500 hover:shadow focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 active:scale-[0.98] xs:py-2.5 xs:text-sm">
                  <span>{categories.find((cat) => cat.value === category)?.label || '카테고리 선택'}</span>
                  <FaChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${showCategoryDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      <div className="py-1">
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={(e) => handleCategorySelect(cat.value, e)}
                            className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-indigo-50 active:bg-indigo-100 ${
                              category === cat.value ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-gray-700'
                            }`}>
                            <span>{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <label htmlFor="edit-title" className="mb-2 block text-sm font-medium text-gray-700 xs:mb-1.5 xs:text-xs">
                제목
              </label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-base transition-all hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 xs:p-2.5 xs:text-sm"
                placeholder="공지사항 제목"
              />
            </div>

            <div>
              <label
                htmlFor="edit-content"
                className="mb-2 block text-sm font-medium text-gray-700 xs:mb-1.5 xs:text-xs">
                내용
              </label>
              <textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-40 w-full rounded-lg border border-gray-300 p-3 text-base transition-all hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 xs:h-32 xs:p-2.5 xs:text-sm"
                placeholder="공지사항 내용"></textarea>
            </div>
          </form>

          {/* 푸터 */}
          <div className="mt-6 grid grid-cols-2 gap-4 xs:mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95 xs:py-3.5 xs:text-sm">
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-4 font-medium text-white shadow-lg transition-all hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl active:scale-95 xs:gap-1.5 xs:py-3.5 xs:text-sm">
              <FaEdit className="h-4 w-4 xs:h-3.5 xs:w-3.5" />
              수정하기
            </button>
          </div>
        </div>
      </motion.div>

      {/* 완료 안내 모달 */}
      {showCompleteModal && <CompleteModal onClose={handleConfirmSave} />}
    </motion.div>
  );
}
