import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

interface LoginSuccessDisplayProps {
  message?: string;
}

const LoginSuccessDisplay = ({ message = '가족장·부가족장님 환영해요! 👋' }: LoginSuccessDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-2xl bg-green-50 px-4 py-4 text-center">
      <div className="flex items-center justify-center gap-2 text-xl font-bold text-green-600">
        <FaCheckCircle className="h-6 w-6" />
        <span>{message}</span>
      </div>

      {/* 로딩 indicator */}
      <div className="mt-4 flex justify-center">
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-green-200">
          <motion.div
            className="h-full bg-green-500"
            initial={{ x: -100 }}
            animate={{ x: 100 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
      <p className="mt-2 text-sm text-green-500">페이지 이동중...</p>
    </motion.div>
  );
};

export default LoginSuccessDisplay;
