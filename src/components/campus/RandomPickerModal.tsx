import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaPlus, FaListUl } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

interface RandomPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RandomPickerModal: React.FC<RandomPickerModalProps> = ({ isOpen, onClose }) => {
  const [names, setNames] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  // 모달이 열릴 때 localStorage에서 이전에 저장된 이름 목록 불러오기
  useEffect(() => {
    if (isOpen) {
      const savedNames = localStorage.getItem('randomPickerNames');
      if (savedNames) {
        try {
          setNames(JSON.parse(savedNames));
        } catch (error) {
          console.error('저장된 이름 목록 로딩 중 오류 발생:', error);
        }
      }
    }
  }, [isOpen]);

  // 이름 추가 핸들러
  const handleAddName = () => {
    if (newName.trim()) {
      const updatedNames = [...names, newName.trim()];
      setNames(updatedNames);
      setNewName('');
      // localStorage에 이름 목록 저장
      localStorage.setItem('randomPickerNames', JSON.stringify(updatedNames));
    }
  };

  // 이름 제거 핸들러
  const handleRemoveName = (index: number) => {
    const updatedNames = [...names];
    updatedNames.splice(index, 1);
    setNames(updatedNames);
    // localStorage에 이름 목록 저장
    localStorage.setItem('randomPickerNames', JSON.stringify(updatedNames));
  };

  // 순서 섞기 핸들러
  const handleShuffle = () => {
    if (names.length < 2) {
      alert('순서를 섞으려면 최소 2명 이상의 이름이 필요합니다.');
      return;
    }

    setIsShuffling(true);

    // 셔플 애니메이션 효과를 위한 여러 번의 상태 업데이트
    let iterations = 0;
    const maxIterations = 10;
    const intervalId = setInterval(() => {
      const shuffled = [...names].sort(() => Math.random() - 0.5);
      setResult(shuffled);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(intervalId);
        setIsShuffling(false);
      }
    }, 150);
  };

  // 모든 이름 지우기 핸들러
  const handleClearNames = () => {
    if (window.confirm('모든 이름을 삭제하시겠습니까?')) {
      setNames([]);
      localStorage.removeItem('randomPickerNames');
    }
  };

  // 모달 닫기 시 결과 초기화
  const handleClose = () => {
    setResult([]);
    onClose();
  };

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  // 애니메이션 변수
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

  const resultItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white tracking-tighter shadow-xl xs:max-h-[95vh] xs:w-[90vw]">
        <div className="p-6 xs:p-3">
          {/* 헤더 영역 */}
          <div className="mb-4 flex items-center justify-between xs:mb-2">
            <div className="flex items-center gap-3 xs:gap-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 xs:text-base">순서 뽑기</h3>
                <p className="text-sm text-gray-600 xs:text-xs">이름을 추가하고 순서를 무작위로 섞어보세요</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              title="닫기">
              <IoMdClose className="h-6 w-6 xs:h-5 xs:w-5" />
            </button>
          </div>

          {/* 이름 입력 폼 */}
          <div className="mb-4 flex items-center gap-2 xs:mb-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="flex-1 rounded-lg border border-indigo-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 xs:py-1.5 xs:text-xs"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddName();
                }
              }}
            />
            <button
              onClick={handleAddName}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-all hover:bg-indigo-700 active:scale-95 xs:px-3 xs:py-1.5 xs:text-sm">
              <FaPlus className="h-3 w-3" />
              <span>추가</span>
            </button>
          </div>

          {/* 이름 목록 상태 표시 */}
          <div className="mb-4 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 p-3 shadow-sm xs:mb-2 xs:p-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaListUl className="h-4 w-4 text-indigo-600" />
                <p className="text-sm text-indigo-700 xs:text-xs">
                  <span className="font-medium">{names.length}</span>명의 참가자 추가됨
                </p>
              </div>
              {names.length > 0 && (
                <button
                  onClick={handleClearNames}
                  className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition-all hover:bg-red-200 active:scale-95 xs:px-2 xs:py-0.5 xs:text-[10px]">
                  <IoMdClose className="h-3 w-3" />
                  <span>모두 지우기</span>
                </button>
              )}
            </div>
          </div>

          {/* 이름 목록 */}
          <div className="mb-4 xs:mb-2">
            <h3 className="mb-2 font-medium text-indigo-800 xs:mb-1 xs:text-sm">참가자 목록</h3>
            {names.length === 0 ? (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-indigo-200 bg-indigo-50 xs:h-16">
                <p className="text-center text-sm text-gray-500 xs:text-xs">아직 추가된 이름이 없습니다</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex max-h-40 flex-col gap-2 overflow-y-auto rounded-lg border border-indigo-100 bg-indigo-50 p-2 xs:max-h-32 xs:gap-1 xs:p-1.5">
                {names.map((name, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-center justify-between rounded-lg bg-white p-2 shadow-sm">
                    <span className="font-medium xs:text-sm">{name}</span>
                    <button
                      onClick={() => handleRemoveName(index)}
                      className="rounded-full bg-red-50 p-1.5 text-red-500 transition-colors hover:bg-red-100 active:scale-90 xs:p-1">
                      <FaTimes className="h-3 w-3 xs:h-2.5 xs:w-2.5" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* 순서 섞기 버튼 */}
          <button
            onClick={handleShuffle}
            disabled={names.length < 2 || isShuffling}
            className={`mb-4 w-full rounded-xl py-4 font-medium text-white shadow-md transition-all xs:mb-3 xs:py-3.5 xs:text-sm ${
              names.length < 2 || isShuffling
                ? 'cursor-not-allowed bg-gray-400'
                : 'active:scale-98 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 hover:shadow-lg'
            }`}>
            {isShuffling ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent xs:h-3.5 xs:w-3.5"></div>
                <span>섞는 중...</span>
              </div>
            ) : (
              <span>순서 섞기</span>
            )}
          </button>

          {/* 결과 표시 */}
          {result.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 shadow-md xs:p-3">
              <h3 className="mb-3 text-center font-bold text-indigo-800 xs:mb-2 xs:text-sm">순서 결과</h3>
              <motion.ol
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2 pl-6 xs:space-y-1.5 xs:pl-4">
                {result.map((name, index) => (
                  <motion.li
                    key={index}
                    variants={resultItemVariants}
                    className="rounded-lg bg-white p-2 font-medium shadow-sm xs:p-1.5 xs:text-sm">
                    {name}
                  </motion.li>
                ))}
              </motion.ol>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RandomPickerModal;
