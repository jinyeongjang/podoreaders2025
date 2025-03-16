import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBook, FaBible, FaTrash } from 'react-icons/fa';
import DeleteConfirmModal from './DeleteConfirmModal';
import { DailyRecord } from '../../types/records';
import Pagination from '../common/Pagination';

interface RecordListProps {
  records: DailyRecord[];
  handleDeleteRecord: (date: string, userName: string) => void;
  selectedDate?: string;
}

const RecordList: React.FC<RecordListProps> = ({ records = [], handleDeleteRecord, selectedDate }) => {
  const [deleteConfirm, setDeleteConfirm] = useState<{
    date: string;
    userName: string;
    record: {
      qtCount: number;
      bibleReadCount: number;
      qtDone: boolean;
      bibleReadDone: boolean;
      writingDone: boolean;
    };
  } | null>(null);

  // 페이지네이션 관련 상태 추가
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage] = useState<number>(10); // 한 페이지당 보여줄 기록 수
  const [paginatedRecords, setPaginatedRecords] = useState<DailyRecord[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  // 전체 기록이 변경되면 페이지네이션 정보 업데이트
  useEffect(() => {
    // 총 페이지 수 계산
    const totalPagesCount = Math.max(1, Math.ceil(records.length / recordsPerPage));
    setTotalPages(totalPagesCount);

    // 현재 페이지가 총 페이지 수보다 크면 마지막 페이지로 조정
    if (currentPage > totalPagesCount) {
      setCurrentPage(totalPagesCount);
    }

    // 현재 페이지에 맞는 기록들 추출
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, records.length);
    setPaginatedRecords(records.slice(startIndex, endIndex));
  }, [records, currentPage, recordsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 기록 목록 상단으로 부드럽게 이동
    document.getElementById('records-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteClick = (record: DailyRecord) => {
    setDeleteConfirm({
      date: record.date,
      userName: record.userName,
      record: {
        qtCount: record.qtCount,
        bibleReadCount: record.bibleReadCount,
        qtDone: record.qtDone, // 기본값 설정
        bibleReadDone: record.bibleReadDone, // 기본값 설정
        writingDone: record.writingDone,
      },
    });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      handleDeleteRecord(deleteConfirm.date, deleteConfirm.userName);
      setDeleteConfirm(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      id="records-container">
      {/* 결과 개수 표시 */}
      <div className="ml-2 mt-5 text-sm font-medium text-gray-600">
        총 <span className="text-[18px] font-bold text-indigo-600">{records.length}</span>개의 기록이 있어요
      </div>

      {/* 기록 목록 */}
      <div className="space-y-2">
        {paginatedRecords.length > 0 ? (
          paginatedRecords.map((record) => (
            <motion.div
              key={`${record.date}-${record.userName}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 flex items-center justify-between rounded-xl bg-white p-4 tracking-tighter shadow-md transition-all xs:items-start ${selectedDate === record.date ? 'ring-2 ring-indigo-500' : ''}`}>
              <div className="flex items-center gap-4 xs:flex-col xs:items-start xs:gap-2">
                <div className="text-sm font-medium text-gray-500">
                  {new Date(record.date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })}
                  <span className="ml-2 text-indigo-600">{record.userName}</span>
                </div>
                <div className="flex items-center gap-4 xs:mt-2 xs:flex-wrap xs:gap-2">
                  <div className="flex items-center gap-1">
                    <FaBook className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">{record.qtCount || 0}회</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaBible className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">{record.bibleReadCount || 0}장</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {record.qtDone && (
                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-600">
                        큐티 완료
                      </span>
                    )}
                    {record.bibleReadDone && (
                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-600">
                        말씀 완료
                      </span>
                    )}
                    {record.writingDone && (
                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-600">
                        필사 완료
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteClick(record)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 xs:self-end"
                aria-label="기록 삭제">
                <FaTrash size={16} />
              </button>
            </motion.div>
          ))
        ) : (
          <div className="rounded-xl bg-gray-50 p-8 text-center">
            <p className="text-gray-500">등록된 기록이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 컴포넌트 */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}

      <AnimatePresence>
        {deleteConfirm && (
          <DeleteConfirmModal
            date={deleteConfirm.date}
            userName={deleteConfirm.userName}
            record={deleteConfirm.record}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecordList;
