import { motion, AnimatePresence } from 'framer-motion';
import { FaMoon, FaChevronDown, FaRegBell, FaPray } from 'react-icons/fa';
import { useState } from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';

export default function NoticeSection() {
  // 타이프라이터 효과 사용 (상위 텍스트만)
  const { displayedText: titleText, isTyping: isTitleTyping } = useTypewriter({
    text: '또 한번 새롭게. 가능성을 열다.',
    speed: 70,
  });

  const subtitleText = '포도리더스 2.0 업데이트 / 성능개선 / 새로운 UI / 유연하게.';

  // 이전 알림 표시 상태 관리
  const [showOldNotices, setShowOldNotices] = useState(false);

  return (
    <div className="container mx-auto mb-4 grid w-full max-w-[640px] grid-cols-1 gap-3 px-4 sm:px-0">
      {/* 세이래 특별새벽기도회 배너 */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-2xl border border-blue-100/50 bg-gradient-to-br from-white/80 via-blue-50/50 to-blue-100/50 px-5 py-4 text-blue-900 shadow-lg shadow-blue-100/50 backdrop-blur-md transition-all hover:shadow-xl hover:shadow-blue-200/50">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-400/10 blur-2xl transition-all group-hover:bg-blue-400/20" />
        
        <div className="relative flex items-center justify-between">
          {/* 텍스트 왼쪽 배치 */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-blue-100 px-4 py-2 text-[10px] font-bold text-blue-600">
            종료
              </span>
              <p className="text-[11px] font-medium tracking-tight text-blue-600/80">
                2025.10.27(월) ~ 11.15(토)
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-base font-bold tracking-tight text-slate-800 sm:text-lg">
                세이래&추수감사 특별새벽기도회
              </p>
              <p className="text-sm font-medium text-blue-600/90">
                기도가 고도를 결정한다
              </p>
            </div>
          </div>

          {/* 아이콘/텍스트 오른쪽 배치 */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500 shadow-sm ring-1 ring-blue-100 transition-colors group-hover:bg-white group-hover:text-blue-600">
            <FaPray className="h-5 w-5" />
          </div>
        </div>
      </motion.div>

      {/* 새 버전 출시 안내 배너 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-2xl border border-purple-100/50 bg-gradient-to-br from-white/80 via-purple-50/50 to-purple-100/50 px-5 py-4 text-purple-900 shadow-lg shadow-purple-100/50 backdrop-blur-md transition-all hover:shadow-xl hover:shadow-purple-200/50">
        <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-purple-400/10 blur-2xl transition-all group-hover:bg-purple-400/20" />
        
        <div className="relative flex items-center justify-between">
          <div className="space-y-1">
            {/* 하위 텍스트: fade-in */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-600">
                업데이트
              </span>
              <p className="text-[11px] font-medium tracking-tight text-purple-600/80">
                포도리더스 2.0
              </p>
            </motion.div>
            
            {/* 상위 텍스트: typewriter */}
            <div className="min-h-[1.5rem]">
              <p className="text-base font-bold tracking-tight text-slate-800 sm:text-lg">
                {titleText}
                {isTitleTyping && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-purple-500 align-middle" />}
              </p>
            </div>
            <p className="text-sm font-medium text-purple-600/90">
              {subtitleText}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 지난 알림 보기 토글 버튼 */}
      <motion.button
        onClick={() => setShowOldNotices((prev) => !prev)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="group flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white/50 px-4 py-3 text-gray-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md hover:text-gray-900">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700">
            <FaRegBell size={12} />
          </div>
          <span className="text-sm font-medium">지난 알림 보기</span>
        </div>
        <div className={`transform transition-transform duration-300 ${showOldNotices ? 'rotate-180' : ''}`}>
          <FaChevronDown size={12} className="text-gray-400 group-hover:text-gray-600" />
        </div>
      </motion.button>

      {/* 이전 알림 섹션 (접을 수 있음) */}
      <AnimatePresence>
        {showOldNotices && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden">
            <div className="space-y-3 pt-1">
              {/* 한글날 안내 배너 */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-green-100/50 bg-gradient-to-br from-white/80 via-green-50/50 to-green-100/50 px-5 py-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-green-600/80">
                      579돌 | 2025.10.9 (목)
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      세종대왕의 한글 창제를 기념합니다
                    </p>
                  </div>
                  <span className="text-lg font-bold text-green-500/30">한글날</span>
                </div>
              </motion.div>

              {/* 추석 명절 안내 배너 */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-amber-100/50 bg-gradient-to-br from-white/80 via-amber-50/50 to-amber-100/50 px-5 py-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">
                      2025년 추석은 <span className="text-amber-600">10월 6일(월)</span>입니다
                    </p>
                    <p className="text-xs font-medium text-amber-700/70">
                      풍성하고 마음은 넉넉한 복된 명절 되시길 소망합니다
                    </p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-amber-500 shadow-sm">
                    <FaMoon size={14} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
