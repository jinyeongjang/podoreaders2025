import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { formatToKST } from '../../../utils/dateUtils';

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

const Calendar2: React.FC<CalendarProps> = ({
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
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-indigo-400 px-5 py-4 text-left text-lg shadow-md shadow-indigo-100 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-200">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/0 to-indigo-400/0 opacity-0 transition-opacity group-hover:opacity-10" />

      <div className="relative z-10 flex items-center gap-3">
        <div className="rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-500 p-2 shadow-lg shadow-indigo-200 transition-all">
          <FaCalendarAlt className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-indigo-900">{selectedDate}</span>
      </div>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="relative z-10">
        <FaChevronDown className="h-5 w-5 text-indigo-500 transition-colors" />
      </motion.div>
    </motion.button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border-2 border-indigo-200 bg-white/95 p-4 shadow-2xl shadow-indigo-100 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <motion.button
              type="button"
              onClick={handlePrevMonth}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
              title="이전 달">
              <FaChevronLeft className="h-5 w-5" />
            </motion.button>
            <h3 className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-lg font-bold text-transparent">
              {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
            </h3>
            <motion.button
              type="button"
              onClick={handleNextMonth}
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
              title="다음 달">
              <FaChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-bold text-indigo-400">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth, records).map((day, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => {
                  handleDateSelect(day.date);
                  onToggle();
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01, duration: 0.15 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-lg p-1 text-sm font-medium transition-all ${
                  day.isCurrentMonth
                    ? day.date === selectedDate
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 font-bold text-white shadow-lg shadow-indigo-200'
                      : day.hasRecord
                        ? 'bg-gradient-to-br from-indigo-50 to-indigo-100 font-semibold text-indigo-700 hover:from-indigo-100 hover:to-indigo-200'
                        : 'text-gray-700 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100'
                    : 'text-gray-300 hover:text-gray-400'
                }`}>
                {new Date(day.date).getDate()}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default Calendar2;
