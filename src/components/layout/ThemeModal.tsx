import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPalette, FaCheck, FaSun } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useThemeStore, Theme } from '../../store/themeStore';

interface ThemeModalProps {
  onClose: () => void;
}

// 테마 옵션 정의
const themeOptions = [
  {
    id: 'light',
    name: '라이트',
    description: '기본 밝은 테마',
    icon: <FaSun />,
    primaryColor: '#4f46e5',
    bgColor: '#ffffff',
    cardColor: '#ffffff',
    borderColor: '#e5e7eb',
    textColor: '#111827',
  },
  {
    id: 'blue',
    name: '블루',
    description: '차분한 블루 테마',
    primaryColor: '#2563eb',
    bgColor: '#f0f9ff',
    cardColor: '#ffffff',
    borderColor: '#bae6fd',
    textColor: '#0c4a6e',
  },
  {
    id: 'green',
    name: '그린',
    description: '신선한 그린 테마',
    primaryColor: '#10b981',
    bgColor: '#ecfdf5',
    cardColor: '#ffffff',
    borderColor: '#a7f3d0',
    textColor: '#064e3b',
  },
  {
    id: 'amber',
    name: '오렌지',
    description: '따뜻한 오렌지 테마',
    primaryColor: '#f59e0b',
    bgColor: '#fffbeb',
    cardColor: '#ffffff',
    borderColor: '#fde68a',
    textColor: '#92400e',
  },
];

export default function ThemeModal({ onClose }: ThemeModalProps) {
  const { theme, setTheme } = useThemeStore();
  const [currentTheme, setCurrentTheme] = useState<string>('light');
  const [selectedThemeObj, setSelectedThemeObj] = useState(themeOptions[0]);

  // 컴포넌트 마운트 시 현재 테마 가져오기
  useEffect(() => {
    setCurrentTheme(theme);
    setSelectedThemeObj(themeOptions.find((t) => t.id === theme) || themeOptions[0]);
  }, [theme]);

  // 테마 변경 함수
  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    const selectedTheme = themeOptions.find((t) => t.id === themeId) || themeOptions[0];
    setSelectedThemeObj(selectedTheme);
    setTheme(themeId as Theme); // 테마 스토어 업데이트
  };

  // 테마 미리보기 렌더링
  const renderThemePreview = () => (
    <div className="mt-6 xs:mt-4">
      <h4 className="mb-2 flex items-center gap-2 font-medium text-gray-700 xs:mb-1.5 xs:text-sm">
        <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 xs:h-1.5 xs:w-1.5"></span>
        적용될 테마 미리보기 화면이에요.
      </h4>
      <div className="overflow-hidden rounded-lg shadow-md" style={{ background: selectedThemeObj.bgColor }}>
        {/* 헤더 */}
        <div
          className="flex items-center justify-between p-3 xs:p-3"
          style={{
            background: `linear-gradient(to right, ${selectedThemeObj.primaryColor}, ${selectedThemeObj.primaryColor}D0)`,
            color: '#ffffff',
          }}>
          <div className="flex gap-2 xs:gap-1">
            <div className="h-2 w-2 rounded-full bg-white/50 xs:h-1.5 xs:w-1.5"></div>
            <div className="h-2 w-2 rounded-full bg-white/50 xs:h-1.5 xs:w-1.5"></div>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-3 xs:p-2">
          <div
            className="mb-2 rounded-md p-2 shadow-sm xs:mb-1.5 xs:p-1.5"
            style={{
              backgroundColor: selectedThemeObj.cardColor,
              color: selectedThemeObj.textColor,
              borderColor: selectedThemeObj.borderColor,
            }}>
            <div className="flex flex-col gap-2 xs:gap-1">
              <div className="text-xs font-medium xs:text-[10px]">
                <span style={{ opacity: 0.7 }}>선택한 테마:</span> {selectedThemeObj.name}
              </div>
              {[100, 150, 200].map((width, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full xs:h-1"
                  style={{
                    width: `${width}px`,
                    background: `${selectedThemeObj.primaryColor}40`,
                  }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderThemeOptionCard = (theme: (typeof themeOptions)[0], isSelected: boolean) => (
    <motion.button
      key={theme.id}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => changeTheme(theme.id)}
      className={`relative flex flex-col items-center rounded-xl border p-3 transition-all xs:p-2 ${
        isSelected
          ? 'border-2 border-indigo-500 bg-indigo-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}>
      {/* 테마 아이콘 */}
      <div
        className="mb-2 flex h-12 w-12 items-center justify-center rounded-full shadow-md xs:mb-1 xs:h-10 xs:w-10"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.primaryColor}DD)`,
          color: '#ffffff',
        }}>
        {theme.icon}
      </div>

      {/* 테마 이름 */}
      <span className="text-sm font-medium text-gray-800 xs:text-xs">{theme.name}</span>

      {/* 테마 설명 (작은 글씨) - 모바일에서 숨김 */}
      <span className="mt-1 line-clamp-1 text-center text-xs text-gray-500 xs:hidden">{theme.description}</span>

      {/* 선택 표시 - 오른쪽 상단 배지 */}
      {isSelected && (
        <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 shadow-lg xs:h-5 xs:w-5">
          <FaCheck className="h-3 w-3 text-white xs:h-2.5 xs:w-2.5" />
        </div>
      )}

      {/* 테마 하단 색상 미리보기 */}
      <div className="mt-2 flex w-full gap-1 xs:mt-1 xs:gap-0.5">
        <div className="h-2 flex-1 rounded-full xs:h-1.5" style={{ backgroundColor: theme.primaryColor }} />
        <div
          className="h-2 flex-1 rounded-full border border-gray-200 xs:h-1.5"
          style={{ backgroundColor: theme.bgColor }}
        />
        <div className="h-2 flex-1 rounded-full xs:h-1.5" style={{ backgroundColor: theme.textColor }} />
      </div>
    </motion.button>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl xs:max-h-[90vh] xs:overflow-auto">
        {/* 헤더 */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 xs:px-4 xs:py-3"
          style={{
            background: `linear-gradient(to right, ${selectedThemeObj.primaryColor}BB, ${selectedThemeObj.primaryColor}80)`,
            color: '#ffffff',
          }}>
          <div className="flex items-center gap-3 xs:gap-2">
            <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm xs:p-1.5">
              <FaPalette className="h-5 w-5 text-white xs:h-4 xs:w-4" />
            </div>
            <h3 className="text-lg font-semibold text-white xs:text-base">테마 설정-beta</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:text-white xs:p-1">
            <IoMdClose className="h-5 w-5 xs:h-4 xs:w-4" />
          </button>
        </div>

        {/* 테마 그리드 */}
        <div className="px-6 py-4 xs:px-3 xs:py-3">
          <p className="mb-4 text-sm text-gray-600 xs:mb-3 xs:text-xs">색상 테마를 변경할 수 있어요.</p>

          {/* 테마 선택 영역 */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xs:gap-2">
            {themeOptions.map((theme) => renderThemeOptionCard(theme, currentTheme === theme.id))}
          </div>

          {/* 테마 미리보기 */}
          {renderThemePreview()}
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4 xs:p-3">
          <button
            onClick={onClose}
            className="w-full rounded-lg px-4 py-4 text-white shadow-sm transition-colors xs:py-4 xs:text-sm"
            style={{
              background: `linear-gradient(to right, ${selectedThemeObj.primaryColor}, ${selectedThemeObj.primaryColor}CC)`,
            }}>
            확인
          </button>
        </div>
      </motion.div>
    </div>
  );
}
