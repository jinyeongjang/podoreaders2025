import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';
import { DailyRecord } from '../types/records';
import { getCurrentKSTDate, formatToKST } from '../utils/dateUtils';

// 말씀캠퍼스 의완팀 전용 QT 기록 타입
interface WordCampus_uiwan_QtRecord {
  id?: number;
  user_name: string;
  date: string;
  qt_count: number;
  bible_read_count: number;
  qt_done: boolean;
  bible_read_done: boolean;
  writing_done: boolean;
  dawn_prayer_attended: boolean;
  created_at?: string;
  updated_at?: string;
}

// supabase 테이블 이름 : wordCampus_uiwan_QT_Records 로 정의
const TABLE_NAME = 'wordCampus_uiwan_QT_Records';

export const useWordCampus_uiwan_QtRecords = (userName: string) => {
  const [selectedDate, setSelectedDate] = useState(getCurrentKSTDate());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [qtCount, setQtCountState] = useState(0);
  const [bibleReadCount, setBibleReadCountState] = useState(0);
  const [qtDone, setQtDone] = useState(false);
  const [bibleReadDone, setBibleReadDone] = useState(false);
  const [writingDone, setWritingDone] = useState(false);
  const [dawnPrayerAttended, setDawnPrayerAttended] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);

  // Setter 함수
  const setQtCount = (value: number) => {
    setQtCountState(value);
  };

  const setBibleReadCount = (value: number) => {
    setBibleReadCountState(value);
  };

  // 특정 날짜와 사용자의 기록 조회
  const findByDateAndUser = async (date: string, user: string): Promise<WordCampus_uiwan_QtRecord | null> => {
    const { data, error } = await supabase.from(TABLE_NAME).select('*').eq('date', date).eq('user_name', user).single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error finding record:', error);
      return null;
    }

    return data;
  };

  // 모든 기록 조회
  const getAllRecords = async (): Promise<WordCampus_uiwan_QtRecord[]> => {
    const { data, error } = await supabase.from(TABLE_NAME).select('*').order('date', { ascending: false });

    if (error) {
      console.error('Error getting all records:', error);
      return [];
    }

    return data || [];
  };

  // 날짜에 따른 기록 로딩
  const loadRecordForDate = useCallback(
    async (date: string) => {
      if (!userName) return;

      try {
        const record = await findByDateAndUser(date, userName);
        if (record) {
          setQtCount(record.qt_count);
          setBibleReadCount(record.bible_read_count);
          setQtDone(record.qt_done);
          setBibleReadDone(record.bible_read_done);
          setWritingDone(record.writing_done);
          setDawnPrayerAttended(record.dawn_prayer_attended || false);
        } else {
          setQtCount(0);
          setBibleReadCount(0);
          setQtDone(false);
          setBibleReadDone(false);
          setWritingDone(false);
          setDawnPrayerAttended(false);
        }
      } catch (error) {
        console.error('Failed to load record:', error);
      }
    },
    [userName],
  );

  // 초기 데이터 로드 및 실시간 업데이트 구독
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await getAllRecords();
        if (data) {
          const formattedRecords = data.map((record) => ({
            date: formatToKST(new Date(record.date)),
            qtCount: record.qt_count,
            bibleReadCount: record.bible_read_count,
            qtDone: record.qt_done,
            bibleReadDone: record.bible_read_done,
            writingDone: record.writing_done,
            dawnPrayerAttended: record.dawn_prayer_attended || false,
            userName: record.user_name,
          }));
          setRecords(formattedRecords);

          if (userName) {
            const userRecord = await findByDateAndUser(selectedDate, userName);
            if (userRecord) {
              setQtCount(userRecord.qt_count);
              setBibleReadCount(userRecord.bible_read_count);
              setQtDone(userRecord.qt_done);
              setBibleReadDone(userRecord.bible_read_done);
              setWritingDone(userRecord.writing_done);
              setDawnPrayerAttended(userRecord.dawn_prayer_attended || false);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();

    // 실시간 구독 설정
    const channel = supabase
      .channel(`${TABLE_NAME}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, async (payload) => {
        console.log('Realtime change received:', payload);

        const updatedData = await getAllRecords();
        const formattedRecords = updatedData.map((record) => ({
          date: formatToKST(new Date(record.date)),
          qtCount: record.qt_count,
          bibleReadCount: record.bible_read_count,
          qtDone: record.qt_done,
          bibleReadDone: record.bible_read_done,
          writingDone: record.writing_done,
          dawnPrayerAttended: record.dawn_prayer_attended || false,
          userName: record.user_name,
        }));
        setRecords(formattedRecords);

        if (userName) {
          const currentRecord = await findByDateAndUser(selectedDate, userName);
          if (currentRecord) {
            setQtCount(currentRecord.qt_count);
            setBibleReadCount(currentRecord.bible_read_count);
            setQtDone(currentRecord.qt_done);
            setBibleReadDone(currentRecord.bible_read_done);
            setWritingDone(currentRecord.writing_done);
            setDawnPrayerAttended(currentRecord.dawn_prayer_attended || false);
          }
        }
      })
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [selectedDate, userName]);

  // 데이터 저장 함수
  const saveRecord = async () => {
    if (!userName) {
      return false;
    }

    setIsSaving(true);

    try {
      const existingRecord = await findByDateAndUser(selectedDate, userName);

      const recordData: Omit<WordCampus_uiwan_QtRecord, 'id' | 'created_at' | 'updated_at'> = {
        user_name: userName,
        date: selectedDate,
        qt_count: qtCount,
        bible_read_count: bibleReadCount,
        qt_done: qtDone,
        bible_read_done: bibleReadDone,
        writing_done: writingDone,
        dawn_prayer_attended: dawnPrayerAttended,
      };

      if (existingRecord) {
        // 업데이트
        const { error } = await supabase
          .from(TABLE_NAME)
          .update({ ...recordData, updated_at: new Date().toISOString() })
          .eq('id', existingRecord.id);

        if (error) throw error;
      } else {
        // 새로 삽입
        const { error } = await supabase.from(TABLE_NAME).insert([recordData]);

        if (error) throw error;
      }

      setShowSuccessModal(true);
      return true;
    } catch (error) {
      console.error('Save error:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // 기록 삭제 함수
  const deleteRecord = async (date: string, user: string) => {
    try {
      const { error } = await supabase.from(TABLE_NAME).delete().eq('date', date).eq('user_name', user);

      if (error) throw error;

      // 삭제 후 현재 선택된 날짜의 기록이 삭제된 경우 상태 초기화
      if (date === selectedDate && user === userName) {
        setQtCount(0);
        setBibleReadCount(0);
        setQtDone(false);
        setBibleReadDone(false);
        setWritingDone(false);
        setDawnPrayerAttended(false);
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  };

  // 날짜 선택 핸들러
  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    await loadRecordForDate(date);
  };

  // 월 변경 핸들러
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  // 캘린더 토글
  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
  };

  return {
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
  };
};
