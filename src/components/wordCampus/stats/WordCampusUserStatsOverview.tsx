import { FaBook, FaBible, FaPen } from 'react-icons/fa';
import NumberFlow from '@number-flow/react';

interface WordCampusUserStatsOverviewProps {
  stats: {
    qtTotal: number;
    bibleTotal: number;
    writingTotal: number;
  };
}

export default function WordCampusUserStatsOverview({ stats }: WordCampusUserStatsOverviewProps) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-xl border p-2">
      <div className="flex flex-col items-center rounded-lg bg-gray-50 p-2 shadow-sm">
        <div className="flex items-center gap-1">
          <FaBook className="h-3 w-3 text-emerald-500" />
          <span className="text-xs font-medium text-gray-600">큐티 누계</span>
        </div>
        <div className="mt-1 text-xl font-bold text-emerald-500">
          <NumberFlow value={stats.qtTotal} />회
        </div>
      </div>
      <div className="flex flex-col items-center rounded-lg bg-gray-50 p-2 shadow-sm">
        <div className="flex items-center gap-1">
          <FaBible className="h-3 w-3 text-blue-500" />
          <span className="text-xs font-medium text-gray-600">말씀 누계</span>
        </div>
        <div className="mt-1 text-xl font-bold text-blue-500">
          <NumberFlow value={stats.bibleTotal} />장
        </div>
      </div>
      <div className="flex flex-col items-center rounded-lg bg-gray-50 p-2 shadow-sm">
        <div className="flex items-center gap-1">
          <FaPen className="h-3 w-3 text-purple-500" />
          <span className="text-xs font-medium text-gray-600">필사 누계</span>
        </div>
        <div className="mt-1 text-xl font-bold text-purple-500">
          <NumberFlow value={stats.writingTotal} />회
        </div>
      </div>
    </div>
  );
}
