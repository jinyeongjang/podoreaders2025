import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaUser, FaClock, FaComments, FaMapMarkerAlt, FaLock } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { pretendard } from '../../lib/fonts';
import { supabase } from '../../utils/supabase';
import { toast } from 'react-hot-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  author_name: string;
  category: string;
  location?: string;
  rating?: number;
  public_transport?: string;
  parking?: string;
  pin_hash?: string;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

interface Comment {
  id: string;
  post_id: string;
  content: string;
  author_name: string;
  author_id: string;
  created_at: string;
}

const CATEGORIES = [
  { value: 'restaurant', label: '맛집' },
  { value: 'cafe', label: '카페' },
  { value: 'museum', label: '미술관' },
  { value: 'exhibition', label: '박물관' },
  { value: 'event', label: '행사' },
];

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthorName, setCommentAuthorName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePin, setDeletePin] = useState('');
  const [showDeletePinError, setShowDeletePinError] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPin, setEditPin] = useState('');
  const [showEditPinError, setShowEditPinError] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from('community_posts').select('*').eq('id', id).single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('게시글을 불러오는데 실패했습니다.');
        router.push('/community');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
    fetchComments();
  }, [id, router, fetchComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentAuthorName.trim()) {
      toast.error('작성자 이름을 입력해주세요.');
      return;
    }

    if (!newComment.trim()) {
      toast.error('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmittingComment(true);

      const { error } = await supabase.from('community_comments').insert([
        {
          post_id: id,
          content: newComment.trim(),
          author_name: commentAuthorName.trim(),
        },
      ]);

      if (error) throw error;

      setNewComment('');
      setCommentAuthorName('');
      fetchComments();
      setPost((prev) => (prev ? { ...prev, comments_count: prev.comments_count + 1 } : null));
      toast.success('댓글이 작성되었습니다!');
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditConfirm = async () => {
    if (!/^\d{4}$/.test(editPin)) {
      toast.error('PIN 번호는 4자리 숫자여야 합니다.');
      return;
    }

    if (editPin !== post?.pin_hash) {
      setShowEditPinError(true);
      setEditPin('');
      return;
    }

    // PIN 확인 성공 - verified 파라미터와 함께 이동
    router.push(`/community/edit/${id}?verified=true`);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!/^\d{4}$/.test(deletePin)) {
      toast.error('PIN 번호는 4자리 숫자여야 합니다.');
      return;
    }

    if (deletePin !== post?.pin_hash) {
      setShowDeletePinError(true);
      setDeletePin('');
      return;
    }

    try {
      const { error } = await supabase.from('community_posts').delete().eq('id', id);

      if (error) throw error;

      toast.success('게시글이 삭제되었습니다.');
      router.push('/community');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('게시글 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 ${pretendard.className}`}>
        <Header title="게시글" showBackButton />
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 ${pretendard.className}`}>
      <Header title="장소 상세" showBackButton />

      <main className="container mx-auto max-w-2xl px-4 py-2 pb-24">
        {/* 게시글 본문 */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-lg md:p-8">
          {/* 카테고리 정보 */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
              {CATEGORIES.find((cat) => cat.value === post.category)?.label || post.category}
            </span>
            {post.rating && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
                ⭐ {post.rating}
              </span>
            )}
          </div>

          {/* 수정/삭제 버튼 - 오른쪽 정렬 */}
          <div className="mb-4 flex justify-end gap-2">
            <motion.button
              onClick={handleEditClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-indigo-600 shadow-md ring-1 ring-indigo-200 transition-all hover:bg-indigo-50 hover:shadow-lg">
              <FaEdit className="h-3.5 w-3.5" />
              <span>수정</span>
            </motion.button>
            <motion.button
              onClick={handleDeleteClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-red-600 shadow-md ring-1 ring-red-200 transition-all hover:bg-red-50 hover:shadow-lg">
              <FaTrash className="h-3.5 w-3.5" />
              <span>삭제</span>
            </motion.button>
          </div>

          {/* 제목 */}
          <h1 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl">{post.title}</h1>

          {/* 위치 정보 */}
          {post.location && (
            <div className="mb-4 flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt className="text-indigo-600" />
              <span className="text-lg">{post.location}</span>
            </div>
          )}

          {/* 대중교통 및 주차 정보 */}
          {(post.public_transport || post.parking) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.public_transport && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {post.public_transport === 'subway' && '🚇 지하철'}
                  {post.public_transport === 'bus' && '🚌 버스정류장'}
                  {post.public_transport === 'car' && '🚗 차로이동'}
                </span>
              )}
              {post.parking && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                    post.parking === 'easy' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                  {post.parking === 'easy' ? '🅿️ 주차 편해요' : '🚫 주차 어려워요'}
                </span>
              )}
            </div>
          )}

          {/* 메타 정보 */}
          <div className="mb-6 flex items-center gap-4 border-b border-gray-200 pb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FaUser />
              <span>{post.author_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>

          {/* 내용 */}
          <div className="prose mb-6 max-w-none whitespace-pre-wrap text-gray-700">{post.content}</div>
        </div>

        {/* 댓글 섹션 */}
        <div className="rounded-xl bg-white p-6 shadow-lg md:p-8">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
            <FaComments />
            댓글 <span className="text-indigo-600">({comments.length})</span>
          </h2>

          {/* 댓글 작성 폼 */}
          <form onSubmit={handleCommentSubmit} className="mb-6 space-y-3">
            <input
              type="text"
              value={commentAuthorName}
              onChange={(e) => setCommentAuthorName(e.target.value)}
              placeholder="이름 또는 닉네임"
              maxLength={50}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <motion.button
              type="submit"
              disabled={isSubmittingComment}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50">
              {isSubmittingComment ? '작성 중...' : '댓글 작성'}
            </motion.button>
          </form>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="py-8 text-center text-gray-500">첫 번째 댓글을 작성해보세요!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                    <FaUser className="text-xs" />
                    <span className="font-semibold">{comment.author_name}</span>
                    <span className="text-gray-400">·</span>
                    <span>{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* 수정 PIN 확인 모달 */}
      {isEditModalOpen && (
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
                    <h3 className="text-xl font-semibold text-gray-900">게시글 수정</h3>
                    <p className="text-sm text-gray-600">수정하려면 PIN 번호를 입력하세요</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditPin('');
                    setShowEditPinError(false);
                  }}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                  <IoMdClose className="h-6 w-6" />
                </button>
              </div>

              {/* PIN 오류 메시지 */}
              {showEditPinError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl bg-red-50 p-4 ring-2 ring-red-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                        <span className="text-lg">⚠️</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1 font-semibold text-red-800">PIN 번호가 잘못되었어요.</h4>
                      <p className="text-sm text-red-700">다시 입력해주세요.</p>
                    </div>
                    <button
                      onClick={() => setShowEditPinError(false)}
                      className="flex-shrink-0 text-red-400 hover:text-red-600">
                      <IoMdClose className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PIN 입력 */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">PIN 번호 (4자리)</label>
                <input
                  type="password"
                  value={editPin}
                  onChange={(e) => {
                    setEditPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                    setShowEditPinError(false);
                  }}
                  placeholder="••••"
                  maxLength={4}
                  autoFocus
                  className={`w-full rounded-xl border px-4 py-3 text-center text-2xl tracking-widest transition focus:outline-none focus:ring-2 ${
                    showEditPinError
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                />
                <p className="mt-2 text-xs text-gray-500">작성 시 설정한 4자리 숫자를 입력하세요</p>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditPin('');
                    setShowEditPinError(false);
                  }}
                  className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95">
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleEditConfirm}
                  disabled={editPin.length !== 4}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-4 font-medium text-white shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
                  <FaLock className="h-4 w-4" />
                  확인
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="p-6">
              {/* 헤더 */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaLock className="h-8 w-8 text-red-600" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">게시글 삭제</h3>
                    <p className="text-sm text-gray-600">삭제하려면 PIN 번호를 입력하세요</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeletePin('');
                    setShowDeletePinError(false);
                  }}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                  <IoMdClose className="h-6 w-6" />
                </button>
              </div>

              {/* 경고 메시지 */}
              <div className="mb-4 rounded-xl bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">삭제된 게시글은 복구할 수 없어요.</p>
              </div>

              {/* PIN 오류 메시지 */}
              {showDeletePinError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl bg-red-50 p-4 ring-2 ring-red-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                        <span className="text-lg">⚠️</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1 font-semibold text-red-800">PIN 번호가 잘못되었어요.</h4>
                      <p className="text-sm text-red-700">다시 입력해주세요.</p>
                    </div>
                    <button
                      onClick={() => setShowDeletePinError(false)}
                      className="flex-shrink-0 text-red-400 hover:text-red-600">
                      <IoMdClose className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PIN 입력 */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">PIN 번호 (4자리)</label>
                <input
                  type="password"
                  value={deletePin}
                  onChange={(e) => {
                    setDeletePin(e.target.value.replace(/\D/g, '').slice(0, 4));
                    setShowDeletePinError(false);
                  }}
                  placeholder="••••"
                  maxLength={4}
                  autoFocus
                  className={`w-full rounded-xl border px-4 py-3 text-center text-2xl tracking-widest transition focus:outline-none focus:ring-2 ${
                    showDeletePinError
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 bg-white focus:border-red-500 focus:ring-red-500'
                  }`}
                />
                <p className="mt-2 text-xs text-gray-500">작성 시 설정한 4자리 숫자를 입력하세요</p>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeletePin('');
                    setShowDeletePinError(false);
                  }}
                  className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95">
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deletePin.length !== 4}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-4 font-medium text-white shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
                  <FaTrash className="h-4 w-4" />
                  삭제하기
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
