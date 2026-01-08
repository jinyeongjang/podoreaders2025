import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

interface SubmitButtonPanelProps {
  isSaving: boolean;
  onPrayerButtonClick: () => void;
}

// 애니메이션 설정
const animations = {
  container: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  },
  button: {
    tap: { scale: 0.98 },
  },
};

const SubmitButtonPanel: React.FC<SubmitButtonPanelProps> = ({ isSaving, onPrayerButtonClick }) => {
  return (
    <motion.div
      variants={animations.container}
      initial="hidden"
      animate="show"
      className="mt-4 flex flex-col gap-2 tracking-tighter">
      {/* 기록 저장 버튼 - 전체 너비 */}
      <motion.button
        type="submit"
        disabled={isSaving}
        variants={animations.button}
        whileHover={{ scale: 1.02 }}
        whileTap="tap"
        className={`group relative flex h-[60px] w-full items-center justify-center rounded-xl px-4 text-white shadow-md transition-all ${
          isSaving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
        } overflow-hidden disabled:cursor-not-allowed disabled:opacity-70`}>
        {/* 배경 효과 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-5"></div>
        <div className="absolute inset-0 -left-3 top-0 h-full w-1/3 transform bg-white opacity-10 blur-xl transition-all duration-1000 group-hover:left-full"></div>

        <div className="relative flex items-center gap-3 font-medium">
          {isSaving ? <FaSpinner className="h-4 w-4 animate-spin text-white" /> : null}
          <span className="text-base font-semibold tracking-tight xs:text-sm">
            {isSaving ? '저장 중...' : '기록하기'}
          </span>
        </div>
      </motion.button>

      {/* 기도제목 작성 버튼 - 2열 구조 */}
      <div className="grid grid-cols-1 gap-2">
        <motion.button
          type="button"
          onClick={onPrayerButtonClick}
          variants={animations.button}
          whileHover={{ scale: 1.02 }}
          whileTap="tap"
          className="group relative flex h-[60px] w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700">
          {/* 배경 효과 */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-5"></div>
          <div className="absolute inset-0 -left-3 top-0 h-full w-1/3 transform bg-white opacity-10 blur-xl transition-all duration-1000 group-hover:left-full"></div>

          <div className="relative flex items-center gap-3 font-medium">
            <span className="text-base font-semibold tracking-tight xs:text-sm">기도제목 작성(준비중)</span>
          </div>
        </motion.button>
      </div>

      <div className="mt-3 rounded-xl border border-blue-200 bg-white/60 px-2 py-3 text-center text-sm text-gray-700 shadow-lg backdrop-blur-md">
        <span className="mx-1">기록하기 버튼을 눌러야 기록이 저장됩니다.</span>
      </div>
    </motion.div>
  );
};

export default SubmitButtonPanel;
