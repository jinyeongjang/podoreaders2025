import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const renderPageButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${
            i === currentPage ? 'bg-indigo-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          disabled={i === currentPage}>
          {i}
        </button>,
      );
    }

    return buttons;
  };

  if (totalPages <= 0) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        aria-label="이전">
        <HiChevronLeft className="h-5 w-5" />
      </button>

      {renderPageButtons()}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        aria-label="다음">
        <HiChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;
