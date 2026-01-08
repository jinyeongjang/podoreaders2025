import { useState, useEffect, useMemo, useCallback } from 'react';
import { FaCheck, FaChevronRight } from 'react-icons/fa';
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
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // 현재 주의 시작일 및 진행률 계산 (메모이제이션)
  const { weekProgress, currentDay } = useMemo(() => {
    const today = new Date();
    const day = today.getDay(); // 0(일) ~ 6(토)
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - day);

    // 주간 진행률 계산 (일요일 0% ~ 토요일 100%)
    const progress = (day / 6) * 100;

    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    return {
      weekProgress: Math.round(progress),
      currentDay: dayNames[day],
    };
  }, []);

  // 프로그레스바 애니메이션 (0%에서 현재 진행률까지)
  useEffect(() => {
    // 컴포넌트 마운트 후 약간 지연 후 애니메이션 시작
    const timer = setTimeout(() => {
      setAnimatedProgress(weekProgress);
    }, 200);

    return () => clearTimeout(timer);
  }, [weekProgress]);

  // 클릭 핸들러 메모이제이션
  const handleClick = useCallback(() => {
    router.push('/campusSelect/wordCampus_uiwan_decision');
  }, [router]);

  return (
    <div className="container mx-auto w-full">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleClick}
        className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/40 px-6 py-4 shadow-md shadow-indigo-100/30 backdrop-blur-sm transition-all hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-200/40 focus:outline-none focus:ring-2 focus:ring-indigo-400">
        <div className="relative z-10 flex w-full flex-col gap-3.5">
          {/* 상단: 아이콘 + 텍스트 + 화살표 */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* 아이콘 */}
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-400/40 transition-transform duration-300 group-hover:scale-105">
                <FaCheck className="h-5 w-5 text-white drop-shadow-sm" />
              </div>

              {/* 텍스트 */}
              <div className="items-baseline text-left">
                <p className="gap-2 text-base font-bold tracking-tight text-gray-900">한주간의 결단</p>
              </div>
            </div>

            {/* 화살표 */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur-sm transition-all group-hover:bg-white group-hover:shadow-md">
              <FaChevronRight className="h-4 w-4 text-indigo-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* 하단: 프로그레스 바 (전체 너비) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">이번 주 진행률</span>
              <span className="text-xs font-bold text-indigo-600">
                {currentDay}요일 • {weekProgress}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-gray-200 to-gray-100 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-l from-sky-500 via-indigo-500 to-indigo-600 shadow-sm transition-all duration-1000 ease-out"
                style={{ width: `${animatedProgress}%` }}
              />
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default WeeklyDecisionPreview;
