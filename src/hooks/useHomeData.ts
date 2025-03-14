import { useState, useEffect, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { prayerAPI, supabase } from '../lib/supabase';
import { QtRecord } from '../lib/qtAPI';

export const useHomeData = () => {
  const [totals, setTotals] = useState({ qtTotal: 0, bibleTotal: 0 });
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);

  // 데이터를 새로 고치고 총계를 업데이트하는 함수
  const updateData = async () => {
    try {
      const { data, error } = await supabase.from('qt_records').select('*').returns<QtRecord[]>();

      if (error) {
        console.error('Supabase error:', error);
        return;
      }

      if (data) {
        // 총계 계산
        const newTotals = data.reduce(
          (acc, record) => ({
            qtTotal: acc.qtTotal + (record.qt_count || 0),
            bibleTotal: acc.bibleTotal + (record.bible_read_count || 0),
          }),
          { qtTotal: 0, bibleTotal: 0 },
        );

        setTotals(newTotals);
      }
    } catch (error) {
      console.error('Failed to update records:', error);
    }
  };

  // 기도 제목 데이터 불러오기
  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        const data = await prayerAPI.getAll();
        if (data) {
          // 필요한 경우 여기서 데이터 처리
        }
      } catch (error) {
        console.error('Failed to fetch prayers:', error);
      }
    };

    fetchPrayers();
  }, []);

  // 실시간 업데이트 설정
  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const setupRealtimeSubscription = async () => {
      try {
        await updateData(); // 초기 데이터 로드

        channel = supabase
          .channel('custom-all-channel')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'qt_records',
            },
            async (payload) => {
              console.log('Realtime update received:', payload);
              await updateData();
            },
          )
          .subscribe((status) => {
            console.log('Subscription status:', status);
          });

        realtimeChannelRef.current = channel;
      } catch (error) {
        console.error('Subscription setup error:', error);
      }
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) {
        console.log('Cleaning up subscription...');
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return {
    totals,
    updateData,
  };
};
