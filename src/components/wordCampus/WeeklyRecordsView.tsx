import { FaBook, FaBible, FaPen } from 'react-icons/fa';

interface WordCampus_minhwa_QtRecord {
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

interface WeeklyRecordsViewProps {
  groupedByMonth: {
    userName: string;
    monthGroups: Record<
      string,
      { weeks: [string, WordCampus_minhwa_QtRecord[]][]; records: WordCampus_minhwa_QtRecord[] }
    >;
  }[];
  formatDate: (dateString: string) => string;
  formatWeekLabel: (weekKey: string) => string;
  calculateWeekStats: (recs: WordCampus_minhwa_QtRecord[]) => {
    qtTotal: number;
    bibleTotal: number;
    writingTotal: number;
    dawnPrayerTotal: number;
    days: number;
  };
  filteredRecordsLength: number;
}

export default function WeeklyRecordsView({
  groupedByMonth,
  formatDate,
  formatWeekLabel,
  calculateWeekStats,
  filteredRecordsLength,
}: WeeklyRecordsViewProps) {
  if (filteredRecordsLength === 0) {
    return (
      <div className="mt-5 rounded-2xl border-2 border-gray-200 bg-white p-6 tracking-tighter">
        <div className="py-8 text-center text-gray-400">기록이 없습니다.</div>
      </div>
    );
  }

  return (
    <>
      {groupedByMonth.map(({ userName, monthGroups }) => (
        <div key={userName} className="mt-5 rounded-2xl border-2 border-gray-200 bg-white p-6 tracking-tighter">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">{userName}</h3>

          {Object.entries(monthGroups).map(([monthName, { weeks }]) => (
            <div key={`${userName}-${monthName}`} className="mb-8">
              <h4 className="mb-2 rounded-xl bg-emerald-50 px-2 py-2 text-right text-[17px] font-semibold text-gray-800">
                {monthName}
              </h4>

              <div className="space-y-3">
                {weeks.map(([weekKey, recs]) => {
                  const weekStats = calculateWeekStats(recs);
                  const sortedRecords = [...recs].sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
                  );

                  return (
                    <div key={weekKey} className="rounded-lg bg-white">
                      <div className="mb-2 flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">{formatWeekLabel(weekKey)}</h5>
                      </div>

                      <div className="mb-2 border-t border-gray-200"></div>
                      <p className="mb-2 text-sm text-gray-500">산정방법: 일요일부터~토요일까지</p>

                      {/* 주간 통계 요약 */}
                      <div className="flex flex-wrap gap-2 py-1 text-[15px] text-gray-600">
                        <div className="flex items-center gap-1">
                          <span>
                            큐티 <span className="text-[20px] font-semibold text-emerald-500">{weekStats.qtTotal}</span>
                            회
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>
                            말씀 <span className="text-[20px] font-semibold text-blue-500">{weekStats.bibleTotal}</span>
                            장
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>
                            필사{' '}
                            <span className="text-[20px] font-semibold text-purple-500">{weekStats.writingTotal}</span>
                            회
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>
                            새벽기도{' '}
                            <span className="text-[20px] font-semibold text-orange-500">
                              {weekStats.dawnPrayerTotal}
                            </span>
                            회
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>
                            기록횟수 <span className="text-[20px] font-semibold text-gray-700">{weekStats.days}</span>회
                          </span>
                        </div>
                      </div>

                      {/* 개별 기록 카드 */}
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sortedRecords.map((record) => (
                          <div
                            key={`${record.date}-${record.user_name}`}
                            className="group mt-4 rounded-xl transition-all">
                            <div className="mb-3 flex items-center justify-between">
                              <span className="text-sm text-gray-500">{formatDate(record.date)}</span>
                              {record.dawn_prayer_attended && (
                                <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                                  새벽기도 ✓
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="rounded-lg bg-emerald-50 p-3">
                                <div className="flex items-center gap-2">
                                  <FaBook className="h-4 w-4 text-emerald-500" />
                                  <span className="text-sm text-gray-500">큐티</span>
                                </div>
                                <div className="mt-1 text-xl font-bold text-emerald-600">{record.qt_count}회</div>
                              </div>
                              <div className="rounded-lg bg-blue-50 p-3">
                                <div className="flex items-center gap-2">
                                  <FaBible className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm text-gray-500">말씀</span>
                                </div>
                                <div className="mt-1 text-xl font-bold text-blue-600">{record.bible_read_count}장</div>
                              </div>
                              <div className="rounded-lg bg-purple-50 p-3">
                                <div className="flex items-center gap-2">
                                  <FaPen className="h-4 w-4 text-purple-500" />
                                  <span className="text-sm text-gray-500">필사</span>
                                </div>
                                <div className="mt-1 text-xl font-bold text-purple-600">
                                  {record.writing_done ? '✓' : '✗'}
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
      ))}
    </>
  );
}
