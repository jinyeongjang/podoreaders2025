import { useState, useEffect, useCallback } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

interface WeeklyDecisionPreview {
  id?: number;
  user_name: string;
  week_start_date: string;
  week_end_date: string;
  decision_text: string;
  created_at?: string;
  updated_at?: string;
}

const WeeklyDecisionPreview = () => {
  const router = useRouter();

  // 현재 주의 시작일 및 진행률 계산
  const [dateInfo, setDateInfo] = useState({ weekProgress: 0, currentDay: '' });

  useEffect(() => {
    const today = new Date();
    const day = today.getDay(); // 0(일) ~ 6(토)

    // 주간 진행률 계산 (일요일 0% ~ 토요일 100%)
    const progress = (day / 6) * 100;
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    setDateInfo({
      weekProgress: Math.round(progress),
      currentDay: dayNames[day],
    });
  }, []);

  // 클릭 핸들러 메모이제이션
  const handleClick = useCallback(() => {
    router.push('/campusSelect/wordCampus_uiwan_decision');
  }, [router]);

  return (
    <div className="w-full">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="group relative flex w-full flex-col items-center justify-center p-2 focus:outline-none">
        <div className="relative z-10 flex w-full flex-col items-center gap-2">
          {/* 아이콘 */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200 transition-transform duration-300 group-hover:scale-110">
            <FaCheck className="h-6 w-6 text-white" />
          </div>

          {/* 텍스트 */}
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center"></div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600">한주간의 결단</h3>
            <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
              {dateInfo.weekProgress}% 진행
            </span>
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default WeeklyDecisionPreview;
