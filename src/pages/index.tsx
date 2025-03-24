import { motion, AnimatePresence } from 'framer-motion';
import { pretendard } from '../lib/fonts';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 서버점검 컴포넌트
import MaintenanceBanner from '../components/MaintenanceBanner';
import MaintenanceScreen from '../components/MaintenanceScreen';

// hooks
import { useHomeData } from '../hooks/useHomeData';
import { useHomeModals } from '../hooks/useHomeModals';
import { useTemperatureStats } from '../hooks/useTemperatureStats';
import { useMaintenanceStatus } from '../hooks/useMaintenanceStatus';

// components
import QtCheck from './qt-check';
import HomePageBanner from '../components/home/HomePageBanner';
import NoticeSection from '../components/home/NoticeSection';
import StatisticsSection from '../components/home/StatisticsSection';
import TemperatureSection from '../components/home/TemperatureSection';

// modals
import ExportFeatureModal from '../components/ExportFeatureModal';
import FamilyAccessModal from '../components/FamilyAccessModal';
import PrayerModal from '../components/prayer/PrayerModal';

// 캠퍼스 선택 버튼 컴포넌트 추가
import CampusSelectButton from '../components/CampusSelectButton';

// 리디렉션
//src\hooks\useCampusLogin.ts
// src\components\campus\CampusAccessLoginForm.tsx

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

export default function Home() {
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

  // 캠퍼스 정보 상태
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);

  // 로컬 스토리지에서 캠퍼스 정보 가져오기 및 권한 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCampus = localStorage.getItem('selectedCampus');
      const campusAuthorized = localStorage.getItem('campusAuthorized') === 'true';
      const accessLevel = localStorage.getItem('accessLevel');

      if (savedCampus) {
        setSelectedCampus(savedCampus);

        // 이미 인증된 사용자인 경우 적절한 캠퍼스 페이지로 자동 리디렉션
        if (campusAuthorized) {
          if (savedCampus === 'prayer') {
            if (accessLevel === 'advanced') {
              router.push('/campusSelect/prayerCampus02');
            } else {
              router.push('/campusSelect/prayerCampus01');
            }
          } else if (savedCampus === 'word') {
            if (accessLevel === 'advanced') {
              router.push('/campusSelect/wordCampus02');
            } else {
              router.push('/campusSelect/wordCampus01');
            }
          }
        }
      }
    }
  }, [router]);

  // 서버 점검 중이면 점검 화면 표시
  if (isMaintenanceMode) {
    return <MaintenanceScreen maintenanceStatus={maintenanceStatus} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-white ${pretendard.className}`}>
      <Header />

      <HomePageBanner />

      {/* 캠퍼스 선택 버튼 */}
      <div className="container mx-auto max-w-2xl px-4 py-2">
        <CampusSelectButton selectedCampus={selectedCampus} clearAuthOnClick={false} />
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

        <NoticeSection />

        <StatisticsSection totals={totals} />

        <TemperatureSection
          userTemps={userTemps}
          showTemperatures={showTemperatures}
          setShowTemperatures={setShowTemperatures}
        />

        {/* QT 체크 구분선 */}
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
