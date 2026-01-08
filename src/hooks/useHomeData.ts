import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const useHomeData = () => {
  const [totals, setTotals] = useState({
    qtTotal: 0,
    bibleTotal: 0,
  });

  // 가족원 전체 QT 및 말씀 읽기 통계 로드
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        // QT 및 말씀 읽기 기록 가져오기
        const { data, error } = await supabase
          .from('qt_records')
          .select('qt_count, bible_read_count')
          .gte('date', '2025-01-01'); // 2025년부터의 기록만 가져오기

        if (error) throw error;

        // 합계 계산
        let qtSum = 0;
        let bibleSum = 0;

        if (data && data.length > 0) {
          qtSum = data.reduce((sum, record) => sum + (record.qt_count || 0), 0);
          bibleSum = data.reduce((sum, record) => sum + (record.bible_read_count || 0), 0);
        }

        setTotals({
          qtTotal: qtSum,
          bibleTotal: bibleSum,
        });
      } catch (error) {
        console.error('통계를 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchTotals();
  }, []);

  return { totals };
};
