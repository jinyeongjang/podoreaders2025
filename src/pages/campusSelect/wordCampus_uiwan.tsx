import { pretendard } from '../../lib/fonts';
import Header from '../../components/layout/Header';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// hooks
import { useWordCampusUiwan } from '../../hooks/useWordCampusUiwan';
import { useWordCampusUiwanQt } from '../../hooks/useWordCampusUiwanQt';

// components
import FamilyMemberSection from '../../components/family/FamilyMemberSection';
import WordCampusBannerUiwan from '../../components/wordCampus/WordCampusBannerUiwan';
import WeeklyDecisionPreview from '../../components/wordCampus/WeeklyDecisionPreview';
import PrayerPreview from '../../components/wordCampus/PrayerPreview';
import GuidePreview from '../../components/wordCampus/GuidePreview';
import CampusDesigner from '../../components/campus/CampusDesigner';
import MobileCampusDesigner from '../../components/campus/MobileCampusDesigner';
import RandomPickerModal from '../../components/campus/RandomPickerModal';
import NoticeSection from '../../components/wordCampus/NoticeSection';
import QtCheckSection from '../../components/wordCampus/QtCheckSection';
import WelcomeTutorial from '../../components/wordCampus/WelcomeCampusTutorial';
import SidebarWidget from '../../components/wordCampus/SidebarWidget';
import SuccessModal from '../../components/dailycheck/SuccessModal';
// import InstallGuideBanner from '@/components/pwa/InstallGuideBanner';

// 말씀캠퍼스 의완 가족 사용자 데이터
import campusUsersUiwan from '../../data/campusUsersWord_uiwan.json';

export default function WordCampusUiwanPage() {
  // 캠퍼스 데이터 및 핸들러
  const {
    isAuthorized,
    isLoading,
    notices,
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
  } = useWordCampusUiwan();

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
  } = useWordCampusUiwanQt();

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
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 ${pretendard.className}`}>
      <Header />

      {/* 앱 설치 유도 배너 */}
      {/* <InstallGuideBanner /> */}

      {/* 캠퍼스 정보 배너 (Hero Section) */}
      <WordCampusBannerUiwan />

      {/* 상단 메뉴 섹션 (전체 너비 배경) */}
      <div className="w-full border-b border-indigo-50/50 bg-white/50 px-4 py-6 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl">
          <div className="grid w-full grid-cols-3 gap-2 md:gap-4">
            {/* 1. 한주간의 결단 */}
            <div className="md:col-span-1">
              <WeeklyDecisionPreview />
            </div>

            {/* 2. 기도제목 */}
            <div className="md:col-span-1">
              <PrayerPreview />
            </div>

            {/* 3. 가이드 */}
            <div className="md:col-span-1">
              <GuidePreview />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex max-w-6xl flex-col px-4 py-8 lg:flex-row lg:gap-8">
        {/* 메인 컨텐츠 영역 */}
        <main className="mx-auto w-full space-y-8 lg:w-3/4">
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
            campusUsers={campusUsersUiwan.users}
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
        <aside className="sticky top-24 hidden h-fit w-full space-y-6 lg:block lg:w-1/3">
          <SidebarWidget />
          <CampusDesigner
            handleNoticeClick={handleNoticeClick}
            handleLocationClick={handleLocationClick}
            handleRegisterClick={handleRegisterClick}
            handleRandomPickerClick={handleRandomPickerClick}
          />
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
