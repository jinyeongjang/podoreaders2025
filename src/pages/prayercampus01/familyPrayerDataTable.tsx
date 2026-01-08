import { useState, useEffect, useMemo } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { pretendard } from '../../lib/fonts';
import { FaArrowLeft, FaSearch, FaTimes, FaFilter, FaCopy, FaCheck, FaSync, FaUser } from 'react-icons/fa';
import { usePrayers, Prayer } from '../../hooks/usePrayers';

const FamilyPrayerDatabase: NextPage = () => {
  // usePrayers 훅을 사용하여 모든 기도제목 불러오기 ('all' 파라미터)
  const { prayers: fetchedPrayers, loading } = usePrayers('all');

  // 상태 관리
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  // 고정 개수
  const itemsPerPage = 12;
  const [showFilters, setShowFilters] = useState(false);

  // fetchedPrayers가 변경될 때 prayers 상태 업데이트
  useEffect(() => {
    if (fetchedPrayers) {
      setPrayers(fetchedPrayers);
    }
  }, [fetchedPrayers]);

  // 유니크한 사용자 목록 계산
  const uniqueUsers = useMemo(() => {
    const users = Array.from(new Set(prayers.map((prayer) => prayer.user_name)));
    return users.sort();
  }, [prayers]);

  // 필터링된 기도제목 계산 (정렬은 항상 최신순)
  const filteredPrayers = useMemo(() => {
    return (
      prayers
        .filter((prayer) => {
          // 검색어 필터링
          const matchesSearch =
            searchTerm === '' ||
            prayer.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prayer.user_name.toLowerCase().includes(searchTerm.toLowerCase());

          // 사용자 필터링
          const matchesFilter = activeFilter === null || prayer.user_name === activeFilter;

          return matchesSearch && matchesFilter;
        })
        // 항상 최신순(날짜 내림차순)으로 정렬
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    );
  }, [prayers, searchTerm, activeFilter]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPrayers.length / itemsPerPage);
  const displayedPrayers = filteredPrayers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 복사 핸들러
  const handleCopy = (text: string, id: number) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch((err) => console.error('Failed to copy text:', err));
  };

  // 데이터 새로고침
  const handleRefresh = () => {
    setCurrentPage(1);
    setSearchTerm('');
    setActiveFilter(null);
  };

  // 페이지 변경 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${pretendard.className}`}>
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* 헤더 섹션 */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/familyManagement"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:bg-gray-100">
              <FaArrowLeft className="h-4 w-4 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl">가족원 기도제목 데이터베이스</h1>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="mb-4 overflow-hidden rounded-xl bg-white p-3 shadow-sm sm:mb-6 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {/* 검색창, 모바일에서 전체 너비 */}
            <div className="relative order-1 w-full flex-1 sm:mr-2">
              <div className="flex overflow-hidden rounded-lg border border-gray-300">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="기도제목 또는 가족원 검색..."
                  className="w-full border-none px-3 py-2.5 text-sm focus:outline-none focus:ring-0 sm:text-base"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="px-2 text-gray-400 hover:text-gray-600">
                    <FaTimes size={16} />
                  </button>
                )}
                <button className="bg-indigo-600 px-4 text-white hover:bg-indigo-700">
                  <FaSearch size={14} />
                </button>
              </div>
            </div>

            {/* 정렬 옵션 제거됨 */}

            {/* 필터/새로고침 버튼 */}
            <div className="order-2 grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center sm:gap-2">
              {/* 필터 버튼 */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  showFilters || activeFilter
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                <FaFilter size={14} />
                <span className="ml-0.5">필터</span>
                {activeFilter && (
                  <span className="ml-1 rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">1</span>
                )}
              </button>

              {/* 새로고침 버튼 */}
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200">
                <FaSync size={14} className={loading ? 'animate-spin' : ''} />
                <span className="ml-0.5">새로고침</span>
              </button>
            </div>
          </div>

          {/* 확장된 필터 영역 */}
          {showFilters && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h4 className="mb-2 text-sm font-semibold text-gray-700">가족원 필터링</h4>
              <div className="flex flex-wrap gap-2">
                {uniqueUsers.map((user) => (
                  <button
                    key={user}
                    onClick={() => setActiveFilter(activeFilter === user ? null : user)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                      activeFilter === user ? 'bg-indigo-600 text-white' : 'hover:bg-cent-200 bg-gray-100 text-gray-700'
                    }`}>
                    <FaUser size={12} className="opacity-70" />
                    <span>{user}</span>
                  </button>
                ))}
                {activeFilter && (
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="rounded-full bg-red-100 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-200">
                    필터 초기화
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 결과 요약 */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-gray-500">
          <div>
            총 <span className="font-medium">{filteredPrayers.length}</span>개의 기도제목
            {activeFilter && (
              <span className="ml-1">
                (<span className="font-medium">{activeFilter}</span> 필터링됨)
              </span>
            )}
          </div>
          <div className="text-xs">
            <span className="font-medium">최신순(최근 작성일)</span> 으로 정렬됨
          </div>
        </div>

        {/* 기도제목 컨테이너 */}
        <div className="mb-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-500">기도제목을 불러오는 중...</p>
              </div>
            </div>
          ) : (
            <>
              {/* 카드 형태의 기도제목 목록 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {displayedPrayers.length > 0 ? (
                  displayedPrayers.map((prayer, index) => (
                    <div
                      key={prayer.id}
                      className="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
                      <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 font-medium text-indigo-700">
                              {prayer.user_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{prayer.user_name}</p>
                              <p className="text-xs text-gray-500">{formatDate(prayer.created_at)}</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                            #{(currentPage - 1) * itemsPerPage + index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="mb-4 min-h-[60px] text-sm text-gray-700">{prayer.content}</p>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleCopy(prayer.content, prayer.id)}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ${
                              copiedId === prayer.id
                                ? 'bg-green-100 text-green-700'
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            }`}>
                            {copiedId === prayer.id ? <FaCheck size={12} /> : <FaCopy size={12} />}
                            <span>{copiedId === prayer.id ? '복사됨' : '복사'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex h-32 items-center justify-center rounded-xl bg-white text-gray-500">
                    {searchTerm || activeFilter ? '검색 결과가 없습니다.' : '기도제목이 없습니다.'}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* 페이지네이션 */}
        {displayedPrayers.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-gray-500">
              전체 {filteredPrayers.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredPrayers.length)}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="hidden h-9 items-center justify-center rounded border border-gray-300 px-2 text-sm disabled:opacity-50 sm:flex">
                처음
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-9 items-center justify-center rounded border border-gray-300 px-3 text-sm disabled:opacity-50">
                이전
              </button>

              <div className="flex items-center">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // 페이지 번호 계산 로직
                  const pageNumToShow =
                    totalPages <= 5
                      ? i + 1
                      : currentPage <= 3
                        ? i + 1
                        : currentPage >= totalPages - 2
                          ? totalPages - 4 + i
                          : currentPage - 2 + i;

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNumToShow)}
                      className={`mx-0.5 hidden h-9 w-9 items-center justify-center rounded-md sm:flex ${
                        currentPage === pageNumToShow
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-300 bg-white hover:bg-gray-50'
                      }`}>
                      {pageNumToShow}
                    </button>
                  );
                })}
                <span className="flex h-9 items-center justify-center px-2 text-sm font-medium text-gray-600 sm:hidden">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-9 items-center justify-center rounded border border-gray-300 px-3 text-sm disabled:opacity-50">
                다음
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="hidden h-9 items-center justify-center rounded border border-gray-300 px-2 text-sm disabled:opacity-50 sm:flex">
                마지막
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyPrayerDatabase;
