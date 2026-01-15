import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import toast from 'react-hot-toast';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export const useSimplePush = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  // 마운트 시 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(window.Notification.permission);
      checkSubscription();
    } else {
      setLoading(false);
    }
  }, []);

  const checkSubscription = async () => {
    if (!('serviceWorker' in navigator)) {
      setLoading(false);
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error('[Simple Push] Check Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGuestId = () => {
    let guestId = localStorage.getItem('podo_guest_id');
    const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (!guestId || !isValidUUID(guestId)) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        guestId = crypto.randomUUID();
      } else {
        guestId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
      localStorage.setItem('podo_guest_id', guestId);
    }
    return guestId;
  };

  const saveToDb = async (sub: PushSubscription) => {
    const targetId = getGuestId();
    // Helper for KST
    const getKSTISOString = () => {
      const date = new Date();
      const kstOffset = 9 * 60 * 60 * 1000;
      const kstDate = new Date(date.getTime() + kstOffset);
      return kstDate.toISOString().replace('Z', '+09:00');
    };

    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: targetId,
        subscription: JSON.parse(JSON.stringify(sub)),
        user_agent: navigator.userAgent,
        updated_at: getKSTISOString(),
      },
      { onConflict: 'user_id' },
    );

    if (error) {
      console.error('[Simple Push] DB Save Error:', error);
      toast.error('설정 저장 실패');
    } else {
      console.log('[Simple Push] Saved for:', targetId);
    }
  };

  const subscribe = async () => {
    if (!VAPID_PUBLIC_KEY) {
      toast.error('설정 오류: VAPID 키 누락');
      return;
    }
    if (!('serviceWorker' in navigator)) {
      toast.error('이 브라우저는 알림을 지원하지 않습니다.');
      return;
    }

    try {
      // 1. 권한 요청
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') {
        toast.error('알림 권한이 거부되었습니다.');
        return;
      }

      // 2. 서비스워커 준비
      const registration = await navigator.serviceWorker.ready;

      // 3. 구독
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      setSubscription(sub);
      await saveToDb(sub);
      toast.success('알림이 설정되었습니다!');
      return sub;
    } catch (error) {
      console.error('[Simple Push] Subscribe Error:', error);
      toast.error('알림 설정 중 오류가 발생했습니다.');
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return;
    try {
      await subscription.unsubscribe();

      // DB에서 삭제
      await supabase.from('push_subscriptions').delete().eq('subscription->>endpoint', subscription.endpoint);

      setSubscription(null);
      toast.success('알림이 해제되었습니다.');
    } catch (error) {
      console.error('[Simple Push] Unsubscribe Error:', error);
      toast.error('알림 해제 실패');
    }
  };

  // Utility
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return {
    permission,
    subscription,
    loading,
    subscribe,
    unsubscribe,
  };
};
