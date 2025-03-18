import { motion, AnimatePresence } from 'framer-motion';
import { pretendard } from '../lib/fonts';
import Header from '../components/Header';

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
// import DevFeatures from '../components/DevFeatures';
import HomePageBanner from '../components/home/HomePageBanner';
import NoticeSection from '../components/home/NoticeSection';
import StatisticsSection from '../components/home/StatisticsSection';
import TemperatureSection from '../components/home/TemperatureSection';

// modals
// import DevFeatureModal from '../components/DevFeatureModal';
import ExportFeatureModal from '../components/ExportFeatureModal';
import FamilyAccessModal from '../components/FamilyAccessModal';
import PrayerModal from '../components/prayer/PrayerModal';

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
  // hooks
  const { totals } = useHomeData();
  const {
    isPrayerModalOpen,
    setPrayerModalOpen,
    // showDevFeatures,
    // showDevFeatureModal,
    // setShowDevFeatureModal,
    // handleDevFeatureConfirm,
    showExportFeatureModal,
    setShowExportFeatureModal,
    isFamilyAccessModalOpen,
    setFamilyAccessModalOpen,

    // handleExportToXLSX,
    handleFamilyAccessConfirm,
  } = useHomeModals();
  const { userTemps, showTemperatures, setShowTemperatures } = useTemperatureStats();

  // 서버 점검 상태 관리
  const { maintenanceStatus, isMaintenanceMode } = useMaintenanceStatus();

  // 서버 점검 중이면 점검 화면 표시
  if (isMaintenanceMode) {
    return <MaintenanceScreen maintenanceStatus={maintenanceStatus} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-white ${pretendard.className}`}>
      <Header />

      <HomePageBanner />

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

        {/* 개발 기능이 켜져있을 때만 보이는 영역 */}
        {/* {showDevFeatures && (
          <DevFeatures
            setPrayerModalOpen={setPrayerModalOpen}
            handleExportToXLSX={handleExportToXLSX}
            animations={animations}
          />
        )} */}
      </main>

      {/* modal 컴포넌트들 */}
      <AnimatePresence>
        {/* {showDevFeatureModal && (
          <DevFeatureModal onConfirm={handleDevFeatureConfirm} onCancel={() => setShowDevFeatureModal(false)} />
        )} */}
        {showExportFeatureModal && <ExportFeatureModal onClose={() => setShowExportFeatureModal(false)} />}
        {isFamilyAccessModalOpen && (
          <FamilyAccessModal onClose={() => setFamilyAccessModalOpen(false)} onConfirm={handleFamilyAccessConfirm} />
        )}
      </AnimatePresence>
      <PrayerModal isOpen={isPrayerModalOpen} onClose={() => setPrayerModalOpen(false)} />
    </div>
  );
}
