import { FaBook, FaBible, FaPen } from 'react-icons/fa';
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
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">기록 목록</h2>
        <div className="flex rounded-lg p-1">
          <button
            onClick={() => setViewMode('week')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'week' ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}>
            주간
          </button>
        </div>
      </div>

      <div className="space-y-8"></div>
      {Object.entries(groupRecordsByWeek(filteredRecordsByRange)).map(([userName, weekGroups]) => (
        <div key={userName} className="mt-5 rounded-2xl border-2 border-gray-200 bg-white p-6 tracking-tighter">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{userName}</h3>
          <div className="space-y-6">
            {Object.entries(weekGroups).map(([weekKey, records]) => {
              const weekStats = calculateWeekStats(records);
              return (
                <div key={weekKey} className="rounded-xl">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{formatWeekLabel(weekKey)}</h4>
                  </div>
                  <div className="mb-2 flex border-t border-gray-200"></div>

                  <div className="flex gap-2 text-sm text-gray-600">
                    <span>큐티 {weekStats.qtTotal}회</span>I<span>말씀 {weekStats.bibleTotal}장</span>I
                    <span>필사 {weekStats.writingTotal}회</span>I<span>기록횟수 {weekStats.days}회</span>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {records.map((record) => (
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
                            <div className="mt-1 text-xl font-bold text-blue-500">
                              {record.writingDone ? '완료' : '없음'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
