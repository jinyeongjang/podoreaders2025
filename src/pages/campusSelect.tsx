import { useState, useEffect } from 'react';
import { pretendard } from '../lib/fonts';
import Header from '../components/layout/Header';
import CampusSelectionScreen from '../components/campus/CampusSelectionScreen';
import CampusAccessLoginForm from '../components/campus/CampusAccessLoginForm';
import { useCampusLogin } from '../hooks/useCampusLogin';

// 캠퍼스 목록
const campusList = [
  {
    id: 'prayer',
    name: '기도 캠퍼스 :: 지원준비중입니다.',
  },

  {
    id: 'word_uiwan',
    name: '말씀 캠퍼스 :: 김의완 가족장 ',
  },

  {
    id: 'word_minhwa',
    name: '말씀 캠퍼스 :: 노민화 가족장',
  },
];

export default function CampusSelectPage() {
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [previouslySaved, setPreviouslySaved] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);

  // 캠퍼스 로그인 관련 로직을 커스텀 훅으로 분리
  const { loginAttempts, loginError, isLoading, isLockedOut, remainingLockoutTime, redirectPath, handleCampusLogin } =
    useCampusLogin(selectedCampus);

  // 로컬 스토리지에서 캠퍼스 정보 가져오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCampus = localStorage.getItem('selectedCampus');

      if (savedCampus) {
        setSelectedCampus(savedCampus);
        setPreviouslySaved(true);
      }
    }
  }, []);

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

  // 선택된 캠퍼스 정보 가져오기
  const selectedCampusInfo = campusList.find((c) => c.id === selectedCampus);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 ${pretendard.className}`}>
      {/* onBack prop 대신 showBackButton 속성만 사용 */}
      <Header showBackButton={true} title="캠퍼스 선택" />

      <div className="container mx-auto max-w-2xl px-4 py-8 xs:py-0">
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
