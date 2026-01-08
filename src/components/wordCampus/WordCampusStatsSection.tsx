import { useState } from 'react';
import { FaUserFriends, FaCheck } from 'react-icons/fa';
import { MdFilterAltOff } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import WordCampusUserStatsCard from './stats/WordCampusUserStatsCard';

interface WordCampus_minhwa_QtRecord {
  id?: number;
  user_name: string;
  date: string;
  qt_count: number;
  bible_read_count: number;
  qt_done: boolean;
  bible_read_done: boolean;
  writing_done: boolean;
  dawn_prayer_attended: boolean;
  created_at?: string;
  updated_at?: string;
}

interface WordCampusStatsSectionProps {
  userList: string[];
  userStats: Record<
    string,
    {
      totalQt: number;
      totalBible: number;
      totalWriting: number;
      totalDawnPrayer: number;
      recordCount: number;
    }
  >;
  groupRecordsByWeek: Record<string, Record<string, WordCampus_minhwa_QtRecord[]>>;
  calculateWeekStats: (records: WordCampus_minhwa_QtRecord[]) => {
    qtTotal: number;
    bibleTotal: number;
    writingTotal: number;
    dawnPrayerTotal: number;
    days: number;
  };
  formatWeekLabel: (weekKey: string) => string;
}

export default function WordCampusStatsSection({
  userList,
  userStats,
  groupRecordsByWeek,
  calculateWeekStats,
  formatWeekLabel,
}: WordCampusStatsSectionProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // 필터링된 사용자 목록
  const displayedUsers = selectedUsers.length > 0 ? selectedUsers : userList;

  // 사용자 선택/해제
  const toggleUserSelection = (userName: string) => {
    setSelectedUsers((prev) => (prev.includes(userName) ? prev.filter((u) => u !== userName) : [...prev, userName]));
  };

  // 필터 초기화
  const clearFilter = () => {
    setSelectedUsers([]);
  };

  return (
    <div className="mb-4 overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-sm">
      {/* 헤더 */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <FaUserFriends className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">가족원 상세 통계</h2>
          {selectedUsers.length > 0 && (
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-white">
              {selectedUsers.length}명 선택
            </span>
          )}
        </div>

        {/* 팀원 선택 영역 - 항상 표시 */}
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-600">팀원을 선택하세요</p>
            {selectedUsers.length > 0 && (
              <button
                onClick={clearFilter}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:underline active:scale-95">
                <MdFilterAltOff className="h-3.5 w-3.5" />
                필터 초기화
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {userList.map((user) => {
              const isSelected = selectedUsers.includes(user);
              return (
                <button
                  key={user}
                  onClick={() => toggleUserSelection(user)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}>
                  {isSelected && <FaCheck className="h-3 w-3" />}
                  {user}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 필터 및 통계 카드 영역 */}
      <div className="p-6">
        {/* 선택된 사용자 태그 */}
        {selectedUsers.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <span
                key={user}
                className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                {user}
                <button onClick={() => toggleUserSelection(user)} className="hover:text-emerald-900">
                  <IoMdClose className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* 통계 카드 */}
        <div className="space-y-3">
          {displayedUsers.map((userName) => (
            <WordCampusUserStatsCard
              key={userName}
              userName={userName}
              stats={{
                qtTotal: userStats[userName]?.totalQt || 0,
                bibleTotal: userStats[userName]?.totalBible || 0,
                writingTotal: userStats[userName]?.totalWriting || 0,
                recordCount: userStats[userName]?.recordCount || 0,
              }}
              userWeeklyData={groupRecordsByWeek[userName] || {}}
              calculateWeekStats={calculateWeekStats}
              formatWeekLabel={formatWeekLabel}
              selectedUsers={selectedUsers}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
