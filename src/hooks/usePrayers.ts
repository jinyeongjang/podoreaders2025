import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Prayer {
  id: number;
  content: string;
  user_name: string;
  created_at: string;
}

export const usePrayers = (userName?: string) => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        let query = supabase
          .from('prayers')
          .select('*')
          // 가장 최근 날짜가 맨 위에 오도록 내림차순 정렬
          .order('created_at', { ascending: false });

        if (userName && userName !== 'all') {
          query = query.eq('user_name', userName);
        }

        const { data, error } = await query;

        if (error) throw error;
        if (data) setPrayers(data);
      } catch (error) {
        console.error('Error fetching prayers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayers();

    // 실시간 업데이트 구독
    const subscription = supabase
      .channel('prayers_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prayers' }, fetchPrayers)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userName]);

  return { prayers, loading };
};
