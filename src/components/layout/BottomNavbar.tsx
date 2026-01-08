import { useRouter } from 'next/router';
import { FaHome, FaThermometerHalf } from 'react-icons/fa';
import { MdOutlineColorLens } from 'react-icons/md';
import { IoCodeSlashOutline } from 'react-icons/io5';
import { GoPeople } from 'react-icons/go';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import AppInfoModal from './AppInfoModal';
import ThemeModal from './ThemeModal';

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ label, icon, href, isActive, onClick }: NavItemProps) => {
  const content = (
    <div
      className={`flex h-full w-full flex-col items-center justify-center rounded-xl p-1 transition-all ${
        isActive ? 'text-indigo-600' : 'text-gray-500'
      }`}>
      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className="absolute bottom-0 h-1 w-8 rounded-full bg-indigo-600"
          transition={{ type: 'spring', duration: 0.3 }}
        />
      )}
      <div className="mb-0.5 text-xl">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );

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
  const [showThemeModal, setShowThemeModal] = useState(false);

  const navItems = [
    { label: '홈', icon: <FaHome />, href: '/' },
    { label: '말씀온도계', icon: <FaThermometerHalf />, href: '/temperatureCalculator' },
    { label: '테마설정', icon: <MdOutlineColorLens />, onClick: () => setShowThemeModal(true) },
    { label: '캠퍼스설정', icon: <GoPeople />, onClick: () => router.push('/campusSelect') },
    { label: '개발자정보', icon: <IoCodeSlashOutline />, onClick: () => setShowAppInfo(true) },
  ];

  return (
    <>
      <div className="fixed bottom-0 z-50 w-full">
        <div className="absolute inset-0 border-t border-gray-200 bg-white/80 backdrop-blur-lg"></div>
        <nav className="relative grid h-16 grid-cols-5">
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
        <div className="h-safe-bottom bg-white/80"></div>
      </div>

      <AnimatePresence>{showAppInfo && <AppInfoModal onClose={() => setShowAppInfo(false)} />}</AnimatePresence>
      <AnimatePresence>{showThemeModal && <ThemeModal onClose={() => setShowThemeModal(false)} />}</AnimatePresence>
    </>
  );
}
