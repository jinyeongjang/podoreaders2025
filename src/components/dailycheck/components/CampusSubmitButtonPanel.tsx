import { motion } from 'framer-motion';
import { FaSpinner, FaCheck } from 'react-icons/fa';

interface CampusSubmitButtonPanelProps {
  isSaving: boolean;
  onPrayerButtonClick: () => void;
}

// 애니메이션 설정
const animations = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  },
};

const CampusSubmitButtonPanel: React.FC<CampusSubmitButtonPanelProps> = ({ isSaving }) => {
  return (
    <div className="mt-6 flex flex-col justify-end gap-2 tracking-tighter xs:flex-col">
      <motion.div
        variants={animations.container}
        initial="hidden"
        animate="show"
        className="container mx-auto h-[70px] w-full max-w-6xl rounded-xl p-0 tracking-tighter shadow-lg"
        style={{
          background: 'linear-gradient(-45deg, #4F46E5, #3B82F6, #60A5FA, #6376f1)',
          backgroundSize: '400% 400%',
          animation: 'gradient 5s ease infinite',
        }}>
        <style jsx global>{`
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
        <button
          type="submit"
          disabled={isSaving}
          className="flex h-full w-full items-center justify-center gap-2 px-4 text-white transition-all hover:shadow-md disabled:bg-opacity-50">
          {isSaving ? <FaSpinner className="h-5 w-5 animate-spin" /> : <FaCheck className="h-5 w-5" />}
          <span>{isSaving ? '저장 중...' : '큐티, 말씀 읽기 횟수 기록하기'}</span>
        </button>
      </motion.div>
    </div>
  );
};

export default CampusSubmitButtonPanel;
