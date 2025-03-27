import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import Header from '../components/Header';
import { pretendard } from '../lib/fonts';

// hooks
import { useHomeData } from '../hooks/useHomeData';
import { useTemperatureStats } from '../hooks/useTemperatureStats';
import { useMaintenanceStatus } from '../hooks/useMaintenanceStatus';

// components
import QtCheck from './qt-check';
import CampusSelectButton from '../components/CampusSelectButton';

// HomepageBanner, NoticeSection, StatisticsSection, TemperatureSection 컴포넌트 import
import HomePageBanner from '../components/home/HomePageBanner';
import NoticeSection from '../components/home/NoticeSection';
import StatisticsSection from '../components/home/StatisticsSection';
import TemperatureSection from '../components/home/TemperatureSection';

// 점검 화면 import
import MaintenanceScreen from '../components/MaintenanceScreen';
import MaintenanceBanner from '../components/MaintenanceBanner';

export default function Home() {
  // hooks
  const { totals } = useHomeData();
  const { userTemps, showTemperatures, setShowTemperatures } = useTemperatureStats();
  const { maintenanceStatus, isMaintenanceMode, hasScheduledMaintenance } = useMaintenanceStatus();

  // 선택된 캠퍼스 상태 관리
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);

  // 로컬 스토리지에서 선택된 캠퍼스 정보 가져오기
  useEffect(() => {
    const storedCampus = localStorage.getItem('selectedCampus');
    if (storedCampus) {
      setSelectedCampus(storedCampus);
    }
  }, []);

  // 서버 점검 중이면 점검 화면 표시
  if (isMaintenanceMode) {
    return <MaintenanceScreen maintenanceStatus={maintenanceStatus} />;
  }

  return (
    <div className={pretendard.className}>
      <Header />

      <main className="container mx-auto max-w-6xl px-4 py-2">
        {/* 예정된 점검이 있을때 배너 표시 */}
        {hasScheduledMaintenance && maintenanceStatus.starts_at && (
          <MaintenanceBanner
            message={maintenanceStatus.message || '서버 점검이 예정되어 있어요.'}
            startsAt={new Date(maintenanceStatus.starts_at)}
            endsAt={maintenanceStatus.ends_at ? new Date(maintenanceStatus.ends_at) : undefined}
          />
        )}

        <div className="container mx-auto mb-4 w-[640px] rounded-xl tracking-tight xs:w-full">
          <CampusSelectButton selectedCampus={selectedCampus} clearAuthOnClick={false} />
        </div>
        {/* 캠퍼스 선택 버튼 추가 */}

        {/* 홈페이지 배너 */}
        <HomePageBanner />

        {/* 공지사항 섹션 */}
        <NoticeSection />

        {/* 통계 섹션 */}
        <StatisticsSection totals={totals} />

        {/* 온도 섹션 */}
        <TemperatureSection
          userTemps={userTemps}
          showTemperatures={showTemperatures}
          setShowTemperatures={setShowTemperatures}
        />

        <motion.div
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
    </div>
  );
}
