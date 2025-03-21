import { useState, useEffect } from 'react';
import { pretendard } from '../lib/fonts';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { useMaintenanceStatus } from '../hooks/useMaintenanceStatus';
import MaintenanceScreen from '../components/MaintenanceScreen';
import CampusSelectionScreen from '../components/campus/CampusSelectionScreen';
import CampusAccessLoginForm from '../components/campus/CampusAccessLoginForm';
import { useCampusLogin } from '../hooks/useCampusLogin';

// 캠퍼스 목록
const campusList = [
  {
    id: 'prayer',
    name: '기도',
  },
  {
    id: 'word',
    name: '말씀',
  },
  {
    id: 'test',
    name: '테스트',
    description: '정식버전으로 업데이트 되기전 개발기능을 먼저 볼 수 있는 캠퍼스에요.',
  },
];

export default function CampusSelectPage() {
  const router = useRouter();
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [previouslySaved, setPreviouslySaved] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const { maintenanceStatus, isMaintenanceMode } = useMaintenanceStatus();

  // 캠퍼스 로그인 관련 로직을 커스텀 훅으로 분리
  const { loginAttempts, loginError, isLoading, isLockedOut, remainingLockoutTime, redirectPath, handleCampusLogin } =
    useCampusLogin(selectedCampus);

  // 로컬 스토리지에서 캠퍼스 정보 가져오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCampus = localStorage.getItem('selectedCampus');
      const campusAuthorized = localStorage.getItem('campusAuthorized') === 'true';
      const accessLevel = localStorage.getItem('accessLevel');

      if (savedCampus) {
        setSelectedCampus(savedCampus);
        setPreviouslySaved(true);

        // 이미 인증된 사용자는 자동으로 해당 캠퍼스 페이지로 리디렉션
        if (campusAuthorized) {
          if (savedCampus === 'prayer') {
            const targetPath = accessLevel === 'advanced' ? '/campusSelect/prayer02' : '/campusSelect/prayer01';
            router.push(targetPath);
          } else if (savedCampus === 'word') {
            const targetPath = accessLevel === 'advanced' ? '/campusSelect/word02' : '/campusSelect/word01';
            router.push(targetPath);
          }
        }
      }
    }
  }, [router]);

  // 캠퍼스 선택 처리
  const handleSelectCampus = (campusId: string) => {
    setSelectedCampus(campusId);
  };

  // 확인 버튼 클릭 처리
  const handleConfirm = () => {
    if (selectedCampus) {
      setShowLoginForm(true);
    }
  };

  // 뒤로가기 처리
  const handleBackToSelection = () => {
    setShowLoginForm(false);
  };

  // 메인으로 돌아가기
  const handleBackToHome = () => {
    router.push('/');
  };

  // 서버 점검 중이면 점검 화면 표시
  if (isMaintenanceMode) {
    return <MaintenanceScreen maintenanceStatus={maintenanceStatus} />;
  }

  // 선택된 캠퍼스 정보 가져오기
  const selectedCampusInfo = campusList.find((c) => c.id === selectedCampus);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 ${pretendard.className}`}>
      <Header showBackButton={true} onBackClick={showLoginForm ? handleBackToSelection : handleBackToHome} />

      <div className="container mx-auto max-w-2xl px-4 py-8">
        {showLoginForm && selectedCampusInfo ? (
          // 로그인 폼 표시
          <CampusAccessLoginForm
            onLogin={handleCampusLogin}
            isLoading={isLoading}
            loginAttempts={loginAttempts}
            loginError={loginError}
            selectedCampus={selectedCampus || ''}
            campusName={selectedCampusInfo.name}
            isLockedOut={isLockedOut}
            remainingLockoutTime={remainingLockoutTime}
            redirectPath={redirectPath}
          />
        ) : (
          // 캠퍼스 선택 화면 표시
          <CampusSelectionScreen
            campusList={campusList}
            selectedCampus={selectedCampus}
            previouslySaved={previouslySaved}
            onSelectCampus={handleSelectCampus}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </div>
  );
}
