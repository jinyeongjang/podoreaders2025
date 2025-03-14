import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { formatToKST } from '../../utils/dateUtils';

interface DailyRecord {
  date: string;
  qtCount: number;
  bibleReadCount: number;
  qtDone: boolean;
  bibleReadDone: boolean;
  userName: string;
}

const formatDate = (date: Date) => {
  return formatToKST(date);
};

const getDaysInMonth = (date: Date, records: DailyRecord[]) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  // KST 시간대에 맞춰 각 날짜에 9시간을 더해준다.
  const firstDay = new Date(year, month, 1);
  firstDay.setHours(firstDay.getHours() + 9);

  const lastDay = new Date(year, month + 1, 0);
  lastDay.setHours(lastDay.getHours() + 9);

  const days = [];

  // 이전 달의 마지막 날짜들을 추가 (월요일 시작)
  const firstDayOfWeek = firstDay.getDay();
  const prevDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  for (let i = prevDays - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    days.push({
      date: formatDate(prevDate),
      isCurrentMonth: false,
      hasRecord: records.some((record) => record.date === formatDate(prevDate)),
    });
  }

  // 현재 달의 날짜들을 추가
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const currentDate = new Date(year, month, i);
    days.push({
      date: formatDate(currentDate),
      isCurrentMonth: true,
      hasRecord: records.some((record) => record.date === formatDate(currentDate)),
    });
  }

  // 다음 달의 시작 날짜들을 추가 (월요일 시작)
  const lastDayOfWeek = lastDay.getDay();
  const nextDays = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
  for (let i = 1; i <= nextDays; i++) {
    const nextDate = new Date(year, month + 1, i);
    days.push({
      date: formatDate(nextDate),
      isCurrentMonth: false,
      hasRecord: records.some((record) => record.date === formatDate(nextDate)),
    });
  }

  return days;
};

interface CalendarProps {
  currentMonth: Date;
  selectedDate: string;
  records: DailyRecord[];
  handleDateSelect: (date: string) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  selectedDate,
  records,
  handleDateSelect,
  handlePrevMonth,
  handleNextMonth,
  isOpen,
  onToggle,
}) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-lg text-gray-700 transition-all hover:border-indigo-500 hover:shadow-md focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 active:scale-95">
      <div className="flex items-center gap-3">
        <FaCalendarAlt className="h-5 w-5 text-gray-400" />
        <span>{selectedDate}</span>
      </div>
      <FaChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>

    {isOpen && (
      <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl bg-white p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" onClick={handlePrevMonth} className="p-1 hover:text-indigo-600" title="이전 달">
            <FaChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-medium">
            {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
          </h3>
          <button type="button" onClick={handleNextMonth} className="p-1 hover:text-indigo-600" title="다음 달">
            <FaChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth(currentMonth, records).map((day, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleDateSelect(day.date)}
              className={`aspect-square rounded-lg p-1 text-sm ${
                day.isCurrentMonth
                  ? day.date === selectedDate
                    ? 'bg-indigo-500 font-bold text-white'
                    : day.hasRecord
                      ? 'bg-indigo-50 font-medium text-indigo-600'
                      : 'hover:bg-gray-100'
                  : 'text-gray-400'
              }`}>
              {new Date(day.date).getDate()}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default Calendar;
