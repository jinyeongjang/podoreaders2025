import { motion } from 'framer-motion';
import { FaBook } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function HomePageBanner() {
  const router = useRouter();

  const handleAlphaTestApply = () => {
    router.push('/alphaTest_apply');
  };

  return (
    <>
      <div className="container mx-auto mb-4 w-[640px] overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white tracking-tight shadow-md transition-all duration-300 hover:shadow-lg xs:w-full">
        <div className="flex items-start justify-between bg-gradient-to-r from-sky-500 to-blue-500 px-5 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-md font-bold text-white">4월 업데이트 안내</h2>
          </div>
        </div>

        <div className="overflow-hidden px-5 py-4">
          <div className="space-y-3">
            <p className="text-sm font-medium leading-relaxed text-gray-700">
              메인페이지가 <span className="font-semibold text-indigo-600">캠퍼스 선택화면</span>으로 변경될 예정이며,
              <br></br>캠퍼스 인증이후에 가족원 페이지로 이동할 수 있습니다.
            </p>

            <div className="rounded-lg bg-indigo-100 p-2.5">
              <p className="text-sm text-indigo-700">
                <span className="font-medium">업데이트 예정 캠퍼스:</span>
              </p>
              <div className="mt-1.5 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-white px-3 py-2 font-medium text-indigo-600 shadow-sm">기도 1팀</div>
                <div className="rounded-md bg-white px-3 py-2 font-medium text-indigo-600 shadow-sm">기도 2팀</div>
                <div className="rounded-md bg-white px-3 py-2 font-medium text-indigo-600 shadow-sm">말씀 1팀</div>
                <div className="rounded-md bg-white px-3 py-2 font-medium text-indigo-600 shadow-sm">말씀 2팀</div>
              </div>
            </div>

            {/* 알파테스트 신청 버튼 추가 */}
            <div className="mt-4 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAlphaTestApply}
                className="flex w-full items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-4 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg">
                <span>가족장.부가족장 알파테스트 신청하기</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="container mx-auto w-[640px] rounded-xl p-4 xs:w-full xs:p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 xs:gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 xs:h-12 xs:w-12">
              <FaBook className="h-6 w-6 text-white xs:h-5 xs:w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800 xs:text-base">2025 포청천리 포청천독!!</h2>
              <p className="text-sm tracking-tighter text-gray-600">3월 말씀 읽기 이벤트가 시작되었습니다</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
