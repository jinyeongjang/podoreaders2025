import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수 로깅 - 디버깅 목적으로 추가
// console.log('Supabase Environment Check:', {
//   url: supabaseUrl ? 'URL 설정됨' : 'URL 없음',
//   key: supabaseAnonKey ? 'KEY 설정됨' : 'KEY 없음',
//   siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '사이트 URL 없음',
//   nodeEnv: process.env.NODE_ENV,
// });

// if (!supabaseUrl || !supabaseAnonKey) {
//   console.error('Supabase credentials are missing. Make sure environment variables are set correctly.');
// }

// 환경에 따른 로깅 추가
// if (typeof window !== 'undefined') {
//   console.log('Initializing Supabase client in:', {
//     environment: process.env.NODE_ENV,
//     hostname: window.location.hostname,
//     isProduction: window.location.hostname !== 'localhost',
//   });
// }

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'podoreaders-auth-storage',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

// 간단한 로그인 상태 확인 헬퍼 함수 추가
export const checkAuthState = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }

    return {
      isAuthenticated: !!data.session,
      user: data.session?.user || null,
    };
  } catch (error) {
    console.error('Auth state check failed:', error);
    return { isAuthenticated: false, user: null };
  }
};
