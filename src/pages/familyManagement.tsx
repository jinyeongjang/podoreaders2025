import { usePrayer } from '../context/PrayerContext';
import { pretendard } from '../lib/fonts';
import Header from '../components/Header';
import { FaUserCog, FaUserShield, FaCalendarWeek, FaListUl, FaFileExport, FaCalendarAlt } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import ExportConfirmModal from '../components/dailycheck/ExportConfirmModal';
import { useRouter } from 'next/router';
import { Tabs, Tab } from '../components/common/Tabs';
import { Toaster } from 'react-hot-toast';
// hooks
import { useFamilyManagement } from '../hooks/useFamilyManagement';
import { useFamilyStats } from '../hooks/useFamilyStats';
// components

import FamilyStats from '../components/family-management/FamilyStats'; // FamilyStats 컴포넌트 -> FamilyStatsSection 포함
import FamilyRecordsView from '../components/family-management/FamilyRecordsView';
import FamilyAttendanceView from '../components/family-management/FamilyAttendanceView';

// 출결 기록 인터페이스 추가
export interface AttendanceRecord {
  id?: number;
  user_name: string;
  date: string;
  is_present: boolean;
  note?: string;
  campus?: string;
  family_leader?: string;
}

// PrayerRequest 인터페이스를 별도로 type 정의
export interface PrayerRequest {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isAnswered: boolean;
  author: string;
  authorId?: number | null;
  likes?: number;
  prayers?: number;
}

export default function FamilyPage() {
  const { prayers } = usePrayer();
  const router = useRouter();

  // 커스텀 hooks
  const {
    qtRecords,
    attendanceRecords,
    selectedUser,
    setSelectedUser,
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    viewTab,
    setViewTab,
    showExportModal,
    setShowExportModal,
    authorized,
    authChecked,
    familyMembers,
    filteredRecordsByRange,
    updateAttendanceStatus,
    handleBulkUpdateAttendance,
    exportAttendance,
    handleLogout,
    handleExportConfirm,
  } = useFamilyManagement();

  // 통계 관련 hooks
  const {
    userList,
    userStats,
    totals,
    stats,
    formattedDate,
    groupRecordsByUser,
    groupRecordsByWeek,
    formatWeekLabel,
    calculateWeekStats,
  } = useFamilyStats(qtRecords, prayers, filteredRecordsByRange);

  // 인증 확인이 완료되지 않았거나 권한이 없는 경우 로딩 표시
  if (!authChecked || !authorized) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-amber-100 border-t-amber-600"></div>
        <p className="mt-4 text-amber-600">권한을 확인하는 중이에요...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 via-slate-50 to-white ${pretendard.className}`}>
      <Header />
      <Toaster position="top-center" />
      <main className="container mx-auto max-w-7xl px-4 py-0">
        {/* 대시보드 헤더 */}
        <div className="mb-0 mt-4 px-2 py-2">
          <div className="flex flex-col gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-800 p-6 tracking-tighter text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <FaUserCog className="h-8 w-8 text-white" />
                <div>
                  <h1 className="text-3xl font-bold">가족원 관리 페이지</h1>
                  <p className="mt-1 text-amber-100">가족원의 신앙 생활과 출결을 관리합니다</p>
                </div>
              </div>
            </div>

            <div className="z-10 grid grid-cols-4 flex-wrap gap-3 xs:grid-cols-2">
              {/* 상단 메뉴 */}
              <button
                onClick={exportAttendance}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-indigo-500 hover:bg-white/20 active:scale-95">
                <FaFileExport className="h-4 w-4" />
                엑셀
              </button>

              <button
                onClick={() => router.push('/familyMemberManagement')}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95">
                <FaUserCog className="h-4 w-4" />
                가족원 관리
              </button>

              <button
                onClick={() => router.push('/leaderManagement')}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95">
                <FaUserShield className="h-4 w-4" />
                가족장 관리
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95">
                <FaUserShield className="h-4 w-4" />
                로그아웃
              </button>
            </div>
          </div>
        </div>

        {/* 주요 선택 탭 */}
        <div className="px-2 py-2">
          <Tabs selectedTab={viewTab} onChange={(tab) => setViewTab(tab as 'stats' | 'attendance')}>
            <Tab
              id="stats"
              label={
                <div className="flex items-center gap-2">
                  <span>신앙생활 통계</span>
                </div>
              }
            />
            <Tab
              id="attendance"
              label={
                <div className="flex items-center gap-2">
                  <span>출결 관리</span>
                </div>
              }
            />
          </Tabs>
        </div>

        {/* 선택된 뷰에 따라 다른 컨텐츠 표시 */}
        {viewTab === 'stats' ? (
          <>
            {/* showFilters 대신 항상 true로 */}
            <div className="overflow-hidden px-2 py-0">
              <FamilyStats
                totals={totals}
                stats={stats}
                userList={userList}
                userStats={userStats}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                formattedDate={formattedDate}
                groupRecordsByWeek={groupRecordsByWeek}
                calculateWeekStats={calculateWeekStats}
                formatWeekLabel={formatWeekLabel}
                filteredRecordsByRange={filteredRecordsByRange}
              />
            </div>

            {/* 뷰 모드 선택 - 일자/주차별 전환 */}
            <div className="mb-4 mt-4 flex items-center justify-end gap-2">
              <span className="text-sm font-medium text-gray-700">보기:</span>
              <button
                onClick={() => setViewMode('day')}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm ${
                  viewMode === 'day' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                <FaListUl className="h-3 w-3" />
                일자별
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm ${
                  viewMode === 'week' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                <FaCalendarWeek className="h-3 w-3" />
                주차별
              </button>
            </div>

            <FamilyRecordsView
              viewMode={viewMode}
              setViewMode={setViewMode}
              filteredRecordsByRange={filteredRecordsByRange}
              groupRecordsByUser={groupRecordsByUser}
              groupRecordsByWeek={groupRecordsByWeek}
              calculateWeekStats={calculateWeekStats}
              formatWeekLabel={formatWeekLabel}
              formattedDate={formattedDate}
            />
          </>
        ) : (
          /* 출결 관리 뷰 */
          <div className="space-y-4 px-2 py-2">
            {/* 날짜 선택 */}
            <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
              <h3 className="flex items-center gap-2 text-lg font-medium text-gray-800">
                <FaCalendarAlt className="h-5 w-5 text-amber-600" />
                출결 날짜 선택
              </h3>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-200"
                />

                <button
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                  오늘
                </button>
              </div>
            </div>

            {/* 출결 관리 뷰 */}
            <FamilyAttendanceView
              attendanceRecords={attendanceRecords}
              selectedDate={selectedDate}
              updateAttendanceStatus={updateAttendanceStatus}
              familyMembers={familyMembers}
              bulkUpdateAttendance={handleBulkUpdateAttendance}
            />
          </div>
        )}

        <AnimatePresence>
          {showExportModal && (
            <ExportConfirmModal
              onConfirm={handleExportConfirm}
              onCancel={() => setShowExportModal(false)}
              message={
                viewTab === 'attendance'
                  ? '출석 데이터를 엑셀로 내보내시겠습니까?'
                  : 'QT 데이터를 엑셀로 내보내시겠습니까?'
              }
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
