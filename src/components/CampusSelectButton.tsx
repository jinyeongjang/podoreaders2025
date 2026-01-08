import { motion } from 'framer-motion';
import { FaChevronRight, FaUniversity } from 'react-icons/fa';
import { useRouter } from 'next/router';

// 캠퍼스 매핑 데이터
const campusNames: Record<string, string> = {
  prayer: '기도',
  word: '말씀',
};

// 캠퍼스별 스타일 데이터
const campusStyles: Record<string, { gradient: string; icon: React.ReactNode; textColor: string; bgColor: string }> = {
  prayer: {
    gradient: 'from-indigo-500 to-blue-500',
    icon: <FaChevronRight className="h-4 w-4" />,
    textColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  word: {
    gradient: 'from-emerald-500 to-teal-500',
    icon: <FaChevronRight className="h-4 w-4" />,
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  test: {
    gradient: 'from-purple-500 to-violet-500',
    icon: <FaChevronRight className="h-4 w-4" />,
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
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
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  };

  // 배경 그라데이션 색상 결정
  const getStyle = () => {
    if (!selectedCampus)
      return {
        gradient: 'from-amber-500 to-amber-600',
        icon: <FaUniversity className="h-4 w-4" />,
        textColor: 'text-amber-600',
        bgColor: 'bg-amber-50',
      };

    return (
      campusStyles[selectedCampus] || {
        gradient: 'from-gray-500 to-gray-600',
        icon: <FaUniversity className="h-4 w-4" />,
        textColor: 'text-gray-600',
        bgColor: 'bg-gray-50',
      }
    );
  };

  const style = getStyle();

  // 버튼 클릭 처리
  const handleButtonClick = () => {
    // clearAuthOnClick이 true인 경우에만 인증 정보 삭제
    if (clearAuthOnClick) {
      localStorage.removeItem('campusAuthorized');
      localStorage.removeItem('lastPassword');
      // 캠퍼스 정보는 유지 (사용자 편의를 위해)
    }

    // 캠퍼스 선택 페이지로 이동
    router.push('/campusSelect');
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={handleButtonClick}
        className="relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-left shadow-sm transition-all"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap">
        {/* 배경 효과 - 개선된 그라데이션 */}
        <div className={`absolute left-0 top-0 h-2 w-full bg-gradient-to-r ${style.gradient}`}></div>

        <div className="flex items-center gap-3">
          {/* 아이콘 영역 - 캠퍼스별 맞춤 아이콘 */}
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${style.bgColor}`}>
            <div className={style.textColor}>{selectedCampus ? style.icon : <FaUniversity className="h-4 w-4" />}</div>
          </div>

          {/* 텍스트 영역 */}
          <div>
            <div className={`text-xs font-medium ${style.textColor}`}>
              {selectedCampus ? '내 소속 캠퍼스 beta' : '필수 선택사항 beta'}
            </div>
            <div className="text-base font-semibold text-gray-800">
              {selectedCampus ? `${campusNames[selectedCampus] || selectedCampus} 캠퍼스` : '캠퍼스를 선택해주세요'}
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              selectedCampus ? `${style.bgColor} ${style.textColor}` : 'bg-amber-100 text-amber-600'
            } hover:opacity-80`}>
            {selectedCampus ? '변경하기' : '선택하기'}
          </span>
          <FaChevronRight className={`h-3.5 w-3.5 ${style.textColor}`} />
        </div>
      </motion.button>
    </div>
  );
}
