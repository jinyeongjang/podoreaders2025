import { AnimatePresence, motion } from 'framer-motion';
import { pretendard } from '../../lib/fonts';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaUser, FaSignOutAlt, FaBars, FaTimes, FaUniversity } from 'react-icons/fa';
import { RiChat3Fill } from 'react-icons/ri';
import { useState, useEffect, useCallback } from 'react';
import FamilyAccessModal from '../FamilyAccessModal';
import { toast } from 'react-hot-toast';
import Chat from '../Chat';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../utils/supabase';
import Image from 'next/image';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
  onBackClick?: () => void;
}

export default function Header({
  title = '포도리더스',
  showBackButton = false,
  rightContent,
  onBackClick,
}: HeaderProps) {
  const router = useRouter();
  const { user, signOut, checkSession, setUser, userInfo } = useAuthStore();
  const [isFamilyAccessModalOpen, setFamilyAccessModalOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const [mounted, setMounted] = useState(false);

  // 세션 상태 확인 함수 - 여러 곳에서 재사용
  const refreshAuthState = useCallback(async () => {
    try {
      // 직접 세션 확인 (더 즉각적인 업데이트)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        console.log('Session found in refreshAuthState:', session.user.email);
        setUser(session.user);
        // 강제 리렌더링 트리거
        setForceRender((prev) => prev + 1);
        return true;
      } else {
        // Zustand 스토어의 checkSession 사용
        const result = await checkSession();
        if (result) {
          // 강제 리렌더링 트리거
          setForceRender((prev) => prev + 1);
        }
        return !!result;
      }
    } catch (error) {
      console.error('Error refreshing auth state:', error);
      return false;
    }
  }, [checkSession, setUser]);

  // 로그인 성공 이벤트 핸들러 - 별도 함수로 분리
  const handleLoginSuccessEvent = useCallback(() => {
    console.log('Login success event received!');
    // 즉시 세션 상태 새로고침
    refreshAuthState();

    // 새로고침이 빠르게 반영되도록 강제 리렌더링 트리거
    setForceRender((prev) => prev + 1);
  }, [refreshAuthState]);

  // 컴포넌트 마운트 시 실행 - 초기 상태 확인 및 이벤트 리스너 등록
  useEffect(() => {
    // 초기 상태 확인
    refreshAuthState();

    // 페이지 포커스될 때 세션 다시 확인
    const handleFocus = () => refreshAuthState();

    // 이벤트 리스너 등록 - 로그인 컴포넌트와의 실시간 통신
    window.addEventListener('focus', handleFocus);
    window.addEventListener('login-success-event', handleLoginSuccessEvent); // 새 이벤트 리스너
    window.addEventListener('user-login-success', handleLoginSuccessEvent);
    window.addEventListener('auth-state-changed', handleLoginSuccessEvent);

    // Supabase 인증 상태 변경 이벤트 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        // 강제 리렌더링 트리거
        setForceRender((prev) => prev + 1);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(session.user);
        // 강제 리렌더링 트리거
        setForceRender((prev) => prev + 1);
      }
    });

    // URL 쿼리 파라미터에 login_success가 있는지 확인
    if (window.location.search.includes('login_success=true')) {
      console.log('Login success flag detected in URL, refreshing auth state');
      refreshAuthState();
    }

    setMounted(true);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('login-success-event', handleLoginSuccessEvent);
      window.removeEventListener('user-login-success', handleLoginSuccessEvent);
      window.removeEventListener('auth-state-changed', handleLoginSuccessEvent);
      subscription.unsubscribe();
    };
  }, [refreshAuthState, handleLoginSuccessEvent, setUser]);

  // forceRender 상태가 변경될 때 로그 출력 (디버깅용)
  useEffect(() => {
    if (forceRender > 0) {
      console.log(`Forced re-render #${forceRender} with user:`, user?.email || 'none');
    }
  }, [forceRender, user]);

  // 로그아웃 핸들러
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('로그아웃되었습니다');
      router.push('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const handleFamilyAccessConfirm = (password: string) => {
    if (password === '2025') {
      setFamilyAccessModalOpen(false);
      router.push('/familyManagement');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleChatToggle = () => {
    setIsChatVisible(!isChatVisible);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  // 사용자 이름 가져오기 함수 추가
  const getUserDisplayName = () => {
    if (!user) return null;

    // 1. 카카오 로그인인 경우 메타데이터에서 user_name 확인
    if (user.app_metadata?.provider === 'kakao' && user.user_metadata?.user_name) {
      return user.user_metadata.user_name;
    }

    // 2. userInfo에서 nickname 사용
    if (userInfo?.nickname) {
      return userInfo.nickname;
    }

    // 3. 기본값으로 이메일 앞부분 사용
    return user.email ? user.email.split('@')[0] : '사용자';
  };

  // 사용자 프로필 이미지 렌더링 컴포넌트
  const renderProfileImage = () => {
    if (!user) return null;

    // 1. 카카오 로그인인 경우 메타데이터에서 avatar_url 확인
    const kakaoAvatarUrl = user.app_metadata?.provider === 'kakao' ? user.user_metadata?.avatar_url : null;

    // 2. 기존 userInfo에서 프로필 이미지 가져오기
    const profileImage = kakaoAvatarUrl || userInfo?.profileImage;

    if (profileImage) {
      return (
        <div className="mr-2 h-8 w-8 overflow-hidden rounded-full border border-gray-200 shadow-sm">
          {/* <img> 태그 대신 Next.js의 <Image> 컴포넌트 사용 */}
          <Image
            src={profileImage}
            alt="사용자 프로필"
            width={32}
            height={32}
            className="h-full w-full object-cover"
            unoptimized={profileImage.includes('googleusercontent.com') || profileImage.includes('kakaocdn.net')}
            onError={(e) => {
              // 이미지 로드 실패 시 기본 아이콘으로 대체 (이벤트 핸들러 변경)
              const target = e.target as HTMLImageElement;
              // 에러 이벤트를 감지한 후 부모 요소에 처리
              const parent = target.parentElement;
              if (parent) {
                // 이미지 요소 숨기기 (display:none 대신 제거)
                parent.innerHTML = '';
                // 부모 요소 스타일 및 아이콘 추가
                parent.classList.add('flex', 'items-center', 'justify-center', 'bg-indigo-100');
                const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                iconSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                iconSvg.setAttribute('viewBox', '0 0 24 24');
                iconSvg.setAttribute('fill', 'currentColor');
                iconSvg.setAttribute('class', 'h-5 w-5 text-indigo-600');

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('fill-rule', 'evenodd');
                path.setAttribute(
                  'd',
                  'M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z',
                );
                path.setAttribute('clip-rule', 'evenodd');

                iconSvg.appendChild(path);
                parent.appendChild(iconSvg);
              }
            }}
          />
        </div>
      );
    }

    // 프로필 이미지가 없는 경우 기본 아이콘 표시
    return (
      <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <FaUser size={16} />
      </div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isFamilyAccessModalOpen && (
          <FamilyAccessModal onClose={() => setFamilyAccessModalOpen(false)} onConfirm={handleFamilyAccessConfirm} />
        )}
      </AnimatePresence>

      <header
        className={`pt-safe sticky top-0 z-20 border-b border-gray-100/30 bg-white/70 shadow-sm backdrop-blur-lg backdrop-saturate-150 ${pretendard.className}`}>
        <div className="container mx-auto w-full max-w-2xl px-0 py-0 xs:px-3 xs:py-0">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBackClick || (() => router.back())}
                  className="flex items-center justify-center rounded-full bg-white/80 p-2 text-gray-500 shadow-sm transition-colors hover:bg-indigo-50"
                  aria-label="뒤로 가기">
                  <FaArrowLeft size={18} className="text-indigo-600" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => router.push(router.pathname.startsWith('/community') ? '/community' : '/')}
                className="text-xl font-bold tracking-tight text-indigo-900 transition-colors hover:text-indigo-600 xs:ml-4 xs:text-[16px]">
                {router.pathname.startsWith('/community') ? '미리내 커뮤니티' : title}
              </motion.button>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              {mounted && user ? (
                <div key={forceRender} className="animate-fadeIn flex items-center gap-2">
                  {/* 프로필 이미지 추가 */}
                  {renderProfileImage()}
                  <span className="mr-2 hidden text-sm font-medium text-gray-600 lg:inline">
                    {getUserDisplayName()}님 반가워요!
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSignOut}
                    className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm font-medium text-indigo-700 shadow-sm transition-all hover:bg-indigo-50"
                    title={`${getUserDisplayName()} (로그아웃)`}>
                    <FaSignOutAlt className="h-4 w-4" />
                    <span>로그아웃</span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/auth/login')}
                  className="flex items-center justify-center gap-2 rounded-lg bg-white/80 px-3 py-2 font-medium text-indigo-700 shadow-sm transition-all hover:bg-indigo-50">
                  <FaUser className="h-3 w-4" />
                  <span>로그인</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/campusSelect')}
                aria-label="캠퍼스"
                className="flex items-center justify-center gap-2 rounded-lg bg-white/80 px-3 py-2 font-medium text-indigo-700 shadow-sm transition-all hover:bg-indigo-50">
                <FaUniversity className="h-4 w-4" />
                <span>캠퍼스</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleChatToggle}
                aria-label="채팅 기능 토글"
                className="flex items-center justify-center gap-2 rounded-lg bg-white/80 px-3 py-2 font-medium text-indigo-700 shadow-sm transition-all hover:bg-indigo-50">
                <RiChat3Fill className="h-4 w-4" />
              </motion.button>

              {rightContent}
            </div>

            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className="rounded-lg bg-white/80 p-2 text-indigo-600 shadow-sm transition-all hover:bg-indigo-50"
                aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}>
                {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full border-t border-indigo-100/30 bg-white/90 shadow-md backdrop-blur-md backdrop-saturate-150 md:hidden">
              <div className="container mx-auto space-y-2 px-4 py-3">
                {mounted && user ? (
                  <div
                    key={forceRender}
                    className="animate-fadeIn mb-2 flex items-center justify-between rounded-lg bg-indigo-50/80 p-2 shadow-sm">
                    <div className="flex items-center gap-2">
                      {/* 모바일 메뉴에도 프로필 이미지 추가 */}
                      {renderProfileImage()}
                      <span className="text-sm font-medium text-indigo-700">{getUserDisplayName()}님</span>
                    </div>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSignOut}
                      className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs text-indigo-700 shadow-sm">
                      <FaSignOutAlt className="h-3 w-3" />
                      <span>로그아웃</span>
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleNavigation('/auth/login')}
                    className="flex w-full items-center gap-3 rounded-lg bg-white/80 px-4 py-2.5 text-left shadow-sm transition-colors hover:bg-indigo-50">
                    <FaUser className="h-4 w-5 text-indigo-600" />
                    <span className="font-medium text-indigo-700">로그인</span>
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleNavigation('/campusSelect')}
                  className="flex w-full items-center gap-3 rounded-lg bg-white/80 px-4 py-2.5 text-left shadow-sm transition-colors hover:bg-indigo-50">
                  <FaUniversity className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-indigo-700">캠퍼스</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {isChatVisible && <Chat onClose={() => setIsChatVisible(false)} />}
    </>
  );
}
