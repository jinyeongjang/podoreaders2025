import { pretendard } from '../../lib/fonts';
import Header from '../../components/layout/Header';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaUserPlus, FaArrowLeft } from 'react-icons/fa';

// hooks
import { useMaintenanceStatus } from '../../hooks/useMaintenanceStatus';

// components
import MaintenanceScreen from '../../components/MaintenanceScreen';
import MaintenanceBanner from '../../components/MaintenanceBanner';

export default function Prayer01Page() {
  const router = useRouter();

  // hooks
  const { maintenanceStatus, isMaintenanceMode, hasScheduledMaintenance } = useMaintenanceStatus();

  // 캠퍼스 권한 확인
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 권한 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
        const campusAuthorized = localStorage.getItem('campusAuthorized') === 'true';
        const selectedCampus = localStorage.getItem('selectedCampus');
        const lastPassword = localStorage.getItem('lastPassword');

        // 기도 캠퍼스 권한 확인
        if (campusAuthorized && selectedCampus === 'prayer' && (lastPassword === '1234' || lastPassword === '5678')) {
          setIsAuthorized(true);
        } else {
          // 권한이 없으면 캠퍼스 선택 페이지로 리디렉션
          router.push('/campusSelect');
        }
        setIsLoading(false);
      };

      checkAuth();
    }
  }, [router]);

  // 캠퍼스 선택 페이지로 이동
  const handleBackToCampusSelect = () => {
    router.push('/campusSelect');
  };

  // 서버 점검 중이면 점검 화면 표시
  if (isMaintenanceMode) {
    return <MaintenanceScreen maintenanceStatus={maintenanceStatus} />;
  }

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-4 text-indigo-700">권한을 확인하는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 권한이 없으면 빈 페이지 반환
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-white ${pretendard.className}`}>
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* 예정된 점검이 있을때 배너 표시 */}
        {hasScheduledMaintenance && maintenanceStatus.starts_at && (
          <MaintenanceBanner
            message={maintenanceStatus.message || '서버 점검이 예정되어 있어요.'}
            startsAt={new Date(maintenanceStatus.starts_at)}
            endsAt={maintenanceStatus.ends_at ? new Date(maintenanceStatus.ends_at) : undefined}
          />
        )}

        {/* 임시 페이지 안내 */}
        <div className="container mx-auto mb-8 mt-8 w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
          <div className="relative p-8">
            {/* 상단 장식 선 */}
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <FaUserPlus className="h-10 w-10" />
              </div>

              <h2 className="mb-4 text-3xl font-bold text-indigo-800">기도캠퍼스 가족 1팀</h2>

              <p className="mb-8 max-w-md text-lg text-indigo-600">
                현재 페이지는 준비 중입니다. <br />
              </p>

              <button
                onClick={handleBackToCampusSelect}
                className="mb-6 flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-all hover:bg-indigo-700 active:scale-95">
                <FaArrowLeft className="h-4 w-4" />
                캠퍼스 선택 페이지로 이동
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
