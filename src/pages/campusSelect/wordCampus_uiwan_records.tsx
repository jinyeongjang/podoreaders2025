import { useState, useEffect, useMemo, useRef } from 'react';
import { pretendard } from '../../lib/fonts';
import Header from '../../components/layout/Header';
import { supabase } from '../../lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

// Components
import RecordsHeader from '../../components/wordCampus/RecordsHeader';
import StatsSummaryCards from '../../components/wordCampus/StatsSummaryCards';
import UserStatsTable from '../../components/wordCampus/UserStatsTable';
import ViewModeToggle from '../../components/wordCampus/ViewModeToggle';
import WeeklyRecordsView from '../../components/wordCampus/WeeklyRecordsView';
import DailyRecordsView from '../../components/wordCampus/DailyRecordsView';
// import WordCampusStatsSection from '../../components/wordCampus/WordCampusStatsSection';
// import campusUsersWorduiwan from '../../data/campusUsersWord_uiwan.json';

// 말씀캠퍼스 의완 가족 전용 QT 기록 타입
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

const TABLE_NAME = 'wordCampus_uiwan_QT_Records';

export default function WordCampusUiwanRecords() {
  const [records, setRecords] = useState<WordCampus_uiwan_QtRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);

  // 기록 불러오기
  useEffect(() => {
    loadRecords();

    // 실시간 구독 설정
    const channel = supabase
      .channel(`${TABLE_NAME}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, async (payload) => {
        console.log('Realtime change received:', payload);
        // 변경사항 발생 시 로딩 상태 없이 데이터만 업데이트
        refreshRecords();
      })
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, []);

  // 초기 로딩 (로딩 상태 포함)
  const loadRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from(TABLE_NAME).select('*').order('date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setLoading(false);
    }
  };

  // 실시간 업데이트 (로딩 상태 없이 조용히 업데이트)
  const refreshRecords = async () => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select('*').order('date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Failed to refresh records:', error);
    }
  };

  // 날짜 필터링
  const filteredRecords = useMemo(() => {
    return records;
  }, [records]);

  // 사용자별 통계
  const userStats = useMemo(() => {
    const stats: Record<
      string,
      {
        totalQt: number;
        totalBible: number;
        totalWriting: number;
        totalDawnPrayer: number;
        recordCount: number;
      }
    > = {};

    filteredRecords.forEach((record) => {
      if (!stats[record.user_name]) {
        stats[record.user_name] = {
          totalQt: 0,
          totalBible: 0,
          totalWriting: 0,
          totalDawnPrayer: 0,
          recordCount: 0,
        };
      }

      stats[record.user_name].totalQt += record.qt_count;
      stats[record.user_name].totalBible += record.bible_read_count;
      stats[record.user_name].totalWriting += record.writing_done ? 1 : 0;
      stats[record.user_name].totalDawnPrayer += record.dawn_prayer_attended ? 1 : 0;
      stats[record.user_name].recordCount += 1;
    });

    return stats;
  }, [filteredRecords]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${month}월 ${day}일 (${dayOfWeek})`;
  };

  // 날짜별 그룹화
  const groupedByDate = useMemo(() => {
    const groups: Record<string, WordCampus_uiwan_QtRecord[]> = {};
    filteredRecords.forEach((record) => {
      if (!groups[record.date]) {
        groups[record.date] = [];
      }
      groups[record.date].push(record);
    });
    return groups;
  }, [filteredRecords]);

  // 주차별 기록 그룹화 (일요일~토요일 기준)
  const groupRecordsByWeek = useMemo(() => {
    const grouped: Record<string, Record<string, WordCampus_uiwan_QtRecord[]>> = {};

    filteredRecords.forEach((record) => {
      const date = new Date(record.date);
      const day = date.getDay();

      const sunday = new Date(date);
      sunday.setDate(date.getDate() - day);

      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6);

      const formatDateToYYYYMMDD = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const weekKey = `${formatDateToYYYYMMDD(sunday)}_${formatDateToYYYYMMDD(saturday)}`;

      if (!grouped[record.user_name]) {
        grouped[record.user_name] = {};
      }
      if (!grouped[record.user_name][weekKey]) {
        grouped[record.user_name][weekKey] = [];
      }
      grouped[record.user_name][weekKey].push(record);
    });

    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b, 'ko-KR'))
      .reduce(
        (acc, userName) => {
          acc[userName] = Object.entries(grouped[userName])
            .sort(([a], [b]) => {
              const startDateA = a.split('_')[0];
              const startDateB = b.split('_')[0];
              return startDateB.localeCompare(startDateA);
            })
            .reduce(
              (weekAcc, [week, recs]) => {
                weekAcc[week] = recs.sort((a, b) => b.date.localeCompare(a.date));
                return weekAcc;
              },
              {} as Record<string, WordCampus_uiwan_QtRecord[]>,
            );
          return acc;
        },
        {} as Record<string, Record<string, WordCampus_uiwan_QtRecord[]>>,
      );
  }, [filteredRecords]);

  // 주차 라벨 형식
  const formatWeekLabel = (weekKey: string) => {
    const [startDate, endDate] = weekKey.split('_');
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    };

    const formattedStart = startDateObj.toLocaleDateString('ko-KR', dateOptions);
    const formattedEnd = endDateObj.toLocaleDateString('ko-KR', dateOptions);

    return `${formattedStart} ~ ${formattedEnd}`;
  };

  // 주차별 통계 계산
  const calculateWeekStats = (recs: WordCampus_uiwan_QtRecord[]) => {
    return recs.reduce(
      (acc, record) => ({
        qtTotal: acc.qtTotal + record.qt_count,
        bibleTotal: acc.bibleTotal + record.bible_read_count,
        writingTotal: acc.writingTotal + (record.writing_done ? 1 : 0),
        dawnPrayerTotal: acc.dawnPrayerTotal + (record.dawn_prayer_attended ? 1 : 0),
        days: acc.days + 1,
      }),
      { qtTotal: 0, bibleTotal: 0, writingTotal: 0, dawnPrayerTotal: 0, days: 0 },
    );
  };

  // 월별 그룹화
  const groupedByMonth = useMemo(() => {
    const getMonthName = (weekKey: string): string => {
      const startDate = weekKey.split('_')[0];
      const [year, month] = startDate.split('-').map(Number);
      return `${year}년 ${month}월`;
    };

    return Object.entries(groupRecordsByWeek).map(([userName, weekGroups]) => {
      const monthGroups: Record<
        string,
        { weeks: [string, WordCampus_uiwan_QtRecord[]][]; records: WordCampus_uiwan_QtRecord[] }
      > = {};

      Object.entries(weekGroups)
        .sort(([a], [b]) => {
          const startA = a.split('_')[0];
          const startB = b.split('_')[0];
          return startB.localeCompare(startA);
        })
        .forEach(([weekKey, recs]) => {
          const monthKey = getMonthName(weekKey);

          if (!monthGroups[monthKey]) {
            monthGroups[monthKey] = { weeks: [], records: [] };
          }

          monthGroups[monthKey].weeks.push([weekKey, recs]);
          monthGroups[monthKey].records.push(...recs);
        });

      const sortedMonthGroups = Object.entries(monthGroups).sort((a, b) => {
        const getMonthDate = (monthKey: string) => {
          const [year, month] = monthKey
            .match(/(\d+)년\s+(\d+)월/)
            ?.slice(1)
            .map(Number) || [0, 0];
          return new Date(year, month - 1, 1);
        };
        return getMonthDate(b[0]).getTime() - getMonthDate(a[0]).getTime();
      });

      return {
        userName,
        monthGroups: Object.fromEntries(sortedMonthGroups),
      };
    });
  }, [groupRecordsByWeek]);

  // 엑셀 내보내기
  const exportToExcel = () => {
    const exportData = filteredRecords.map((record) => ({
      이름: record.user_name,
      날짜: formatDate(record.date),
      QT횟수: record.qt_count,
      말씀읽기: record.bible_read_count,
      필사완료: record.writing_done ? 'O' : 'X',
      새벽기도: record.dawn_prayer_attended ? 'O' : 'X',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '말씀캠퍼스 김의완 가족 QT 기록');

    const fileName = `말씀캠퍼스 김의완 가족 QT기록_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${pretendard.variable} font-pretendard`}>
        <Header />
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-emerald-500"></div>
            <p className="mt-4 text-gray-600">기록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-gray-50 via-slate-50 to-white ${pretendard.variable} font-pretendard`}>
      <Header />

      <main className="container mx-auto max-w-7xl px-4 py-0">
        <RecordsHeader onExport={exportToExcel} familyName="김의완 가족" />

        <StatsSummaryCards
          totalQt={Object.values(userStats).reduce((sum, stat) => sum + stat.totalQt, 0)}
          totalBible={Object.values(userStats).reduce((sum, stat) => sum + stat.totalBible, 0)}
          totalWriting={Object.values(userStats).reduce((sum, stat) => sum + stat.totalWriting, 0)}
          totalDawnPrayer={Object.values(userStats).reduce((sum, stat) => sum + stat.totalDawnPrayer, 0)}
        />

        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

        {viewMode === 'week' ? (
          <WeeklyRecordsView
            groupedByMonth={groupedByMonth}
            formatDate={formatDate}
            formatWeekLabel={formatWeekLabel}
            calculateWeekStats={calculateWeekStats}
            filteredRecordsLength={filteredRecords.length}
          />
        ) : (
          <DailyRecordsView
            groupedByDate={groupedByDate}
            formatDate={formatDate}
            filteredRecordsLength={filteredRecords.length}
          />
        )}
        <UserStatsTable userStats={userStats} selectedUser="all" />
        {/* 가족원 상세 통계 */}
        {/* <WordCampusStatsSection
          userList={campusUsersWorduiwan.users.map((u) => u.name)}
          userStats={userStats}
          groupRecordsByWeek={groupRecordsByWeek}
          calculateWeekStats={calculateWeekStats}
          formatWeekLabel={formatWeekLabel}
        /> */}
      </main>
    </div>
  );
}
