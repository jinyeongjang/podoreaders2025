import { useState } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { formatToKST } from '../../utils/dateUtils';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
}

export default function DatePicker({ value, onChange, label = '모임 날짜' }: DatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (date: string) => {
    onChange(date);
    setIsCalendarOpen(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    firstDay.setHours(firstDay.getHours() + 9);
    const lastDay = new Date(year, month + 1, 0);
    lastDay.setHours(lastDay.getHours() + 9);
    const days = [];

    const firstDayOfWeek = firstDay.getDay();
    const prevDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    for (let i = prevDays - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: formatToKST(prevDate), isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: formatToKST(currentDate), isCurrentMonth: true });
    }

    const lastDayOfWeek = lastDay.getDay();
    const nextDays = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
    for (let i = 1; i <= nextDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: formatToKST(nextDate), isCurrentMonth: false });
    }

    return days;
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        <FaCalendarAlt className="mr-1 inline-block" /> {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={toggleCalendar}
          className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-gray-700 transition-all hover:border-emerald-500 hover:shadow-md focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 active:scale-95">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="h-4 w-4 text-gray-400" />
            <span>{value || '날짜 선택'}</span>
          </div>
          <FaChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isCalendarOpen && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <button type="button" onClick={handlePrevMonth} className="p-1 hover:text-emerald-600" title="이전 달">
                <FaChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-medium">
                {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
              </h3>
              <button type="button" onClick={handleNextMonth} className="p-1 hover:text-emerald-600" title="다음 달">
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
              {getDaysInMonth(currentMonth).map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(day.date)}
                  className={`aspect-square rounded-lg p-1 text-sm ${
                    day.isCurrentMonth
                      ? day.date === value
                        ? 'bg-emerald-500 font-bold text-white'
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
    </div>
  );
}
