import { FaFileExport } from 'react-icons/fa';
import { RiUserHeartLine } from 'react-icons/ri';
import { useRouter } from 'next/router';

interface RecordsHeaderProps {
  onExport: () => void;
  familyName?: string;
}

export default function RecordsHeader({ onExport, familyName = '가족' }: RecordsHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-0 mt-4 px-2 py-2">
      <div className="grid grid-cols-1 gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 p-6 tracking-tighter text-white shadow-lg sm:flex sm:flex-row sm:items-center sm:justify-between xs:grid-cols-2">
        <div className="relative z-10 sm:col-span-1 xs:col-span-2">
          <div className="flex items-center gap-3">
            <RiUserHeartLine className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-xl font-bold">말씀캠퍼스 {familyName} QT 기록</h1>
              <p className="mt-1 tracking-tighter text-emerald-100 xs:text-[13px]">
                팀원들의 QT 기록을 확인하고 통계를 볼 수 있어요.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex xs:col-span-2">
          <button
            onClick={onExport}
            className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:underline active:scale-95">
            <FaFileExport className="h-4 w-4" />
            <span className="xs:inline">엑셀 내보내기</span>
          </button>

          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:underline active:scale-95">
            ← 이전으로
          </button>
        </div>
      </div>
    </div>
  );
}
