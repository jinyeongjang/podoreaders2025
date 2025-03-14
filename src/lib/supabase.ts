import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // 세션 지속성 비활성화
      autoRefreshToken: false, // 토큰 자동 갱신 비활성화
    },
    global: {
      headers: {
        'X-Client-Info': 'client', // 최소한의 정보만 전송
      },
    },
  });
};

export const supabase = getSupabaseClient();

export interface Prayer {
  id: number;
  title: string;
  content: string;
  author: string;
  password?: string;
  is_answered: boolean;
  answered_at?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  likes?: number;
  prayers?: number;
}

export interface PrayerInput {
  title: string;
  content: string;
  author: string;
}

export interface QTRecord {
  id: number;
  user_id: string;
  record_date: string;
  content: string;
  created_at: string;
}

export interface QTCheck {
  id: string;
  user_id: string;
  title: string;
  description: string;
  word_count: number;
  qt_count: number;
  date: string;
  created_at: string;
}

// prayerAPI 정의
export const prayerAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('prayers') // 'prayers' 데이터베이스 테이블
      .select('*');

    if (error) throw new Error(error.message);
    return data;
  },
  getById: async (id: number) => {
    const { data, error } = await supabase.from('prayers').select('*').eq('id', id).single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
  create: async (prayer: PrayerInput) => {
    // Supabase에 기도제목 추가
    const { data, error } = await supabase.from('prayers').insert([prayer]);

    if (error) {
      throw error;
    }

    return data;
  },
  delete: async (id: number) => {
    const { data, error } = await supabase.from('prayers').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return data;
  },
  update: async (id: number, updates: Partial<Prayer>) => {
    const { data, error } = await supabase.from('prayers').update(updates).eq('id', id);

    if (error) {
      throw error;
    }

    return data;
  },
};
