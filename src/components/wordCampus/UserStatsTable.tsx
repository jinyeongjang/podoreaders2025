interface UserStats {
  totalQt: number;
  totalBible: number;
  totalWriting: number;
  totalDawnPrayer: number;
  recordCount: number;
}

interface UserStatsTableProps {
  userStats: Record<string, UserStats>;
  selectedUser: string;
}

export default function UserStatsTable({ userStats, selectedUser }: UserStatsTableProps) {
  if (selectedUser !== 'all') {
    return null;
  }

  return (
    <div className="mb-6 rounded-2xl border-2 border-gray-200 bg-white p-6 px-2">
      <h2 className="mb-4 ml-2 flex items-center gap-2 text-xl font-bold text-gray-900">가족원 통계</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="px-1 py-2 text-center text-sm font-semibold text-gray-700">이름</th>
              <th className="px-1 py-2 text-center text-sm font-semibold text-gray-700">QT</th>
              <th className="px-1 py-2 text-center text-sm font-semibold text-gray-700">말씀</th>
              <th className="px-1 py-2 text-center text-sm font-semibold text-gray-700">필사</th>
              <th className="px-1 py-2 text-center text-sm font-semibold text-gray-700">새벽기도</th>
              <th className="px-1 py-2 text-center text-sm font-semibold text-gray-700">기록 횟수</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(userStats)
              .sort((a, b) => b[1].totalQt - a[1].totalQt)
              .map(([userName, stats]) => (
                <tr key={userName} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-1 py-2 text-center font-medium text-gray-900">{userName}</td>
                  <td className="px-1 py-2 text-center font-semibold tracking-tighter text-emerald-600">
                    {stats.totalQt}회
                  </td>
                  <td className="px-1 py-2 text-center font-semibold tracking-tighter text-blue-600">
                    {stats.totalBible}장
                  </td>
                  <td className="px-1 py-2 text-center font-semibold tracking-tighter text-purple-600">
                    {stats.totalWriting}회
                  </td>
                  <td className="px-1 py-2 text-center font-semibold tracking-tighter text-orange-600">
                    {stats.totalDawnPrayer}회
                  </td>
                  <td className="px-1 py-2 text-center tracking-tighter text-gray-600">{stats.recordCount}회</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
