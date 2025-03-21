import { motion } from 'framer-motion';
import { FaChevronRight, FaExchangeAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';

// 캠퍼스 매핑 데이터
const campusNames: Record<string, string> = {
  prayer: '기도',
  word: '말씀',
  test: '테스트',
};

interface CampusSelectButtonProps {
  selectedCampus: string | null;
  clearAuthOnClick?: boolean;
}

export default function CampusSelectButton({ selectedCampus, clearAuthOnClick = false }: CampusSelectButtonProps) {
  const router = useRouter();

  // 애니메이션 설정
  const buttonVariants = {
    hover: {
      scale: 1.01,
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.1)',
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  };

  // 배경 그라데이션 색상 결정
  const getBgGradient = () => {
    if (!selectedCampus) return 'from-amber-500 to-amber-600';

    switch (selectedCampus) {
      case 'prayer':
        return 'from-indigo-500 to-blue-500';
      case 'word':
        return 'from-emerald-500 to-teal-500';
      case 'test':
        return 'from-purple-500 to-violet-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // 버튼 클릭 처리
  const handleButtonClick = () => {
    // clearAuthOnClick이 true인 경우에만 인증 정보 삭제
    if (clearAuthOnClick) {
      localStorage.removeItem('campusAuthorized');
      localStorage.removeItem('accessLevel');
      localStorage.removeItem('lastPassword');
      // 캠퍼스 정보는 유지 (사용자 편의를 위해)
    }

    // 캠퍼스 선택 페이지로 이동
    router.push('/campusSelect');
  };

  // 캠퍼스 선택된 상태에 따른 표시 정보
  const renderCampusInfo = () => {
    if (selectedCampus) {
      return (
        <>
          <div className="text-xs font-medium uppercase text-indigo-500">내 소속 캠퍼스</div>
          <div className="font-medium text-gray-800">{campusNames[selectedCampus] || selectedCampus} 캠퍼스</div>
        </>
      );
    } else {
      return (
        <>
          <div className="text-xs font-medium uppercase text-amber-500">필수 선택사항</div>
          <div className="font-medium text-gray-600">캠퍼스를 선택해주세요</div>
        </>
      );
    }
  };

  return (
    <div className="mb-4 mt-3">
      <motion.button
        onClick={handleButtonClick}
        className="relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-left shadow-sm transition-all"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap">
        {/* 배경 효과 */}
        <div className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${getBgGradient()}`}></div>

        <div className="flex items-center gap-3">
          {/* 선택된 캠퍼스가 있을 때 변경 아이콘 표시 */}
          {selectedCampus && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50">
              <FaExchangeAlt className="h-4 w-4 text-indigo-500" />
            </div>
          )}
          <div>{renderCampusInfo()}</div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full bg-opacity-10 px-3 py-1.5 text-xs font-medium ${
              selectedCampus ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'
            }`}>
            {selectedCampus ? '변경하기' : '선택하기'}
          </span>
          <FaChevronRight className="h-3.5 w-3.5 text-gray-400" />
        </div>
      </motion.button>
    </div>
  );
}
