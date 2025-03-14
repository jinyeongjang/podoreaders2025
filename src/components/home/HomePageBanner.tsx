import { motion } from 'framer-motion';
import { FaBook } from 'react-icons/fa';

export default function HomePageBanner() {
  return (
    <>
      <div className="container mx-auto w-[640px] rounded-xl rounded-t-lg bg-slate-200 px-2 py-2 tracking-tighter shadow-xl xs:w-full xs:px-5 xs:py-2 xs:text-[15px]">
        포도리더스 개편안내: 말씀온도 계산기가 새롭게 추가되었어요.
      </div>

      <motion.div className="container mx-auto mt-2 w-[640px] rounded-t-lg py-4 xs:w-[350px] xs:px-0 xs:py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <FaBook className="h-6 w-6 text-white" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">2025 포청천리 포청천독!!</h2>
              <p className="text-sm tracking-tighter text-gray-600">3월 말씀 읽기 이벤트가 시작되었습니다.</p>
              <div className="mt-1 flex items-center"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
