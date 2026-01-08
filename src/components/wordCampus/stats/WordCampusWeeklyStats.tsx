import { FaCalendarAlt } from 'react-icons/fa';

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

interface WordCampusWeeklyStatsProps {
  userWeeklyData: Record<string, WordCampus_QtRecord[]>;
  calculateWeekStats: (records: WordCampus_QtRecord[]) => {
    qtTotal: number;
    bibleTotal: number;
    writingTotal: number;
    dawnPrayerTotal: number;
    days: number;
  };
  formatWeekLabel: (weekKey: string) => string;
}

export default function WordCampusWeeklyStats({
  userWeeklyData,
  calculateWeekStats,
  formatWeekLabel,
}: WordCampusWeeklyStatsProps) {
  const sortedWeeks = Object.entries(userWeeklyData).sort(([a], [b]) => {
    const startDateA = a.split('_')[0];
    const startDateB = b.split('_')[0];
    return startDateB.localeCompare(startDateA);
  });

  return (
    <div className="space-y-3">
      {sortedWeeks.map(([weekKey, records]) => {
        const weekStats = calculateWeekStats(records);

        return (
          <div key={weekKey} className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FaCalendarAlt className="h-3 w-3 text-emerald-500" />
              {formatWeekLabel(weekKey)}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded bg-emerald-50 p-2">
                <div className="text-gray-600">큐티</div>
                <div className="text-lg font-bold text-emerald-600">{weekStats.qtTotal}회</div>
              </div>
              <div className="rounded bg-blue-50 p-2">
                <div className="text-gray-600">말씀</div>
                <div className="text-lg font-bold text-blue-600">{weekStats.bibleTotal}장</div>
              </div>
              <div className="rounded bg-purple-50 p-2">
                <div className="text-gray-600">필사</div>
                <div className="text-lg font-bold text-purple-600">{weekStats.writingTotal}회</div>
              </div>
              <div className="rounded bg-orange-50 p-2">
                <div className="text-gray-600">새벽기도</div>
                <div className="text-lg font-bold text-orange-600">{weekStats.dawnPrayerTotal}회</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
