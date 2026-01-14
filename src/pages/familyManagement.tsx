import { pretendard } from '../lib/fonts';
import Header from '../components/layout/Header';
import { FaUserCog, FaUserShield, FaCalendarWeek, FaListUl, FaFileExport } from 'react-icons/fa';
// hooks
import { useFamilyManagement } from '../hooks/useFamilyManagement';
import { useFamilyStats } from '../components/family-management/useFamilyStats';
// components
import FamilyStats from '../components/family-management/FamilyStats';
import FamilyRecordsView from '../components/family-management/FamilyRecordsView';

// PrayerRequest 인터페이스를 별도로 정의
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
  // 커스텀 hooks
  const {
    qtRecords,
    selectedUser,
    setSelectedUser,
    viewMode,
    setViewMode,
    authorized,
    authChecked,
    exportAttendance,
    handleLogout,
    filteredRecordsByRange,
  } = useFamilyManagement();

  // 통계 관련 hooks
  const {
    userList,
    userStats,
    totals,
    formattedDate,
    groupRecordsByUser,
    groupRecordsByWeek,
    formatWeekLabel,
    calculateWeekStats,
  } = useFamilyStats(qtRecords, filteredRecordsByRange);

  // 인증 확인이 완료되지 않았거나 권한이 없는 경우 로딩 표시
  if (!authChecked || !authorized) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-amber-100 border-t-amber-600"></div>
        <p className="mt-4 text-amber-600">권한을 확인하는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 via-slate-50 to-white ${pretendard.className}`}>
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-0">
        {/* 대시보드 헤더 */}
        <div className="mb-0 mt-4 px-2 py-2">
          <div className="flex flex-col gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-800 p-6 tracking-tighter text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <FaUserCog className="h-8 w-8 text-white" />
                <div>
                  <h1 className="text-xl font-bold">가족원 관리 페이지</h1>
                  <p className="mt-1 text-amber-100">가족원의 신앙 생활을 관리합니다</p>
                </div>
              </div>
            </div>

            <div className="z-10 flex flex-wrap gap-3">
              {/* 액션 버튼들 */}
              <button
                onClick={exportAttendance}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95">
                <FaFileExport className="h-4 w-4" />
                엑셀 내보내기
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

        {/* 신앙생활 통계 섹션 */}
        <div className="overflow-hidden px-2 py-0">
          <FamilyStats
            totals={totals}
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

        {/* 뷰 모드 선택기 - 일자별/주차별 전환 */}
        <div className="mb-4 mt-4 flex items-center justify-end gap-2">
          <span className="text-sm font-medium text-gray-700">보기 모드:</span>
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
      </main>
    </div>
  );
}
