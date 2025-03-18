import { FaSpinner, FaPen } from 'react-icons/fa';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-4 font-medium text-white shadow-xl transition hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50">
        {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPen className="h-4 w-4" />}
        {isSubmitting ? '등록 중...' : '가족장에게 전송하기'}
      </button>
    </div>
  );
};

export default SubmitButton;
