import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export const useSubscriberStats = () => {
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [appleSubscriberCount, setAppleSubscriberCount] = useState(0);
  const [androidSubscriberCount, setAndroidSubscriberCount] = useState(0);

  useEffect(() => {
    fetchSubscriberStats();
  }, []);

  const fetchSubscriberStats = async () => {
    try {
      const { data, count, error } = await supabase
        .from('push_subscriptions')
        .select('subscription', { count: 'exact' });
      if (error) throw error;

      setSubscriberCount(count);

      let apple = 0;
      let android = 0;

      data?.forEach((item) => {
        const sub = item.subscription as unknown as { endpoint?: string };
        const endpoint = sub.endpoint || '';
        if (endpoint.includes('apple.com') || endpoint.includes('push.apple.com')) apple++;
        else if (endpoint.includes('google.com') || endpoint.includes('googleapis.com')) android++;
      });

      setAppleSubscriberCount(apple);
      setAndroidSubscriberCount(android);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return { subscriberCount, appleSubscriberCount, androidSubscriberCount, refetch: fetchSubscriberStats };
};
