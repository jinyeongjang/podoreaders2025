import { useState, useCallback } from 'react';
import { useWordCampus_uiwan_QtRecords } from './useWordCampus_uiwan_QtRecords';

export function useWordCampusUiwanQt() {
  // QT 체크 관련 상태
  const [userName, setUserName] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // QT 기록 관리 훅
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
  } = useWordCampus_uiwan_QtRecords(userName);

  // localStorage에서 사용자 로드
  const loadUserFromStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      const savedUserName = localStorage.getItem('qtUserName_uiwan');
      if (savedUserName) {
        setUserName(savedUserName);
      }
    }
  }, []);

  // 가족원 선택 처리
  const handleUserSelect = useCallback(
    async (name: string) => {
      setUserName(name);
      localStorage.setItem('qtUserName_uiwan', name);
      setShowUserDropdown(false);
      await loadRecordForDate(selectedDate);
    },
    [loadRecordForDate, selectedDate],
  );

  // 사용자 초기화
  const handleResetUser = useCallback(() => {
    setUserName('');
    localStorage.removeItem('qtUserName_uiwan');
    setShowUserDropdown(false);
  }, []);

  // QT 폼 제출 처리
  const handleQtSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userName.trim()) {
        alert('가족원을 선택해주세요.');
        return;
      }

      const success = await saveRecord();
      if (!success) {
        alert('기록 저장에 실패했습니다.');
      }
    },
    [userName, saveRecord],
  );

  // QT 기록 삭제 처리
  const handleDeleteRecord = useCallback(
    async (date: string, user: string) => {
      const success = await deleteRecord(date, user);
      if (!success) {
        alert('기록 삭제에 실패했습니다.');
      }
    },
    [deleteRecord],
  );

  // 날짜 선택 이벤트 핸들러
  const handleDateChange = useCallback(
    async (date: string) => {
      await handleDateSelect(date);
    },
    [handleDateSelect],
  );

  return {
    // 상태
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
    showSuccessModal,
    setShowSuccessModal,
    isCalendarOpen,

    // 핸들러
    loadUserFromStorage,
    handleUserSelect,
    handleResetUser,
    handleQtSubmit,
    handleDeleteRecord,
    handleDateChange,
    handlePrevMonth,
    handleNextMonth,
    toggleCalendar,
  };
}
