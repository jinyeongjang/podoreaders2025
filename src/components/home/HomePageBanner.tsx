import { motion } from 'framer-motion';
import { FaBook } from 'react-icons/fa';

export default function HomePageBanner() {
  return (
    <>
      <div className="container mx-auto mb-4 w-[640px] rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-5 tracking-tight shadow-md transition-shadow duration-300 hover:shadow-lg xs:w-full xs:p-5">
        <h2 className="text-md font-semibold text-indigo-800">4월 업데이트</h2>
        <p className="text-sm tracking-tighter text-gray-600">
          메인페이지가 캠퍼스 선택화면으로 변경될 예정입니다.<br></br>* 업데이트 예정 캠퍼스: 기도 1 기도 2 / 말씀 1
          말씀 2
        </p>
        <p className="mt-2 text-sm tracking-tighter text-gray-600">
          캠퍼스 선택 후 가족장으로부터 발급받은 비밀번호를 입력해야만<br></br>캠퍼스 가족원 페이지 이용이 가능해요.
        </p>
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
