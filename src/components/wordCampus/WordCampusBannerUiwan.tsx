import { motion } from 'framer-motion';
import { RiUserHeartLine } from 'react-icons/ri';

export default function WordCampusBannerUiwan() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
      className="container mx-auto mb-2 w-full overflow-hidden rounded-2xl">
      <div className="relative">
        {/* 배너 내용 */}
        <div className="relative flex items-center justify-center gap-4 px-0 py-1">
          <div className="flex flex-col items-center gap-2">
            {/* 아이콘 */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-200">
              <RiUserHeartLine className="h-6 w-6 text-white" />
            </div>

            {/* 텍스트 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[12px] font-bold text-emerald-600">
                  말씀캠퍼스
                </span>
              </div>
              <h3 className="mt-1 text-lg font-bold tracking-tight text-emerald-900">
                환영해요. 김의완 가족입니다. ^_^
              </h3>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
