import campusUsersWord_minhwa from '../../data/campusUsersWord_minhwa.json';

interface RecordsFilterProps {
  selectedUser: string;
  setSelectedUser: (user: string) => void;
  dateRange: 'week' | 'month' | 'all';
  setDateRange: (range: 'week' | 'month' | 'all') => void;
}

export default function RecordsFilter({ selectedUser, setSelectedUser, dateRange, setDateRange }: RecordsFilterProps) {
  return (
    <div className="mb-4 rounded-2xl border-2 border-gray-200 bg-white p-6 px-2">
      <div className="flex flex-wrap gap-4">
        {/* 팀원 선택 */}
        <div className="min-w-[200px] flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">팀원 선택</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200">
            <option value="all">전체 보기</option>
            {campusUsersWord_minhwa.users.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* 기간 선택 */}
        <div className="min-w-[200px] flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">기간</label>
          <div className="flex gap-2">
            <button
              onClick={() => setDateRange('week')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                dateRange === 'week' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              1주일
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                dateRange === 'month' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              1개월
            </button>
            <button
              onClick={() => setDateRange('all')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                dateRange === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              전체
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
