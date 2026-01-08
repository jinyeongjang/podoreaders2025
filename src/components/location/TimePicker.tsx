import { useState } from 'react';
import { FaClock, FaChevronDown } from 'react-icons/fa';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
}

export default function TimePicker({ value, onChange, label = '모임 시간' }: TimePickerProps) {
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const toggleTimePicker = () => setIsTimePickerOpen(!isTimePickerOpen);

  const handleTimeSelect = (hour: number, minute: number) => {
    const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    onChange(formattedTime);
    setIsTimePickerOpen(false);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        <FaClock className="mr-1 inline-block" /> {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={toggleTimePicker}
          className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-gray-700 transition-all hover:border-emerald-500 hover:shadow-md focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 active:scale-95">
          <div className="flex items-center gap-3">
            <FaClock className="h-5 w-5 text-emerald-500" />
            <span className="text-base font-medium">{value || '시간 선택'}</span>
          </div>
          <FaChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isTimePickerOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isTimePickerOpen && (
          <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-xl border border-gray-200 bg-white p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">시간 선택</span>
              <button type="button" onClick={toggleTimePicker} className="text-xs text-gray-500 hover:text-emerald-600">
                닫기
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* 시간 선택 */}
              <div>
                <div className="mb-2 text-xs font-medium text-gray-600">시</div>
                <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const currentHour = value ? parseInt(value.split(':')[0]) : -1;
                    return (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => {
                          const minute = value ? parseInt(value.split(':')[1]) : 0;
                          handleTimeSelect(hour, minute);
                        }}
                        className={`w-full px-4 py-2.5 text-center text-sm transition-colors ${
                          currentHour === hour
                            ? 'bg-emerald-500 font-bold text-white'
                            : 'hover:bg-emerald-50 hover:text-emerald-600'
                        }`}>
                        {String(hour).padStart(2, '0')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 분 선택 */}
              <div>
                <div className="mb-2 text-xs font-medium text-gray-600">분</div>
                <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50">
                  {[0, 10, 15, 20, 30, 40, 45, 50].map((minute) => {
                    const currentMinute = value ? parseInt(value.split(':')[1]) : -1;
                    return (
                      <button
                        key={minute}
                        type="button"
                        onClick={() => {
                          const hour = value ? parseInt(value.split(':')[0]) : 0;
                          handleTimeSelect(hour, minute);
                        }}
                        className={`w-full px-4 py-2.5 text-center text-sm transition-colors ${
                          currentMinute === minute
                            ? 'bg-emerald-500 font-bold text-white'
                            : 'hover:bg-emerald-50 hover:text-emerald-600'
                        }`}>
                        {String(minute).padStart(2, '0')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
