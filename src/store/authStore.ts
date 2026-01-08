import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

// 사용자 정보 인터페이스
interface UserInfo {
  nickname: string;
  profileImage: string | null;
  email: string;
  provider: string;
  id?: string;
}

interface AuthState {
  user: User | null;
  userInfo: UserInfo | null;
  isLoading: boolean;
  authError: AuthError | null;

  // 액션
  setUser: (user: User | null) => void;
  setAuthError: (error: AuthError | null) => void;
  extractUserInfo: (user: User) => void;
  signOut: () => Promise<boolean>;
  checkSession: () => Promise<User | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      userInfo: null,
      isLoading: false,
      authError: null,

      setUser: (user) => set({ user }),

      setAuthError: (error) => set({ authError: error }),

      extractUserInfo: (user) => {
        if (!user) return;

        const provider = user.app_metadata?.provider;
        const userInfo: UserInfo = {
          nickname: '',
          profileImage: null,
          email: user.email || '',
          provider: provider || '',
          id: user.id,
        };

        // 제공자별 사용자 정보 추출
        if (provider === 'google') {
          // 구글 사용자 정보 추출 로직
          const { name, picture, email, given_name } = user.user_metadata || {};

          // 닉네임 설정 (name > given_name > 이메일 앞부분 > 기본값)
          userInfo.nickname = name || given_name || email?.split('@')[0] || user.email?.split('@')[0] || '구글 사용자';

          // 프로필 이미지
          userInfo.profileImage = picture || null;

          console.log('구글 로그인 정보 추출:', {
            name,
            email,
            picture,
            metadata: user.user_metadata,
            provider,
          });
        } else if (provider === 'kakao') {
          const { properties, kakao_account } = user.user_metadata || {};
          userInfo.nickname = properties?.nickname || kakao_account?.profile?.nickname || '카카오 사용자';

          // 프로필 이미지가 있는 경우에만 설정
          if (properties?.profile_image || kakao_account?.profile?.profile_image_url) {
            userInfo.profileImage = properties?.profile_image || kakao_account?.profile?.profile_image_url || null;
          }

          userInfo.email = kakao_account?.email || userInfo.email;

          console.log('카카오 로그인 정보 추출:', {
            nickname: userInfo.nickname,
            email: userInfo.email,
            profileImage: userInfo.profileImage,
            metadata: user.user_metadata,
            provider,
          });
        }

        set({ userInfo });
        console.log('사용자 정보 추출 완료:', userInfo);
      },

      signOut: async () => {
        try {
          set({ isLoading: true, authError: null });

          // Supabase 로그아웃 요청
          const { error } = await supabase.auth.signOut();

          if (error) {
            console.error('로그아웃 오류:', error);
            set({ authError: error });
            return false;
          }

          // 상태 초기화 (명시적으로 모든 관련 상태 초기화)
          set({ user: null, userInfo: null, authError: null });
          console.log('로그아웃 성공, 상태 초기화 완료');

          // 로컬 스토리지 정리 (Zustand persist 캐시도 포함)
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');

          // Supabase가 사용하는 로컬 스토리지 항목도 확인하여 제거
          localStorage.removeItem('supabase.auth.token');

          // 세션 스토리지도 정리
          sessionStorage.clear();

          // 추가 Supabase 로그아웃 시도 (이중 로그아웃)
          try {
            await supabase.auth.signOut({ scope: 'global' });
          } catch (e) {
            console.log('추가 로그아웃 시도 중 오류 (무시):', e);
          }

          return true; // 로그아웃 성공 반환
        } catch (error) {
          console.error('로그아웃 예외:', error);
          return false; // 로그아웃 실패 반환
        } finally {
          set({ isLoading: false });
        }
      },

      checkSession: async () => {
        try {
          set({ isLoading: true, authError: null });

          // Supabase 세션 확인
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            console.error('세션 확인 오류:', error);
            set({ authError: error, isLoading: false });
            return null;
          }

          const user = data.session?.user || null;

          // 사용자 정보가 있는 경우
          if (user) {
            console.log('세션에서 사용자 확인됨:', user.email);
            set({ user });
            get().extractUserInfo(user);

            // 사용자 메타데이터가 없는 경우 기본 정보 생성
            if (!user.user_metadata || Object.keys(user.user_metadata).length === 0) {
              console.log('사용자 메타데이터 없음, 기본 정보 생성');
              get().extractUserInfo({
                ...user,
                user_metadata: {
                  name: user.email?.split('@')[0] || '사용자',
                  provider: user.app_metadata?.provider || 'unknown',
                },
              });
            }

            return user;
          }

          // 세션은 없지만 현재 스토어에 사용자 정보가 있으면 유지
          const currentUser = get().user;
          if (currentUser) {
            console.log('세션은 없지만 스토어에 사용자 있음:', currentUser.email);
            return currentUser;
          }

          // 사용자 정보 없음, 상태 초기화
          set({ user: null, userInfo: null });
          return null;
        } catch (error) {
          console.error('세션 확인 예외:', error);
          set({ isLoading: false });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      // 로컬 스토리지에 저장할 필드 선택 (민감하지 않은 정보만)
      partialize: (state) => ({
        userInfo: state.userInfo,
      }),
    },
  ),
);

// Supabase 인증 상태 변화 감지 및 전역 상태 업데이트
supabase.auth.onAuthStateChange((event, session) => {
  // console.log('Supabase 인증 상태 변경:', event);

  if (event === 'SIGNED_IN' && session?.user) {
    // 로그인 성공
    useAuthStore.getState().setUser(session.user);
    useAuthStore.getState().extractUserInfo(session.user);
    useAuthStore.getState().setAuthError(null);
  } else if (event === 'SIGNED_OUT') {
    // 로그아웃 - 확실하게 상태 초기화
    // console.log('SIGNED_OUT 이벤트 감지, 상태 초기화');
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setAuthError(null);
    // userInfo도 명시적으로 초기화
    const state = useAuthStore.getState();
    state.userInfo = null;
  } else if (event === 'TOKEN_REFRESHED' && session?.user) {
    // 토큰 갱신
    useAuthStore.getState().setUser(session.user);
  } else if (event === 'USER_UPDATED' && session?.user) {
    // 사용자 정보 업데이트
    useAuthStore.getState().setUser(session.user);
    useAuthStore.getState().extractUserInfo(session.user);
  }
});
