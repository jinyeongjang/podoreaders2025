import { useState, useEffect, useRef, useCallback } from 'react';
import { qtAPI } from '../lib/qtAPI';
import { DailyRecord } from '../types/records';
import { formatToKST } from '../utils/dateUtils';
import { RealtimeChannel } from '@supabase/supabase-js';
import { exportToExcel } from '../utils/excel';

export function useQtRecords() {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);

  // 초기 데이터 로드 및 실시간 구독 설정
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Supabase에서 기록 가져오기
        const data = await qtAPI.getAll();
        if (data) {
          const formattedRecords = data.map((record) => ({
            date: formatToKST(new Date(record.date)), // KST로 변환
            qtCount: record.qt_count,
            bibleReadCount: record.bible_read_count,
            qtDone: record.qt_done,
            bibleReadDone: record.bible_read_done,
            writingDone: record.writing_done,
            userName: record.user_name,
          }));
          setRecords(formattedRecords);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();

    // 실시간 구독 설정
    const channel = qtAPI.subscribeToChanges(async (payload) => {
      console.log('Realtime change received:', payload);

      // 변경사항이 발생하면 데이터 다시 로드
      const updatedData = await qtAPI.getAll();
      const formattedRecords = updatedData.map((record) => ({
        date: formatToKST(new Date(record.date)), // KST로 변환
        qtCount: record.qt_count,
        bibleReadCount: record.bible_read_count,
        qtDone: record.qt_done,
        bibleReadDone: record.bible_read_done,
        writingDone: record.writing_done,
        userName: record.user_name,
      }));
      setRecords(formattedRecords);
    });

    realtimeChannelRef.current = channel;

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (realtimeChannelRef.current) {
        qtAPI.unsubscribe(realtimeChannelRef.current);
      }
    };
  }, []);

  // 기록 삭제 핸들러
  const handleDeleteRecord = async (date: string, userName: string) => {
    try {
      const record = await qtAPI.findByDateAndUser(date, userName);
      if (record) {
        await qtAPI.delete(record.id!);
        const updatedRecords = await qtAPI.getAll();
        const formattedRecords = updatedRecords.map((record) => ({
          date: formatToKST(new Date(record.date)),
          qtCount: record.qt_count,
          bibleReadCount: record.bible_read_count,
          qtDone: record.qt_done,
          bibleReadDone: record.bible_read_done,
          writingDone: record.writing_done,
          userName: record.user_name,
        }));
        setRecords(formattedRecords);
      }
    } catch (error) {
      console.error('Failed to delete record:', error);
      alert('기록 삭제에 실패했습니다.');
    }
  };

  // 엑셀 내보내기
  const handleExportConfirm = () => {
    exportToExcel(records);
    setShowExportModal(false);
  };

  // 외부에서 records 상태를 업데이트하기 위한 함수
  const updateRecords = useCallback((newRecords: DailyRecord[]) => {
    setRecords(newRecords);
  }, []);

  return {
    records,
    showExportModal,
    setShowExportModal,
    handleDeleteRecord,
    handleExportConfirm,
    updateRecords,
  };
}
