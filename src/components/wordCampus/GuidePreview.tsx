import { useCallback } from 'react';
import { FaBook, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const GuidePreview = () => {
  const router = useRouter();

  // 클릭 핸들러 메모이제이션
  const handleClick = useCallback(() => {
    router.push('/campusSelect/wordCampus_uiwan_guide');
  }, [router]);

  return (
    <div className="w-full">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleClick}
        className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-white via-emerald-50/40 to-green-50/40 px-6 py-4 shadow-md shadow-emerald-100/30 backdrop-blur-sm transition-all hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-200/40 focus:outline-none focus:ring-2 focus:ring-emerald-400">
        <div className="relative z-10 flex w-full flex-col gap-3.5">
          {/* 상단: 아이콘 + 텍스트 + 화살표 */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* 아이콘 */}
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-400/40 transition-transform duration-300 group-hover:scale-105">
                <FaBook className="h-5 w-5 text-white drop-shadow-sm" />
              </div>

              {/* 텍스트 */}
              <div className="text-left">
                <div className="mb-1 flex items-baseline gap-2.5 text-base font-bold font-medium">
                  <p className="text-base font-bold tracking-tight text-gray-900">사용 가이드</p>
                </div>
                <p className="text-xs text-gray-600">
                  여기를 눌러 사용법을 간단하게<br></br>확인할 수 있어요.
                </p>
              </div>
            </div>

            {/* 화살표 */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur-sm transition-all group-hover:bg-white group-hover:shadow-md">
              <FaChevronRight className="h-4 w-4 text-emerald-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default GuidePreview;
