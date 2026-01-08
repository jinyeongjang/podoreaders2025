import { useRouter } from 'next/router';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';

export default function WordCampusUiwanPrayer() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-indigo-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-500 shadow-lg">
              <FaCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-indigo-600">김의완 가족</p>
              <h1 className="text-lg font-bold text-gray-900">기도제목</h1>
            </div>
          </div>
          <button
            onClick={() => router.push('/campusSelect/wordCampus_uiwan')}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md">
            <FaArrowLeft className="h-4 w-4" />
            이전으로
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 pb-12">
        {/* Welcome Section */}
        <div className="overflow-hidden rounded-2xl p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex-1">
              <h2 className="mb-3 text-xl font-bold text-gray-900 md:text-2xl">기도제목</h2>
              <p className="mb-4 text-sm text-gray-600 md:text-base">가족원들의 기도제목을 확인하고 함께 기도해요</p>
            </div>
          </div>
        </div>

        {/* 준비중 공지 */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-500 text-white shadow-lg">
              <FaCheck className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-bold text-gray-900">준비중이에요</h3>
              <p className="text-xs text-gray-600">조금만 기다려주시면 감사하겠습니다. 🙏</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/campusSelect/wordCampus_uiwan')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl">
            <FaArrowLeft className="h-6 w-6" />
            이전으로
          </button>
        </div>
      </div>
    </div>
  );
}
