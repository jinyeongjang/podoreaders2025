import { motion, AnimatePresence } from 'framer-motion';
import { FaThermometerHalf, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import ThermometerCard2 from '../dailycheck/ThermometerCard2';
import ThermometerCard3 from '../dailycheck/ThermometerCard3';
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

  return (
    <>
      {/* 가족원 온도 토글 버튼 */}
      <div className="container mx-auto mb-2 w-[640px] tracking-tighter xs:w-full">
        <button
          onClick={() => setShowTemperatures(!showTemperatures)}
          className="flex w-full transform items-center justify-between rounded-xl bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 px-4 py-3 text-white transition-transform duration-300 ease-in-out hover:from-indigo-500 hover:via-indigo-600 hover:to-indigo-700 active:scale-95 active:from-indigo-600 active:via-indigo-700 active:to-indigo-800">
          <div className="flex-col">
            <div className="flex items-center gap-2">
              <FaThermometerHalf className="h-5 w-5" />
              <span className="text-lg font-semibold">가족원 말씀 릴레이 온도 현황판</span>
            </div>
          </div>
          {showTemperatures ? <FaAngleUp className="h-5 w-5" /> : <FaAngleDown className="h-5 w-5" />}
        </button>
      </div>

      {/* 가족원 온도 - 현황판 - 이벤트기간 */}
      <AnimatePresence>
        {showTemperatures && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto mb-4 w-[635px] rounded-xl bg-white px-2 py-2 tracking-tighter shadow-xl xs:w-full">
            <div className="grid grid-cols-4 gap-2 md:grid-cols-3 lg:grid-cols-5">
              {temperatureUsers
                .sort((a, b) => b.totalTemp - a.totalTemp)
                .map((user, index) => (
                  <div key={user.userName} className="rounded-xl">
                    <ThermometerCard2 userName={user.userName} value={user.totalTemp} rank={index + 1} />
                  </div>
                ))}
            </div>
            <p className="mt-2 flex flex-col rounded-xl bg-slate-200 px-4 py-2 text-xs md:text-sm">
              <span>
                3월부터 기록을 시작하고 3개월간의 온도를 측정하여 <br></br>금메달, 은메달, 동메달 순위가 매겨질
                예정입니다.
              </span>

              <p className="mt-2 flex flex-col rounded-xl bg-slate-200 py-2 text-xs md:text-sm">
                <span>3월기준 - 구약 929장 + 신약 260장 = 1189장 </span>
                <span>큐티 1회당 0.084°C, 말씀 1장당 0.084°C </span>
                <span>100°C (1189장)를 기준으로 정확히 1통독이 되게 산출</span>
              </p>

              <p className="mt-2 flex flex-col rounded-xl bg-slate-200 py-2 text-xs md:text-sm">
                <span>
                  1통독이 되지 않더라도 3개월 기준으로 <br></br>가장 높은 온도를 기준으로 순위가 선정됩니다.
                </span>
              </p>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 가족원 윷놀이판 섹션 */}
      <AnimatePresence>
        {showTemperatures && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto mb-4 w-[635px] rounded-xl bg-white px-2 py-4 tracking-tighter shadow-xl xs:w-full">
            {/* ThermometerCard3에 모든 사용자 데이터를 한 번에 전달 */}
            <ThermometerCard3
              users={
                temperatureUsers.map((user) => ({
                  userName: user.userName,
                  value: user.totalTemp,
                  rank:
                    temperatureUsers
                      .sort((a, b) => b.totalTemp - a.totalTemp)
                      .findIndex((u) => u.userName === user.userName) + 1,
                })) || []
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
