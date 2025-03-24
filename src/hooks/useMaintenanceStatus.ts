import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// 서버 점검 상태 인터페이스 정의
export interface MaintenanceStatus {
  is_maintenance: boolean;
  message: string;
  starts_at: string | null;
  ends_at: string | null;
}

export function useMaintenanceStatus() {
  // 서버 점검 상태 관련 상태
  const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceStatus>({
    is_maintenance: false,
    message: '',
    starts_at: null,
    ends_at: null,
  });

  // 현재 서버 점검 모드 여부
  const isMaintenanceMode = maintenanceStatus.is_maintenance;

  // 서버 점검 상태 가져오기
  useEffect(() => {
    async function fetchMaintenanceStatus() {
      const { data, error } = await supabase.rpc('get_maintenance_status');

      if (error) {
        return;
      }

      if (data) {
        setMaintenanceStatus(data);
      }
    }

    // 초기 상태 가져오기
    fetchMaintenanceStatus();

    // 1분마다 상태 업데이트
    const interval = setInterval(fetchMaintenanceStatus, 60000);

    // 실시간 구독 설정
    const subscription = supabase
      .channel('system_status_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'system_status' }, (payload) => {
        if (payload.new && payload.new.key === 'maintenance_mode') {
          setMaintenanceStatus({
            is_maintenance: payload.new.value,
            message: payload.new.message,
            starts_at: payload.new.starts_at,
            ends_at: payload.new.ends_at,
          });
        }
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(subscription);
    };
  }, []);

  // 예정된 점검인지 확인
  const hasScheduledMaintenance = maintenanceStatus.starts_at && new Date(maintenanceStatus.starts_at) > new Date();

  return {
    maintenanceStatus,
    isMaintenanceMode,
    hasScheduledMaintenance,
  };
}
