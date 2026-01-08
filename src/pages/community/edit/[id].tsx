import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import Header from '../../../components/layout/Header';
import { pretendard } from '../../../lib/fonts';
import { supabase } from '../../../utils/supabase';
import { toast } from 'react-hot-toast';
import CategorySelector from '../../../components/community/CategorySelector';
import RatingSelector from '../../../components/community/RatingSelector';
import TransportSelector from '../../../components/community/TransportSelector';
import ParkingSelector from '../../../components/community/ParkingSelector';

const CATEGORIES = [
  { value: 'restaurant', label: '맛집' },
  { value: 'cafe', label: '카페' },
  { value: 'museum', label: '미술관' },
  { value: 'exhibition', label: '박물관' },
  { value: 'event', label: '행사' },
];

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  location?: string;
  rating?: number;
  public_transport?: string;
  parking?: string;
  pin_hash?: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const { id, verified } = router.query;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('restaurant');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [publicTransport, setPublicTransport] = useState<'subway' | 'bus' | 'car' | ''>('');
  const [parking, setParking] = useState<'easy' | 'difficult' | ''>('');
  const [pin, setPin] = useState('');
  const [isPinVerified, setIsPinVerified] = useState(verified === 'true');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalPost, setOriginalPost] = useState<Post | null>(null);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('community_posts').select('*').eq('id', id).single();

      if (error) throw error;

      setOriginalPost(data);
      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category);
      setLocation(data.location || '');
      setRating(data.rating || 5);
      setPublicTransport(data.public_transport || '');
      setParking(data.parking || '');
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('게시글을 불러오는데 실패했습니다.');
      router.push('/community');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePinVerify = () => {
    if (!/^\d{4}$/.test(pin)) {
      toast.error('PIN 번호는 4자리 숫자여야 합니다.');
      return;
    }

    if (pin !== originalPost?.pin_hash) {
      toast.error('PIN 번호가 올바르지 않습니다.');
      setPin('');
      return;
    }

    setIsPinVerified(true);
    toast.success('PIN 번호가 확인되었습니다.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPinVerified) {
      toast.error('PIN 번호를 먼저 확인해주세요.');
      return;
    }

    if (!title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('community_posts')
        .update({
          title: title.trim(),
          content: content.trim(),
          category,
          location: location.trim() || null,
          rating: rating,
          public_transport: publicTransport || null,
          parking: parking || null,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('게시글이 수정되었습니다!');
      router.push(`/community/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('게시글 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      originalPost &&
      (title !== originalPost.title ||
        content !== originalPost.content ||
        category !== originalPost.category ||
        location !== (originalPost.location || '') ||
        rating !== (originalPost.rating || 5))
    ) {
      if (window.confirm('수정 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        router.push(`/community/${id}`);
      }
    } else {
      router.push(`/community/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 ${pretendard.className}`}>
        <Header title="장소 수정" showBackButton />
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 ${pretendard.className}`}>
      <Header title="장소 수정" showBackButton />

      {/* PIN 인증 모달 */}
      {!isPinVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="p-6">
              {/* 헤더 */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaLock className="h-8 w-8 text-indigo-600" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">PIN 번호 확인</h3>
                    <p className="text-sm text-gray-600">게시글을 수정하려면 PIN 번호를 입력하세요</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/community/${id}`)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                  <IoMdClose className="h-6 w-6" />
                </button>
              </div>

              {/* PIN 입력 */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">PIN 번호 (4자리)</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  maxLength={4}
                  autoFocus
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-2xl tracking-widest transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-2 text-xs text-gray-500">작성 시 설정한 4자리 숫자를 입력하세요</p>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/community/${id}`)}
                  className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95">
                  취소
                </button>
                <button
                  type="button"
                  onClick={handlePinVerify}
                  disabled={pin.length !== 4}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-4 font-medium text-white shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
                  <FaLock className="h-4 w-4" />
                  확인
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <main className="container mx-auto max-w-2xl px-4 py-2 pb-24">
        {isPinVerified && (
          <div className="rounded-xl bg-white p-6 shadow-lg md:p-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-800">장소 정보 수정</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 카테고리 선택 */}
              <CategorySelector categories={CATEGORIES} selectedCategory={category} onCategoryChange={setCategory} />

              {/* 제목 입력 */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-800">🏪 장소명</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 서울 명동 칼국수"
                  maxLength={100}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3.5 transition hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <div className="mt-1.5 text-right text-xs text-gray-400">{title.length}/100</div>
              </div>

              {/* 위치 입력 */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-800">📍 위치</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="예: 서울 중구 명동"
                  maxLength={100}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3.5 transition hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              {/* 평점 입력 */}
              <RatingSelector rating={rating} onRatingChange={setRating} />

              {/* 대중교통 이용 여부 */}
              <TransportSelector publicTransport={publicTransport} onTransportChange={setPublicTransport} />

              {/* 주차 정보 */}
              <ParkingSelector parking={parking} onParkingChange={setParking} />

              {/* 내용 입력 */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-800">📝 상세 설명</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="• 이 장소의 특징&#10;• 추천 메뉴&#10;• 방문 팁&#10;• 주차 정보&#10;• 가격대 등을 자유롭게 작성해주세요"
                  rows={10}
                  maxLength={5000}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3.5 transition hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <div className="mt-1.5 text-right text-xs text-gray-400">{content.length}/5000</div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white py-4 font-bold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50">
                  <span>취소</span>
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 font-bold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50">
                  <span>{isSubmitting ? '수정 중...' : '수정하기'}</span>
                </motion.button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
