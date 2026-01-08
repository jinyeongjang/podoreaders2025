import { motion } from 'framer-motion';

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface NoticeSectionProps {
  notices: Notice[];
  onNoticeClick: () => void;
  formatDate: (dateString: string) => string;
}

export default function NoticeSection({ notices, onNoticeClick, formatDate }: NoticeSectionProps) {
  // [지난공지] 문자열이 포함된 공지사항 필터링
  const hasOldNoticeTag = (notice: Notice) => {
    return notice.title.includes('[지난공지]') || notice.content.includes('[지난공지]');
  };

  // [지난공지] 태그가 없는 공지사항만 표시
  const recentNotices = notices.filter((notice) => !hasOldNoticeTag(notice));

  return (
    <>
      {/* 공지사항 2열 그리드 */}
      {recentNotices.length > 0 && (
        <div className="container mx-auto mb-4 grid w-full grid-cols-2 gap-3 xs:grid-cols-2">
          {recentNotices.map((notice) => (
            <motion.div
              key={notice.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNoticeClick}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 via-blue-50/50 to-blue-100/50 px-5 py-5 text-blue-900 shadow-lg shadow-blue-100/50 backdrop-blur-md transition-all hover:shadow-xl hover:shadow-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 xs:py-6">
              <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-blue-400/10 blur-2xl transition-all group-hover:bg-blue-400/20" />

              <div className="relative flex items-center justify-between">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 rounded-xl bg-blue-100 px-2 text-[10px] font-bold text-blue-600">
                      공지
                    </span>
                    <p className="text-[11px] font-medium tracking-tight text-blue-600/80 xs:text-[10px]">
                      {formatDate(notice.created_at)}
                    </p>
                  </div>

                  <h5 className="text-base font-bold tracking-tight text-slate-800 sm:text-lg">{notice.title}</h5>
                  <p className="text-sm font-medium text-blue-600/90">{notice.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
