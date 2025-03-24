import { FaCheck } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { RiSunFoggyLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DawnPrayerCheckProps {
  dawnPrayerAttended: boolean;
  setDawnPrayerAttended: (attended: boolean) => void;
}

const DawnPrayerCheck: React.FC<DawnPrayerCheckProps> = ({ dawnPrayerAttended, setDawnPrayerAttended }) => {
  const [prevAttended, setPrevAttended] = useState(dawnPrayerAttended);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
      setPrevAttended(dawnPrayerAttended);
      return;
    }

    if (prevAttended !== dawnPrayerAttended) {
      setPrevAttended(dawnPrayerAttended);
    }
  }, [dawnPrayerAttended, prevAttended, isLoaded]);

  return (
    <div className="space-y-5">
      <div className="relative mt-8 flex items-center gap-3 overflow-hidden rounded-xl">
        <div className="z-10">
          <h3 className="text-lg font-semibold text-gray-800">4. 세이래 특별새벽기도 참석 여부</h3>
          <p className="ml-5 text-sm text-gray-700">현장/온라인 동일 2025.03.31(월) ~ 04.18(금)</p>
        </div>
      </div>

      {/* 새벽기도 참석 여부 체크 ui */}
      <motion.div
        className="overflow-hidden rounded-xl bg-white"
        animate={{
          boxShadow: dawnPrayerAttended
            ? '0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
        transition={{ duration: 0.3 }}>
        <div className="p-4">
          <div className="flex w-full gap-3">
            {/* '드렸어요' */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setDawnPrayerAttended(true)}
              animate={{
                backgroundColor: dawnPrayerAttended ? 'rgb(79, 70, 229)' : 'rgb(249, 250, 251)',
                color: dawnPrayerAttended ? 'white' : 'rgb(55, 65, 81)',
                y: isLoaded && dawnPrayerAttended && prevAttended !== dawnPrayerAttended ? [5, 0] : 0,
                scale: isLoaded && dawnPrayerAttended && prevAttended !== dawnPrayerAttended ? [0.95, 1.05, 1] : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg px-4 py-5 shadow-sm transition-colors`}>
              <div className="relative">
                <FaCheck className={`h-8 w-8 transition-colors`} />
              </div>
              <span className="font-medium">드렸어요</span>
            </motion.button>

            {/* '안 드렸어요' */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setDawnPrayerAttended(false)}
              animate={{
                backgroundColor: !dawnPrayerAttended ? 'rgb(55, 65, 81)' : 'rgb(249, 250, 251)',
                color: !dawnPrayerAttended ? 'white' : 'rgb(55, 65, 81)',
                y: isLoaded && !dawnPrayerAttended && prevAttended !== dawnPrayerAttended ? [5, 0] : 0,
                scale: isLoaded && !dawnPrayerAttended && prevAttended !== dawnPrayerAttended ? [0.95, 1.05, 1] : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg px-4 py-5 shadow-sm transition-colors`}>
              <div className="relative">
                <IoClose className={`h-8 w-8 transition-colors`} />
              </div>
              <span className="font-medium">안 드렸어요</span>
            </motion.button>
          </div>

          {/* 참석 여부에 따른 다른 메시지 ui */}
          <AnimatePresence mode="wait">
            <motion.div
              key={dawnPrayerAttended ? 'attended' : 'not-attended'}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden">
              {dawnPrayerAttended ? (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-start gap-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-3">
                  <RiSunFoggyLine className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                  <div className="text-sm">
                    <p className="font-medium text-indigo-700">오늘도 특별새벽기도에 참여하셨군요!</p>
                    <p className="mt-1 text-indigo-600/80">남은 기간까지 화이팅하세요!</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                  <RiSunFoggyLine className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <p>괜찮아요 내일도 있어요.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
          <div className="text-sm text-gray-600">
            <p>세이래 특별새벽기도 참석 여부는 현장·온라인과 상관없이 매주 통계에 반영됩니다.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DawnPrayerCheck;
