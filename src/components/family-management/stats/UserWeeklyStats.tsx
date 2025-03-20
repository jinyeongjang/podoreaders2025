// 주차별 통계 표시 컴포넌트
import NumberFlow from '@number-flow/react';
import { DailyRecord } from '../../../types/records';
import Pagination from '../../common/Pagination';

interface UserWeeklyStatsProps {
  paginatedWeeks: [string, DailyRecord[]][];
  formatWeekLabel: (weekKey: string) => string;
  calculateWeekStats: (records: DailyRecord[]) => {
    qtTotal: number;
    bibleTotal: number;
    writingTotal: number;
    days: number;
  };
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const UserWeeklyStats = ({
  paginatedWeeks,
  formatWeekLabel,
  calculateWeekStats,
  totalPages,
  currentPage,
  onPageChange,
}: UserWeeklyStatsProps) => {
  return (
    <div className="space-y-3">
      {paginatedWeeks.map(([weekKey, records]) => {
        const weekStats = calculateWeekStats(records);

        return (
          <div key={weekKey} className="rounded-lg bg-gray-50 p-3">
            <div className="mb-2 text-center text-xs font-semibold text-gray-700">{formatWeekLabel(weekKey)}</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="text-xs text-gray-500">큐티 횟수</div>
                <div className="text-lg font-bold text-indigo-500">
                  <NumberFlow value={weekStats.qtTotal} />일
                </div>
              </div>
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="text-xs text-gray-500">말씀 읽기</div>
                <div className="text-lg font-bold text-blue-500">
                  <NumberFlow value={weekStats.bibleTotal} />장
                </div>
              </div>
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="text-xs text-gray-500">필사 횟수</div>
                <div className="text-lg font-bold text-green-600">
                  <NumberFlow value={weekStats.writingTotal} />회
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* 주차별 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};

export default UserWeeklyStats;
