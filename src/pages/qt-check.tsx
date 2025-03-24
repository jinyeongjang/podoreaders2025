import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { pretendard } from '../lib/fonts';
import Calendar from '../components/dailycheck/Calendar';
import RecordList from '../components/dailycheck/RecordList';
import SuccessModal from '../components/dailycheck/SuccessModal';
import ExportConfirmModal from '../components/dailycheck/ExportConfirmModal';
import PrayerModal from '../components/prayer/PrayerModal';
import QtCounterPanel from '../components/dailycheck/QtCounterPanel';
import SubmitButtonPanel from '../components/dailycheck/SubmitButtonPanel';
import DawnPrayerCheck from '../components/dailycheck/DawnPrayerCheck';
import { exportToExcel } from '../utils/excel';
import { useQtRecords } from '../hooks/useQtRecords';
import usersData from '../data/users.json';
import { FaUser, FaChevronDown, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const QtCheck = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [isPrayerModalOpen, setPrayerModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // QT 기록 관리 로직을 커스텀 훅으로 분리
  const {
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
    showSuccessModal,
    setShowSuccessModal,
    isCalendarOpen,
    loadRecordForDate,
    saveRecord,
    deleteRecord,
    handleDateSelect,
    handlePrevMonth,
    handleNextMonth,
    toggleCalendar,
  } = useQtRecords(userName);

  // 컴포넌트 마운트 시 localStorage에서 저장된 사용자 로드
  useEffect(() => {
    const savedUserName = localStorage.getItem('qtUserName');
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []);

  // 가족원 선택 처리
  const handleUserSelect = useCallback(
    async (name: string) => {
      
      setUserName(name);
      // 선택한 가족원 이름을 로컬스토리지로 저장하여 편의성 개선
      localStorage.setItem('qtUserName', name);
      setShowUserDropdown(false);

      // 기록 불러오기
      await loadRecordForDate(selectedDate);

  // 사용자 초기화
  const handleResetUser = () => {
    setUserName('');
    localStorage.removeItem('qtUserName');
    setShowUserDropdown(false);
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert('가족원을 선택해주세요.');
      return;
    }

    const success = await saveRecord();

    if (!success) {
      alert('기록 저장에 실패했습니다.');
    }
  };

  // 기록 삭제 처리
  const handleDeleteRecord = async (date: string, user: string) => {
    const success = await deleteRecord(date, user);
    if (!success) {
      alert('기록 삭제에 실패했습니다.');
    }
  };

  // 내보내기 확인
  const handleExportConfirm = () => {
    exportToExcel(records);
    setShowExportModal(false);
  };

  // 날짜 선택 이벤트 핸들러
  const handleDateChange = useCallback(
    async (date: string) => {
      console.log(`날짜 변경: ${date} - 기록 로드 시작`);
      await handleDateSelect(date);
      console.log(`날짜 변경: ${date} - 기록 로드 완료`, `새벽기도: ${dawnPrayerAttended ? '참석' : '미참석'}`);
    },
    [handleDateSelect, dawnPrayerAttended],
  );

  return (
    <div className={`flex ${pretendard.className}`}>
      <main className="container mx-auto mb-10 w-full max-w-2xl px-4 py-0 xs:px-0 xs:py-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-b-lg bg-white p-6 shadow-lg">
            {/* 가족원 선택 */}
            <div className="mb-6">
              <div className="mb-4 flex h-[40px] items-center justify-between">
                <label className="text-lg font-semibold text-gray-700">1. 가족원 선택</label>
                {userName && (
                  <button
                    type="button"
                    onClick={handleResetUser}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-gray-500 transition-all hover:border-violet-500 hover:text-violet-500 hover:shadow-md active:scale-95 xs:w-[100px] xs:px-1">
                    <FaSpinner className="h-4 w-4" />
                    <span className="xs:text-sm">초기화</span>
                  </button>
                )}
              </div>

              <label className="mb-2 block px-2 text-right text-[15px] font-semibold italic tracking-tighter text-gray-700 xs:text-[14px]">
                * 가족원 명단에 없을경우 가족장에게 문의해주세요.
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="relative flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-lg text-gray-700 transition-all hover:border-indigo-500 hover:shadow-md focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 active:scale-95">
                    <div className="flex items-center gap-3">
                      <FaUser className="h-5 w-5 text-gray-400" />
                      <span>{userName || '가족원 선택'}</span>
                    </div>

                    <FaChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-full z-10 mt-1 max-h-[480px] w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg xs:max-h-[450px]">
                        {usersData.users.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleUserSelect(user.name)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-gray-700 transition-colors hover:bg-indigo-50 active:bg-indigo-100">
                            <FaUser className="h-4 w-4 text-gray-400" />
                            <span>{user.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* 날짜 선택 컴포넌트 */}
            <label className="mb-4 block text-lg font-semibold text-gray-700">2. 날짜</label>
            <div className="mb-6">
              <Calendar
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                records={records}
                handleDateSelect={handleDateChange} // 수정된 핸들러 사용
                handlePrevMonth={handlePrevMonth}
                handleNextMonth={handleNextMonth}
                isOpen={isCalendarOpen}
                onToggle={toggleCalendar}
              />
            </div>

            {/* QT 카운터 컴포넌트 */}
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
            />

            {/* 새벽기도 체크 컴포넌트 */}
            <DawnPrayerCheck
              dawnPrayerAttended={dawnPrayerAttended}
              setDawnPrayerAttended={(value) => {
                console.log('새벽기도 상태 변경:', value ? '참석' : '미참석');
                setDawnPrayerAttended(value);
              }}
            />

            {/* 제출 버튼 컴포넌트 */}
            <SubmitButtonPanel isSaving={isSaving} onPrayerButtonClick={() => setPrayerModalOpen(true)} />
          </div>
        </form>

        {/* 기록 목록 컴포넌트 */}
        <RecordList records={records} handleDeleteRecord={handleDeleteRecord} />
      </main>

      {/* modal 컴포넌트 */}
      <AnimatePresence>
        {showSuccessModal && (
          <SuccessModal
            userName={userName}
            selectedDate={selectedDate}
            qtCount={qtCount}
            bibleReadCount={bibleReadCount}
            qtDone={qtDone}
            bibleReadDone={bibleReadDone}
            writingDone={writingDone}
            dawnPrayerAttended={dawnPrayerAttended}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
        {showExportModal && (
          <ExportConfirmModal onConfirm={handleExportConfirm} onCancel={() => setShowExportModal(false)} />
        )}
        <PrayerModal isOpen={isPrayerModalOpen} onClose={() => setPrayerModalOpen(false)} />
      </AnimatePresence>
    </div>
  );
};

export default QtCheck;
