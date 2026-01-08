import { useRouter } from 'next/router';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import { RiUserHeartLine } from 'react-icons/ri';

export default function WordCampusUiwanGuide() {
  const router = useRouter();

  const usageSteps = [
    {
      number: '1',
      title: '가족원 선택',
      description: '가족원 선택 시 다음 큐티, 말씀 체크 편의를 위해 선택이 자동저장되어있습니다.',
    },
    {
      number: '2',
      title: '날짜 선택',
      description: '이전날짜, 이후날짜 모두 선택 가능합니다.',
    },
    {
      number: '3',
      title: '큐티 횟수 기록',
      description: '큐티를 했다면 큐티 횟수(일)에 1을 기록합니다.',
    },
    {
      number: '4',
      title: '말씀 읽기 기록',
      description: '말씀 읽기 횟수에 읽었던 장수를 기록합니다.',
    },
    {
      number: '5',
      title: '완료 여부 체크',
      description: '큐티, 말씀에 체크를 합니다. 추가로 필사 및 새벽기도를 했다면 함께 체크해놓습니다.',
    },
    {
      number: '6',
      title: '기록 저장',
      description: "기록하기 버튼을 누르고, '저장 완료' 알림이 나타났는지 확인합니다.",
    },
  ];

  const faqs = [
    {
      question: '기록 열람 기준이 어떻게 되나요? 포도리더스를 사용하면 좋은점이 무엇인가요?',
      answer: [
        '매주 주일~토요일 기준으로 (주단위) 및 가족원 단위 전체취합 기록을 볼 수 있습니다.',
        '이는 가족장님.부가족장님이 큐티, 말씀 기록을 취합하고 가족장보고서를 작성하는데 매우 도움이 됩니다.',
        '매일 날짜별로 기록하면, 한주마다 내가 큐티를 얼만큼 했고, 말씀을 얼마만큼 읽었는지 나의 신앙생활도 한번에 체크를 할 수 있습니다.',
      ],
    },
    {
      question: '큐티 및 말씀 읽었는데, 기록날짜를 놓쳤습니다 어떻게 할까요?',
      answer: [
        '해당 주에 큐티 및 말씀을 몰아서 체크해도 됩니다. (주일~토)',
        '또는 날짜별로 큐티했다면 해당날짜를 선택해서 하나씩 기록하는 것도 좋습니다.',
      ],
    },
    {
      question: '수정은 어떻게 하나요?',
      answer: [
        '해당 가족원-해당날짜 선택 후 큐티 또는 말씀 읽기 횟수 다시 기록 하면 덮어쓰기되어 수정됩니다.',
        '기록 후, 말씀을 추가로 더 읽었을경우도 있기때문에 당일 읽은 횟수를 언제든지 추가로 기록하여 체크할 수 있어요.',
        '날짜 변경은 문의해주시면 수정해드리겠습니다.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-emerald-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg">
              <RiUserHeartLine className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-600">포도리더스</p>
              <h1 className="text-lg font-bold text-gray-900">사용 가이드</h1>
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
              <h2 className="mb-3 text-xl font-bold text-gray-900 md:text-2xl">
                포도리더스 플랫폼에 오신 것을 환영해요! 👋✨
              </h2>
              <p className="mb-4 text-sm text-gray-600 md:text-base">
                오늘부터 말씀, 큐티를 하고 아래 플랫폼으로 기록을 하면 되는데, <br></br>처음이다 보니 익숙하지 않아
                어렵게 느껴지실 수도 있을 것 같습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Password Info */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-500 text-white shadow-lg">
              <FaLock className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-bold text-gray-900">비밀번호 안내</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  처음 김의완 가족 캠퍼스 접근 비밀번호는{' '}
                  <span className="font-bold text-indigo-600">&apos;5678&apos;</span> 입니다.
                </p>
                <p className="text-xs text-gray-600">
                  → 추후 캠퍼스 가족 확장시, 타 가족이 가족원 기록열람을 방지하기위한 안전장치입니다.
                  <br />
                  (비밀번호는 적응기간이 끝나면 변경 예정입니다.)
                </p>
                <p className="mt-3 rounded-lg bg-white/60 p-3 text-xs">
                  처음에만 비밀번호를 입력하고, 저장되면 바로 페이지가 열립니다. <br></br>이후 비밀번호 없이 가족원
                  페이지로 바로 이동됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Steps */}
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-bold text-gray-900">사용 방법</h3>
          <div className="space-y-3">
            {usageSteps.map((step, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-emerald-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-500 text-lg font-bold text-white shadow-md">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 font-bold text-gray-900">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-bold text-gray-900">자주 묻는 질문</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="bg-gradient-to-r from-gray-50 to-white p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                      Q{index + 1}
                    </span>
                    <h4 className="flex-1 font-bold text-gray-900">{faq.question}</h4>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                      A
                    </span>
                    <div className="flex-1 space-y-2">
                      {faq.answer.map((line, lineIndex) => (
                        <p key={lineIndex} className="text-sm leading-relaxed text-gray-700">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/campusSelect/wordCampus_uiwan')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl">
            <RiUserHeartLine className="h-6 w-6" />
            김의완 가족 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
