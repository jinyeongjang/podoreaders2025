import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaCheck, FaPlus, FaEdit } from 'react-icons/fa';
import { supabase } from '../../lib/supabaseClient';
import { pretendard } from '../../lib/fonts';
import Header from '../../components/layout/Header';
import campusUsersUiwan from '../../data/campusUsersWord_uiwan.json';
import DecisionFormModal from '../../components/dailycheck/DecisionFormModal';
import DecisionSuccessModal from '../../components/dailycheck/DecisionSuccessModal';

// 한주간의 결단 타입
interface WeeklyDecision {
  id?: number;
  user_name: string;
  week_start_date: string; // 주의 시작일 (일요일)
  week_end_date: string; // 주의 종료일 (토요일)
  decision_text: string;
  created_at?: string;
  updated_at?: string;
}

const TABLE_NAME = 'wordCampus_uiwan_weekly_decisions';

export default function WordCampusUiwanDecision() {
  const router = useRouter();
  const [decisions, setDecisions] = useState<WeeklyDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingDecision, setEditingDecision] = useState<WeeklyDecision | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // 폼 상태
  const [formData, setFormData] = useState({
    decisionText: '',
  });

  // 사용자 목록을 JSON 파일에서 가져오기
  const users = campusUsersUiwan.users.map((u) => u.name);

  // 현재 주의 시작일과 종료일 계산
  const getCurrentWeekDates = () => {
    const today = new Date();
    const day = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - day);
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);

    return {
      startDate: sunday.toISOString().split('T')[0],
      endDate: saturday.toISOString().split('T')[0],
    };
  };

  // 결단 목록 불러오기
  const loadDecisions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('week_start_date', { ascending: false });

      if (error) throw error;
      setDecisions(data || []);
    } catch (error) {
      console.error('Failed to load decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecisions();
  }, []);

  // 결단 저장
  const handleSubmit = async () => {
    if (!selectedUser || !formData.decisionText) {
      alert('사용자와 결단 내용을 입력해주세요.');
      return;
    }

    const weekDates = getCurrentWeekDates();

    try {
      if (editingDecision) {
        // 수정
        const { error } = await supabase
          .from(TABLE_NAME)
          .update({
            decision_text: formData.decisionText,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingDecision.id);

        if (error) throw error;
        setIsEditMode(true);
        setShowSuccessModal(true);
      } else {
        // 새로 추가
        const { error } = await supabase.from(TABLE_NAME).insert([
          {
            user_name: selectedUser,
            week_start_date: weekDates.startDate,
            week_end_date: weekDates.endDate,
            decision_text: formData.decisionText,
          },
        ]);

        if (error) throw error;
        setIsEditMode(false);
        setShowSuccessModal(true);
      }

      // 폼 초기화는 모달 닫을 때 처리
    } catch (error) {
      console.error('Failed to save decision:', error);
      alert('저장에 실패했습니다.');
    }
  };

  // 수정 시작
  const handleEdit = (decision: WeeklyDecision) => {
    setEditingDecision(decision);
    setSelectedUser(decision.user_name);
    setFormData({
      decisionText: decision.decision_text,
    });
    setShowForm(true);
  };

  // 주차 포맷팅
  const formatWeek = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.getMonth() + 1}/${start.getDate()} ~ ${end.getMonth() + 1}/${end.getDate()}`;
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setShowSuccessModal(false);
    setFormData({ decisionText: '' });
    setShowForm(false);
    setEditingDecision(null);
    loadDecisions();
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${pretendard.className}`}>
        <Header />
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
            <p className="mt-4 text-gray-600">불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 ${pretendard.className}`}>
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-indigo-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-500 shadow-lg">
              <FaCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-indigo-600">김의완 가족</p>
              <h1 className="text-lg font-bold text-gray-900">한주간의 결단</h1>
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
      <div className="container mx-auto max-w-4xl px-4 py-6 pb-12">
        {/* 안내 섹션 */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
          <h2 className="mb-2 text-xl font-bold text-gray-900">한주간의 결단을 기록해보세요! ✨📖</h2>
          <p className="text-sm text-gray-600">
            한주간의 말씀을 통해 받은 은혜를 삶으로 실천하기 위한 구체적인 결단을 기록할 수 있어요.
          </p>
        </div>

        {/* 결단 작성 버튼 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <FaPlus className="h-5 w-5" />
          <span>한주간의 결단 작성하기</span>
        </motion.button>

        {/* 결단 작성 폼 모달 */}
        <DecisionFormModal
          isOpen={showForm}
          isEdit={!!editingDecision}
          users={users}
          selectedUser={selectedUser}
          decisionText={formData.decisionText}
          onUserChange={setSelectedUser}
          onDecisionTextChange={(text) => setFormData({ decisionText: text })}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingDecision(null);
            setFormData({ decisionText: '' });
          }}
        />

        {/* 결단 목록 */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">결단 목록</h3>

          {decisions.length === 0 ? (
            <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                <FaCheck className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-500">아직 작성된 결단이 없습니다.</p>
              <p className="mt-2 text-sm text-gray-400">첫 번째 결단을 작성해보세요!</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xs:grid-cols-2">
              {decisions.map((decision) => (
                <div
                  key={decision.id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:shadow-indigo-100/50">
                  {/* 헤더 */}
                  <div className="relative z-10 border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 px-4 py-3">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-600">{decision.user_name}</span>
                      </div>
                      <button
                        onClick={() => handleEdit(decision)}
                        className="rounded-lg p-1.5 text-gray-400 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm">
                        <FaEdit className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{formatWeek(decision.week_start_date, decision.week_end_date)}</span>
                    </div>
                  </div>

                  {/* 내용 */}
                  <div className="relative z-10 px-3 py-2">
                    <p className="ml-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                      {decision.decision_text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 성공 모달 */}
      <AnimatePresence>
        {showSuccessModal && (
          <DecisionSuccessModal
            userName={selectedUser}
            isEdit={isEditMode}
            decisionText={formData.decisionText}
            onClose={handleModalClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
