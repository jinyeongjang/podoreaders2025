import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/layout/Header';
import { pretendard } from '../../lib/fonts';
import { FaPaperPlane, FaArrowLeft, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import { supabase } from '../../lib/supabaseClient';
import SuccessNoticeModal from '../../components/wordCampus/SuccessNoticeModal';
import DeleteNoticeConfirmModal from '../../components/wordCampus/DeleteNoticeConfirmModal';
import DeleteSuccessModal from '../../components/wordCampus/DeleteSuccessModal';
import { AnimatePresence } from 'framer-motion';

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function WordCampusUiwanNoticesPage() {
  const router = useRouter();

  // 캠퍼스 권한 확인
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 폼 상태 관리
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredTitle, setRegisteredTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingNotice, setDeletingNotice] = useState<Notice | null>(null);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [deletedTitle, setDeletedTitle] = useState('');

  // 권한 확인 및 공지사항 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
        const campusAuthorized = localStorage.getItem('campusAuthorized') === 'true';
        const selectedCampus = localStorage.getItem('selectedCampus');
        const lastPassword = localStorage.getItem('lastPassword');

        // 말씀 캠퍼스 의완팀 권한 확인
        if (campusAuthorized && selectedCampus === 'word_uiwan' && lastPassword === '5678') {
          setIsAuthorized(true);
        } else {
          // 권한이 없으면 캠퍼스 선택 페이지로 리디렉션
          router.push('/campusSelect');
        }
        setIsLoading(false);
      };

      checkAuth();
      loadNotices();
    }
  }, [router]);

  // Supabase에서 공지사항 불러오기
  const loadNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('wordCampus_notices_uiwan')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('공지사항 로딩 중 오류 발생:', error);
        return;
      }

      if (data) {
        setNotices(data);
      }
    } catch (error) {
      console.error('공지사항 로딩 중 오류 발생:', error);
    }
  };

  // 공지사항 등록/수정 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing && editingNoticeId) {
        // 수정 모드
        const { error } = await supabase
          .from('wordCampus_notices_uiwan')
          .update({
            title: title.trim(),
            content: content.trim(),
          })
          .eq('id', editingNoticeId);

        if (error) throw error;

        setRegisteredTitle(title.trim());
        setTitle('');
        setContent('');
        setIsEditing(false);
        setEditingNoticeId(null);
        await loadNotices();
        setShowSuccessModal(true);
      } else {
        // 등록 모드
        const { error } = await supabase.from('wordCampus_notices_uiwan').insert({
          title: title.trim(),
          content: content.trim(),
        });

        if (error) throw error;

        setRegisteredTitle(title.trim());
        setTitle('');
        setContent('');
        await loadNotices();
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('공지사항 처리 중 오류 발생:', error);
      alert(`공지사항 ${isEditing ? '수정' : '등록'}에 실패했습니다.`);
    } finally {
      setIsSaving(false);
    }
  };

  // 수정 모드 진입
  const handleEdit = (notice: Notice) => {
    setIsEditing(true);
    setEditingNoticeId(notice.id);
    setTitle(notice.title);
    setContent(notice.content);
    // 폼으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingNoticeId(null);
    setTitle('');
    setContent('');
  };

  // 공지사항 삭제 모달 표시
  const handleDelete = (notice: Notice) => {
    setDeletingNotice(notice);
    setShowDeleteModal(true);
  };

  // 공지사항 삭제 확인
  const confirmDelete = async () => {
    if (!deletingNotice) return;

    try {
      const { error } = await supabase.from('wordCampus_notices_uiwan').delete().eq('id', deletingNotice.id);

      if (error) throw error;

      await loadNotices();
      setDeletedTitle(deletingNotice.title);
      setShowDeleteModal(false);
      setDeletingNotice(null);
      setShowDeleteSuccessModal(true);
    } catch (error) {
      console.error('공지사항 삭제 중 오류 발생:', error);
      alert('공지사항 삭제에 실패했습니다.');
    }
  };

  // 공지사항 삭제 취소
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingNotice(null);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-4 text-emerald-700">권한을 확인하는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 권한이 없으면 빈 페이지 반환
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-emerald-50 to-white ${pretendard.className}`}>
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-emerald-800">공지사항 관리</h1>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-lg bg-emerald-100 px-4 py-2 text-emerald-700 transition-colors hover:bg-emerald-200">
            <FaArrowLeft className="h-4 w-4" />
            돌아가기
          </button>
        </div>

        {/* 공지사항 등록/수정 폼 */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-emerald-800">{isEditing ? '공지사항 수정' : '새 공지사항 작성'}</h2>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200">
                  <FaTimes className="h-3 w-3" />
                  취소
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* 제목 입력 */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-gray-700">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="공지사항 제목을 입력하세요"
                maxLength={100}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <div className="mt-1 text-right text-xs text-gray-500">{title.length}/100자</div>
            </div>

            {/* 내용 입력 */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="공지사항 내용을 입력하세요"
                maxLength={1000}
                rows={8}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <div className="mt-1 text-right text-xs text-gray-500">{content.length}/1000자</div>
            </div>

            {/* 등록/수정 버튼 */}
            <button
              type="submit"
              disabled={isSaving || !title.trim() || !content.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300">
              <FaPaperPlane className="h-4 w-4" />
              {isSaving ? (isEditing ? '수정 중...' : '등록 중...') : isEditing ? '공지사항 수정' : '공지사항 등록'}
            </button>
          </form>
        </div>

        {/* 등록된 공지사항 목록 */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-4">
            <h2 className="text-xl font-bold text-emerald-800">
              등록된 공지사항 <span className="text-emerald-600">({notices.length})</span>
            </h2>
          </div>

          <div className="p-6">
            {notices.length > 0 ? (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-md">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="flex-1 text-lg font-semibold text-emerald-800">{notice.title}</h3>
                      <div className="ml-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(notice)}
                          className="rounded-lg bg-emerald-100 p-2 text-emerald-600 transition-colors hover:bg-emerald-200">
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(notice)}
                          className="rounded-lg bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200">
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mb-3 whitespace-pre-wrap text-sm text-gray-700">{notice.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-medium text-emerald-600">공지</span>
                      <span>{formatDate(notice.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                <p className="text-lg">아직 등록된 공지사항이 없습니다.</p>
                <p className="mt-2 text-sm">위 폼을 작성하여 첫 번째 공지사항을 등록해보세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && <SuccessNoticeModal title={registeredTitle} onClose={() => setShowSuccessModal(false)} />}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDeleteModal && deletingNotice && (
          <DeleteNoticeConfirmModal
            title={deletingNotice.title}
            content={deletingNotice.content}
            createdAt={deletingNotice.created_at}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </AnimatePresence>

      {/* Delete Success Modal */}
      <AnimatePresence>
        {showDeleteSuccessModal && (
          <DeleteSuccessModal title={deletedTitle} onClose={() => setShowDeleteSuccessModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
