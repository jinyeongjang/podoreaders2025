import { motion } from 'framer-motion';
import { FaTimes, FaBook, FaCode } from 'react-icons/fa';

interface AppInfoModalProps {
  onClose: () => void;
}

const AppInfoModal = ({ onClose }: AppInfoModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black"
      />

      {/* modal 영역 */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-lg rounded-t-xl bg-white px-4 pb-8 pt-6 shadow-xl"
        style={{
          maxHeight: '80vh',
          overflowY: 'auto',
        }}>
        {/* 닫기 버튼 */}
        <div className="mb-12 flex items-center justify-between">
          <h2 className="ml-2 text-xl font-bold">포도리더스 앱 정보</h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* 포도리더스 앱 로고 및 정보 영역*/}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 h-20 w-20 overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-4 shadow-lg shadow-indigo-500/30">
            <div className="flex h-full w-full items-center justify-center">
              <FaBook className="h-10 w-10 text-white" />
            </div>
          </div>
          <h3 className="mb-1 text-lg font-semibold">포도리더스</h3>
          <p className="text-center text-sm text-gray-500">버전 1.0.5 / PDOUI 1.0</p>
        </div>

        {/* 포도리더스 앱 설명 영역 */}
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-600">
            포도리더스는 큐티, 말씀 읽기를 온도로 변환하여<br></br>가족원들의 신앙생활을 도와주는 플랫폼 앱입니다.
            <br></br>
          </p>
          <hr className="mt-8 flex border-t border-gray-200"></hr>
        </div>

        {/* 개발자 정보 */}
        <div className="mb-8">
          <div className="mb-2 ml-2 flex items-center">
            <FaCode className="mr-3 h-5 w-5 text-slate-500" />
            <h4 className="font-medium text-gray-800">개발자 정보</h4>
          </div>
          <p className="ml-2 text-sm text-gray-600">
            포도리더스 개발자: 장진영 형제(jin_glorious0448)
            <p className="mt-2 text-sm italic text-gray-600">&quot;성장이라는 날개로 끊임없이 날아오르다&quot;</p>
          </p>
        </div>

        {/* 주요 기능 */}
        <div className="mb-6">
          <h4 className="mb-3 ml-2 font-medium text-gray-800">주요 기능</h4>
          <div className="space-y-2">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-700">큐티, 말씀 읽기, 필사 횟수 체크</p>
              <p className="mt-2 text-xs text-gray-600">
                가족원은 매일 큐티, 말씀 읽기, 필사 횟수를<br></br>기록할 수 있습니다.
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-700">가족장 열람</p>
              <p className="mt-2 text-xs text-gray-600">
                가족장.부가족장은 큐티, 말씀 읽기, 필사횟수를<br></br>현황판 형태로 관리할 수 있습니다.
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-700">(개발기능) 임원 열람</p>
              <p className="mt-2 text-xs text-gray-600">
                캠퍼스 별 가족원 활동 요약 및 통계 정보를 <br></br>말씀온도 그래프로 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 기술 스택 */}
        <div className="mb-6">
          <h4 className="mb-3 ml-2 font-medium text-gray-800">기술 스택</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="mb-1 font-medium text-gray-700">Frontend</p>
              <ul className="space-y-1 text-gray-600">
                <li>Next.js 15.1.3+React</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Framer Motion</li>
                <li>Progressive Web Apps</li>
              </ul>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="mb-1 font-medium text-gray-700">Backend</p>
              <ul className="space-y-1 text-gray-600">
                <li>supabase(postgreSQL)</li>
                <li>google OAuth</li>
                <li>Node.js+Express</li>
              </ul>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="mb-1 font-medium text-gray-700">DevOps</p>
              <ul className="space-y-1 text-gray-600">
                <li>GitHub Actions</li>
                <li>Vercel</li>
              </ul>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="mb-1 font-medium text-gray-700">Code Correction</p>
              <ul className="space-y-1 text-gray-600">
                <li>ES2017, ESLint</li>
                <li>Prettier</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 저작권 정보 */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">© 2025 포도리더스. All rights reserved.</p>
        </div>

        {/* 하단 스와이프 바 */}
        <div className="mt-4 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-gray-300"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default AppInfoModal;
