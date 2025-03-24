import { useEffect, useState } from 'react';

interface MaintenanceBannerProps {
  message: string;
  startsAt: Date;
  endsAt?: Date;
}

const MaintenanceBanner: React.FC<MaintenanceBannerProps> = ({ message, startsAt, endsAt }) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // 남은 시간 계산 함수
  const calculateTimeRemaining = () => {
    const now = new Date();
    const diff = startsAt.getTime() - now.getTime();

    if (diff <= 0) return '지금';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}시간 ${minutes}분 후`;
    }
    return `${minutes}분 후`;
  };

  // 1분마다 남은 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000);

    // 초기 설정
    setTimeRemaining(calculateTimeRemaining());

    return () => clearInterval(timer);
  }, [startsAt]);

  return (
    <div className="mb-4 rounded-lg bg-yellow-50 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="font-medium text-yellow-800">{message}</p>
        </div>

        <div className="mt-2 flex sm:mt-0">
          <div className="ml-4 text-sm font-semibold text-yellow-700">
            <span>시작: {timeRemaining}</span>
            {endsAt && (
              <span className="ml-2">
                (예상 완료: {endsAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceBanner;
