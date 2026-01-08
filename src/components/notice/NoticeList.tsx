import React from 'react';

// Notice 인터페이스 정의 - notices.tsx와 일치시킴
interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category: string; // 카테고리 필드 추가
}

// 카테고리 옵션 인터페이스
interface CategoryOption {
  value: string;
  label: string;
}

interface NoticeListProps {
  notices: Notice[];
  onEdit: (notice: Notice) => void;
  onDelete: (id: string, title: string) => void;
  formatDate: (dateString: string) => string;
  getCategoryBadgeColor: (category: string) => string;
  categories: CategoryOption[];
}

const NoticeList: React.FC<NoticeListProps> = ({
  notices,
  onEdit,
  onDelete,
  formatDate,
  getCategoryBadgeColor,
  categories,
}) => {
  return (
    <div className="space-y-4">
      {notices.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-lg text-gray-500">아직 등록된 공지사항이 없어요.</p>
          <p className="text-sm text-gray-400">첫 공지사항을 등록해볼까요?</p>
        </div>
      ) : (
        notices.map((notice) => (
          <div
            key={notice.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${getCategoryBadgeColor(notice.category)}`}>
                  {categories.find((cat) => cat.value === notice.category)?.label || '일반'}
                </span>
                <h3 className="text-lg font-bold">{notice.title}</h3>
              </div>
              <span className="text-sm text-gray-500">{formatDate(notice.createdAt)}</span>
            </div>

            <p className="mb-4 whitespace-pre-line text-gray-600">{notice.content}</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => onEdit(notice)}
                className="rounded-md bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-200">
                수정
              </button>
              <button
                onClick={() => onDelete(notice.id, notice.title)}
                className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-200">
                삭제
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NoticeList;
