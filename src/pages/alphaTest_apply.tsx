import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaCheck, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import Header from '../components/Header';
import { pretendard } from '../lib/fonts';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

interface AlphaTestForm {
  name: string;
  email: string;
  campus: string;
  experience: string;
  device: string;
  reason: string;
}

export default function AlphaTest() {
  const router = useRouter();
  const [form, setForm] = useState<AlphaTestForm>({
    name: '',
    email: '',
    campus: '',
    experience: '',
    device: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 이전 페이지로 돌아가는 함수
  const goBack = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('alpha_testers').insert([
        {
          ...form,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-white ${pretendard.className}`}>
        <Header showBackButton={true} onBackClick={goBack} title="알파테스트 신청" />
        <main className="container mx-auto max-w-2xl px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-8 text-center shadow-lg">
            <FaCheck className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h2 className="mb-4 text-2xl font-bold">알파테스트 신청이 완료되었습니다!</h2>
            <p className="mb-6 text-gray-600">검토 후 선정된 분들께 개별 연락 드리겠습니다.</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={goBack}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-2 text-white shadow-md transition-all hover:from-indigo-600 hover:to-blue-600">
              <div className="flex items-center gap-2">
                <FaArrowLeft className="h-4 w-4" />
                <span>홈으로 돌아가기</span>
              </div>
            </motion.button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-white ${pretendard.className}`}>
      <Header showBackButton={true} onBackClick={goBack} title="알파테스트 신청" />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-8 flex items-center gap-4">
            <div className="rounded-full bg-indigo-100 p-3">
              <FaRocket className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">포도리더스(가족장보고서) 알파테스트 신청</h1>
              <p className="mt-1 text-sm text-gray-600">개발단계이므로 안정성 및 추가 패치가 진행될 수 있습니다.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">가족장 및 부가족장님 이름</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 hover:border-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                이메일<br></br>알파테스트에 선정될 경우 필요한 인증코드를<br></br>발급받기 위해 유효한 이메일주소를
                입력해주세요.
              </label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 hover:border-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">소속 캠퍼스</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 hover:border-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={form.campus}
                onChange={(e) => setForm({ ...form, campus: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">사용 기기</label>
              <select
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 hover:border-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={form.device}
                onChange={(e) => setForm({ ...form, device: e.target.value })}>
                <option value="">선택해주세요</option>
                <option value="iOS">iOS (아이폰) 쓰고 있어요</option>
                <option value="Android">Android (안드로이드) 쓰고 있어요</option>
                <option value="both">둘 다 사용하고 있어요</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">알파테스트 경험</label>
              <select
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 hover:border-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}>
                <option value="">선택해주세요</option>
                <option value="yes">있음</option>
                <option value="no">없음</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                지원 동기<br></br>사용하는 목적이 맞지 않을경우 다른 가족장에게 기회가 제공될 수 있음을 양해바랍니다.
              </label>
              <textarea
                required
                className="mt-1 block h-32 w-full rounded-lg border border-gray-300 px-4 py-2 hover:border-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="알파테스트에 참여하고 싶은 이유를 작성해주세요."
              />
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={goBack}
                className="flex-1 rounded-xl bg-gray-200 py-3 text-gray-800 shadow-md transition-all hover:bg-gray-300">
                이전으로
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 py-3 text-white shadow-lg transition-all hover:from-indigo-600 hover:to-blue-600 disabled:opacity-50"
                type="submit">
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaSpinner className="h-5 w-5 animate-spin" />
                    제출 중...
                  </span>
                ) : (
                  '신청하기'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
