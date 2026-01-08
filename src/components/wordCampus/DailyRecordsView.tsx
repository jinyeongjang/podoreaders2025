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

interface DailyRecordsViewProps {
  groupedByDate: Record<string, WordCampus_minhwa_QtRecord[]>;
  formatDate: (dateString: string) => string;
  filteredRecordsLength: number;
}

export default function DailyRecordsView({ groupedByDate, formatDate, filteredRecordsLength }: DailyRecordsViewProps) {
  return (
    <div className="mt-5 rounded-2xl border-2 border-gray-200 bg-white p-6 tracking-tighter">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">일간 기록</h3>

      {filteredRecordsLength === 0 && <div className="py-8 text-center text-gray-400">기록이 없습니다.</div>}

      {Object.entries(groupedByDate).map(([date, dateRecords]) => (
        <div key={date} className="mb-6">
          <div className="mb-2 text-right text-[17px] font-semibold text-gray-800">{formatDate(date)}</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dateRecords.map((record) => (
              <div
                key={record.id}
                className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">{record.user_name}</h4>
                  {record.dawn_prayer_attended && (
                    <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                      새벽기도 ✓
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaBook className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-gray-600">QT</span>
                    </div>
                    <span className="font-semibold text-emerald-600">{record.qt_count}회</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaBible className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">말씀읽기</span>
                    </div>
                    <span className="font-semibold text-blue-600">{record.bible_read_count}장</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaPen className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-gray-600">필사</span>
                    </div>
                    <span className="font-semibold text-purple-600">{record.writing_done ? '완료 ✓' : '미완료'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
