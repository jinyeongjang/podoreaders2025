import { create } from 'zustand';
import { supabase } from '../utils/supabase';

// 카카오 사용자 정보 인터페이스 정의
interface KakaoUserMetadata {
  id?: string;
  properties?: {
    nickname?: string;
    profile_image?: string;
    thumbnail_image?: string;
    [key: string]: string | undefined;
  };
  kakao_account?: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
      thumbnail_image_url?: string;
      [key: string]: string | undefined;
    };
    has_email?: boolean;
    email_needs_agreement?: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;

    [key: string]:
      | string
      | boolean
      | undefined
      | {
          nickname?: string;
          profile_image_url?: string;
          thumbnail_image_url?: string;
          [key: string]: string | undefined;
        };
  };
  [key: string]: unknown;
}

interface KakaoAuthState {
  // 상태
  kakaoUserInfo: KakaoUserMetadata | null;

  // 액션
  signInWithKakao: (redirectUrl?: string) => Promise<void>;
  clearKakaoInfo: () => void;
  ensureKakaoLogout: () => void; // 새 함수 추가
}

export const useKakaoAuthStore = create<KakaoAuthState>()((set) => ({
  kakaoUserInfo: null,

  signInWithKakao: async (redirectUrl) => {
    try {
      console.log('Starting Kakao OAuth login...');

      // 리디렉션 URL 결정
      const callbackUrl = redirectUrl || `${window.location.origin}/auth/callback`;
      console.log('Using callback URL:', callbackUrl);

      // Supabase OAuth 로그인 시작
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Kakao login error:', error);
      throw error;
    }
  },

  clearKakaoInfo: () => {
    set({ kakaoUserInfo: null });
  },

  // 카카오 로그아웃이 확실하게 이루어지도록 하는 함수
  ensureKakaoLogout: () => {
    set({ kakaoUserInfo: null });

    // 카카오 관련 로컬 스토리지 항목도 정리
    const keysToRemove = Object.keys(localStorage).filter((key) => key.includes('kakao') || key.includes('Kakao'));

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      console.log('카카오 관련 스토리지 항목 제거:', key);
    });
  },
}));

// Kakao 로그인 성공 시 사용자 메타데이터 저장
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const provider = session.user.app_metadata?.provider;

    if (provider === 'kakao') {
      // 타입 안전하게 사용자 메타데이터 저장
      const metadata = session.user.user_metadata as KakaoUserMetadata;
      useKakaoAuthStore.getState().kakaoUserInfo = metadata;
    }
  } else if (event === 'SIGNED_OUT') {
    // 로그아웃 시 확실하게 카카오 정보도 정리
    useKakaoAuthStore.getState().ensureKakaoLogout();
  }
});
