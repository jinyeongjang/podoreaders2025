import { FaListUl, FaStickyNote, FaLocationArrow, FaUserPlus } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { FaShuffle } from 'react-icons/fa6';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface CampusDesignerProps {
  handleNoticeClick: () => void;
  handleLocationClick: () => void;
  handleRegisterClick: () => void;
  handleRandomPickerClick?: () => void;
}

const CampusDesigner: React.FC<CampusDesignerProps> = ({
  handleNoticeClick,
  handleLocationClick,
  handleRegisterClick,
  handleRandomPickerClick,
}) => {
  // 현재 호버된 아이템 상태 추적
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // 메뉴 항목 정의
  const menuItems = [
    {
      id: 'notice',
      icon: <FaStickyNote className="h-5 w-5" />,
      title: '공지사항 등록',
      bgGradient: 'from-indigo-500 to-blue-600',
      hoverGradient: 'from-indigo-600 to-blue-700',
      bgLight: 'from-indigo-50 to-blue-50',
      hoverLight: 'from-indigo-100 to-blue-100',
      textColor: 'text-indigo-700',
      onClick: handleNoticeClick,
    },
    {
      id: 'location',
      icon: <FaLocationArrow className="h-5 w-5" />,
      title: '모임장소 등록',
      bgGradient: 'from-yellow-500 to-orange-600',
      hoverGradient: 'from-yellow-600 to-orange-700',
      bgLight: 'from-yellow-50 to-orange-50',
      hoverLight: 'from-yellow-100 to-orange-100',
      textColor: 'text-orange-700',
      onClick: handleLocationClick,
    },
    {
      id: 'register',
      icon: <FaUserPlus className="h-5 w-5" />,
      title: '가족원 등록',
      bgGradient: 'from-purple-500 to-indigo-600',
      hoverGradient: 'from-purple-600 to-indigo-700',
      bgLight: 'from-purple-50 to-indigo-50',
      hoverLight: 'from-purple-100 to-indigo-100',
      textColor: 'text-indigo-700',
      onClick: handleRegisterClick,
    },
    // 순서뽑기 항목 추가
    {
      id: 'random',
      icon: <FaShuffle className="h-5 w-5" />,
      title: '순서 뽑기',
      bgGradient: 'from-blue-500 to-cyan-600',
      hoverGradient: 'from-blue-600 to-cyan-700',
      bgLight: 'from-blue-50 to-cyan-50',
      hoverLight: 'from-blue-100 to-cyan-100',
      textColor: 'text-cyan-700',
      onClick: handleRandomPickerClick,
    },
  ];

  return (
    <motion.div
      // 배경 그라데이션 및 그림자 효과 개선
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg transition-all hover:shadow-xl">
      {/* 상단 장식 바 */}
      <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500"></div>

      {/* 헤더 영역: 패딩 및 정렬 조정 */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <FaListUl className="text-indigo-600" />
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            캠퍼스 디자이너
          </span>
        </h3>
        <div className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm">v1.0</div>
      </div>

      {/* 메뉴 아이템 목록: 버튼 스타일 및 호버 효과 개선 */}
      <div className="space-y-3">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={item.onClick}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            whileTap={{ scale: 0.98 }}
            // 버튼 배경 및 테두리 개선
            className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-xl border border-transparent bg-gradient-to-r p-4 transition-all duration-300 hover:border-gray-200 hover:shadow-md ${
              hoveredItem === item.id ? item.hoverLight : item.bgLight
            }`}>
            {/* 아이콘 컨테이너: 그림자 및 크기 조정 */}
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${
                hoveredItem === item.id ? item.hoverGradient : item.bgGradient
              }`}>
              {item.icon}
            </div>

            {/* 텍스트 컨테이너: 폰트 크기 및 색상 조정 */}
            <div className="flex-1 text-left">
              <h4 className={`text-base font-semibold ${item.textColor}`}>{item.title}</h4>
            </div>

            {/* 우측 화살표 아이콘: 애니메이션 및 투명도 조정 */}
            <motion.div
              animate={{ x: hoveredItem === item.id ? 0 : -4, opacity: hoveredItem === item.id ? 0.8 : 0.3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className={`${item.textColor}`}>
              <IoIosArrowForward className="h-5 w-5" />
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* 하단 정보: 스타일 개선 */}
      <div className="mt-6 border-t border-gray-100 pt-4 text-center">
        <p className="text-xs font-medium text-indigo-500">포도리더스 캠퍼스 관리자</p>
        <p className="mt-1 text-[10px] text-gray-400">최근 업데이트: 2024.04.19</p>
      </div>
    </motion.div>
  );
};

export default CampusDesigner;
