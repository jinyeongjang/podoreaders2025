import { FaUserPlus, FaArrowRight } from 'react-icons/fa';

interface WelcomeCampusTutorialProps {
  onRegisterClick: () => void;
}

export default function WelcomeCampusTutorial({ onRegisterClick }: WelcomeCampusTutorialProps) {
  return (
    <div className="container mx-auto mb-8 mt-8 w-full overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
      <div className="relative p-6">
        {/* 상단 장식 선 */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full text-emerald-600">
            <FaUserPlus className="h-8 w-8" />
          </div>

          <h2 className="text-[27px] font-bold text-emerald-800">안녕하세요</h2>

          <h2 className="mb-10 text-[30px] font-bold text-emerald-800">포도리더스에 오신것을 환영해요.</h2>

          <p className="max-w-md text-emerald-600">
            아직은 낯설지만, 점차 익숙해 질 거예요. <br />
          </p>

          <p className="mb-10 max-w-md text-emerald-600">아래의 가족원 등록하기 버튼을 눌러볼까요?</p>

          <button
            onClick={onRegisterClick}
            className="group mb-4 flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-emerald-700">
            <span>가족원 등록하기</span>
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* 하단 설명 섹션 */}
      <div className="bg-white/50 p-4 text-center text-sm text-emerald-600">
        가족원 관리는 페이지가 완성된 후 사용할 수 있어요.
      </div>
    </div>
  );
}
