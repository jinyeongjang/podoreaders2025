import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

// 캠퍼스 상태 인터페이스 정의
interface CampusStatus {
  name: string;
  color: string;
  status: 'completed' | 'waiting';
}

export default function HomePageBanner() {
  const router = useRouter();

  // 캠퍼스별 상태 데이터
  const campusStatuses: CampusStatus[] = [
    { name: '기도 1팀', color: 'bg-indigo-500', status: 'completed' },
    { name: '기도 2팀', color: 'bg-indigo-600', status: 'waiting' },
    { name: '말씀 1팀', color: 'bg-emerald-500', status: 'waiting' },
    { name: '말씀 2팀', color: 'bg-emerald-600', status: 'waiting' },
  ];

  const handleAlphaTestApply = () => {
    router.push('/alphaTest_apply');
  };

  // 상태에 따른 아이콘 표시
  // const getStatusIcon = (status: 'completed' | 'waiting') => {
  //   return status === 'completed' ? (
  //     <FaCheckCircle className="h-3 w-3 text-green-500" />
  //   ) : (
  //     <FaHourglassHalf className="h-3 w-3 text-amber-500" />
  //   );
  // };

  // 상태에 따른 텍스트 표시
  // const getStatusText = (status: 'completed' | 'waiting') => {
  //   return status === 'completed' ? (
  //     <span className="ml-1 text-xs text-green-600">신청완료</span>
  //   ) : (
  //     <span className="ml-1 text-xs text-amber-600">모집 대기중</span>
  //   );
  // };

  return (
    <>
      {/* 첫 번째 배너 */}
      <div className="container mx-auto mb-2 grid w-[640px] grid-cols-1 gap-2 xs:w-full xs:grid-cols-1">
        {/* 세이레 특새 기간 공지 */}
        {/* <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-indigo-100 to-sky-100 shadow-sm transition-all hover:shadow-md">
          <div className="px-4 py-2">
            <h3 className="mb-1 text-sm font-semibold text-gray-900">
              지금은 세이레 특별새벽기도회-고난주간 기간입니다.
            </h3>
            <p className="text-xs text-gray-600">2025.3.31(월) ~ 4.18(금) / 05:30 / 현장 / 온라인 동일</p>
            <h3 className="text-sm font-semibold text-gray-900">오늘은 부활주일입니다.</h3>
          </div>
        </div> */}

        {/* 두 번째 배너 - 업데이트 안내 */}
        <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm transition-all hover:shadow-md">
          <div className="px-4 py-2">
            <div>
              <h3 className="mb-2 font-semibold text-gray-800">업데이트 예정 캠퍼스</h3>
              <div className="grid grid-cols-4 gap-1 text-sm sm:grid-cols-4 xs:grid-cols-2">
                {campusStatuses.map((campus, index) => (
                  <div key={index} className="mb-2 rounded-md p-1">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-3 rounded-full ${campus.color}`}></div>
                      <span className="font-medium tracking-tighter">{campus.name}</span>
                    </div>
                    {/* 캠퍼스 상태 표시 추가 */}
                    {/* <div className="mt-1 flex items-center text-xs">
                      {getStatusIcon(campus.status)}
                      {getStatusText(campus.status)}
                    </div> */}
                  </div>
                ))}
              </div>
            </div>

            {/* 상태 범례 추가 */}
            <div className="mt-2 flex gap-4 text-xs text-gray-600">
              <div className="flex items-center">
                <FaCheckCircle className="h-3 w-3 text-green-500" />
                <span className="ml-1">신청완료</span>
              </div>
              <div className="flex items-center">
                <FaHourglassHalf className="h-3 w-3 text-amber-500" />
                <span className="ml-1">모집 대기중</span>
              </div>
            </div>

            {/* 프로세스 UI 추가 */}
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-800">현재 개발단계 - 캠퍼스 개별 페이지 개발</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="ml-2 text-xs text-gray-700">알파 테스트 1차</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <span className="ml-2 text-xs text-gray-500">알파 테스트 2차</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <span className="ml-2 text-xs text-gray-500">서비스 시작</span>
                </div>
              </div>
            </div>
            {/* 알파테스트 신청 버튼 */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAlphaTestApply}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-400 px-6 py-3.5 font-medium tracking-tighter text-white shadow-md transition-all hover:shadow-lg">
                <span>가족장.부가족장 알파테스트 신청하기</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
