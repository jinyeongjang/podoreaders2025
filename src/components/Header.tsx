import { AnimatePresence } from 'framer-motion';
import { pretendard } from '../lib/fonts';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaUser, FaUserCog, FaTrash, FaSpinner, FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import { RiChat3Fill } from 'react-icons/ri';
import FamilyAccessModal from './FamilyAccessModal';
import { useAuth } from '../hooks/useAuth';
import { useHeaderChat } from '../hooks/useHeaderChat';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
}

export default function Header({ title = '포도리더스 2025', showBackButton = false, rightContent }: HeaderProps) {
  const router = useRouter();
  const { user, handleSignOut } = useAuth();
  const {
    isFamilyAccessModalOpen,
    setFamilyAccessModalOpen,
    handleFamilyAccessConfirm,
    isChatVisible,
    handleChatToggle,
    handleClearMessages,
    handleSubmit,
    messages,
    input,
    setInput,
    isLoading,
  } = useHeaderChat();

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
                  onClick={() => router.back()}
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
                className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 xs:px-3"
                title="가족원 관리 페이지">
                <FaUserCog className="h-5 w-5" />
              </button>

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
