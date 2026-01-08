import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import { pretendard } from '../lib/fonts';

export default function Custom404() {
  const router = useRouter();

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-white ${pretendard.className}`}>
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center">
          <FaExclamationTriangle className="mx-auto mb-6 h-16 w-16 text-yellow-500" />
          <h1 className="mb-4 text-4xl font-bold text-gray-800">404</h1>
          <p className="mb-8 text-xl text-gray-600">서버를 점검중이거나 잘못된 경로입니다.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-white transition-all hover:bg-indigo-600">
            <FaHome className="h-5 w-5" />
            <span>홈으로 돌아가기</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
