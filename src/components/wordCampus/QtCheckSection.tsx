import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaSpinner, FaChevronRight } from 'react-icons/fa';
import { FaChartColumn } from 'react-icons/fa6';
import Calendar2 from '../dailycheck/components/Calendar2';
import RecordList from '../dailycheck/RecordList';
import QtCounterPanel from '../dailycheck/QtCounterPanel';
import SubmitButtonPanel from '../dailycheck/SubmitButtonPanel';
import UserDropdown from '../dailycheck/components/UserDropdown';

interface WordCampus_minhwa_QtRecord {
  date: string;
  userName: string;
  qtCount: number;
  bibleReadCount: number;
  qtDone: boolean;
  bibleReadDone: boolean;
  writingDone: boolean;
  dawnPrayerAttended?: boolean;
}

interface CampusUser {
  id: number;
  name: string;
}

interface QtCheckSectionProps {
  userName: string;
  showUserDropdown: boolean;
  setShowUserDropdown: (show: boolean) => void;
  selectedDate: string;
  currentMonth: Date;
  qtCount: number;
  setQtCount: (count: number) => void;
  bibleReadCount: number;
  setBibleReadCount: (count: number) => void;
  qtDone: boolean;
  setQtDone: (done: boolean) => void;
  bibleReadDone: boolean;
  setBibleReadDone: (done: boolean) => void;
  writingDone: boolean;
  setWritingDone: (done: boolean) => void;
  dawnPrayerAttended: boolean;
  setDawnPrayerAttended: (attended: boolean) => void;
  isSaving: boolean;
  records: WordCampus_minhwa_QtRecord[];
  isCalendarOpen: boolean;
  campusUsers?: CampusUser[];
  handleUserSelect: (name: string) => void;
  handleResetUser: () => void;
  handleDateChange: (date: string) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  toggleCalendar: () => void;
  handleQtSubmit: (e: React.FormEvent) => void;
  handleDeleteRecord: (date: string, user: string) => void;
  handleRecordsClick: () => void;
}

export default function QtCheckSection({
  userName,
  showUserDropdown,
  setShowUserDropdown,
  selectedDate,
  currentMonth,
  qtCount,
  setQtCount,
  bibleReadCount,
  setBibleReadCount,
  qtDone,
  setQtDone,
  bibleReadDone,
  setBibleReadDone,
  writingDone,
  setWritingDone,
  dawnPrayerAttended,
  setDawnPrayerAttended,
  isSaving,
  records,
  isCalendarOpen,
  campusUsers,
  handleUserSelect,
  handleResetUser,
  handleDateChange,
  handlePrevMonth,
  handleNextMonth,
  toggleCalendar,
  handleQtSubmit,
  handleDeleteRecord,
  handleRecordsClick,
}: QtCheckSectionProps) {
  const [showQtSection, setShowQtSection] = useState(true);

  const toggleQtSection = () => {
    setShowQtSection(!showQtSection);
  };

  return (
    <div className="container mx-auto mb-6 w-full overflow-hidden rounded-xl bg-white shadow-md">
      <div className="relative">
        <button
          onClick={toggleQtSection}
          className="w-full border-b border-emerald-100 bg-emerald-50 px-6 py-3 text-left transition-colors hover:bg-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-emerald-800">QT 체크</h3>
              {records.length > 0 && (
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-medium text-emerald-700">
                  {records.length}개
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRecordsClick();
                }}
                className="flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-800 backdrop-blur-sm transition-all hover:underline active:scale-95">
                <FaChartColumn />
                기록 열람
                <FaChevronRight />
              </button>
            </div>
          </div>
        </button>

        <AnimatePresence>
          {showQtSection && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden">
              <div className="p-6">
                <form onSubmit={handleQtSubmit} className="space-y-6">
                  {/* 가족원 선택 */}
                  <div>
                    <div className="mb-4 flex h-[40px] items-center justify-between">
                      <label className="bg-gradient-to-r from-indigo-600 to-indigo-600 bg-clip-text text-lg font-bold text-transparent">
                        1. 가족원 선택
                      </label>
                      {userName && (
                        <motion.button
                          type="button"
                          onClick={handleResetUser}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 text-gray-600 shadow-sm transition-all hover:border-indigo-400 hover:from-indigo-50 hover:to-indigo-50 hover:text-indigo-600 hover:shadow-md">
                          <FaSpinner className="h-4 w-4 transition-transform group-hover:rotate-180" />
                          <span className="font-medium">초기화</span>
                        </motion.button>
                      )}
                    </div>

                    <UserDropdown
                      userName={userName}
                      showUserDropdown={showUserDropdown}
                      setShowUserDropdown={setShowUserDropdown}
                      campusUsers={campusUsers}
                      handleUserSelect={handleUserSelect}
                    />
                  </div>

                  {/* 날짜 선택 */}
                  <div>
                    <label className="mb-4 block text-lg font-semibold text-gray-700">2. 날짜</label>
                    <Calendar2
                      currentMonth={currentMonth}
                      selectedDate={selectedDate}
                      records={records}
                      handleDateSelect={handleDateChange}
                      handlePrevMonth={handlePrevMonth}
                      handleNextMonth={handleNextMonth}
                      isOpen={isCalendarOpen}
                      onToggle={toggleCalendar}
                    />
                  </div>

                  {/* QT 카운터 */}
                  <QtCounterPanel
                    qtCount={qtCount}
                    setQtCount={setQtCount}
                    bibleReadCount={bibleReadCount}
                    setBibleReadCount={setBibleReadCount}
                    qtDone={qtDone}
                    setQtDone={setQtDone}
                    bibleReadDone={bibleReadDone}
                    setBibleReadDone={setBibleReadDone}
                    writingDone={writingDone}
                    setWritingDone={setWritingDone}
                    dawnPrayerAttended={dawnPrayerAttended}
                    setDawnPrayerAttended={setDawnPrayerAttended}
                  />

                  {/* 제출 버튼 */}
                  <SubmitButtonPanel isSaving={isSaving} onPrayerButtonClick={() => {}} />
                </form>

                {/* 기록 목록 */}
                <div className="mt-6">
                  <RecordList records={records} handleDeleteRecord={handleDeleteRecord} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
