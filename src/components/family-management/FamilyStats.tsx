import { motion } from 'framer-motion';
import NumberFlow from '@number-flow/react'; // @number-flow/react 사용
// components
import FamilyStatsSection from './FamilyStatsSection';
// types
import { DailyRecord } from '../../types/records';

interface FamilyStatsProps {
  totals: {
    qtTotal: number;
    bibleTotal: number;
  };
  stats: {
    total: number;
    answered: number;
  };
  userList: string[];
  userStats: Record<
    string,
    {
      qtTotal: number;
      bibleTotal: number;
      writingTotal: number;
      recordCount: number;
      lastRecord: Date | null;
    }
  >;
  selectedUser: string;
  setSelectedUser: (user: string) => void;
  formattedDate: (date: string | Date) => string;
  groupRecordsByWeek: (records: DailyRecord[]) => Record<string, Record<string, DailyRecord[]>>;
  calculateWeekStats: (records: DailyRecord[]) => {
    qtTotal: number;
    bibleTotal: number;
    writingTotal: number;
    days: number;
  };
  formatWeekLabel: (weekKey: string) => string;
  filteredRecordsByRange: DailyRecord[];
}

export default function FamilyStats({
  totals,
  userList,
  userStats,
  selectedUser,
  setSelectedUser,
  groupRecordsByWeek,
  calculateWeekStats,
  formatWeekLabel,
  filteredRecordsByRange,
}: FamilyStatsProps) {
  // 선택된 가족원들의 누계 계산
  const calculateSelectedTotals = () => {
    if (selectedUser === 'all') {
      return totals;
    }

    const selectedUsersList = selectedUser.split(', ');
    return {
      qtTotal: selectedUsersList.reduce((sum, user) => sum + (userStats[user]?.qtTotal || 0), 0),
      bibleTotal: selectedUsersList.reduce((sum, user) => sum + (userStats[user]?.bibleTotal || 0), 0),
    };
  };

  const selectedTotals = calculateSelectedTotals();

  return (
    <>
      <div className="mb-4 grid grid-cols-2 gap-4 xs:grid-cols-2">
        <motion.div
          animate={{
            background: ['linear-gradient(0deg, #6366f1, #818cf8)', 'linear-gradient(360deg, #6366f1, #818cf8)'],
          }}
          transition={{
            background: {
              repeat: Infinity,
              duration: 5,
              ease: 'linear',
            },
          }}
          className="rounded-3xl p-6 text-white shadow-lg">
          <p className="text-sm font-medium text-indigo-100">
            {selectedUser === 'all' ? '전체 큐티 횟수' : '선택된 가족원 큐티 횟수'}
          </p>
          <div className="mt-2 text-[45px] font-bold drop-shadow-xl">
            <NumberFlow value={selectedTotals.qtTotal} />
            <span className="text-[25px]">회</span>
          </div>
        </motion.div>

        <motion.div
          animate={{
            background: ['linear-gradient(0deg, #60a5fa, #93c5fd)', 'linear-gradient(360deg, #60a5fa, #93c5fd)'],
          }}
          transition={{
            background: {
              repeat: Infinity,
              duration: 5,
              ease: 'linear',
            },
          }}
          className="rounded-3xl p-6 text-white shadow-lg">
          <p className="text-sm font-medium text-sky-100">
            {selectedUser === 'all' ? '전체 말씀 읽기' : '선택된 가족원 말씀 횟수'}
          </p>
          <div className="mt-2 text-[45px] font-bold drop-shadow-xl">
            <NumberFlow value={selectedTotals.bibleTotal} />
            <span className="text-[25px]">장</span>
          </div>
        </motion.div>
      </div>
      <FamilyStatsSection
        userList={userList}
        userStats={userStats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        groupRecordsByWeek={groupRecordsByWeek}
        calculateWeekStats={calculateWeekStats}
        formatWeekLabel={formatWeekLabel}
        filteredRecordsByRange={filteredRecordsByRange}
      />
    </>
  );
}
