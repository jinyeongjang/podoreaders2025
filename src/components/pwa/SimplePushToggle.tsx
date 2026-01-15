import { useState } from 'react';
import { useSimplePush } from '@/hooks/useSimplePush';
import { IoReload } from 'react-icons/io5';

export const SimplePushToggle = () => {
  const { permission, subscription, loading: initialLoading, subscribe, unsubscribe } = useSimplePush();
  const [isToggling, setIsToggling] = useState(false);

  if (initialLoading) {
    return (
      <div className="flex animate-pulse items-center justify-between rounded-xl bg-slate-50 p-4">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded-lg bg-slate-200" />
          <div className="h-3 w-48 rounded-lg bg-slate-200" />
        </div>
        <div className="h-7 w-12 rounded-full bg-slate-200" />
      </div>
    );
  }

  // Not supported
  if (typeof window !== 'undefined' && !('serviceWorker' in navigator)) {
    return (
      <div className="rounded-xl bg-slate-100 p-4 text-xs text-slate-500">이 브라우저에서는 알림을 받을 수 없어요.</div>
    );
  }

  const isEnabled = !!subscription;

  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      if (isEnabled) {
        await unsubscribe();
      } else {
        await subscribe();
      }
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="relative flex items-center justify-between rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100/80">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700">
          알림
          {isToggling && (
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          )}
        </h3>
        <p className="text-xs text-slate-400">
          {permission === 'denied'
            ? '권한이 차단되었습니다. 브라우저 설정에서 허용해주세요.'
            : isEnabled
              ? '중요한 알림을 실시간으로 받고 있습니다.'
              : '알림을 켜서 소식을 받아보세요.'}
        </p>
      </div>

      <button
        onClick={handleToggle}
        disabled={permission === 'denied' || isToggling}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
          isEnabled ? 'bg-indigo-600 shadow-lg shadow-indigo-200' : 'bg-slate-300'
        } ${permission === 'denied' || isToggling ? 'cursor-not-allowed opacity-70' : 'hover:scale-105 active:scale-95'}`}>
        <span
          className={`${
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          } ease-spring flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300`}>
          {isToggling && <IoReload className="animate-spin text-[10px] text-indigo-600" />}
        </span>
      </button>

      {/* Linear Loading Bar */}
      {isToggling && (
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl bg-slate-100">
          <div className="h-full w-full animate-pulse bg-gradient-to-r from-indigo-500 to-purple-500" />
        </div>
      )}
    </div>
  );
};
