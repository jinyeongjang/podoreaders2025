import { FaCheck } from 'react-icons/fa';

interface CompletionButtonProps {
  isActive: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  label: string;
}

const CompletionButton: React.FC<CompletionButtonProps> = ({ isActive, onToggle, icon, label }) => {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center gap-3 rounded-xl ${
          isActive ? 'bg-indigo-50 ring-2 ring-indigo-500' : 'bg-gray-50 ring-1 ring-gray-200 hover:shadow-md'
        } px-4 py-3 transition-all hover:bg-indigo-50 active:bg-indigo-100`}>
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-md ${
            isActive ? 'bg-indigo-500 text-white' : 'bg-white ring-1 ring-gray-300'
          }`}>
          {isActive && <FaCheck size={14} />}
        </div>
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
      </button>
    </div>
  );
};

export default CompletionButton;
