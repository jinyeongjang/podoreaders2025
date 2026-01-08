import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserCog, FaCheck, FaSearch, FaUserPlus } from 'react-icons/fa';
import { MdFilterAltOff } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';

interface UserSelectionModalProps {
  userList: string[];
  selectedUsers: string[];
  handleUserToggle: (userName: string) => void;
  handleApplySelection: () => void;
  handleClose: () => void;
  handleClearSelection: () => void;
}

const UserSelectionModal: React.FC<UserSelectionModalProps> = ({
  userList,
  selectedUsers,
  handleUserToggle,
  handleApplySelection,
  handleClose,
  handleClearSelection,
}) => {
  // 검색 기능 추가
  const [searchQuery, setSearchQuery] = useState('');

  // 모든 사용자 선택 기능
  const handleSelectAll = () => {
    // 모든 사용자가 이미 선택되었다면 선택 해제, 아니면 모두 선택
    if (selectedUsers.length === userList.length) {
      handleClearSelection();
    } else {
      userList.forEach((userName) => {
        if (!selectedUsers.includes(userName)) {
          handleUserToggle(userName);
        }
      });
    }
  };

  // 사용자 선택 핸들러 - 오류 수정: 직접 handleUserToggle을 호출하도록 수정
  const handleUserSelect = (userName: string) => {
    handleUserToggle(userName);
  };

  // 검색어에 따른 필터링된 사용자 목록
  const filteredUsers = userList.filter((user) => user.toLowerCase().includes(searchQuery.toLowerCase()));

  // 애니메이션 설정
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed -inset-20 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white tracking-tighter shadow-xl xs:max-h-[95vh] xs:w-[85vw]">
        <div className="p-6 xs:p-3">
          {/* 헤더 영역 */}
          <div className="mb-4 flex items-center justify-between xs:mb-2">
            <div className="flex items-center gap-3 xs:gap-2">
              <FaUserCog className="h-8 w-8 text-amber-600 xs:h-6 xs:w-6" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 xs:text-base">가족원 선택</h3>
                <p className="text-sm text-gray-600 xs:text-xs">선택한 가족원의 데이터만 표시합니다</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              title="닫기">
              <IoMdClose className="h-6 w-6 xs:h-5 xs:w-5" />
            </button>
          </div>

          {/* 검색 필드 */}
          <div className="relative mb-4 xs:mb-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="h-4 w-4 text-gray-400 xs:h-3 xs:w-3" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="가족원 이름으로 검색..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 xs:py-1.5 xs:pl-8 xs:text-xs"
            />
          </div>

          {/* 작업 버튼 영역 */}
          <div className="xs:flex-col-2 mb-4 flex gap-2 xs:mb-2 xs:gap-1.5">
            <button
              type="button"
              onClick={handleSelectAll}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-indigo-100 py-3 text-sm font-medium text-indigo-700 transition-all hover:bg-indigo-200 xs:gap-1 xs:py-3 xs:text-xs">
              <FaUserPlus className="h-4 w-4 xs:h-3 xs:w-3" />
              <span>{selectedUsers.length === userList.length ? '전체 선택 해제' : '전체 선택'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleClearSelection();
                handleClose();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-100 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 xs:gap-1 xs:py-1.5 xs:text-xs">
              <MdFilterAltOff className="h-4 w-4 xs:h-3 xs:w-3" />
              <span>필터 초기화</span>
            </button>
          </div>

          {/* 현재 선택 상태 표시 */}
          <div className="mb-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-3 shadow-sm xs:mb-2 xs:p-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-700 xs:text-xs">
                  <span className="font-medium">{selectedUsers.length}</span>/{userList.length} 명의 가족원 선택됨
                </p>
              </div>
              {selectedUsers.length > 0 && (
                <button
                  onClick={handleClearSelection}
                  className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition-all hover:bg-gray-300 active:scale-95 xs:px-2 xs:py-0.5 xs:text-[12px]">
                  <IoMdClose className="h-3 w-3" />
                  <span>초기화</span>
                </button>
              )}
            </div>
          </div>

          {/* 가족원 선택 목록 */}
          {filteredUsers.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid max-h-[320px] grid-cols-2 gap-2 overflow-y-auto px-1 py-2 xs:max-h-[360px] xs:gap-1.5 xs:py-1">
              {filteredUsers.map((user) => (
                <motion.button
                  key={user}
                  variants={itemVariants}
                  onClick={() => handleUserSelect(user)}
                  className={`relative flex items-center justify-center rounded-full px-4 py-3 transition-all xs:px-2 xs:py-4 xs:text-[15px] ${
                    selectedUsers.includes(user)
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}>
                  <span className="break-all text-center font-medium">{user}</span>
                  {selectedUsers.includes(user) && (
                    <span className="absolute right-2 xs:right-1.5">
                      <FaCheck className="h-4 w-4 text-white xs:h-3 xs:w-3" />
                    </span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <div className="flex h-32 items-center justify-center xs:h-24">
              <p className="text-gray-500 xs:text-sm">검색 결과가 없습니다</p>
            </div>
          )}

          {/* 하단 버튼 영역 */}
          <div className="mt-6 flex gap-2 xs:mt-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95 xs:py-4 xs:text-sm">
              취소
            </button>
            <button
              type="button"
              onClick={() => {
                handleApplySelection();
                handleClose();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-4 font-medium text-white shadow-lg transition-all hover:shadow-xl active:scale-95 xs:gap-1 xs:py-4 xs:text-sm">
              <FaCheck className="h-4 w-4 xs:h-3 xs:w-3" />
              적용하기
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserSelectionModal;
