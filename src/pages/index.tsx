import { motion, AnimatePresence } from 'framer-motion';
import { pretendard } from '../lib/fonts';
import Header from '../components/Header';

// hooks
import { useHomeData } from '../hooks/useHomeData';
import { useHomeModals } from '../hooks/useHomeModals';
import { useTemperatureStats } from '../hooks/useTemperatureStats';

// components
import QtCheck from './qt-check';
import DevFeatures from '../components/DevFeatures';
import HomePageBanner from '../components/home/HomePageBanner';
import NoticeSection from '../components/home/NoticeSection';
import StatisticsSection from '../components/home/StatisticsSection';
import TemperatureSection from '../components/home/TemperatureSection';

// modals
import DevFeatureModal from '../components/DevFeatureModal';
import ExportFeatureModal from '../components/ExportFeatureModal';
import FamilyAccessModal from '../components/FamilyAccessModal';
import PrayerModal from '../components/prayer/PrayerModal';
import PrayerNoteModal from '../components/PrayerNoteModal';

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
    isNoteModalOpen,
    setNoteModalOpen,
    showDevFeatures,
    showDevFeatureModal,
    setShowDevFeatureModal,
    showExportFeatureModal,
    setShowExportFeatureModal,
    isFamilyAccessModalOpen,
    setFamilyAccessModalOpen,
    handleDevFeatureConfirm,
    handleExportToXLSX,
    handleFamilyAccessConfirm,
  } = useHomeModals();
  const { userTemps, showTemperatures, setShowTemperatures } = useTemperatureStats();

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-white ${pretendard.className}`}>
      <Header />
      <HomePageBanner />

      <main className="container mx-auto max-w-6xl px-4 py-2">
        <NoticeSection />

        <StatisticsSection totals={totals} />

        <TemperatureSection
          userTemps={userTemps}
          showTemperatures={showTemperatures}
          setShowTemperatures={setShowTemperatures}
        />

        {/* 알림판 섹션 추가 */}
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
        {showDevFeatures && (
          <DevFeatures
            setPrayerModalOpen={setPrayerModalOpen}
            setNoteModalOpen={setNoteModalOpen}
            handleExportToXLSX={handleExportToXLSX}
            animations={animations}
          />
        )}
      </main>

      {/* 모달 컴포넌트들 */}
      <AnimatePresence>
        {showDevFeatureModal && (
          <DevFeatureModal onConfirm={handleDevFeatureConfirm} onCancel={() => setShowDevFeatureModal(false)} />
        )}
        {showExportFeatureModal && <ExportFeatureModal onClose={() => setShowExportFeatureModal(false)} />}
        {isFamilyAccessModalOpen && (
          <FamilyAccessModal onClose={() => setFamilyAccessModalOpen(false)} onConfirm={handleFamilyAccessConfirm} />
        )}
      </AnimatePresence>
      <PrayerModal isOpen={isPrayerModalOpen} onClose={() => setPrayerModalOpen(false)} />
      <PrayerNoteModal isOpen={isNoteModalOpen} onClose={() => setNoteModalOpen(false)} prayerId={0} />
    </div>
  );
}
