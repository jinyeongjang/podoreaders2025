import { FaStickyNote } from 'react-icons/fa';

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface NoticeSectionProps {
  notices: Notice[];
  handleNoticeClick: () => void;
  formatDate: (dateString: string) => string;
}

const NoticeSection = ({ notices, handleNoticeClick, formatDate }: NoticeSectionProps) => {
  const hasNotices = notices.length > 0;

  return (
    <div className="container mx-auto mb-6 w-full overflow-hidden rounded-xl bg-white shadow-md">
      <div className="relative">
        <div className="border-b border-indigo-100 bg-indigo-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-indigo-800">
              <FaStickyNote className="text-indigo-600" /> 공지사항
            </h3>
            <button
              onClick={handleNoticeClick}
              className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-200">
              더보기
            </button>
          </div>
        </div>

        {hasNotices ? (
          <div className="divide-y divide-gray-100">
            {notices.map((notice) => (
              <div key={notice.id} className="p-4">
                <h4 className="text-base font-medium text-indigo-800">{notice.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">{notice.content}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-500">공지</span>
                  <span className="text-xs text-gray-400">{formatDate(notice.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="m-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-8 text-center">
            <FaStickyNote className="mb-3 h-10 w-10 text-gray-300" />
            <p className="mb-4 text-gray-500">아직 등록된 공지사항이 없어요.</p>
            <button
              onClick={handleNoticeClick}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-all hover:bg-indigo-700 active:scale-95">
              <FaStickyNote className="h-4 w-4" /> 공지사항 등록하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeSection;
