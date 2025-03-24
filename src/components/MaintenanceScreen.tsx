import { pretendard } from '../lib/fonts';
import { motion } from 'framer-motion';
import { MaintenanceStatus } from '../hooks/useMaintenanceStatus';

interface MaintenanceScreenProps {
  maintenanceStatus: MaintenanceStatus;
}

const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ maintenanceStatus }) => {
  return (
    <div className={`min-h-screen bg-gray-100 ${pretendard.className}`}>
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-center"></div>

          <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">서버 점검 중</h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6 text-center text-gray-600">
            {maintenanceStatus.message}
          </motion.p>

          {maintenanceStatus.ends_at && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-4 rounded-lg bg-yellow-100 p-3 text-center text-sm">
              <p className="font-medium text-yellow-800">
                예상 완료 시간: {new Date(maintenanceStatus.ends_at).toLocaleString('ko-KR')}
              </p>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-center text-sm text-gray-500">
            불편을 드려 죄송해요.<br></br>더 나은 포도리더스를 위해 서버를 점검하고 있어요.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScreen;
