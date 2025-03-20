import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { RiUserHeartLine } from 'react-icons/ri';
import { DailyRecord } from '../../../types/records';
import UserStatsTabs from './UserStatsTabs';
import UserStatsOverview from './UserStatsOverview';
import UserWeeklyStats from './UserWeeklyStats';
import UserPrayerList from './UserPrayerList';

// Prayer 인터페이스 정의
interface Prayer {
  id: number;
  content: string;
  created_at: string;
  user_name: string;
}

interface UserStatsCardProps {
  userName: string;
  stats: {
    qtTotal: number;
    bibleTotal: number;
    writingTotal: number;
    recordCount: number;
    lastRecord: Date | null;
  };
  userWeeklyData: Record<string, DailyRecord[]>;
  prayers: Prayer[];
  calculateWeekStats: (records: DailyRecord[]) => {
    qtTotal: number;
    bibleTotal: number;
    writingTotal: number;
    days: number;
  };
  formatWeekLabel: (weekKey: string) => string;
  selectedUsers: string[];
  activeTab: 'stats' | 'prayers';
  setActiveTab: (tab: 'stats' | 'prayers') => void;
}

const UserStatsCard = ({
  userName,
  stats,
  userWeeklyData,
  prayers,
  calculateWeekStats,
  formatWeekLabel,
  selectedUsers,
  activeTab,
  setActiveTab,
}: UserStatsCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [prayerPage, setPrayerPage] = useState(1);
  const itemsPerPage = 2;
  const prayersPerPage = 3;

  // 주차별 데이터 페이지네이션
  const weekEntries = Object.entries(userWeeklyData);
  const totalPages = Math.max(1, Math.ceil(weekEntries.length / itemsPerPage));
  const paginatedWeeks = weekEntries
    .sort(([a], [b]) => b.localeCompare(a))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 기도제목 페이지네이션
  const totalPrayerPages = Math.ceil(prayers.length / prayersPerPage);
  const paginatedPrayers = prayers.slice((prayerPage - 1) * prayersPerPage, prayerPage * prayersPerPage);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 ${
        selectedUsers.includes(userName) ? 'ring-2 ring-indigo-500' : ''
      }`}>
      {/* 카드 헤더 */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white p-1 text-indigo-600">
              <RiUserHeartLine className="h-4 w-4" />
            </span>
            <h3 className="text-lg font-bold">{userName}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
              기록 {stats.recordCount}회
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-full bg-white/20 p-1 backdrop-blur-sm hover:bg-white/30">
              {isExpanded ? <FaChevronUp className="h-3 w-3" /> : <FaChevronDown className="h-3 w-3" />}
            </button>
          </div>
        </div>
        {stats.lastRecord && (
          <div className="mt-1 text-xs opacity-80">
            최근기록: {new Date(stats.lastRecord).toLocaleDateString('ko-KR').replace(/\. /g, '.')}
          </div>
        )}
      </div>

      {/* 탭 네비게이션 */}
      <UserStatsTabs activeTab={activeTab} setActiveTab={setActiveTab} prayersCount={prayers.length} />

      <div className="p-4">
        {activeTab === 'stats' ? (
          <div className="space-y-4">
            {/* 누계 통계 */}
            <UserStatsOverview stats={stats} />

            {/* 주차별 통계 */}
            {isExpanded && (
              <UserWeeklyStats
                paginatedWeeks={paginatedWeeks}
                formatWeekLabel={formatWeekLabel}
                calculateWeekStats={calculateWeekStats}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}

            {/* 접기/펼치기 버튼 */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`mt-2 flex w-full items-center justify-center gap-1 rounded-lg ${isExpanded ? 'bg-gray-200' : 'bg-gray-100'} py-2 text-sm text-gray-700 transition-all hover:bg-gray-200`}>
              {isExpanded ? (
                <>
                  <FaChevronUp className="h-3 w-3" />
                  <span>주차별 통계 접기</span>
                </>
              ) : (
                <>
                  <FaChevronDown className="h-3 w-3" />
                  <span>주차별 통계 펼치기</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <UserPrayerList
            prayers={paginatedPrayers}
            totalPages={totalPrayerPages}
            currentPage={prayerPage}
            onPageChange={setPrayerPage}
          />
        )}
      </div>
    </motion.div>
  );
};

export default UserStatsCard;
