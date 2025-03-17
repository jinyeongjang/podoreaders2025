import { useMemo } from 'react';
import { DailyRecord } from '../types/records';
import { PrayerRequest } from '../pages/familyManagement';

export const useFamilyStats = (
  qtRecords: DailyRecord[],
  prayers: PrayerRequest[],
  filteredRecordsByRange: DailyRecord[],
) => {
  // 사용자 목록 추출하기
  const userList = useMemo(() => {
    return Array.from(new Set(qtRecords.map((record) => record.userName)))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'ko-KR'));
  }, [qtRecords]);

  // 사용자별 통계 계산
  const userStats = useMemo(() => {
    return Object.fromEntries(
      userList.map((userName) => {
        const userRecords = qtRecords.filter((record) => record.userName === userName);
        return [
          userName,
          {
            qtTotal: userRecords.reduce((sum, record) => sum + record.qtCount, 0),
            bibleTotal: userRecords.reduce((sum, record) => sum + record.bibleReadCount, 0),
            writingTotal: userRecords.filter((record) => record.writingDone).length,
            recordCount: userRecords.length,
            lastRecord:
              userRecords.length > 0 ? new Date(Math.max(...userRecords.map((r) => new Date(r.date).getTime()))) : null,
          },
        ];
      }),
    );
  }, [qtRecords, userList]);

  // 전체 통계 계산
  const totals = useMemo(
    () => ({
      qtTotal: filteredRecordsByRange.reduce((sum, record) => sum + record.qtCount, 0),
      bibleTotal: filteredRecordsByRange.reduce((sum, record) => sum + record.bibleReadCount, 0),
    }),
    [filteredRecordsByRange],
  );

  // 기도 제목 통계
  const stats = useMemo(
    () => ({
      total: prayers.length,
      answered: prayers.filter((p: PrayerRequest) => p.isAnswered).length,
    }),
    [prayers],
  );

  // 날짜 포맷팅 함수
  const formattedDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  // 사용자별 기록 그룹화
  const groupRecordsByUser = (records: DailyRecord[]) => {
    const grouped = records.reduce(
      (acc, record) => {
        if (!acc[record.userName]) {
          acc[record.userName] = [];
        }
        acc[record.userName].push(record);
        return acc;
      },
      {} as Record<string, DailyRecord[]>,
    );

    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b, 'ko-KR'))
      .reduce(
        (acc, key) => {
          acc[key] = grouped[key].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          return acc;
        },
        {} as Record<string, DailyRecord[]>,
      );
  };

  // 주차별 기록 그룹화
  const groupRecordsByWeek = (records: DailyRecord[]) => {
    const grouped = records.reduce(
      (acc, record) => {
        const date = new Date(record.date);
        const year = date.getFullYear();
        const weekNumber = Math.ceil((date.getDate() + new Date(year, date.getMonth(), 1).getDay()) / 7);
        const weekKey = `${year}-${date.getMonth() + 1}-${weekNumber}`;

        if (!acc[record.userName]) {
          acc[record.userName] = {};
        }
        if (!acc[record.userName][weekKey]) {
          acc[record.userName][weekKey] = [];
        }
        acc[record.userName][weekKey].push(record);
        return acc;
      },
      {} as Record<string, Record<string, DailyRecord[]>>,
    );

    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b, 'ko-KR'))
      .reduce(
        (acc, userName) => {
          acc[userName] = Object.entries(grouped[userName])
            .sort(([a], [b]) => b.localeCompare(a))
            .reduce(
              (weekAcc, [week, records]) => {
                weekAcc[week] = records.sort((a, b) => b.date.localeCompare(a.date));
                return weekAcc;
              },
              {} as Record<string, DailyRecord[]>,
            );
          return acc;
        },
        {} as Record<string, Record<string, DailyRecord[]>>,
      );
  };

  // 주차 라벨 형식
  const formatWeekLabel = (weekKey: string) => {
    const [year, month, week] = weekKey.split('-').map(Number);
    return `${year}년 ${month}월 ${week}주차`;
  };

  // 주차별 통계 계산
  const calculateWeekStats = (records: DailyRecord[]) => {
    return records.reduce(
      (acc, record) => ({
        qtTotal: acc.qtTotal + record.qtCount,
        bibleTotal: acc.bibleTotal + record.bibleReadCount,
        writingTotal: acc.writingTotal + (record.writingDone ? 1 : 0),
        days: acc.days + 1,
      }),
      { qtTotal: 0, bibleTotal: 0, writingTotal: 0, days: 0 },
    );
  };

  return {
    userList,
    userStats,
    totals,
    stats,
    formattedDate,
    groupRecordsByUser,
    groupRecordsByWeek,
    formatWeekLabel,
    calculateWeekStats,
  };
};
