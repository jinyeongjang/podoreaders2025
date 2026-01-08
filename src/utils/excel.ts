import * as XLSX from 'xlsx';
import { DailyRecord } from '../types/records';

export const exportToExcel = (records: DailyRecord[]) => {
  // 사용자별, 주차별 데이터 그룹화 및 누계 계산
  const userWeeklyStats = records.reduce(
    (acc, record) => {
      const date = new Date(record.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const week = Math.ceil((date.getDate() + new Date(year, date.getMonth(), 1).getDay()) / 7);
      const weekKey = `${year}-${month}-${week}`;
      const userName = record.userName;

      if (!acc[userName]) {
        acc[userName] = {
          totalQt: 0,
          totalBible: 0,
          totalWriting: 0,
          weeks: {},
        };
      }

      if (!acc[userName].weeks[weekKey]) {
        acc[userName].weeks[weekKey] = {
          weeklyQt: 0,
          weeklyBible: 0,
          weeklyWriting: 0,
          qtCumulative: 0,
          bibleCumulative: 0,
          writingCumulative: 0,
        };
      }

      // 주차별 데이터 누적
      acc[userName].weeks[weekKey].weeklyQt += record.qtCount;
      acc[userName].weeks[weekKey].weeklyBible += record.bibleReadCount;
      acc[userName].weeks[weekKey].weeklyWriting += record.writingDone ? 1 : 0;

      // 전체 누계 업데이트
      acc[userName].totalQt += record.qtCount;
      acc[userName].totalBible += record.bibleReadCount;
      acc[userName].totalWriting += record.writingDone ? 1 : 0;

      return acc;
    },
    {} as Record<
      string,
      {
        totalQt: number;
        totalBible: number;
        totalWriting: number;
        weeks: Record<
          string,
          {
            weeklyQt: number;
            weeklyBible: number;
            weeklyWriting: number;
            qtCumulative: number;
            bibleCumulative: number;
            writingCumulative: number;
          }
        >;
      }
    >,
  );

  // 주차별 누계 계산
  Object.values(userWeeklyStats).forEach((userData) => {
    let qtCumulative = 0;
    let bibleCumulative = 0;
    let writingCumulative = 0;

    Object.keys(userData.weeks)
      .sort()
      .forEach((weekKey) => {
        const week = userData.weeks[weekKey];
        qtCumulative += week.weeklyQt;
        bibleCumulative += week.weeklyBible;
        writingCumulative += week.weeklyWriting;

        week.qtCumulative = qtCumulative;
        week.bibleCumulative = bibleCumulative;
        week.writingCumulative = writingCumulative;
      });
  });

  // 엑셀 데이터 포맷팅 - 이름순 오름차순 정렬 추가
  const excelData = records
    .sort((a, b) => {
      // 1차: 이름순 오름차순
      const nameCompare = a.userName.localeCompare(b.userName, 'ko-KR');
      if (nameCompare !== 0) return nameCompare;

      // 2차: 같은 이름일 경우 날짜순 내림차순
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .map((record) => {
      const date = new Date(record.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const week = Math.ceil((date.getDate() + new Date(year, date.getMonth(), 1).getDay()) / 7);
      const weekKey = `${year}-${month}-${week}`;
      const userStats = userWeeklyStats[record.userName].weeks[weekKey];

      return {
        날짜: new Date(record.date).toLocaleDateString('ko-KR'),
        주차: `${month}월 ${week}주`,
        이름: record.userName,
        '큐티 횟수': record.qtCount,
        '말씀 읽기 횟수': record.bibleReadCount,
        '필사 완료': record.writingDone ? 'O' : 'X',
        '큐티 누계': userStats.qtCumulative,
        '말씀 읽기 누계': userStats.bibleCumulative,
        '필사 누계': userStats.writingCumulative,
      };
    });

  // 워크북 생성
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // 열 너비 설정
  ws['!cols'] = [
    { wch: 15 }, // 날짜
    { wch: 12 }, // 주차
    { wch: 10 }, // 이름
    { wch: 10 }, // 큐티 횟수
    { wch: 15 }, // 말씀 읽기 횟수
    { wch: 10 }, // 필사 완료
    { wch: 10 }, // 큐티 누계
    { wch: 15 }, // 말씀 읽기 누계
    { wch: 10 }, // 필사 누계
  ];

  // 워크시트를 워크북에 추가
  XLSX.utils.book_append_sheet(wb, ws, '말씀 기록');

  // 파일 다운로드
  const now = new Date();
  const fileName = `말씀기록_${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
