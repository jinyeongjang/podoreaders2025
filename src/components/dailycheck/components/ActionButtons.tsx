import { FaSpinner, FaCheck, FaFileExport } from 'react-icons/fa';

interface ActionButtonsProps {
  isSaving: boolean;
  handleExportClick: () => void;
  handleSaveToGoogleSheet: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isSaving, handleExportClick, handleSaveToGoogleSheet }) => {
  return (
    <>
      <button
        type="submit"
        disabled={isSaving}
        className="flex h-[70px] w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 text-white transition-all hover:bg-indigo-600 hover:shadow-md active:bg-indigo-700 disabled:bg-indigo-300">
        {isSaving ? <FaSpinner className="animate-spin" /> : <FaCheck />}
        <span>{isSaving ? '저장 중...' : '저장'}</span>
      </button>

      <button
        type="button"
        onClick={handleSaveToGoogleSheet}
        disabled={isSaving}
        className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-slate-500 px-4 text-white transition-all hover:bg-slate-600 hover:shadow-md active:bg-slate-700 disabled:bg-indigo-300">
        {isSaving ? <FaSpinner className="animate-spin" /> : <FaCheck />}
        <span>{isSaving ? '저장 중...' : '구글 스프레드 시트에 저장하기'}</span>
      </button>

      <button
        type="button"
        onClick={handleExportClick}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-500 px-4 py-3 text-white transition-all hover:bg-slate-600 active:bg-slate-700">
        <FaFileExport className="h-5 w-5" />
        <span>[가족장 권한] 엑셀로 내보내기</span>
      </button>
    </>
  );
};

export default ActionButtons;
