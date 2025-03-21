import { motion, AnimatePresence } from 'framer-motion';
import { pretendard } from '../../lib/fonts';
import { IoAddCircle } from 'react-icons/io5';
import Header from '../../components/Header';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 서버점검 컴포넌트
import MaintenanceBanner from '../../components/MaintenanceBanner';
import MaintenanceScreen from '../../components/MaintenanceScreen';

// 캠퍼스 선택 버튼 컴포넌트
import CampusSelectButton from '../../components/CampusSelectButton';

// hooks
import { useHomeData } from '../../hooks/useHomeData';
import { useHomeModals } from '../../hooks/useHomeModals';
import { useTemperatureStats } from '../../hooks/useTemperatureStats';
import { useMaintenanceStatus } from '../../hooks/useMaintenanceStatus';

// components
import QtCheck from '../qt-check';
import HomePageBanner from '../../components/home/HomePageBanner';
import NoticeSection from '../../components/home/NoticeSection';
import StatisticsSection from '../../components/home/StatisticsSection';
import TemperatureSection from '../../components/home/TemperatureSection';

// modals
import ExportFeatureModal from '../../components/ExportFeatureModal';
import FamilyAccessModal from '../../components/FamilyAccessModal';
import PrayerModal from '../../components/prayer/PrayerModal';

export const animations = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        duration: 0.8,
      },
    },
  },
};

export default function Prayer01Page() {
  const router = useRouter();
  // hooks
  const { totals } = useHomeData();
  const {
    isPrayerModalOpen,
    setPrayerModalOpen,
    showExportFeatureModal,
    setShowExportFeatureModal,
    isFamilyAccessModalOpen,
    setFamilyAccessModalOpen,
    handleFamilyAccessConfirm,
  } = useHomeModals();

  const { userTemps, showTemperatures, setShowTemperatures } = useTemperatureStats();

  // 서버 점검 상태 관리
  const { maintenanceStatus, isMaintenanceMode } = useMaintenanceStatus();

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
        const accessLevel = localStorage.getItem('accessLevel');

        // 기도 캠퍼스 권한 레벨 확인
        if (
          campusAuthorized &&
          selectedCampus === 'prayer' &&
          (accessLevel === 'advanced' || lastPassword === '5678')
        ) {
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

      {/* 캠퍼스 선택 */}
      <div className="container mx-auto px-4">
        <CampusSelectButton selectedCampus="prayer" />
      </div>

      <main className="container mx-auto max-w-6xl px-4 py-2">
        {/* 점검 예정 알림 */}
        {maintenanceStatus.starts_at && new Date(maintenanceStatus.starts_at) > new Date() && (
          <MaintenanceBanner
            message={`예정된 점검 안내: ${maintenanceStatus.message}`}
            startsAt={new Date(maintenanceStatus.starts_at)}
            endsAt={maintenanceStatus.ends_at ? new Date(maintenanceStatus.ends_at) : undefined}
          />
        )}

        {/* 기도 캠퍼스 2팀 페이지 section */}
        <motion.div
          variants={animations.item}
          className="container mx-auto mb-4 w-[640px] rounded-xl border border-indigo-200 bg-indigo-50 p-4 tracking-tight shadow-md transition-shadow duration-300 hover:shadow-lg xs:w-full">
          <div className="flex items-center gap-2">
            <IoAddCircle className="h-5 w-5 text-indigo-600" />
            <h3 className="text-md font-semibold text-indigo-800">기도캠퍼스 가족</h3>
          </div>
          <p className="mt-1 pl-7 text-sm text-indigo-700">2팀 페이지 입니다</p>
        </motion.div>

        <HomePageBanner />
        <NoticeSection />
        <StatisticsSection totals={totals} />
        <TemperatureSection
          userTemps={userTemps}
          showTemperatures={showTemperatures}
          setShowTemperatures={setShowTemperatures}
        />

        {/* 알림판 섹션 */}
        <motion.div
          variants={animations.container}
          initial="hidden"
          animate="show"
          className="container mx-auto h-[10px] w-[640px] max-w-6xl rounded-t-xl bg-indigo-500 p-5 py-1 tracking-tighter shadow-xl xs:w-full">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white"></h2>
          </div>
          <p className="text-md text-white"></p>
        </motion.div>

        <QtCheck />
      </main>

      {/* modal 컴포넌트들 */}
      <AnimatePresence>
        {showExportFeatureModal && <ExportFeatureModal onClose={() => setShowExportFeatureModal(false)} />}
        {isFamilyAccessModalOpen && (
          <FamilyAccessModal onClose={() => setFamilyAccessModalOpen(false)} onConfirm={handleFamilyAccessConfirm} />
        )}
      </AnimatePresence>
      <PrayerModal isOpen={isPrayerModalOpen} onClose={() => setPrayerModalOpen(false)} />
    </div>
  );
}
