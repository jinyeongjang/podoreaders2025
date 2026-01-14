import { useState, useEffect } from 'react';
import { pretendard } from '../lib/fonts';
import { motion } from 'framer-motion';
import {
  IoWifiOutline,
  IoRefreshOutline,
  IoCloudOfflineOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoHomeOutline,
} from 'react-icons/io5';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useRouter } from 'next/router';

export default function Offline() {
  const router = useRouter();
  const networkStatus = useNetworkStatus();
  const [cachedPages, setCachedPages] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // 캐시된 페이지 목록 가져오기
  useEffect(() => {
    const getCachedPages = async () => {
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          const pages: string[] = [];

          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            requests.forEach((request) => {
              const url = new URL(request.url);
              if (url.pathname !== '/' && !url.pathname.includes('_next') && !url.pathname.includes('api')) {
                pages.push(url.pathname);
              }
            });
          }

          setCachedPages([...new Set(pages)]);
        } catch (error) {
          console.error('Failed to get cached pages:', error);
        }
      }
    };

    getCachedPages();
  }, []);

  // 온라인 상태 변경 감지
  useEffect(() => {
    if (networkStatus.isOnline) {
      // 온라인으로 복귀하면 홈으로 리다이렉트
      router.push('/');
    }
  }, [networkStatus.isOnline, router]);

  const handleRetry = async () => {
    setIsChecking(true);
    setLastChecked(new Date());

    // 네트워크 상태 확인
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (navigator.onLine) {
      window.location.reload();
    } else {
      setIsChecking(false);
    }
  };

  const navigateToCachedPage = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className={`${pretendard.className} flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100`}>
      <div className="mx-auto max-w-2xl px-6">
        {/* 상태 아이콘 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-slate-400 opacity-20" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-700 shadow-2xl">
              <IoCloudOfflineOutline className="h-16 w-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* 제목 및 설명 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">오프라인 상태입니다</h1>
          <p className="text-lg text-gray-600">
            현재 인터넷에 연결되어 있지 않습니다.
            <br />
            네트워크 연결을 확인해주세요.
          </p>
        </motion.div>

        {/* 네트워크 상태 정보 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700">
            <IoWifiOutline className="h-5 w-5" />
            네트워크 상태
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">연결 상태</span>
              <span className="flex items-center gap-2 text-sm font-bold text-red-600">
                <div className="h-2 w-2 rounded-full bg-red-600" />
                오프라인
              </span>
            </div>
            {lastChecked && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">마지막 확인</span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <IoTimeOutline className="h-4 w-4" />
                  {lastChecked.toLocaleTimeString('ko-KR')}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* 재시도 버튼 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 flex gap-3">
          <button
            onClick={handleRetry}
            disabled={isChecking}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl active:scale-95 disabled:opacity-50">
            {isChecking ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>확인 중...</span>
              </>
            ) : (
              <>
                <IoRefreshOutline className="h-5 w-5" />
                <span>다시 시도</span>
              </>
            )}
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-4 font-bold text-slate-700 transition-all hover:bg-slate-50">
            <IoHomeOutline className="h-5 w-5" />
          </button>
        </motion.div>

        {/* 캐시된 페이지 */}
        {cachedPages.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700">
              <IoCheckmarkCircleOutline className="h-5 w-5 text-green-600" />
              오프라인에서 사용 가능한 페이지
            </h3>
            <div className="space-y-2">
              {cachedPages.slice(0, 5).map((page, index) => (
                <button
                  key={index}
                  onClick={() => navigateToCachedPage(page)}
                  className="w-full rounded-lg bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600">
                  {page}
                </button>
              ))}
            </div>
            {cachedPages.length > 5 && (
              <p className="mt-3 text-center text-xs text-gray-500">외 {cachedPages.length - 5}개 페이지</p>
            )}
          </motion.div>
        )}

        {/* 안내 메시지 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center">
          <p className="text-sm text-gray-500">네트워크가 복구되면 자동으로 연결됩니다</p>
        </motion.div>
      </div>
    </div>
  );
}
