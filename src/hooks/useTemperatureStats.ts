import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// 온도 계산 함수
export const calculateTemperature = {
  qt: (count: number) => Math.min(count * 0.084, 100), // 큐티 1회당 0.084도
  bible: (count: number) => Math.min(count * 0.084, 100), // 말씀 1장당 0.084도
  total: (qtTemp: number, bibleTemp: number) => Math.min((qtTemp + bibleTemp) / 2, 100), // 종합 (큐티온도+말씀온도) / 2
};

// 온도 데이터 타입 정의
export interface TemperatureData {
  qtTotal: number;
  bibleTotal: number;
  userName: string;
}

export interface UserTemperature {
  userName: string;
  qtTemp: number;
  bibleTemp: number;
  totalTemp: number;
}

export const useTemperatureStats = () => {
  const [showTemperatures, setShowTemperatures] = useState(false);
  const [userTemps, setUserTemps] = useState<
    Record<
      string,
      {
        qtTemp: number;
        bibleTemp: number;
        totalTemp: number;
        userName: string;
      }[]
    >
  >({});

  // 사용자별 온도 데이터 가져오기 함수
  const fetchUserTemperatures = useCallback(async () => {
    try {
      const { data: records, error } = await supabase
        .from('qt_records')
        .select('user_name, qt_count, bible_read_count');

      if (error) throw error;

      const temperatures = records.reduce<Record<string, TemperatureData>>((acc, record) => {
        const userName = record.user_name;
        if (!acc[userName]) {
          acc[userName] = {
            qtTotal: 0,
            bibleTotal: 0,
            userName,
          };
        }
        acc[userName].qtTotal += record.qt_count || 0;
        acc[userName].bibleTotal += record.bible_read_count || 0;
        return acc;
      }, {});

      // 온도 계산
      const userTemperatures = Object.values(temperatures).map(
        (user: TemperatureData): UserTemperature => ({
          userName: user.userName,
          qtTemp: calculateTemperature.qt(user.qtTotal),
          bibleTemp: calculateTemperature.bible(user.bibleTotal),
          totalTemp: calculateTemperature.total(
            calculateTemperature.qt(user.qtTotal),
            calculateTemperature.bible(user.bibleTotal),
          ),
        }),
      );

      setUserTemps({ users: userTemperatures });
    } catch (error) {
      console.error('Failed to fetch user temperatures:', error);
    }
  }, []);

  // 초기 데이터 로딩
  useEffect(() => {
    fetchUserTemperatures();
  }, [fetchUserTemperatures]);

  return {
    userTemps,
    showTemperatures,
    setShowTemperatures,
    fetchUserTemperatures,
  };
};
