import { useRouter } from 'next/router';
import { FaHome, FaThermometerHalf, FaCode } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import AppInfoModal from './AppInfoModal';

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ label, icon, href, isActive, onClick }: NavItemProps) => {
  // 링크 또는 버튼 컨텐츠
  const content = (
    <div
      className={`flex h-full w-full flex-col items-center justify-center rounded-xl p-1 transition-all ${
        isActive ? 'text-indigo-600' : 'text-gray-500'
      }`}>
      {/* 활성화된 경우 아이콘 아래에 표시되는 인디케이터 */}
      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className="absolute bottom-0 h-1 w-8 rounded-full bg-indigo-600"
          transition={{ type: 'spring', duration: 0.3 }}
        />
      )}

      {/* 아이콘 */}
      <div className="mb-0.5 text-xl">{icon}</div>

      {/* 레이블 */}
      <span className="text-xs font-medium">{label}</span>
    </div>
  );

  // href가 있으면 Link로, 없으면 button으로 렌더링
  if (href) {
    return (
      <Link href={href} className="relative flex flex-col items-center">
        {content}
      </Link>
    );
  } else {
    return (
      <button onClick={onClick} className="relative flex flex-col items-center">
        {content}
      </button>
    );
  }
};

export default function BottomNavbar() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [showAppInfo, setShowAppInfo] = useState(false);

  // 네비게이션 아이템에 말씀온도 메뉴 추가
  const navItems = [
    { label: '홈', icon: <FaHome />, href: '/' },
    { label: '말씀온도 계산기', icon: <FaThermometerHalf />, href: '/temperatureCalculator' },
    { label: '포도리더스', icon: <FaCode />, onClick: () => setShowAppInfo(true) },
  ];

  return (
    <>
      <div className="fixed bottom-0 z-50 w-full">
        {/* 불투명 배경 효과를 위한 블러 레이어 */}
        <div className="absolute inset-0 border-t border-gray-200 bg-white/80 backdrop-blur-lg"></div>

        {/* 메인 내비게이션 바 - 3개 아이템으로 grid-cols-3 변경 */}
        <nav className="relative grid h-16 grid-cols-3">
          {navItems.map((item, index) => (
            <NavItem
              key={item.label || index}
              label={item.label}
              icon={item.icon}
              href={item.href}
              isActive={item.href ? currentPath === item.href : false}
              onClick={item.onClick}
            />
          ))}
        </nav>

        {/* iOS 홈 인디케이터 영역 safe-margin */}
        <div className="h-safe-bottom bg-white/80"></div>
      </div>

      {/* 앱 정보 모달 */}
      <AnimatePresence>{showAppInfo && <AppInfoModal onClose={() => setShowAppInfo(false)} />}</AnimatePresence>
    </>
  );
}
