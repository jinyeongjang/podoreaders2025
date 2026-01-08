import { pretendard } from '../lib/fonts';
import { FaWifi } from 'react-icons/fa';

export default function Offline() {
  return (
    <div
      className={`${pretendard.className} flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50`}>
      <div className="mx-auto max-w-md px-6 text-center">
        {/* 아이콘 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-indigo-400 opacity-20" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl">
              <FaWifi className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* 제목 */}
        <h1 className="mb-4 text-3xl font-bold text-gray-900">오프라인 상태입니다</h1>

        {/* 설명 */}
        <p className="mb-8 text-gray-600">
          현재 인터넷에 연결되어 있지 않아요.
          <br />
          포도리더스는 인터넷이 연결되어야 사용할 수 있어요.
        </p>

        {/* 재시도 버튼 */}
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl">
          <FaWifi className="h-5 w-5" />
          다시 시도
        </button>

        {/* 상태 표시 */}
        <div className="mt-8 rounded-xl bg-white/50 p-4 backdrop-blur-sm">
          <p className="text-sm text-gray-500">일부 기능은 오프라인에서도 사용 가능합니다</p>
        </div>
      </div>
    </div>
  );
}
