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
        className="hover:shadow-3xl mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-7 py-4 font-semibold text-white shadow-2xl transition-all duration-150 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50">
        {isSubmitting ? <FaSpinner className="h-5 w-5 animate-spin" /> : <FaPen className="h-5 w-5" />}
        {isSubmitting ? '등록 중...' : '가족장에게 전송하기'}
      </button>
    </div>
  );
};

export default SubmitButton;
