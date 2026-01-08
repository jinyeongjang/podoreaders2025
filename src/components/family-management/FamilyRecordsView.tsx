import { useMemo, useState } from 'react';
import { FaBook, FaBible, FaPen, FaPray } from 'react-icons/fa';
import { DailyRecord } from '../../types/records';

interface RecordsViewProps {
  viewMode: 'day' | 'week';
  setViewMode: (mode: 'day' | 'week') => void;
  filteredRecordsByRange: DailyRecord[];
  groupRecordsByUser: (records: DailyRecord[]) => Record<string, DailyRecord[]>;
  groupRecordsByWeek: (records: DailyRecord[]) => Record<string, Record<string, DailyRecord[]>>;
  calculateWeekStats: (records: DailyRecord[]) => {
    qtTotal: number;
    bibleTotal: number;
    writingTotal: number;
    days: number;
  };
  formatWeekLabel: (weekKey: string) => string;
  formattedDate: (date: string | Date) => string;
}

export default function RecordsView({
  viewMode = 'week',
  setViewMode,
  filteredRecordsByRange,
  groupRecordsByWeek,
  calculateWeekStats,
  formatWeekLabel,
  formattedDate,
}: RecordsViewProps) {
  // 보기 모드 상태 (주/일)
  const [tab, setTab] = useState<'week' | 'day'>(viewMode === 'week' ? 'week' : 'day');

  // 데이터 정렬 및 그룹화 함수들
  const sortRecordsByDateAscending = (records: DailyRecord[]): DailyRecord[] => {
    return [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const sortWeekGroupsByMonth = (weekGroups: Record<string, DailyRecord[]>): [string, DailyRecord[]][] => {
    return Object.entries(weekGroups).sort((a, b) => {
      const getStartDate = (weekKey: string) => {
        const startDateStr = weekKey.split('_')[0];
        const [year, month, day] = startDateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      };
      return getStartDate(b[0]).getTime() - getStartDate(a[0]).getTime();
    });
  };

  const getMonthName = (weekKey: string): string => {
    const startDate = weekKey.split('_')[0];
    const [year, month] = startDate.split('-').map(Number);
    return `${year}년 ${month}월`;
  };

  // 사용자별 월 그룹화 데이터 계산
  const groupedByMonth = useMemo(() => {
    const groupedByWeek = groupRecordsByWeek(filteredRecordsByRange);

    return Object.entries(groupedByWeek).map(([userName, weekGroups]) => {
      const sortedWeekGroups = sortWeekGroupsByMonth(weekGroups);
      const monthGroups: Record<string, { weeks: [string, DailyRecord[]][]; records: DailyRecord[] }> = {};

      sortedWeekGroups.forEach(([weekKey, records]) => {
        const monthKey = getMonthName(weekKey);

        if (!monthGroups[monthKey]) {
          monthGroups[monthKey] = { weeks: [], records: [] };
        }

        monthGroups[monthKey].weeks.push([weekKey, records]);
        monthGroups[monthKey].records.push(...records);
      });

      // 월 그룹을 최신순으로 정렬
      const sortedMonthGroups = Object.entries(monthGroups).sort((a, b) => {
        const getMonthDate = (monthKey: string) => {
          const [year, month] = monthKey
            .match(/(\d+)년\s+(\d+)월/)
            ?.slice(1)
            .map(Number) || [0, 0];
          return new Date(year, month - 1, 1);
        };
        return getMonthDate(b[0]).getTime() - getMonthDate(a[0]).getTime();
      });

      return {
        userName,
        monthGroups: Object.fromEntries(sortedMonthGroups),
      };
    });
  }, [filteredRecordsByRange, groupRecordsByWeek]);

  // 일간 그룹화: 날짜별로 그룹화
  const groupedByDate = useMemo(() => {
    const map: Record<string, DailyRecord[]> = {};
    filteredRecordsByRange.forEach((rec) => {
      if (!map[rec.date]) map[rec.date] = [];
      map[rec.date].push(rec);
    });
    return Object.entries(map).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [filteredRecordsByRange]);

  // 주간 통계 컴포넌트 렌더링
  const renderWeeklyRecords = () =>
    groupedByMonth.map(({ userName, monthGroups }) => (
      <div key={userName} className="mt-5 rounded-2xl border-2 border-gray-200 bg-white p-6 tracking-tighter">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{userName}</h3>

        {Object.entries(monthGroups).map(([monthName, { weeks }]) => (
          <div key={`${userName}-${monthName}`} className="mb-8">
            <h4 className="mb-2 rounded-xl bg-indigo-50 px-2 py-2 text-right text-[17px] font-semibold text-gray-800">
              {monthName}
            </h4>

            <div className="space-y-3">
              {weeks.map(([weekKey, records]) => {
                const weekStats = calculateWeekStats(records);
                const sortedRecords = sortRecordsByDateAscending(records);

                return (
                  <div key={weekKey} className="rounded-lg bg-white">
                    <div className="mb-2 flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">{formatWeekLabel(weekKey)}</h5>
                    </div>

                    <div className="mb-2 border-t border-gray-200"></div>
                    <p className="mb-2 text-sm text-gray-500">산정방법: 일요일부터~토요일까지</p>

                    {/* 주간 통계 요약 */}
                    <div className="flex gap-2 py-1 text-[15px] text-gray-600">
                      <div className="flex items-center gap-1">
                        <span>
                          큐티 <span className="text-[20px] font-semibold text-indigo-500">{weekStats.qtTotal}</span>회
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>
                          말씀 <span className="text-[20px] font-semibold text-indigo-500">{weekStats.bibleTotal}</span>
                          장
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>
                          필사{' '}
                          <span className="text-[20px] font-semibold text-indigo-500">{weekStats.writingTotal}</span>회
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>
                          기록횟수 <span className="text-[20px] font-semibold text-indigo-500">{weekStats.days}</span>회
                        </span>
                      </div>
                    </div>

                    {/* 개별 기록 카드 */}
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {sortedRecords.map((record) => renderRecordCard(record))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    ));

  // 일간 기록 컴포넌트 렌더링
  const renderDailyRecords = () => (
    <div className="mt-5 rounded-2xl border-2 border-gray-200 bg-white p-6 tracking-tighter">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">일간 기록</h3>

      {groupedByDate.length === 0 && <div className="py-8 text-center text-gray-400">기록이 없습니다.</div>}

      {groupedByDate.map(([date, records]) => (
        <div key={date} className="mb-6">
          <div className="mb-2 text-right text-[17px] font-semibold text-gray-800">{formattedDate(date)}</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {records.map((record) => renderDailyRecordCard(record))}
          </div>
        </div>
      ))}
    </div>
  );

  // 주간 보기에서 사용하는 레코드 카드
  const renderRecordCard = (record: DailyRecord) => (
    <div key={`${record.date}-${record.userName}`} className="group mt-4 rounded-xl transition-all">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">{formattedDate(record.date)}</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-indigo-50 p-3">
          <div className="flex items-center gap-2">
            <FaBook className="h-4 w-4 text-indigo-500" />
            <span className="text-sm text-gray-500">큐티</span>
          </div>
          <div className="mt-1 text-xl font-bold text-indigo-600">{record.qtCount}회</div>
        </div>
        <div className="rounded-lg bg-indigo-50 p-3">
          <div className="flex items-center gap-2">
            <FaBible className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-500">말씀</span>
          </div>
          <div className="mt-1 text-xl font-bold text-blue-600">{record.bibleReadCount}장</div>
        </div>
        <div className="rounded-lg bg-blue-50 p-3">
          <div className="flex items-center gap-2">
            <FaPen className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-500">필사</span>
          </div>
          <div className="mt-1 text-xl font-bold text-blue-500">{record.writingDone ? '완료' : '없음'}</div>
        </div>
      </div>
    </div>
  );

  // 일간 보기에서 사용하는 레코드 카드
  const renderDailyRecordCard = (record: DailyRecord) => (
    <div key={`${record.date}-${record.userName}`} className="group rounded-xl border bg-indigo-50 p-4 transition-all">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-indigo-700">{record.userName}</span>
        {record.dawnPrayerAttended && (
          <span className="flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-600">
            <FaPray className="mr-1 inline-block" /> 새벽기도
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center rounded bg-white p-2">
          <FaBook className="h-4 w-4 text-indigo-500" />
          <span className="text-xs text-gray-500">큐티</span>
          <span className="mt-1 text-lg font-bold text-indigo-600">{record.qtCount}회</span>
        </div>
        <div className="flex flex-col items-center rounded bg-white p-2">
          <FaBible className="h-4 w-4 text-blue-500" />
          <span className="text-xs text-gray-500">말씀</span>
          <span className="mt-1 text-lg font-bold text-blue-600">{record.bibleReadCount}장</span>
        </div>
        <div className="flex flex-col items-center rounded bg-white p-2">
          <FaPen className="h-4 w-4 text-blue-500" />
          <span className="text-xs text-gray-500">필사</span>
          <span className="mt-1 text-lg font-bold text-blue-500">{record.writingDone ? '완료' : '없음'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">기록 목록</h2>
        <div className="flex gap-1 rounded-lg p-1">
          <button
            onClick={() => {
              setTab('week');
              setViewMode('week');
            }}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'week' ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}>
            주간
          </button>
          <button
            onClick={() => {
              setTab('day');
              setViewMode('day');
            }}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'day' ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}>
            일간
          </button>
        </div>
      </div>

      <div className="space-y-8"></div>

      {/* 주간/일간 뷰 전환 */}
      {tab === 'week' ? renderWeeklyRecords() : renderDailyRecords()}
    </div>
  );
}
