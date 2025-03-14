import { useState, useCallback, useEffect } from 'react';
import { qtAPI, QtRecord } from '../lib/qtAPI';
import { DailyRecord } from '../types/records';
import { formatToKST } from '../utils/dateUtils';

interface UseQtFormProps {
  selectedDate: string;
  updateRecords: (records: DailyRecord[]) => void;
}

export function useQtForm({ selectedDate, updateRecords }: UseQtFormProps) {
  const [qtCount, setQtCount] = useState(0);
  const [bibleReadCount, setBibleReadCount] = useState(0);
  const [qtDone, setQtDone] = useState(false);
  const [bibleReadDone, setBibleReadDone] = useState(false);
  const [writingDone, setWritingDone] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userName, setUserName] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isPrayerModalOpen, setPrayerModalOpen] = useState(false);

  // 선택한 날짜의 기록 불러오기
  const loadRecordForDate = useCallback(
    async (date: string) => {
      if (!userName) return;

      try {
        const record = await qtAPI.findByDateAndUser(date, userName);
        if (record) {
          setQtCount(record.qt_count);
          setBibleReadCount(record.bible_read_count);
          setQtDone(record.qt_done);
          setBibleReadDone(record.bible_read_done);
          setWritingDone(record.writing_done || false);
        } else {
          // 기록이 없는 경우 초기화
          setQtCount(0);
          setBibleReadCount(0);
          setQtDone(false);
          setBibleReadDone(false);
          setWritingDone(false);
        }
      } catch (error) {
        console.error('Failed to load record:', error);
      }
    },
    [userName],
  ); // userName만 의존성으로 등록

  // userName이 변경될 때마다 로컬 스토리지 업데이트
  useEffect(() => {
    if (userName) {
      localStorage.setItem('qtUserName', userName);
      loadRecordForDate(selectedDate);
    }
  }, [userName, selectedDate, loadRecordForDate]);

  // 컴포넌트 마운트 시 저장된 사용자 정보 불러오기
  useEffect(() => {
    const savedUserName = localStorage.getItem('qtUserName');
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []); // 빈 의존성 배열 유지 (초기 로딩 시 한 번만 실행)

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert('가족원을 선택해주세요.');
      return;
    }
    setIsSaving(true);

    try {
      const now = new Date();
      const recordData: QtRecord = {
        user_name: userName.trim(),
        date: selectedDate,
        qt_count: qtCount,
        bible_read_count: bibleReadCount,
        qt_done: qtDone,
        bible_read_done: bibleReadDone,
        writing_done: writingDone,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      };

      // Supabase에 저장
      const existingRecord = await qtAPI.findByDateAndUser(selectedDate, userName.trim());
      if (existingRecord) {
        await qtAPI.update(existingRecord.id!, recordData);
      } else {
        await qtAPI.create(recordData);
      }

      // 데이터 갱신
      const updatedRecords = await qtAPI.getAll();
      const formattedRecords = updatedRecords.map((record) => ({
        date: formatToKST(new Date(record.date)),
        qtCount: record.qt_count,
        bibleReadCount: record.bible_read_count,
        qtDone: record.qt_done,
        bibleReadDone: record.bible_read_done,
        writingDone: record.writing_done || false,
        userName: record.user_name,
      }));

      updateRecords(formattedRecords);
      setIsSaving(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to save record:', error);
      alert('기록 저장에 실패했습니다.');
      setIsSaving(false);
    }
  };

  // 사용자 재설정
  const handleResetUser = () => {
    setUserName('');
    localStorage.removeItem('qtUserName');
    setShowUserDropdown(false);
    // 폼 데이터 초기화
    setQtCount(0);
    setBibleReadCount(0);
    setQtDone(false);
    setBibleReadDone(false);
    setWritingDone(false);
  };

  // 사용자 선택
  const handleUserSelect = async (name: string) => {
    setUserName(name);
    setShowUserDropdown(false);
  };

  return {
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
    setUserName,
    showSuccessModal,
    setShowSuccessModal,
    showUserDropdown,
    setShowUserDropdown,
    isPrayerModalOpen,
    setPrayerModalOpen,
    handleSubmit,
    handleResetUser,
    handleUserSelect,
    loadRecordForDate,
  };
}
