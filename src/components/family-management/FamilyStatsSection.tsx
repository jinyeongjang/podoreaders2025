import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaFilter, FaUserFriends, FaChevronDown, FaChevronUp, FaChartLine } from 'react-icons/fa';
import { MdFilterAltOff } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { DailyRecord } from '../../types/records';
import { usePrayers } from '../../hooks/usePrayers';
import UserSelectionModal from './UserSelectionModal';
import UserStatsCard from './stats/UserStatsCard';
import { Tooltip } from 'react-tooltip';

interface UserStatsProps {
  userList: string[];
  userStats: Record<
    string,
    {
      qtTotal: number;
      bibleTotal: number;
      writingTotal: number;
      recordCount: number;
      lastRecord: Date | null;
      weeklyRecords?: Record<string, DailyRecord[]>;
    }
  >;
  selectedUser: string;
  setSelectedUser: (user: string) => void;
  calculateWeekStats: (records: DailyRecord[]) => {
    qtTotal: number;
    bibleTotal: number;
    writingTotal: number;
    days: number;
  };
  groupRecordsByWeek: (records: DailyRecord[]) => Record<string, Record<string, DailyRecord[]>>;
  formatWeekLabel: (weekKey: string) => string;
  filteredRecordsByRange: DailyRecord[];
}

const FamilyStatsSection = ({
  userList,
  userStats,
  selectedUser,
  setSelectedUser,
  calculateWeekStats,
  groupRecordsByWeek,
  formatWeekLabel,
  filteredRecordsByRange,
}: UserStatsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'prayers'>('stats');
  const { prayers: allPrayers } = usePrayers('all');

  // 사용자 선택 핸들러
  const handleUserToggle = (userName: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userName) ? prev.filter((user) => user !== userName) : [...prev, userName],
    );
  };

  const handleApplySelection = () => {
    if (selectedUsers.length > 0) {
      setSelectedUser(selectedUsers.join(', '));
      const filteredUsers = userList.filter((user) => selectedUsers.includes(user));
      setSelectedUsers(filteredUsers);
    } else {
      setSelectedUser('all');
      setSelectedUsers([]);
    }
    setIsModalOpen(false);
  };

  const handleClearSelection = () => {
    setSelectedUsers([]);
    setSelectedUser('all');
  };

  // 디스플레이 유저 정보
  const getDisplayedUsers = () => {
    if (selectedUser === 'all') {
      return userList;
    }
    return selectedUser
      .split(', ')
      .filter(Boolean)
      .filter((user) => userList.includes(user));
  };

  // 필터링된 데이터 가져오기
  const getUserPrayers = (userName: string) => {
    return allPrayers.filter((p) => p.user_name === userName);
  };

  const getUserWeeklyData = (userName: string) => {
    const userRecords = filteredRecordsByRange.filter((record) => record.userName === userName);
    const weeklyDataByUser = groupRecordsByWeek(userRecords);
    return weeklyDataByUser[userName] || {};
  };

  return (
    <div className="mb-8 space-y-5">
      {/* 상단 고정 메뉴 */}
      <StatsHeader
        displayedUsersCount={getDisplayedUsers().length}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        selectedUser={selectedUser}
        setIsModalOpen={setIsModalOpen}
        handleClearSelection={handleClearSelection}
      />

      {/* 툴팁 */}
      <Tooltip id="filter-tooltip" place="bottom" />
      <Tooltip id="clear-tooltip" place="bottom" />
      <Tooltip id="toggle-tooltip" place="bottom" />

      {/* 사용자 선택 modal */}
      <AnimatePresence>
        {isModalOpen && (
          <UserSelectionModal
            userList={userList}
            selectedUsers={selectedUsers}
            handleUserToggle={handleUserToggle}
            handleApplySelection={handleApplySelection}
            handleClose={() => setIsModalOpen(false)}
            handleClearSelection={handleClearSelection}
          />
        )}
      </AnimatePresence>

      {/* 사용자 통계 카드 그리드 */}
      {isExpanded && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {getDisplayedUsers().map((userName) => {
            const userWeeklyData = getUserWeeklyData(userName);
            const userPrayers = getUserPrayers(userName);
            const stats = userStats[userName];

            if (!stats) return null;

            return (
              <UserStatsCard
                key={userName}
                userName={userName}
                stats={stats}
                userWeeklyData={userWeeklyData}
                prayers={userPrayers}
                calculateWeekStats={calculateWeekStats}
                formatWeekLabel={formatWeekLabel}
                selectedUsers={selectedUsers}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// 통계 헤더 컴포넌트
interface StatsHeaderProps {
  displayedUsersCount: number;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  selectedUser: string;
  setIsModalOpen: (open: boolean) => void;
  handleClearSelection: () => void;
}

const StatsHeader = ({
  displayedUsersCount,
  isExpanded,
  setIsExpanded,
  selectedUser,
  setIsModalOpen,
  handleClearSelection,
}: StatsHeaderProps) => {
  return (
    <div className="sticky top-16 z-30 backdrop-blur-md">
      <div className="rounded-xl bg-white/90 px-4 py-3 shadow-lg transition-all duration-300 ease-in-out">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FaUserFriends className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900 xs:text-base">
              가족원 통계
              <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                {displayedUsersCount}명
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              data-tooltip-id="filter-tooltip"
              data-tooltip-content="가족원 필터링"
              className="flex items-center gap-1.5 rounded-lg bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-700 transition-all hover:bg-indigo-200 active:scale-95 xs:py-3 xs:text-xs">
              <FaFilter className="h-3.5 w-3.5" />
              <span>{selectedUser === 'all' ? '가족원 선택' : '필터 적용 중'}</span>
            </button>

            {selectedUser !== 'all' && (
              <button
                onClick={handleClearSelection}
                data-tooltip-id="clear-tooltip"
                data-tooltip-content="필터 초기화"
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-indigo-500 hover:text-indigo-600 active:bg-indigo-50 xs:text-xs">
                <MdFilterAltOff className="h-3.5 w-3.5" />
                <span>초기화</span>
              </button>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              data-tooltip-id="toggle-tooltip"
              data-tooltip-content={isExpanded ? '통계 접기' : '통계 펼치기'}
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95 xs:py-3 xs:text-xs">
              {isExpanded ? <FaChevronUp className="h-3.5 w-3.5" /> : <FaChevronDown className="h-3.5 w-3.5" />}
              <span>{isExpanded ? '접기' : '펼치기'}</span>
            </button>
          </div>
        </div>

        {/* 필터 적용 badge */}
        {selectedUser !== 'all' && (
          <div className="mt-2 flex items-center rounded-lg bg-blue-50 px-3 py-2">
            <FaChartLine className="h-4 w-4 text-blue-600" />
            <span className="ml-2 text-xs font-medium text-blue-700">
              {selectedUser.split(', ').length}명의 가족원 데이터만 표시 중
            </span>
            <button
              onClick={handleClearSelection}
              className="ml-auto rounded-full bg-blue-100 p-1 text-blue-700 hover:bg-blue-200 hover:text-blue-800">
              <IoMdClose className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyStatsSection;
