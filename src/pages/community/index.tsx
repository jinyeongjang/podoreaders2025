import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaPlus, FaComments, FaClock, FaUser, FaMapMarkerAlt, FaStar, FaSearch, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { pretendard } from '../../lib/fonts';
import { supabase } from '../../utils/supabase';
import { toast } from 'react-hot-toast';
import mirinaeLogo from '../../assets/images/mirinae_community_logo.jpg';

// hooks
import { useMaintenanceStatus } from '../../hooks/useMaintenanceStatus';

// components
import MaintenanceScreen from '../../components/MaintenanceScreen';
import MaintenanceBanner from '../../components/MaintenanceBanner';

interface Post {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_id: string;
  category: string;
  location?: string;
  rating?: number;
  public_transport?: string;
  parking?: string;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: 'restaurant', label: '맛집' },
  { value: 'cafe', label: '카페' },
  { value: 'museum', label: '미술관' },
  { value: 'exhibition', label: '박물관' },
  { value: 'event', label: '행사' },
];

export default function CommunityPage() {
  const router = useRouter();
  const { maintenanceStatus, isMaintenanceMode, hasScheduledMaintenance } = useMaintenanceStatus();

  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParking, setSelectedParking] = useState<'all' | 'easy' | 'difficult'>('all');
  const [selectedTransport, setSelectedTransport] = useState<'all' | 'subway' | 'bus' | 'car'>('all');

  // 게시글 불러오기
  useEffect(() => {
    fetchPosts();
  }, []);

  // 검색 필터링
  useEffect(() => {
    let filtered = posts;

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // 주차 필터
    if (selectedParking !== 'all') {
      filtered = filtered.filter((post) => post.parking === selectedParking);
    }

    // 교통수단 필터
    if (selectedTransport !== 'all') {
      filtered = filtered.filter((post) => post.public_transport === selectedTransport);
    }

    // 검색어 필터
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author_name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, posts, selectedCategory, selectedParking, selectedTransport]);

  // 서버 점검 중이면 점검 화면 표시
  if (isMaintenanceMode) {
    return <MaintenanceScreen maintenanceStatus={maintenanceStatus} />;
  }

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('게시글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostClick = (postId: string) => {
    router.push(`/community/${postId}`);
  };

  const handleCreatePost = () => {
    router.push('/community/create');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 ${pretendard.className}`}>
      <Header title="커뮤니티" showBackButton onBackClick={() => router.push('/community')} />

      {hasScheduledMaintenance && maintenanceStatus && maintenanceStatus.starts_at && (
        <MaintenanceBanner
          message={maintenanceStatus.message}
          startsAt={new Date(maintenanceStatus.starts_at)}
          endsAt={maintenanceStatus.ends_at ? new Date(maintenanceStatus.ends_at) : undefined}
        />
      )}

      <main className="container mx-auto max-w-2xl px-4 py-2 pb-24">
        {/* 헤더 섹션 */}
        <div className="mb-4 mt-2 text-center">
          <motion.div
            onClick={() => router.push('/community')}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative mx-auto mb-2 h-14 w-36 cursor-pointer overflow-hidden rounded-lg mix-blend-multiply transition">
            {/* 빗방울 애니메이션 */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 60, opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.05,
                  ease: 'easeIn',
                }}
                className="absolute"
                style={{
                  left: `${5 + i * 6}%`,
                  width: '2px',
                  height: '10px',
                  background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.1))',
                  borderRadius: '2px',
                }}
              />
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1, ease: 'easeOut' }}
              className="absolute inset-0">
              <Image
                src={mirinaeLogo}
                alt="미리내 커뮤니티 로고"
                layout="fill"
                objectFit="cover"
                className="mix-blend-multiply"
              />
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center text-gray-600">
            맛집부터 카페까지, 내가 가보고 좋았던 장소. <br></br>혼자만 보기 아까웠던 것 이제 나눠봐요.
          </motion.p>
        </div>

        {/* 검색 및 카테고리 필터 */}
        <div className="mb-6 space-y-4">
          {/* 검색창 */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="장소나 음식 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-12 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            )}
          </div>
          {/* 카테고리 필터 */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">카테고리</label>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs text-indigo-600 hover:text-indigo-800">
                  초기화
                </button>
              )}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {CATEGORIES.map((category) => (
                <motion.button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-xl p-3 text-center font-semibold shadow-md transition ${
                    selectedCategory === category.value
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}>
                  <div className="text-sm">{category.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
          {/* 주차 필터 */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">주차 편의성</label>
              {selectedParking !== 'all' && (
                <button
                  onClick={() => setSelectedParking('all')}
                  className="text-xs text-green-600 hover:text-green-800">
                  초기화
                </button>
              )}
            </div>
            <div className="flex justify-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedParking('all')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedParking === 'all'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}>
                전체
              </button>
              <button
                onClick={() => setSelectedParking('easy')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedParking === 'easy'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}>
                가능
              </button>
              <button
                onClick={() => setSelectedParking('difficult')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedParking === 'difficult'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}>
                불가
              </button>
            </div>
          </div>{' '}
          {/* 교통수단 필터 */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">교통수단</label>
              {selectedTransport !== 'all' && (
                <button
                  onClick={() => setSelectedTransport('all')}
                  className="text-xs text-blue-600 hover:text-blue-800">
                  초기화
                </button>
              )}
            </div>
            <div className="flex justify-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedTransport('all')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedTransport === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}>
                전체
              </button>
              <button
                onClick={() => setSelectedTransport('subway')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedTransport === 'subway'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}>
                지하철
              </button>
              <button
                onClick={() => setSelectedTransport('bus')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedTransport === 'bus'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}>
                버스
              </button>
              <button
                onClick={() => setSelectedTransport('car')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedTransport === 'car'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}>
                차
              </button>
            </div>
          </div>
        </div>

        {/* 장소 추천 버튼 */}
        <motion.button
          onClick={handleCreatePost}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700">
          <FaPlus />
          <span>새 장소 추천하기</span>
        </motion.button>

        {/* 게시글 목록 */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
            <p className="mt-4 text-sm font-medium text-indigo-600">장소를 불러오는 중...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-2xl bg-gradient-to-br from-white to-indigo-50/30 p-12 text-center shadow-lg backdrop-blur-lg">
            <FaMapMarkerAlt className="mx-auto mb-4 text-6xl text-indigo-300" />
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              {searchQuery ? '검색 결과가 없습니다' : '추천 장소가 없습니다'}
            </h3>
            <p className="text-sm text-gray-600">
              {searchQuery ? '다른 검색어를 입력해보세요' : '첫 번째 장소를 추천해보세요!'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreatePost}
                className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-md transition hover:shadow-lg">
                <FaPlus className="mr-2 inline" />
                지금 추천하기
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="cursor-pointer rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">
                {/* 카테고리 배지 및 위치 */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {CATEGORIES.find((cat) => cat.value === post.category)?.label || post.category}
                  </span>
                  {post.location && (
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <FaMapMarkerAlt />
                      {post.location}
                    </span>
                  )}
                  {post.rating && (
                    <span className="flex items-center gap-1 text-xs text-yellow-600">
                      <FaStar />
                      {post.rating}⭐
                    </span>
                  )}
                  {post.public_transport && (
                    <span className="text-xs">
                      {post.public_transport === 'subway' && '🚇'}
                      {post.public_transport === 'bus' && '🚌'}
                      {post.public_transport === 'car' && '🚗'}
                    </span>
                  )}
                  {post.parking && <span className="text-xs">{post.parking === 'easy' ? '🅿️' : '🚫'}</span>}
                </div>

                {/* 제목 */}
                <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-800">{post.title}</h3>

                {/* 내용 미리보기 */}
                <p className="mb-4 line-clamp-2 text-gray-600">{post.content}</p>

                {/* 메타 정보 */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FaUser className="text-xs" />
                      <span>{post.author_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock className="text-xs" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <FaComments className="text-indigo-500" />
                      <span>{post.comments_count || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
