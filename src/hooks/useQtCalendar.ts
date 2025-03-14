import { useState } from 'react';
import { getCurrentKSTDate } from '../utils/dateUtils';

export function useQtCalendar() {
  const [selectedDate, setSelectedDate] = useState(getCurrentKSTDate());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsCalendarOpen(false); // 날짜 선택 후 달력 자동 닫기
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  return {
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    isCalendarOpen,
    setIsCalendarOpen,
    handleDateSelect,
    handlePrevMonth,
    handleNextMonth,
    toggleCalendar,
  };
}
