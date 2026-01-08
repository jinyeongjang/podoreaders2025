import { useMemo } from 'react';
import { DailyRecord } from '../../types/records';

export const useFamilyStats = (qtRecords: DailyRecord[], filteredRecordsByRange: DailyRecord[]) => {
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

  // 주차별 기록 그룹화 (일요일~토요일 기준)
  const groupRecordsByWeek = (records: DailyRecord[]) => {
    const grouped = records.reduce(
      (acc, record) => {
        // 해당 날짜가 속한 주의 시작일(일요일)과 종료일(토요일) 계산
        const date = new Date(record.date);
        const day = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

        // 현재 날짜에서 요일만큼 빼서 해당 주의 일요일 구하기
        const sunday = new Date(date);
        sunday.setDate(date.getDate() - day);

        // 해당 주의 토요일 구하기 (일요일 + 6일)
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);

        // 날짜를 YYYY-MM-DD 형식으로 포맷팅하는 함수
        const formatDateToYYYYMMDD = (d: Date) => {
          const year = d.getFullYear();
          // 월과 일은 항상 두 자리로 포맷팅 (01, 02, ..., 12)
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        // 주차 키: YYYY-MM-DD_YYYY-MM-DD (일요일_토요일) 형식 - 형식 통일을 위해 포맷팅 함수 사용
        const weekKey = `${formatDateToYYYYMMDD(sunday)}_${formatDateToYYYYMMDD(saturday)}`;

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

    // 사용자 이름 순으로 정렬하고, 각 사용자의 주차는 최신순으로, 각 주차 내 기록은 날짜 내림차순으로 정렬
    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b, 'ko-KR'))
      .reduce(
        (acc, userName) => {
          acc[userName] = Object.entries(grouped[userName])
            .sort(([a], [b]) => {
              // 주차 키에서 시작일(일요일) 추출하여 최신순 정렬
              const startDateA = a.split('_')[0];
              const startDateB = b.split('_')[0];
              return startDateB.localeCompare(startDateA); // 내림차순 정렬
            })
            .reduce(
              (weekAcc, [week, records]) => {
                weekAcc[week] = records.sort((a, b) => b.date.localeCompare(a.date)); // 날짜 내림차순 정렬
                return weekAcc;
              },
              {} as Record<string, DailyRecord[]>,
            );
          return acc;
        },
        {} as Record<string, Record<string, DailyRecord[]>>,
      );
  };

  // 주차 라벨 형식 개선 - 10/5~10/11과 같은 형식의 날짜도 올바르게 처리
  const formatWeekLabel = (weekKey: string) => {
    const [startDate, endDate] = weekKey.split('_');

    // Date 객체 생성 시 YYYY-MM-DD 형식으로 통일
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // 날짜 형식화 옵션
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    };

    // 포맷된 날짜 생성 (한국어 로케일)
    const formattedStart = startDateObj.toLocaleDateString('ko-KR', dateOptions);
    const formattedEnd = endDateObj.toLocaleDateString('ko-KR', dateOptions);

    return `${formattedStart} ~ ${formattedEnd}`;
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
    formattedDate,
    groupRecordsByUser,
    groupRecordsByWeek,
    formatWeekLabel,
    calculateWeekStats,
  };
};
