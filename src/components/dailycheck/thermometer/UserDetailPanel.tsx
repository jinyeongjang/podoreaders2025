import { motion, AnimationControls } from 'framer-motion';
import { ThermometerUser, getLegendColor } from './utils';

interface UserDetailPanelProps {
  userData: ThermometerUser;
  bubbleControls: AnimationControls;
}

const UserDetailPanel = ({ userData, bubbleControls }: UserDetailPanelProps) => {
  const userTemp = userData.value;
  // 물방울 개수는 온도에 비례하도록 설정
  const bubbleCount = Math.max(3, Math.min(Math.floor(userTemp / 10), 8));

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 mt-4 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50/80 p-4 shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-full shadow-md xs:h-10 xs:w-10 ${getLegendColor(userData.userName)}`}>
              <span className="text-lg font-bold text-white xs:text-base">{userData.userName[0]}</span>

              {/* 물방울 애니메이션 효과 */}
              {[...Array(bubbleCount)].map((_, i) => (
                <motion.div
                  key={`bubble-${i}`}
                  custom={i}
                  animate={bubbleControls}
                  className="absolute h-2 w-2 rounded-full bg-white/60 opacity-0"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${50 - Math.random() * 30}%`,
                  }}
                />
              ))}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 xs:text-base">{userData.userName}</h3>
              <p className="text-sm text-gray-600 xs:text-xs">
                현재 순위: <span className="font-semibold text-indigo-600">{userData.rank}위</span>
              </p>
            </div>
          </div>

          <div className="relative text-center">
            <p className="text-sm font-medium text-gray-600 xs:text-xs">현재 온도</p>
            <p className="text-2xl font-bold text-indigo-600 xs:text-xl">{userData.value.toFixed(1)}°C</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-white/80 p-4 shadow-sm backdrop-blur-sm xs:grid-cols-1 xs:gap-2">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600">말씀 온도</div>
            <p className="mt-2 text-xl font-bold text-indigo-600">{userData.value.toFixed(1)}°C</p>
          </div>

          <div className="text-center">
            <div className="text-sm font-medium text-gray-600">1통독까지 남은 온도</div>
            <motion.div
              className="mt-2 text-xl font-bold text-indigo-600"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'loop',
              }}>
              {(100 - userData.value).toFixed(1)}°C
            </motion.div>
            <motion.div
              className="mt-1 text-xs text-indigo-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'mirror',
              }}>
              {Math.ceil((100 - userData.value) / 0.084)} 장 더 읽으면 완독!
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDetailPanel;
