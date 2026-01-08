import { useState } from 'react';
import { FaEdit, FaCheck } from 'react-icons/fa';

interface StatusMessageSectionProps {
  statusMessage: {
    message: string;
    updatedAt: string;
  };
  onSave: (message: string) => Promise<void>;
  formatDate: (dateString: string) => string;
}

export default function StatusMessageSection({ statusMessage, onSave, formatDate }: StatusMessageSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const handleEditClick = () => {
    setNewMessage(statusMessage.message);
    setIsEditing(true);
  };

  const handleSave = async () => {
    await onSave(newMessage.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto mb-6 w-full overflow-hidden rounded-xl bg-white shadow-md">
      <div className="relative">
        <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-800">캠퍼스 상태 메시지</h3>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-200">
                {statusMessage.message ? '수정' : '등록'}
              </button>
            )}
          </div>
        </div>

        <div className="p-4">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="오늘의 메시지를 입력해주세요"
                maxLength={200}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                rows={3}></textarea>
              <div className="flex justify-between">
                <p className="text-xs text-gray-500">{newMessage.length}/200자</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200">
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!newMessage.trim()}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 disabled:bg-gray-300">
                    <FaCheck className="h-3 w-3" /> 저장
                  </button>
                </div>
              </div>
            </div>
          ) : statusMessage.message ? (
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="whitespace-pre-wrap text-sm text-gray-800">{statusMessage.message}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {statusMessage.updatedAt && formatDate(statusMessage.updatedAt)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-8 text-center">
              <p className="mb-4 text-gray-500">아직 등록된 메시지가 없습니다</p>
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-all hover:bg-emerald-700 active:scale-95">
                <FaEdit className="h-4 w-4" /> 메시지 등록하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
