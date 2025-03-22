import { motion } from 'framer-motion';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';

interface CampusInfo {
  id: string;
  name: string;
  description?: string;
}

interface CampusSelectionScreenProps {
  campusList: CampusInfo[];
  selectedCampus: string | null;
  previouslySaved: boolean;
  onSelectCampus: (campusId: string) => void;
  onConfirm: () => void;
}

export default function CampusSelectionScreen({
  campusList,
  selectedCampus,
  previouslySaved,
  onSelectCampus,
  onConfirm,
}: CampusSelectionScreenProps) {
  return (
    <>
      <div className="mb-8 px-2 py-2 xs:mb-2 xs:mt-2">
        <h1 className="text-2xl font-bold text-gray-900 xs:text-[20px]">가족장보고서의 새이름,</h1>
        <h1 className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent xs:text-[20px]">
          포도리더스에 오신 것을 환영해요 <span className="inline-flex text-black">👋✨</span>
        </h1>
      </div>

      <motion.div
        className="container mx-auto mb-8 flex w-[640px] items-center justify-center rounded-xl px-2 py-3 text-center tracking-tighter text-white shadow-xl xs:w-full xs:px-4 xs:py-2"
        style={{
          background: 'linear-gradient(45deg, #4F46E5, #60A5FA, #9EA5E9, #3B82F6)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 5,
          ease: 'easeInOut',
          repeat: Infinity,
        }}>
        <h2 className="text-lg font-semibold xs:text-[17px]">시작하기 전 소속 캠퍼스를 선택해주세요.</h2>
      </motion.div>

      <div className="mb-8 space-y-4 xs:mb-6">
        {campusList.map((campus, index) => (
          <CampusCard
            key={campus.id}
            campus={campus}
            isSelected={selectedCampus === campus.id}
            index={index}
            onSelect={() => onSelectCampus(campus.id)}
            icon={undefined}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <motion.button
          onClick={onConfirm}
          disabled={!selectedCampus}
          className={`flex w-full items-center justify-center gap-3 rounded-xl px-8 py-4 text-lg font-medium text-white transition-all xs:px-5 ${
            selectedCampus
              ? 'bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg hover:from-indigo-700 hover:to-blue-600 hover:shadow-xl'
              : 'cursor-not-allowed bg-gray-400'
          }`}
          whileTap={selectedCampus ? { scale: 0.97 } : {}}
          whileHover={selectedCampus ? { scale: 1.02 } : {}}>
          {previouslySaved ? '캠퍼스 선택 완료' : '캠퍼스 선택 완료'}
          <FaArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    </>
  );
}

interface CampusCardProps {
  campus: CampusInfo;
  isSelected: boolean;
  index: number;
  icon: React.ReactNode;
  onSelect: () => void;
}

function CampusCard({ campus, isSelected, index, onSelect }: CampusCardProps) {
  // 캠퍼스별 스타일 설정
  const getBorderStyle = () => {
    if (!isSelected) return 'border-gray-200';

    switch (campus.id) {
      case 'prayer':
        return 'border-indigo-500 ring-2 ring-indigo-200';
      case 'word':
        return 'border-indigo-500 ring-2 ring-indigo-200';
      case 'test':
        return 'border-indigo-500 ring-2 ring-indigo-200';
      default:
        return 'border-indigo-500 ring-2 ring-indigo-200';
    }
  };

  const getBackgroundStyle = () => {
    if (!isSelected) return 'bg-white hover:bg-gray-50';

    switch (campus.id) {
      case 'prayer':
        return 'bg-indigo-50';
      case 'word':
        return 'bg-indigo-50';
      case 'test':
        return 'bg-indigo-50';
      default:
        return 'bg-indigo-50';
    }
  };

  const getTextStyle = () => {
    if (!isSelected) return 'text-gray-800';

    switch (campus.id) {
      case 'prayer':
        return 'text-indigo-700';
      case 'word':
        return 'text-indigo-700';
      case 'test':
        return 'text-indigo-700';
      default:
        return 'text-indigo-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      onClick={onSelect}
      className={`relative cursor-pointer overflow-hidden rounded-xl border p-5 shadow transition-all hover:shadow-md ${getBorderStyle()} ${getBackgroundStyle()}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${getTextStyle()}`}>{campus.name} 캠퍼스</h3>
          <p className="mt-1 text-sm text-gray-600">{campus.description}</p>
        </div>

        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute right-5 top-5">
            <FaCheckCircle
              className={`h-7 w-7 ${campus.id === 'prayer' ? 'text-indigo-500' : campus.id === 'word' ? 'text-indigo-500' : 'text-indigo-500'}`}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
