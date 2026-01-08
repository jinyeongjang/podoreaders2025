import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface QtCheckQuickButtonProps {
  onClick: () => void;
}

const QtCheckQuickButton: React.FC<QtCheckQuickButtonProps> = ({ onClick }) => {
  return (
    <div className="rounded-xl transition-all">
      <div className="px-4 py-4">
        <div className="flex justify-center">
          <button
            onClick={onClick}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-12 py-3 text-white shadow-lg transition-all hover:bg-indigo-700 active:scale-95 xs:w-full xs:py-4"
            aria-label="QT 체크로 이동">
            <FaCheckCircle className="h-5 w-5" />
            <span className="font-medium">QT 체크인 하러가기!</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QtCheckQuickButton;
