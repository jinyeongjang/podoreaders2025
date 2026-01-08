import { motion } from 'framer-motion';
import { RiUserHeartLine } from 'react-icons/ri';
import WordCampusUserStatsOverview from './WordCampusUserStatsOverview';
import WordCampusWeeklyStats from './WordCampusWeeklyStats';

interface WordCampus_QtRecord {
  id?: number;
  user_name: string;
  date: string;
  qt_count: number;
  bible_read_count: number;
  qt_done: boolean;
  bible_read_done: boolean;
  writing_done: boolean;
  dawn_prayer_attended: boolean;
  created_at?: string;
  updated_at?: string;
}

interface WordCampusUserStatsCardProps {
  userName: string;
  stats: {
    qtTotal: number;
    bibleTotal: number;
    writingTotal: number;
    recordCount: number;
  };
  userWeeklyData: Record<string, WordCampus_QtRecord[]>;
  calculateWeekStats: (records: WordCampus_QtRecord[]) => {
    qtTotal: number;
    bibleTotal: number;
    writingTotal: number;
    dawnPrayerTotal: number;
    days: number;
  };
  formatWeekLabel: (weekKey: string) => string;
  selectedUsers: string[];
}

export default function WordCampusUserStatsCard({
  userName,
  stats,
  userWeeklyData,
  calculateWeekStats,
  formatWeekLabel,
  selectedUsers,
}: WordCampusUserStatsCardProps) {
  const isSelected = selectedUsers.includes(userName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`overflow-hidden rounded-2xl border-2 transition-all ${
        isSelected ? 'border-emerald-400 bg-emerald-50/50 shadow-lg' : 'border-gray-200 bg-white shadow-sm'
      }`}>
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2 ${isSelected ? 'bg-emerald-100' : 'bg-gray-100'}`}>
            <RiUserHeartLine className={`h-5 w-5 ${isSelected ? 'text-emerald-600' : 'text-gray-600'}`} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900">{userName}</h3>
            <p className="text-xs text-gray-500">총 {stats.recordCount}일 기록</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSelected && (
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">선택됨</span>
          )}
        </div>
      </div>

      {/* 확장 영역 - 항상 표시 */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-50 p-4">
        <div className="space-y-4">
          {/* 누계 통계 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-700">전체 누계</h4>
            <WordCampusUserStatsOverview
              stats={{
                qtTotal: stats.qtTotal,
                bibleTotal: stats.bibleTotal,
                writingTotal: stats.writingTotal,
              }}
            />
          </div>

          {/* 주차별 통계 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-700">주차별 기록</h4>
            <WordCampusWeeklyStats
              userWeeklyData={userWeeklyData}
              calculateWeekStats={calculateWeekStats}
              formatWeekLabel={formatWeekLabel}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
