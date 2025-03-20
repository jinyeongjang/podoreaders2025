import { AnimatePresence } from 'framer-motion';
import { pretendard } from '../lib/fonts';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaUser, FaUserCog, FaTrash, FaSpinner, FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import { RiChat3Fill } from 'react-icons/ri';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { User } from '@supabase/supabase-js';
import FamilyAccessModal from './FamilyAccessModal';
import { GeminiChat } from '../lib/gemini';
import { toast } from 'react-hot-toast';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
  onBackClick?: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Header({
  title = '포도리더스 2025',
  showBackButton = false,
  rightContent,
  onBackClick,
}: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isFamilyAccessModalOpen, setFamilyAccessModalOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatInstance = useRef<GeminiChat | null>(null);

  // 인증 상태 확인 함수
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 로컬 스토리지에서 사용자 정보 확인
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
          setUser({ email: storedEmail } as User);
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          console.log('User confirmed from session:', session.user.email);
          setUser(session.user);
          localStorage.setItem('userEmail', session.user.email || '');
        } else if (!storedEmail) {
          // 세션도 없고 로컬 스토리지에도 없는 경우만 null

          setUser(null);
          localStorage.removeItem('userEmail');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    // 페이지 로드 시 즉시 확인
    checkAuthStatus();

    // 인증 상태 변경 이벤트 리스너
    const handleAuthChange = () => {
      console.log('auth-state-changed event triggered');
      checkAuthStatus();
    };

    window.addEventListener('auth-state-changed', handleAuthChange);

    // Supabase 인증 이벤트 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Supabase auth event:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('SIGNED_IN event detected:', session.user.email);
        setUser(session.user);
        localStorage.setItem('userEmail', session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        console.log('SIGNED_OUT event detected');
        setUser(null);
        localStorage.removeItem('userEmail');
      }
    });

    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
      subscription.unsubscribe();
    };
  }, []);

  // 로그아웃 함수 개선
  const handleSignOut = async () => {
    try {
      // 즉시 UI 업데이트
      setUser(null);
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');

      // Supabase 로그아웃 요청
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        return;
      }

      if (toast) toast.success('로그아웃되었어요');
    } catch (error) {
      console.error('로그아웃에 문제가 있어요:', error);
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
    if (!isChatVisible && chatInstance.current === null) {
      chatInstance.current = new GeminiChat();
      const hasGreeted = localStorage.getItem('hasGreeted');
      if (!hasGreeted) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '안녕하세요! 포도리더스 AI입니다. 무엇을 도와드릴까요?' },
        ]);
        localStorage.setItem('hasGreeted', 'true');
      }
    }
  };

  const handleClearMessages = () => {
    setMessages([{ role: 'assistant', content: '안녕하세요! 포도리더스 AI입니다. 무엇을 도와드릴까요?' }]);
    localStorage.setItem(
      'chatMessages',
      JSON.stringify([{ role: 'assistant', content: '안녕하세요! 포도리더스 AI입니다. 무엇을 도와드릴까요?' }]),
    );
    localStorage.setItem('hasGreeted', 'true');
    chatInstance.current = new GeminiChat();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (chatInstance.current) {
        const response = await chatInstance.current.sendMessage(input);
        const assistantMessage: ChatMessage = { role: 'assistant', content: response };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '죄송합니다. 오류가 발생했어요.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, [user]);

  // 뒤로가기 처리
  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isFamilyAccessModalOpen && (
          <FamilyAccessModal onClose={() => setFamilyAccessModalOpen(false)} onConfirm={handleFamilyAccessConfirm} />
        )}
      </AnimatePresence>

      <header
        className={`sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm ${pretendard.className}`}>
        <div className="container mx-auto max-w-2xl px-4 xs:px-2">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-gray-100"
                  aria-label="뒤로 가기">
                  <FaArrowLeft size={20} />
                </button>
              )}
              <button
                onClick={() => router.push('/')}
                className="text-xl font-bold text-gray-900 hover:underline xs:w-[120px] xs:text-[15px]">
                {title}
              </button>
            </div>
            <div className="flex items-center gap-2">
              {/* 로그인 상태에 따른 버튼 표시 */}
              <div>
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
                    title={`${user.email || '사용자'} (로그아웃)`}>
                    <FaSignOutAlt className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/auth/Login')}
                    className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 xs:px-3">
                    <FaUser className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => router.push('/executiveTestPage')}
                className="flex items-center justify-center gap-2 rounded-lg bg-amber-100 px-4 py-2 text-amber-700 transition-colors hover:bg-amber-200 xs:px-3"
                title="임원 전용 페이지">
                <FaUserShield className="h-5 w-5" />
              </button>

              <button
                onClick={() => router.push('/familyManagement')}
                // onClick={() => setFamilyAccessModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 xs:px-3"
                title="가족원 관리 페이지">
                <FaUserCog className="h-5 w-5" />
              </button>

              {/* <button
                onClick={() => router.push('/developer')}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 xs:px-2"
                title="개발자 소개 페이지">
                <FaCode className="h-5 w-5" />
              </button> */}

              <button
                onClick={handleChatToggle}
                aria-label="채팅 기능 토글"
                className="flex items-center justify-center rounded-lg bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 px-4 py-2 text-lg text-white shadow-lg shadow-sky-500/50 transition-all hover:scale-105 hover:from-sky-500 hover:via-sky-600 hover:to-sky-700 hover:shadow-sky-500/50 active:scale-95 active:from-sky-600 active:via-sky-700 active:to-sky-800 xs:px-3">
                <RiChat3Fill className="h-5 w-5" />
              </button>
              {rightContent}
            </div>
          </div>
        </div>
      </header>
      {isChatVisible && (
        <div className="mt-8 rounded-xl bg-white p-4 shadow-xl xs:mt-4 xs:p-2">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={handleClearMessages}
              className="flex items-center justify-center rounded-xl px-2 py-2 text-yellow-700 transition-all hover:text-yellow-800 xs:h-full xs:px-3">
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
          <div className="mb-4 h-[400px] overflow-y-auto rounded-lg bg-gray-50 p-4 xs:h-[400px] xs:p-2">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800 shadow-md'
                  }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mb-4 flex justify-start">
                <div className="flex max-w-[80%] items-center gap-2 rounded-lg bg-gray-200 p-3 text-gray-800 shadow-md">
                  <FaSpinner className="h-5 w-5 animate-spin text-indigo-500" />
                  <span className="text-sm text-gray-600">메시지를 생성하는 중...</span>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 xs:flex-row xs:gap-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요"
              className="flex-1 rounded-xl border border-gray-300 p-4 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 xs:p-2"
              disabled={isLoading}
            />
            <div className="flex gap-2 xs:gap-0">
              <button
                type="submit"
                disabled={isLoading}
                className="w-[100px] rounded-xl bg-indigo-500 px-6 py-2 text-white transition-all hover:bg-indigo-600 active:bg-indigo-700 disabled:bg-gray-400 xs:w-[100px] xs:px-2 xs:py-2 xs:text-sm">
                전송
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
