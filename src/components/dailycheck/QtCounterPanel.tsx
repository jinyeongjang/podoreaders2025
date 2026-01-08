import { FaBook, FaBible, FaPen, FaCheck, FaPray } from 'react-icons/fa';
import { motion } from 'framer-motion';
import CounterButton from './components/CounterButton';

interface QtCounterPanelProps {
  qtCount: number;
  setQtCount: (value: number) => void;
  bibleReadCount: number;
  setBibleReadCount: (value: number) => void;
  qtDone: boolean;
  setQtDone: (value: boolean) => void;
  bibleReadDone: boolean;
  setBibleReadDone: (value: boolean) => void;
  writingDone: boolean;
  setWritingDone: (value: boolean) => void;
  dawnPrayerAttended: boolean;
  setDawnPrayerAttended: (value: boolean) => void;
}

const QtCounterPanel: React.FC<QtCounterPanelProps> = ({
  qtCount,
  setQtCount,
  bibleReadCount,
  setBibleReadCount,
  qtDone,
  setQtDone,
  bibleReadDone,
  setBibleReadDone,
  writingDone,
  setWritingDone,
  dawnPrayerAttended,
  setDawnPrayerAttended,
}) => {
  // 카운터 값을 변경할 때 사용할 함수
  const handleQtCountChange = (newValue: number) => {
    setQtCount(newValue);
  };

  const handleBibleReadCountChange = (newValue: number) => {
    setBibleReadCount(newValue);
  };

  return (
    <>
      <motion.div
        className="mb-6 grid grid-cols-2 gap-4 tracking-tighter"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}>
        <div className="rounded-2xl border border-white/40 bg-white/30 p-2 shadow-md backdrop-blur-lg">
          <CounterButton
            count={qtCount}
            setCount={handleQtCountChange}
            label="큐티 횟수(일)"
            icon={<FaBook className="h-5 w-5 text-indigo-500" />}
          />
        </div>
        <div className="rounded-2xl border border-white/40 bg-white/30 p-2 shadow-md backdrop-blur-lg">
          <CounterButton
            count={bibleReadCount}
            setCount={handleBibleReadCountChange}
            label="말씀 읽기 횟수(장)"
            icon={<FaBible className="h-5 w-5 text-indigo-500" />}
          />
        </div>
      </motion.div>

      <label className="mb-4 block text-lg font-semibold text-gray-700">3. 완료 여부</label>

      <motion.div
        className="grid grid-cols-2 gap-3 sm:grid-cols-2 xs:grid-cols-2"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}>
        <div className="relative">
          <motion.button
            type="button"
            onClick={() => setQtDone(!qtDone)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`flex h-[50px] w-full items-center gap-2 rounded-2xl border border-white/40 px-2 py-2 shadow-md backdrop-blur-lg transition-all ${qtDone ? 'bg-indigo-100/50 ring-2 ring-indigo-400' : 'bg-white/30 ring-1 ring-gray-200'} hover:bg-gradient-to-r hover:from-indigo-100/60 hover:to-indigo-300/40 active:bg-indigo-100/60`}>
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-xl ${qtDone ? 'bg-indigo-400 text-white' : 'bg-white/70 ring-1 ring-gray-300'}`}>
              {qtDone && <FaCheck size={14} />}
            </div>
            <div className="flex items-center gap-2">
              <FaBook className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">큐티</span>
            </div>
          </motion.button>
        </div>

        <div className="relative">
          <motion.button
            type="button"
            onClick={() => setBibleReadDone(!bibleReadDone)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`flex h-[50px] w-full items-center gap-2 rounded-2xl border border-white/40 px-2 py-2 shadow-md backdrop-blur-lg transition-all ${bibleReadDone ? 'bg-indigo-100/50 ring-2 ring-indigo-400' : 'bg-white/30 ring-1 ring-gray-200'} hover:bg-gradient-to-r hover:from-indigo-100/60 hover:to-indigo-300/40 active:bg-indigo-100/60`}>
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-xl ${bibleReadDone ? 'bg-indigo-400 text-white' : 'bg-white/70 ring-1 ring-gray-300'}`}>
              {bibleReadDone && <FaCheck size={14} />}
            </div>
            <div className="flex items-center gap-2">
              <FaBible className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">말씀</span>
            </div>
          </motion.button>
        </div>

        <div className="relative">
          <motion.button
            type="button"
            onClick={() => setWritingDone(!writingDone)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`flex h-[50px] w-full items-center gap-2 rounded-2xl border border-white/40 px-2 py-2 shadow-md backdrop-blur-lg transition-all ${writingDone ? 'bg-indigo-100/50 ring-2 ring-indigo-400' : 'bg-white/30 ring-1 ring-gray-200'} hover:bg-gradient-to-r hover:from-indigo-100/60 hover:to-indigo-300/40 active:bg-indigo-100/60`}>
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-xl ${writingDone ? 'bg-indigo-400 text-white' : 'bg-white/70 ring-1 ring-gray-300'}`}>
              {writingDone && <FaCheck size={14} />}
            </div>
            <div className="flex items-center gap-2">
              <FaPen className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">필사</span>
            </div>
          </motion.button>
        </div>

        <div className="relative">
          <motion.button
            type="button"
            onClick={() => setDawnPrayerAttended(!dawnPrayerAttended)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`flex h-[50px] w-full items-center gap-2 rounded-2xl border border-white/40 px-2 py-2 shadow-md backdrop-blur-lg transition-all ${dawnPrayerAttended ? 'bg-indigo-100/50 ring-2 ring-indigo-400' : 'bg-white/30 ring-1 ring-gray-200'} hover:bg-gradient-to-r hover:from-indigo-100/60 hover:to-indigo-300/40 active:bg-indigo-100/60`}>
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-xl ${dawnPrayerAttended ? 'bg-indigo-400 text-white' : 'bg-white/70 ring-1 ring-gray-300'}`}>
              {dawnPrayerAttended && <FaCheck size={14} />}
            </div>
            <div className="flex items-center gap-2">
              <FaPray className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">새벽기도</span>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default QtCounterPanel;
