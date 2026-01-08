export interface DailyRecord {
  date: string;
  qtCount: number;
  bibleReadCount: number;
  qtDone: boolean;
  bibleReadDone: boolean;
  writingDone: boolean;
  dawnPrayerAttended?: boolean;
  userName: string;
}
