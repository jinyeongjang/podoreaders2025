import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { RealtimeChannel } from '@supabase/supabase-js';
import { DailyRecord } from '../types/records';
import { qtAPI } from '../lib/qtAPI';
import { exportToExcel } from '../utils/excel';

export const useFamilyManagement = () => {
  const [qtRecords, setQtRecords] = useState<DailyRecord[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const [viewTab, setViewTab] = useState<'stats'>('stats');
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<
    { id: number; name: string; campus?: string; family_leader?: string }[]
  >([]);

  // 권한 확인
  useEffect(() => {
    const checkAuthorization = () => {
      const isAuthorized = localStorage.getItem('familyAuthorized') === 'true';
      setAuthorized(isAuthorized);
      setAuthChecked(true);

      if (!isAuthorized) {
        // 인증되지 않은 경우 접근 제한 및 리디렉션
        router.replace('/familyAccessPage?redirected=true');
      }
    };

    checkAuthorization();
  }, [router]);

  // QT 기록 불러오기
  useEffect(() => {
    const loadQtRecords = async () => {
      try {
        const data = await qtAPI.getAll();
        const formattedRecords = data.map((record) => ({
          date: record.date,
          qtCount: record.qt_count,
          bibleReadCount: record.bible_read_count,
          qtDone: record.qt_done,
          bibleReadDone: record.bible_read_done,
          writingDone: record.writing_done,
          userName: record.user_name,
        }));
        setQtRecords(formattedRecords);
      } catch (error) {
        console.error('Failed to load QT records:', error);
      }
    };

    if (authorized) {
      loadQtRecords();

      const channel = qtAPI.subscribeToChanges(async () => {
        await loadQtRecords();
      });

      realtimeChannelRef.current = channel;
    }

    return () => {
      if (realtimeChannelRef.current) {
        qtAPI.unsubscribe(realtimeChannelRef.current);
      }
    };
  }, [authorized]);

  // 가족원 목록 로드 함수
  const fetchFamilyMembers = async () => {
    try {
      // DB가 없으므로 임시 데이터 불러오기
      setFamilyMembers([
        { id: 1, name: '가족장1번', campus: '기도', family_leader: '리더1' },
        { id: 2, name: '가족장1번', campus: '말씀', family_leader: '리더2' },
        { id: 3, name: '가족장1번', campus: '찬양', family_leader: '리더3' },
      ]);
    } catch (error) {
      console.error('가족원 목록을 불러오는데 실패했습니다:', error);
    }
  };

  // 컴포넌트 mount 가족원 목록 불러오기
  useEffect(() => {
    if (authorized) {
      fetchFamilyMembers();
    }
  }, [authorized]);

  // 출결 내보내기
  const exportAttendance = () => {
    exportToExcel(filteredRecordsByRange);
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('familyAuthorized');
    router.push('/familyAccessPage');
  };

  // 선택된 사용자들의 데이터 필터링
  const filteredRecordsByRange = qtRecords.filter((record) => {
    if (selectedUser === 'all') return true;
    const selectedUsers = selectedUser.split(', ').filter(Boolean);
    return selectedUsers.includes(record.userName);
  });

  return {
    qtRecords,
    selectedUser,
    setSelectedUser,
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    viewTab,
    setViewTab,
    authorized,
    authChecked,
    familyMembers,
    filteredRecordsByRange,
    exportAttendance,
    handleLogout,
  };
};
