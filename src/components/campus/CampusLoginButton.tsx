interface CampusLoginButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  attempts: number;
  campusId: string;
}

export default function CampusLoginButton({
  onClick,
  isLoading,
  isDisabled,
  attempts,
  campusId,
}: CampusLoginButtonProps) {
  // 캠퍼스 및 시도 횟수에 따라 버튼 색상 변경
  const getButtonGradient = () => {
    if (attempts >= 4) return 'from-red-500 to-red-600';

    switch (campusId) {
      case 'prayer':
        return 'from-indigo-500 to-blue-600';
      case 'word':
        return 'from-indigo-500 to-violet-600';
      default:
        return attempts >= 2 ? 'from-amber-600 to-amber-700' : 'from-amber-500 to-amber-600';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`relative w-full overflow-hidden rounded-lg bg-gradient-to-r ${getButtonGradient()} px-6 py-4 text-center font-medium text-white shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-${
        campusId === 'prayer' ? 'indigo' : campusId === 'word' ? 'emerald' : campusId === 'test' ? 'purple' : 'amber'
      }-500 disabled:opacity-50`}>
      {isLoading ? (
        <svg
          className="mx-auto h-5 w-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      ) : (
        '로그인'
      )}
    </button>
  );
}
