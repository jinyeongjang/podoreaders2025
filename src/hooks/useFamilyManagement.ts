import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { RealtimeChannel } from '@supabase/supabase-js';
import { DailyRecord } from '../types/records';
import { qtAPI } from '../lib/qtAPI';
import { AttendanceRecord } from '../pages/familyManagement';
import { AttendanceSubmitData } from '../components/family-management/AttendanceRegistrationModal';
import { exportToExcel } from '../utils/excel';

export const useFamilyManagement = () => {
  const [qtRecords, setQtRecords] = useState<DailyRecord[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const [viewTab, setViewTab] = useState<'stats' | 'attendance'>('stats');
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
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

  // 출석 기록 불러오기
  const fetchAttendanceRecords = async () => {
    try {
      // DB가 없으므로 샘플 데이터 정의
      const sampleData: AttendanceRecord[] = [
        {
          id: 1,
          user_name: '가족장1번',
          date: '2025-03-01',
          is_present: true,
          campus: '찬양',
          family_leader: '리더1',
        },
        {
          id: 2,
          user_name: '가족장1번',
          date: '2025-03-01',
          is_present: true,
          campus: '기도',
          family_leader: '리더2',
        },
        {
          id: 3,
          user_name: '가족장1번',
          date: '2023-03-01',
          is_present: false,
          campus: '말씀',
          family_leader: '리더3',
        },
      ];
      setAttendanceRecords(sampleData);
    } catch (error) {
      console.error('출석 기록을 불러오는데 실패했습니다:', error);
    }
  };

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
      fetchAttendanceRecords();
    }
  }, [authorized]);

  // 출석 상태 업데이트 함수
  const updateAttendanceStatus = async (userId: number, date: string, isPresent: boolean, note?: string) => {
    try {
      // 성공 시 로컬 상태 업데이트
      setAttendanceRecords((prev) =>
        prev.map((record) =>
          record.id === userId && record.date === date
            ? { ...record, is_present: isPresent, note: note || record.note }
            : record,
        ),
      );

      // 성공 알림
      toast.success('출석 상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('출석 상태 업데이트 오류:', error);
      toast.error('출석 상태 업데이트에 실패했습니다.');
    }
  };

  // 일괄 출결 등록 함수
  const handleBulkUpdateAttendance = async (data: AttendanceSubmitData) => {
    try {
      // 임시 처리
      const newRecords: AttendanceRecord[] = [];

      for (const member of data.members) {
        const existingIndex = attendanceRecords.findIndex(
          (record) =>
            record.user_name === member.name && new Date(record.date).toISOString().split('T')[0] === data.date,
        );

        if (existingIndex >= 0) {
          // 기존 레코드 업데이트
          const updatedRecords = [...attendanceRecords];
          updatedRecords[existingIndex] = {
            ...updatedRecords[existingIndex],
            is_present: member.isPresent,
            note: member.note,
          };
          setAttendanceRecords(updatedRecords);
        } else {
          // 새 레코드 추가
          const familyMember = familyMembers.find((fm) => fm.id === member.id);
          const newRecord: AttendanceRecord = {
            id: Date.now() + member.id, // 임시 ID
            user_name: member.name,
            date: data.date,
            is_present: member.isPresent,
            note: member.note,
            campus: familyMember?.campus,
            family_leader: familyMember?.family_leader,
          };
          newRecords.push(newRecord);
        }
      }

      // 새 레코드 추가
      if (newRecords.length > 0) {
        setAttendanceRecords((prev) => [...prev, ...newRecords]);
      }

      toast.success(`${data.members.length}명의 출석 정보가 등록되었습니다.`);
    } catch (error) {
      console.error('일괄 출석 등록 오류:', error);
      toast.error('일괄 등록 중 오류가 발생했습니다.');
    }
  };

  // 출결 내보내기
  const exportAttendance = () => {
    setShowExportModal(true);
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('familyAuthorized');
    router.push('/familyAccessPage');
  };

  const handleExportConfirm = () => {
    exportToExcel(filteredRecordsByRange);
    setShowExportModal(false);
  };

  // 선택된 사용자들의 데이터 필터링
  const filteredRecordsByRange = qtRecords.filter((record) => {
    if (selectedUser === 'all') return true;
    const selectedUsers = selectedUser.split(', ').filter(Boolean);
    return selectedUsers.includes(record.userName);
  });

  return {
    qtRecords,
    attendanceRecords,
    selectedUser,
    setSelectedUser,
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    viewTab,
    setViewTab,
    showExportModal,
    setShowExportModal,
    authorized,
    authChecked,
    familyMembers,
    filteredRecordsByRange,
    updateAttendanceStatus,
    handleBulkUpdateAttendance,
    exportAttendance,
    handleLogout,
    handleExportConfirm,
  };
};
