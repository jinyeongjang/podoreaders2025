interface UserStatsTabsProps {
  activeTab: 'stats' | 'prayers';
  setActiveTab: (tab: 'stats' | 'prayers') => void;
  prayersCount: number;
}

const UserStatsTabs = ({ activeTab, setActiveTab, prayersCount }: UserStatsTabsProps) => {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2 text-center text-sm font-medium ${
            activeTab === 'stats' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
          }`}>
          통계
        </button>
        <button
          onClick={() => setActiveTab('prayers')}
          className={`flex-1 py-2 text-center text-sm font-medium ${
            activeTab === 'prayers'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}>
          기도제목
          {prayersCount > 0 && (
            <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.5 text-xs text-indigo-800">
              {prayersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserStatsTabs;
