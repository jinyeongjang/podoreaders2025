import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  IoSettingsOutline,
  IoNotificationsOutline,
  IoDownloadOutline,
  IoRefreshOutline,
  IoTrashOutline,
  IoCheckmarkCircle,
  IoInformationCircleOutline,
  IoCodeSlashOutline,
  IoChevronForwardOutline,
  IoImageOutline,
} from 'react-icons/io5';

import Header from '@/components/layout/Header';
import AppInfoModal from '@/components/layout/AppInfoModal';
import { usePwaSettings } from '@/hooks/usePwaSettings';
import Link from 'next/link';
import { SimplePushToggle } from '@/components/pwa/SimplePushToggle';

const SettingsSection = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) => (
  <section className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-6 shadow-2xl shadow-indigo-100/20 backdrop-blur-xl transition-all hover:bg-white/80">
    <h2 className="mb-5 flex items-center gap-2.5 text-lg font-bold tracking-tight text-gray-800">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100">
        <Icon size={20} />
      </div>
      {title}
    </h2>
    {children}
  </section>
);

const SettingItem = ({
  label,
  description,
  icon: Icon,
  action,
  status,
  disabled = false,
}: {
  label: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  action?: () => void;
  status?: React.ReactNode;
  disabled?: boolean;
}) => (
  <div
    onClick={!disabled ? action : undefined}
    className={`flex items-center justify-between rounded-2xl p-4 transition-all ${
      action && !disabled ? 'cursor-pointer bg-gray-50/50 hover:bg-indigo-50/50 active:scale-[0.98]' : 'bg-gray-50/30'
    }`}>
    <div className="flex items-center gap-3">
      {Icon && <Icon size={20} className="text-gray-400" />}
      <div>
        <p className="text-[14px] font-bold text-gray-700">{label}</p>
        {description && <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400">{description}</p>}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {status}
      {action && !disabled && <IoChevronForwardOutline size={16} className="text-gray-300" />}
    </div>
  </div>
);

const PwaSettingsPage = () => {
  const [mounted, setMounted] = useState(false);
  const [showAppInfo, setShowAppInfo] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [cacheCount, setCacheCount] = useState<number>(0);

  const { isStandalone, canInstall, isInstalled, installApp, clearAppCache, checkUpdate } = usePwaSettings();

  useEffect(() => {
    setMounted(true);
    calculateCacheSize();
  }, []);

  // 캐시 크기 계산
  const calculateCacheSize = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        let totalSize = 0;
        let totalCount = 0;

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          totalCount += requests.length;

          // 대략적인 크기 추정
          for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              totalSize += blob.size;
            }
          }
        }

        setCacheSize(totalSize);
        setCacheCount(totalCount);
      } catch (error) {
        console.error('Failed to calculate cache size:', error);
      }
    }
  };

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast.success('설치가 시작되었습니다!');
    } else {
      toast.error('설치할 수 없는 상태에요. 브라우저 메뉴의 [홈 화면에 추가]를 사용해 주세요.');
    }
  };

  const handleClearCache = async () => {
    const confirmClear = window.confirm('앱 캐시를 초기화하시겠습니까? 데이터 최신화를 위해 앱이 재시작됩니다.');
    if (confirmClear) {
      const success = await clearAppCache();
      if (success) {
        toast.success('캐시가 삭제되었습니다.');
        setCacheSize(0);
        setCacheCount(0);

        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }
        }

        setTimeout(() => window.location.reload(), 1000);
      }
    }
  };

  const handleHardReset = async () => {
    const confirmReset = window.confirm(
      'PWA 설정을 완전히 초기화하시겠습니까? 모든 설정이 기본값으로 돌아가며 앱이 새로 고침됩니다.',
    );
    if (confirmReset) {
      localStorage.removeItem('pwa_reset_v1');
      localStorage.removeItem('pwa_redirect_path');
      localStorage.removeItem('pwa_redirect_time');

      await handleClearCache();
    }
  };

  const handleUpdateCheck = async () => {
    setIsRefreshing(true);
    const result = await checkUpdate();
    setTimeout(() => {
      setIsRefreshing(false);
      if (result) {
        toast.success('새 업데이트를 확인 중입니다...');
      } else {
        toast.success('현재 최신 버전을 사용 중입니다.');
      }
    }, 1200);
  };

  // Hydration 방지
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-indigo-500 border-t-transparent shadow-sm" />
          <p className="text-[14px] font-medium text-indigo-400">설정 로딩 중...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32">
      <Head>
        <title>앱 설정 | 포도리더스 2025</title>
      </Head>

      <Header title="앱 설정" showBackButton={true} />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="container mx-auto max-w-2xl px-5 py-8">
        <div className="space-y-8">
          {/* Header Title Section */}
          <div className="flex flex-col gap-1 px-1">
            <h1 className="text-2xl font-black tracking-tight text-gray-900">시스템 설정</h1>
            <p className="text-[13px] font-medium text-gray-400">PWA 환경 및 알림 권한을 관리합니다.</p>
          </div>

          {/* App Installation Section */}
          <SettingsSection title="애플리케이션 설치" icon={IoDownloadOutline}>
            <div className="space-y-4">
              <SettingItem
                label="현재 상태"
                description={
                  isStandalone
                    ? '홈 화면에서 안정적으로 실행 중'
                    : isInstalled
                      ? '설치 완료됨'
                      : '브라우저 모드로 실행 중'
                }
                status={
                  isStandalone || isInstalled ? (
                    <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-600 ring-1 ring-green-100">
                      <IoCheckmarkCircle size={14} /> 최적화됨
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-600 ring-1 ring-amber-100">
                      <IoInformationCircleOutline size={14} /> 설치 가능
                    </div>
                  )
                }
              />

              {!isStandalone && (
                <button
                  onClick={handleInstall}
                  disabled={!canInstall}
                  className={`relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-[22px] py-5 font-black transition-all active:scale-[0.98] ${
                    canInstall
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-200 hover:from-indigo-700 hover:to-indigo-800'
                      : 'cursor-not-allowed bg-gray-100/80 text-gray-400'
                  }`}>
                  <IoDownloadOutline size={20} className={canInstall ? 'animate-bounce' : ''} />
                  <span>{canInstall ? '포도리더스 앱 설치' : '현재 설치 불가'}</span>
                </button>
              )}

              {!canInstall && !isStandalone && (
                <div className="rounded-2xl bg-indigo-50/50 p-4 text-[12px] leading-relaxed text-indigo-700/80 ring-1 ring-indigo-100/50">
                  <p className="font-bold">iOS(아이폰) 사용자 안내:</p>
                  <p className="mt-1 opacity-80">
                    사파리 브라우저 하단의 [공유] 단추를 누른 후 **&quot;홈 화면에 추가&quot;**를 선택하면 앱으로 바로
                    설치되어 더 쾌적하게 이용하실 수 있습니다.
                  </p>
                </div>
              )}
            </div>
          </SettingsSection>

          {/* Push Notifications Section */}
          <SettingsSection title="푸시 알림 제어" icon={IoNotificationsOutline}>
            <div className="space-y-4">
              <SimplePushToggle />
            </div>
          </SettingsSection>

          {/* Cache Statistics Section */}
          <SettingsSection title="캐시 통계" icon={IoSettingsOutline}>
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50/50 p-4 ring-1 ring-slate-100">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-bold text-gray-700">캐시 크기</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">저장된 데이터 용량</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-indigo-600">{(cacheSize / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-[10px] text-gray-500">{cacheCount}개 항목</p>
                  </div>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${Math.min((cacheSize / (50 * 1024 * 1024)) * 100, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-center text-[10px] text-gray-400">권장 용량: 50MB 이하</p>
              </div>
            </div>
          </SettingsSection>

          {/* 3. System Maintenance Section */}
          <SettingsSection title="시스템 및 정보" icon={IoSettingsOutline}>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/admin/push-sender"
                className="group col-span-2 flex flex-col items-center justify-center gap-3 rounded-2xl bg-indigo-600/5 py-6 text-indigo-600 ring-1 ring-indigo-100 transition-all hover:bg-indigo-600 hover:text-white hover:shadow-xl hover:shadow-indigo-200 active:scale-95">
                <div className="rounded-full bg-white p-2 shadow-sm transition-colors group-hover:bg-white/20">
                  <IoNotificationsOutline size={22} className="group-hover:text-white" />
                </div>
                <div className="text-center">
                  <span className="block text-[13px] font-black uppercase tracking-wider">Push Message Center</span>
                  <span className="mt-0.5 block text-[10px] font-bold opacity-60 group-hover:opacity-90">
                    실시간 알림 발송 도구
                  </span>
                </div>
              </Link>

              <Link
                href="/admin/icon-studio"
                className="group col-span-2 flex flex-col items-center justify-center gap-3 rounded-2xl bg-emerald-600/5 py-6 text-emerald-600 ring-1 ring-emerald-100 transition-all hover:bg-emerald-600 hover:text-white hover:shadow-xl hover:shadow-emerald-200 active:scale-95">
                <div className="rounded-full bg-white p-2 shadow-sm transition-colors group-hover:bg-white/20">
                  <IoImageOutline size={22} className="group-hover:text-white" />
                </div>
                <div className="text-center">
                  <span className="block text-[13px] font-black uppercase tracking-wider">PWA Icon Studio</span>
                  <span className="mt-0.5 block text-[10px] font-bold opacity-60 group-hover:opacity-90">
                    PWA용 모든 아이콘 자동 생성
                  </span>
                </div>
              </Link>

              <button
                onClick={handleUpdateCheck}
                disabled={isRefreshing}
                className="group col-span-3 flex flex-col items-center justify-center gap-3 rounded-2xl bg-gray-50/80 py-6 ring-1 ring-gray-100 transition-all hover:bg-white hover:shadow-lg hover:shadow-gray-200 active:scale-95">
                <div
                  className={`rounded-full bg-indigo-50 p-2 text-indigo-600 transition-transform group-hover:rotate-12 ${isRefreshing ? 'animate-spin' : ''}`}>
                  <IoRefreshOutline size={22} />
                </div>
                <span className="text-[12px] font-bold text-gray-600">업데이트 확인</span>
              </button>

              <button
                onClick={handleClearCache}
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl bg-gray-50/80 py-6 ring-1 ring-gray-100 transition-all hover:bg-white hover:shadow-lg hover:shadow-gray-200 active:scale-95">
                <div className="rounded-full bg-slate-50 p-2 text-slate-500 transition-transform group-hover:-rotate-12">
                  <IoTrashOutline size={22} />
                </div>
                <span className="text-[12px] font-bold text-gray-600">간편 캐시 삭제</span>
              </button>

              <button
                onClick={handleHardReset}
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl bg-red-50/30 py-6 ring-1 ring-red-100/30 transition-all hover:bg-white hover:shadow-lg hover:shadow-red-50 active:scale-95">
                <div className="rounded-full bg-red-50 p-2 text-red-500 transition-transform group-hover:rotate-12">
                  <IoRefreshOutline size={22} />
                </div>
                <span className="text-[12px] font-bold text-red-600">전체 초기화</span>
              </button>

              <button
                onClick={() => setShowAppInfo(true)}
                className="group col-span-2 flex items-center justify-center gap-2.5 rounded-2xl bg-white py-5 shadow-lg shadow-gray-200/50 ring-1 ring-gray-100 transition-all hover:bg-gray-50 active:scale-[0.99]">
                <IoCodeSlashOutline className="text-gray-400 transition-colors group-hover:text-indigo-500" size={20} />
                <span className="text-[13px] font-bold text-gray-600">포도리더스 버전 및 개발자 정보</span>
              </button>
            </div>
          </SettingsSection>

          {/* Build Tag */}
          <div className="flex items-center justify-center gap-6 px-4 py-6 opacity-30 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0">
            <div className="flex flex-col items-center gap-1">
              <p className="text-[8px] font-black uppercase tracking-[3px]">BUILD VERSION</p>
              <p className="font-mono text-[10px] font-bold">2026.1.15.</p>
            </div>
            <div className="h-6 w-[1px] bg-gray-300" />
            <div className="flex flex-col items-center gap-1">
              <p className="text-[8px] font-black uppercase tracking-[3px]">PLATFORM</p>
              <p className="font-mono text-[10px] font-bold">NEXT_JS 15.5.7</p>
            </div>
          </div>
        </div>
      </motion.main>

      <AnimatePresence>{showAppInfo && <AppInfoModal onClose={() => setShowAppInfo(false)} />}</AnimatePresence>
    </div>
  );
};

export default PwaSettingsPage;
