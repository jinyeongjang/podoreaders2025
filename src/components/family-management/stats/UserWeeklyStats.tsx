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
  calculateWeekStats,
  totalPages,
  currentPage,
  onPageChange,
}: UserWeeklyStatsProps) => {
  // 주차 라벨을 더 가독성 좋게 포맷하는 함수
  const formatWeekDateRange = (weekKey: string) => {
    // 주차의 시작일과 종료일 객체 생성
    const [startDate, endDate] = weekKey.split('_');
    const startDateObj = new Date(startDate.replace(/-/g, '/'));
    const endDateObj = new Date(endDate.replace(/-/g, '/'));

    // 각각의 요일 구하기
    const startDayName = startDateObj.toLocaleDateString('ko-KR', { weekday: 'short' });
    const endDayName = endDateObj.toLocaleDateString('ko-KR', { weekday: 'short' });

    // 헤더에 요일을 강조하여 표시
    return (
      <div className="mb-1 flex items-center rounded-xl px-1 py-2 text-sm font-medium text-gray-800">
        {startDateObj.getFullYear()}년 {startDateObj.getMonth() + 1}월 {startDateObj.getDate()}일
        <span className="mx-1 text-indigo-500">({startDayName})</span>~ {endDateObj.getMonth() + 1}월{' '}
        {endDateObj.getDate()}일<span className="mx-1 text-indigo-500">({endDayName})</span>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {paginatedWeeks.map(([weekKey, records]) => {
        const weekStats = calculateWeekStats(records);

        return (
          <div key={weekKey} className="rounded-lg bg-gray-50 p-3">
            <div className="mb-2 tracking-tighter">{formatWeekDateRange(weekKey)}</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {/* 큐티 통계 */}
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="text-xs text-gray-500">큐티</div>
                <div className="text-lg font-bold text-indigo-500">
                  <NumberFlow value={weekStats.qtTotal} />회
                </div>
              </div>
              {/* 말씀 통계 */}
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="text-xs text-gray-500">말씀</div>
                <div className="text-lg font-bold text-blue-500">
                  <NumberFlow value={weekStats.bibleTotal} />장
                </div>
              </div>
              {/* 필사 통계 */}
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="text-xs text-gray-500">필사</div>
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
