import { motion, AnimatePresence } from 'framer-motion';
import { FaThermometerHalf, FaAngleDown, FaAngleUp, FaMedal, FaCrown } from 'react-icons/fa';
import { UserTemperature } from '../../hooks/useTemperatureStats';

interface TemperatureSectionProps {
  userTemps: {
    users?: UserTemperature[];
  };
  showTemperatures: boolean;
  setShowTemperatures: (show: boolean) => void;
}

export default function TemperatureSection({
  userTemps,
  showTemperatures,
  setShowTemperatures,
}: TemperatureSectionProps) {
  // users가 undefined일 경우 빈 배열로 초기화
  const temperatureUsers = userTemps.users || [];

  // 순위에 따른 아이콘 및 배경색 결정
  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: <FaCrown className="mr-1.5 h-4 w-4 text-yellow-500" />,
          borderColor: 'border-yellow-200',
          bgColor: 'rounded-xl bg-gradient-to-r from-orange-100 to-sky-100',
        };
      case 2:
        return {
          icon: <FaMedal className="mr-1.5 h-4 w-4 text-gray-400" />,
          borderColor: 'border-gray-200',
        };
      case 3:
        return {
          icon: <FaMedal className="mr-1.5 h-4 w-4 text-amber-600" />,
          borderColor: 'border-amber-200',
        };
      default:
        return {
          icon: null,
          bgColor: rank <= 10 ? 'bg-white' : 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  return (
    <>
      {/* 가족원 온도 토글 버튼 */}
      <div className="container mx-auto mb-2 w-[640px] tracking-tighter xs:w-full">
        <button
          onClick={() => setShowTemperatures(!showTemperatures)}
          className="flex w-full transform items-center justify-between rounded-xl bg-slate-200 px-4 py-3 text-black transition-all hover:bg-slate-300 hover:shadow-xl active:bg-slate-400">
          <div className="flex-col">
            <div className="flex items-center gap-2">
              <FaThermometerHalf className="h-5 w-5" />
              <span className="text-lg font-semibold">가족원 말씀 릴레이 온도</span>
            </div>
          </div>
          {showTemperatures ? <FaAngleUp className="h-5 w-5" /> : <FaAngleDown className="h-5 w-5" />}
        </button>
      </div>

      {/* 가족원 온도 - 현황판 */}
      <AnimatePresence>
        {showTemperatures && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto mb-4 w-[635px] rounded-xl bg-white tracking-tighter shadow-xl xs:w-full">
            {/* 테이블 */}
            <div className="overflow-hidden p-3 xs:p-2">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 xs:px-2 xs:py-2 xs:text-xs">
                        순위
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 xs:px-2 xs:py-2 xs:text-xs">
                        이름
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 xs:px-2 xs:py-2 xs:text-xs">
                        온도
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 xs:px-2 xs:py-2 xs:text-xs">
                        진행률
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {temperatureUsers
                      .sort((a, b) => b.totalTemp - a.totalTemp)
                      .map((user, index) => {
                        const rank = index + 1;
                        const rankInfo = getRankDisplay(rank);

                        return (
                          <motion.tr
                            key={user.userName}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: rank * 0.05, duration: 0.3 }}
                            className={`${rankInfo.bgColor} border-b border-gray-200`}>
                            <td className="px-4 py-3 text-left xs:px-2 xs:py-2">
                              <div className="flex items-center">
                                {rankInfo.icon}
                                <span className="text-sm font-medium text-gray-800 xs:text-xs">{rank}위</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-left xs:px-2 xs:py-2">
                              <span className="text-sm font-medium text-gray-800 xs:text-xs">{user.userName}</span>
                            </td>
                            <td className="px-4 py-3 text-center xs:px-2 xs:py-2">
                              <span className="text-base font-bold text-indigo-600 xs:text-sm">
                                {user.totalTemp.toFixed(1)}°C
                              </span>
                            </td>
                            <td className="px-4 py-3 xs:px-2 xs:py-2">
                              <div className="flex flex-col items-center">
                                <span className="mt-1 text-xs text-gray-500">
                                  {Math.min(Math.round(user.totalTemp), 100)}%
                                </span>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
