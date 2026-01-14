import { useCallback } from 'react';
import { FaBook } from 'react-icons/fa';
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="group relative flex w-full flex-col items-center justify-center p-2 focus:outline-none">
        <div className="relative z-10 flex w-full flex-col items-center gap-2">
          {/* 아이콘 */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-200 transition-transform duration-300 group-hover:scale-110">
            <FaBook className="h-6 w-6 text-white" />
          </div>

          {/* 텍스트 */}
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600"></span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600">사용 가이드</h3>
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default GuidePreview;
