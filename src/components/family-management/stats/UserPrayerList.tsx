import { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import Pagination from '../../common/Pagination';

// Prayer 인터페이스 type 정의
interface Prayer {
  id: number;
  content: string;
  created_at: string;
  user_name: string;
}

interface UserPrayerListProps {
  prayers: Prayer[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const UserPrayerList = ({ prayers, totalPages, currentPage, onPageChange }: UserPrayerListProps) => {
  const [copiedPrayerId, setCopiedPrayerId] = useState<number | null>(null);

  // 텍스트 복사 핸들러
  const handleCopy = (text: string, id: number) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedPrayerId(id);
        setTimeout(() => setCopiedPrayerId(null), 2000);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-3">
      {prayers.length > 0 ? (
        prayers.map((prayer) => (
          <div key={prayer.id} className="rounded-lg bg-gray-50 p-3">
            <div className="px-2 py-2 text-sm text-gray-700">{prayer.content}</div>
            <div className="mt-1 flex items-center justify-between border-t border-gray-200 pt-2 text-xs text-gray-500">
              <span>{new Date(prayer.created_at).toLocaleDateString()}</span>
              <button
                onClick={() => handleCopy(prayer.content, prayer.id)}
                className="flex items-center gap-1 rounded-lg bg-indigo-100 px-2 py-1 text-indigo-700 transition-all hover:bg-indigo-200">
                {copiedPrayerId === prayer.id ? (
                  <>
                    <FaCheck size={10} />
                    <span>복사 완료</span>
                  </>
                ) : (
                  <>
                    <FaCopy size={10} />
                    <span>복사</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex h-32 items-center justify-center text-gray-500">기도제목이 없습니다</div>
      )}

      {/* 기도제목 Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};

export default UserPrayerList;
