import { pretendard } from '../../lib/fonts';
import Header from '../../components/layout/Header';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// hooks
import { useWordCampusMinhwa } from '../../hooks/useWordCampusMinhwa';
import { useWordCampusMinhwaQt } from '../../hooks/useWordCampusMinhwaQt';

// components
import LocationSection from '../../components/campus/LocationSection';
import FamilyMemberSection from '../../components/family/FamilyMemberSection';
import CampusDesigner from '../../components/campus/CampusDesigner';
import MobileCampusDesigner from '../../components/campus/MobileCampusDesigner';
import RandomPickerModal from '../../components/campus/RandomPickerModal';
import NoticeSection from '../../components/wordCampus/NoticeSection';
import QtCheckSection from '../../components/wordCampus/QtCheckSection';
import WelcomeTutorial from '../../components/wordCampus/WelcomeCampusTutorial';
import WordCampusBannerMinhwa from '../../components/wordCampus/WordCampusBannerMinhwa';
import SidebarWidget from '../../components/wordCampus/SidebarWidget';
import SuccessModal from '../../components/dailycheck/SuccessModal';

// 말씀캠퍼스 민화 가족 사용자 데이터
import campusUsersMinhwa from '../../data/campusUsersWord_minhwa.json';

export default function Word01Page() {
  // 캠퍼스 데이터 및 핸들러
  const {
    isAuthorized,
    isLoading,
    notices,
    locations,
    familyMembers,
    hasFamilyMembers,
    showRandomPicker,
    formatDate,
    handleRegisterClick,
    handleNoticeClick,
    handleLocationClick,
    handleRecordsClick,
    handleRandomPickerClick,
    handleCloseModal,
  } = useWordCampusMinhwa();

  // QT 체크 관련
  const {
    userName,
    showUserDropdown,
    setShowUserDropdown,
    selectedDate,
    currentMonth,
    qtCount,
    setQtCount,
    bibleReadCount,
    setBibleReadCount,
    qtDone,
    setQtDone,
    bibleReadDone,
    setBibleReadDone,
    writingDone,
    setWritingDone,
    dawnPrayerAttended,
    setDawnPrayerAttended,
    isSaving,
    records,
    showSuccessModal,
    setShowSuccessModal,
    isCalendarOpen,
    loadUserFromStorage,
    handleUserSelect,
    handleResetUser,
    handleQtSubmit,
    handleDeleteRecord,
    handleDateChange,
    handlePrevMonth,
    handleNextMonth,
    toggleCalendar,
  } = useWordCampusMinhwaQt();

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

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
    <div className={`min-h-screen bg-gradient-to-b from-green-50 to-white ${pretendard.className}`}>
      <Header />

      <div className="container mx-auto flex max-w-5xl flex-col px-4 py-2 lg:flex-row lg:gap-6">
        {/* 메인 컨텐츠 영역 */}
        <main className="mx-auto w-full lg:w-3/4">
          {/* 캠퍼스 정보 배너 */}
          <WordCampusBannerMinhwa />

          {/* 공지사항 섹션 */}
          <NoticeSection notices={notices} onNoticeClick={handleNoticeClick} formatDate={formatDate} />

          {/* QT 체크 섹션 */}
          <QtCheckSection
            userName={userName}
            showUserDropdown={showUserDropdown}
            setShowUserDropdown={setShowUserDropdown}
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            qtCount={qtCount}
            setQtCount={setQtCount}
            bibleReadCount={bibleReadCount}
            setBibleReadCount={setBibleReadCount}
            qtDone={qtDone}
            setQtDone={setQtDone}
            bibleReadDone={bibleReadDone}
            setBibleReadDone={setBibleReadDone}
            writingDone={writingDone}
            setWritingDone={setWritingDone}
            dawnPrayerAttended={dawnPrayerAttended}
            setDawnPrayerAttended={setDawnPrayerAttended}
            isSaving={isSaving}
            records={records}
            isCalendarOpen={isCalendarOpen}
            campusUsers={campusUsersMinhwa.users}
            handleUserSelect={handleUserSelect}
            handleResetUser={handleResetUser}
            handleDateChange={handleDateChange}
            handlePrevMonth={handlePrevMonth}
            handleNextMonth={handleNextMonth}
            toggleCalendar={toggleCalendar}
            handleQtSubmit={handleQtSubmit}
            handleDeleteRecord={handleDeleteRecord}
            handleRecordsClick={handleRecordsClick}
          />

          {/* 모임장소 섹션 */}
          <LocationSection locations={locations} handleLocationClick={handleLocationClick} />

          {/* 가족원 현황 섹션 */}
          <FamilyMemberSection
            familyMembers={familyMembers}
            handleRegisterClick={handleRegisterClick}
            formatDate={formatDate}
          />

          {/* 튜토리얼 */}
          {!hasFamilyMembers && <WelcomeTutorial onRegisterClick={handleRegisterClick} />}

          {/* 모바일 기능 버튼 */}
          <MobileCampusDesigner
            handleNoticeClick={handleNoticeClick}
            handleLocationClick={handleLocationClick}
            handleRegisterClick={handleRegisterClick}
            handleRandomPickerClick={handleRandomPickerClick}
          />
        </main>

        {/* 사이드바 영역 (lg 화면 이상에서만 표시) */}
        <aside className="sticky top-4 hidden w-full space-y-4 lg:block lg:w-1/3">
          <CampusDesigner
            handleNoticeClick={handleNoticeClick}
            handleLocationClick={handleLocationClick}
            handleRegisterClick={handleRegisterClick}
            handleRandomPickerClick={handleRandomPickerClick}
          />
          <SidebarWidget />
        </aside>
      </div>

      {/* 순서뽑기 모달 */}
      <RandomPickerModal isOpen={showRandomPicker} onClose={handleCloseModal} />

      {/* QT 성공 모달 */}
      <AnimatePresence>
        {showSuccessModal && (
          <SuccessModal
            userName={userName}
            selectedDate={selectedDate}
            qtCount={qtCount}
            bibleReadCount={bibleReadCount}
            qtDone={qtDone}
            bibleReadDone={bibleReadDone}
            writingDone={writingDone}
            dawnPrayerAttended={dawnPrayerAttended}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
