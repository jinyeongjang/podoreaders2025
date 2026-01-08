import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';
import Image from 'next/image';
import Header from '../../components/layout/Header';
import { pretendard } from '../../lib/fonts';
import { supabase } from '../../utils/supabase';
import { toast } from 'react-hot-toast';
import mirinaeLogo from '../../assets/images/mirinae_community_logo.jpg';
import CategorySelector from '../../components/community/CategorySelector';
import RatingSelector from '../../components/community/RatingSelector';
import TransportSelector from '../../components/community/TransportSelector';
import ParkingSelector from '../../components/community/ParkingSelector';
import PinModal from '../../components/community/PinModal';

const CATEGORIES = [
  { value: 'restaurant', label: '맛집' },
  { value: 'cafe', label: '카페' },
  { value: 'museum', label: '미술관' },
  { value: 'exhibition', label: '박물관' },
  { value: 'event', label: '행사' },
];
export default function CreatePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('restaurant');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [publicTransport, setPublicTransport] = useState<'subway' | 'bus' | 'car' | ''>('');
  const [parking, setParking] = useState<'easy' | 'difficult' | ''>('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    if (!authorName.trim()) {
      toast.error('작성자 이름을 입력해주세요.');
      return;
    }

    // 모달 열기
    setIsPinModalOpen(true);
  };

  const handlePinConfirm = async () => {
    if (!/^\d{4}$/.test(pin)) {
      toast.error('PIN 번호는 4자리 숫자여야 합니다.');
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.from('community_posts').insert([
        {
          title: title.trim(),
          content: content.trim(),
          category,
          location: location.trim() || null,
          rating: rating,
          public_transport: publicTransport || null,
          parking: parking || null,
          author_name: authorName.trim(),
          pin_hash: pin,
        },
      ]);

      if (error) throw error;

      toast.success('게시글이 작성되었습니다!');
      router.push('/community');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('게시글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        router.push('/community');
      }
    } else {
      router.push('/community');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 ${pretendard.className}`}>
      <Header title="장소 추천" showBackButton />

      <main className="container mx-auto max-w-2xl px-4 py-2 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-6 shadow-xl md:p-8">
          <div className="mb-8 text-center">
            <div
              onClick={() => router.push('/community')}
              className="relative mx-auto mb-4 h-14 w-36 cursor-pointer overflow-hidden rounded-lg transition hover:opacity-80">
              <Image
                src={mirinaeLogo}
                alt="미리내 커뮤니티 로고"
                layout="fill"
                objectFit="cover"
                className="mix-blend-multiply"
              />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">장소 추천</h1>
            <p className="text-sm text-gray-600">
              맛집부터 카페까지, 내가 가보고 좋았던 장소.<br></br> 혼자만 보기 아까웠던 것 이제 나눠봐요.
            </p>
          </div>

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

            {/* 작성자 정보 */}
            <div className="space-y-4 rounded-xl border-2 border-indigo-100 bg-indigo-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <FaUser className="text-indigo-600" />
                <span className="text-sm font-bold text-gray-800">작성자 정보</span>
              </div>

              {/* 작성자 이름 */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">이름 또는 닉네임</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="예: 홍길동"
                  maxLength={50}
                  className="w-full rounded-lg border-2 border-white bg-white px-4 py-3 transition hover:border-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div className="flex items-start gap-2 text-xs text-indigo-700">
                <span className="mt-0.5">💡</span>
                <span>작성 완료 시 게시글 수정/삭제를 위한 PIN 번호를 설정하게 되요.</span>
              </div>
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
                <span>{isSubmitting ? '작성 중...' : '작성하기'}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>

      {/* PIN 입력 모달 */}
      <PinModal
        isOpen={isPinModalOpen}
        pin={pin}
        onPinChange={setPin}
        onConfirm={handlePinConfirm}
        onCancel={() => {
          setIsPinModalOpen(false);
          setPin('');
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
