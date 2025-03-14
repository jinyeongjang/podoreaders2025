import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaBible, FaBook, FaCheck, FaChevronDown, FaUser, FaPen } from 'react-icons/fa';
import usersData from '../data/users.json';
import { pretendard } from '../lib/fonts';
import CounterButton from '../components/dailycheck/CounterButton';
import SuccessModal from '../components/dailycheck/SuccessModal';
import RecordList from '../components/dailycheck/RecordList';
import Calendar from '../components/dailycheck/Calendar';
import ExportConfirmModal from '../components/dailycheck/ExportConfirmModal';
import PrayerModal from '../components/prayer/PrayerModal';

// custom hooks
import { useQtRecords } from '../hooks/useQtRecords';
import { useQtForm } from '../hooks/useQtForm';
import { useQtCalendar } from '../hooks/useQtCalendar';

// 애니메이션 설정 추가
const animations = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  },
};

const QtCheck = () => {
  // 캘린더 관련 로직
  const {
    selectedDate,
    currentMonth,
    isCalendarOpen,
    handleDateSelect,
    handlePrevMonth,
    handleNextMonth,
    toggleCalendar,
  } = useQtCalendar();

  // 데이터 관리 관련 로직
  const {
    records,
    showExportModal,
    setShowExportModal,
    handleDeleteRecord,
    handleExportConfirm,
    updateRecords, // 레코드 업데이트 함수 추출
  } = useQtRecords();

  // 폼 관련 로직
  const {
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
    isSaving,
    userName,
    showSuccessModal,
    setShowSuccessModal,
    showUserDropdown,
    setShowUserDropdown,
    isPrayerModalOpen,
    setPrayerModalOpen,
    handleSubmit,
    handleResetUser,
    handleUserSelect,
  } = useQtForm({
    selectedDate,
    updateRecords, // 함수 전달
  });

  return (
    <div className={`flex ${pretendard.className}`}>
      <main className="container mx-auto mb-10 w-full max-w-2xl px-4 py-0 xs:px-0 xs:py-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-b-lg bg-white p-6 shadow-lg">
            <div className="mb-6">
              {/* 초기화 버튼 나타날 때 요소 움직이는 것을 고정하기 위해 h-[40px] 속성 설정 */}
              <div className="mb-4 flex h-[40px] items-center justify-between">
                <label className="text-lg font-semibold text-gray-700">1. 캠퍼스 및 이름</label>
                {userName && (
                  <button
                    type="button"
                    onClick={handleResetUser}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-gray-500 transition-all hover:border-violet-500 hover:text-violet-500 hover:shadow-md active:scale-95 xs:w-[100px] xs:px-1">
                    <FaSpinner className="h-4 w-4" />
                    초기화
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
                        {usersData.users.map((user: { id: number; name: string }) => (
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

            <label className="mb-4 block text-lg font-semibold text-gray-700">2. 날짜</label>
            <div className="mb-6">
              <Calendar
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                records={records}
                handleDateSelect={handleDateSelect}
                handlePrevMonth={handlePrevMonth}
                handleNextMonth={handleNextMonth}
                isOpen={isCalendarOpen}
                onToggle={toggleCalendar}
              />
            </div>

            <div className="flex-col-2 mb-6 flex gap-4 tracking-tighter">
              <CounterButton
                count={qtCount}
                setCount={setQtCount}
                label="큐티 횟수(일)"
                icon={<FaBook className="h-5 w-5 text-indigo-500" />}
              />

              <CounterButton
                count={bibleReadCount}
                setCount={setBibleReadCount}
                label="말씀 읽기 횟수(장)"
                icon={<FaBible className="h-5 w-5 text-indigo-500" />}
              />
            </div>
            <label className="mb-4 block text-lg font-semibold text-gray-700">3. 완료 여부</label>
            <div className="space-y-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setQtDone(!qtDone)}
                  className={`flex w-full items-center gap-3 rounded-xl ${
                    qtDone ? 'bg-indigo-50 ring-2 ring-indigo-500' : 'bg-gray-50 ring-1 ring-gray-200 hover:shadow-md'
                  } px-4 py-3 transition-all hover:bg-indigo-50 active:bg-indigo-100`}>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-md ${
                      qtDone ? 'bg-indigo-500 text-white' : 'bg-white ring-1 ring-gray-300'
                    }`}>
                    {qtDone && <FaCheck size={14} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBook className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">큐티 완료</span>
                  </div>
                </button>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setBibleReadDone(!bibleReadDone)}
                  className={`flex w-full items-center gap-3 rounded-xl ${
                    bibleReadDone
                      ? 'bg-indigo-50 ring-2 ring-indigo-500'
                      : 'bg-gray-50 ring-1 ring-gray-200 active:bg-indigo-100'
                  } px-4 py-3 transition-all hover:bg-indigo-50 hover:shadow-md`}>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-md ${
                      bibleReadDone ? 'bg-indigo-500 text-white' : 'bg-white ring-1 ring-gray-300'
                    }`}>
                    {bibleReadDone && <FaCheck size={14} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBible className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">말씀 읽기 완료</span>
                  </div>
                </button>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setWritingDone(!writingDone)}
                  className={`flex w-full items-center gap-3 rounded-xl ${
                    writingDone
                      ? 'bg-indigo-50 ring-2 ring-indigo-500'
                      : 'bg-gray-50 ring-1 ring-gray-200 active:bg-indigo-100'
                  } px-4 py-3 transition-all hover:bg-indigo-50 hover:shadow-md`}>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-md ${
                      writingDone ? 'bg-indigo-500 text-white' : 'bg-white ring-1 ring-gray-300'
                    }`}>
                    {writingDone && <FaCheck size={14} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPen className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">필사 완료</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col justify-end gap-2 tracking-tighter xs:flex-col">
              <motion.div
                variants={animations.container}
                initial="hidden"
                animate="show"
                className="container mx-auto h-[70px] w-full max-w-6xl rounded-xl p-0 tracking-tighter shadow-lg"
                style={{
                  background: 'linear-gradient(-45deg, #4F46E5, #3B82F6, #60A5FA, #6376f1)',
                  backgroundSize: '400% 400%',
                  animation: 'gradient 5s ease infinite',
                }}>
                <style jsx global>{`
                  @keyframes gradient {
                    0% {
                      background-position: 0% 50%;
                    }
                    50% {
                      background-position: 100% 50%;
                    }
                    100% {
                      background-position: 0% 50%;
                    }
                  }
                `}</style>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex h-full w-full items-center justify-center gap-2 px-4 text-white transition-all hover:shadow-md disabled:bg-opacity-50">
                  {isSaving ? <FaSpinner className="h-5 w-5 animate-spin" /> : <FaCheck className="h-5 w-5" />}
                  <span>{isSaving ? '저장 중...' : '큐티, 말씀 읽기 횟수 기록하기'}</span>
                </button>
              </motion.div>

              <div className="flex tracking-tighter">
                <button
                  type="button"
                  onClick={() => setPrayerModalOpen(true)}
                  className="flex h-[70px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 px-4 text-white transition-all hover:from-orange-500 hover:to-orange-700 hover:shadow-md active:from-orange-600 active:to-orange-800">
                  <FaPen className="h-5 w-5" />
                  <span className="ml-2">기도제목 작성하여 제출하기</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        <RecordList records={records} handleDeleteRecord={handleDeleteRecord} />
      </main>

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
