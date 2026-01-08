import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaStickyNote, FaArrowRight, FaTimes } from 'react-icons/fa';
import { FaLocationArrow, FaShuffle, FaListUl, FaBars } from 'react-icons/fa6';

interface MobileCampusDesignerProps {
  handleNoticeClick: () => void;
  handleLocationClick: () => void;
  handleRegisterClick: () => void;
  handleRandomPickerClick?: () => void;
}

const MobileCampusDesigner: React.FC<MobileCampusDesignerProps> = ({
  handleNoticeClick,
  handleLocationClick,
  handleRegisterClick,
  handleRandomPickerClick,
}) => {
  // 사이드바 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);

  // 메뉴 열기/닫기 핸들러
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // 메뉴 항목 정의
  const menuItems = [
    {
      id: 'notice',
      icon: <FaStickyNote className="h-5 w-5" />,
      title: '공지사항 등록',
      bgGradient: 'from-indigo-500 to-blue-600',
      bgLight: 'from-indigo-50 to-blue-50',
      textColor: 'text-indigo-700',
      arrowColor: 'text-indigo-700',
      onClick: () => {
        handleNoticeClick();
        setIsOpen(false);
      },
    },
    {
      id: 'location',
      icon: <FaLocationArrow className="h-5 w-5" />,
      title: '모임장소 등록',
      bgGradient: 'from-yellow-500 to-orange-600',
      bgLight: 'from-yellow-50 to-orange-50',
      textColor: 'text-orange-700',
      arrowColor: 'text-orange-700',
      onClick: () => {
        handleLocationClick();
        setIsOpen(false);
      },
    },
    {
      id: 'register',
      icon: <FaUserPlus className="h-5 w-5" />,
      title: '가족원 등록',
      bgGradient: 'from-purple-500 to-indigo-600',
      bgLight: 'from-purple-50 to-indigo-50',
      textColor: 'text-indigo-700',
      arrowColor: 'text-indigo-700',
      onClick: () => {
        handleRegisterClick();
        setIsOpen(false);
      },
    },
    {
      id: 'random',
      icon: <FaShuffle className="h-5 w-5" />,
      title: '순서 뽑기',
      bgGradient: 'from-blue-500 to-cyan-600',
      bgLight: 'from-blue-50 to-cyan-50',
      textColor: 'text-cyan-700',
      arrowColor: 'text-cyan-700',
      onClick: () => {
        if (handleRandomPickerClick) {
          handleRandomPickerClick();
          setIsOpen(false);
        }
      },
    },
  ];

  // 사이드바 애니메이션 설정
  const sidebarVariants = {
    closed: { x: '100%', opacity: 0.5 },
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <>
      {/* 모바일 메뉴 버튼 (화면 우측 하단에 고정) */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-[80px] right-3 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 lg:hidden">
        <FaBars className="h-6 w-6 text-white" />
      </button>

      {/* 사이드바 오버레이 및 메뉴 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              key="overlay"
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* 사이드바 메뉴 */}
            <motion.div
              key="sidebar"
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed bottom-0 right-0 top-[130px] z-50 w-3/4 max-w-sm overflow-y-auto rounded-l-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-2xl lg:hidden">
              {/* 상단 장식 바 */}
              <div className="absolute left-0 top-0 h-1.5 w-full rounded-l-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500"></div>

              {/* 메뉴 헤더 */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaListUl className="text-indigo-600" />
                  <h3 className="text-lg font-bold text-gray-800">
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      캠퍼스 디자이너
                    </span>
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100">
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              {/* 메뉴 아이템 목록 */}
              <div className="space-y-3">
                {menuItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    custom={i}
                    initial="closed"
                    animate="open"
                    onClick={item.onClick}
                    className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-xl bg-gradient-to-r ${item.bgLight} p-4 transition-all duration-300 hover:shadow-md active:scale-95`}>
                    {/* 아이콘 컨테이너 */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.bgGradient} text-white shadow-lg transition-all duration-300 group-hover:shadow-xl`}>
                      {item.icon}
                    </div>

                    {/* 텍스트 컨테이너 */}
                    <div className="flex-1 text-left">
                      <h4 className={`font-bold ${item.textColor}`}>{item.title}</h4>
                    </div>

                    {/* 화살표 아이콘 */}
                    <div className={item.arrowColor}>
                      <FaArrowRight className="opacity-70" />
                    </div>

                    {/* 배경 장식 */}
                    <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br from-white/10 to-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                  </motion.button>
                ))}
              </div>

              {/* 하단 정보 */}
              <div className="mt-auto">
                <div className="border-t border-gray-100 pt-4 text-center">
                  <p className="text-xs font-medium text-indigo-400">포도리더스 캠퍼스 관리자</p>
                  <p className="mt-1 text-[10px] text-gray-400">최근 업데이트: 2024.04.24</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileCampusDesigner;
