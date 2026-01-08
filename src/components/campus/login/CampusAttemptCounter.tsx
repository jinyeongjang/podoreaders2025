import { motion } from 'framer-motion';

interface CampusAttemptCounterProps {
  attempts: number;
  maxAttempts: number;
  accentColor: string;
}

const CampusAttemptCounter = ({ attempts, maxAttempts, accentColor }: CampusAttemptCounterProps) => {
  const remainingAttempts = maxAttempts - attempts;

  // 시도 횟수에 따른 경고 수준 설정
  const getWarningLevel = () => {
    if (remainingAttempts <= 1) return 'bg-red-500';
    if (remainingAttempts <= 2) return 'bg-amber-500';
    return accentColor.replace('text-', 'bg-');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-lg ${
        remainingAttempts <= 1
          ? 'bg-red-50'
          : remainingAttempts <= 2
            ? 'bg-amber-50'
            : accentColor.replace('text-', 'bg-') + '/10'
      } p-3`}>
      <p
        className={`text-sm ${remainingAttempts <= 1 ? 'text-red-600' : remainingAttempts <= 2 ? 'text-amber-600' : accentColor} font-medium`}>
        {maxAttempts - attempts}회의 로그인 시도 기회가 남았습니다.
      </p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className={`h-full ${getWarningLevel()}`}
          initial={{ width: '100%' }}
          animate={{ width: `${(remainingAttempts / maxAttempts) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

export default CampusAttemptCounter;
