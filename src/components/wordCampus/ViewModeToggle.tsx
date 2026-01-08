import { FaCalendarWeek, FaListUl } from 'react-icons/fa';

interface ViewModeToggleProps {
  viewMode: 'day' | 'week';
  setViewMode: (mode: 'day' | 'week') => void;
}

export default function ViewModeToggle({ viewMode, setViewMode }: ViewModeToggleProps) {
  return (
    <div className="mb-4 mt-4 flex items-center justify-end gap-2">
      <span className="text-sm font-medium text-gray-700">보기 모드:</span>
      <button
        onClick={() => setViewMode('day')}
        className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm ${
          viewMode === 'day' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}>
        <FaListUl className="h-3 w-3" />
        일자별
      </button>
      <button
        onClick={() => setViewMode('week')}
        className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm ${
          viewMode === 'week' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}>
        <FaCalendarWeek className="h-3 w-3" />
        주차별
      </button>
    </div>
  );
}
