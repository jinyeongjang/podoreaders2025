import { FaUserPlus, FaTrash, FaEdit } from 'react-icons/fa';

interface FamilyMember {
  id: string;
  name: string;
  createdAt: string;
}

interface FamilyMemberListProps {
  members: FamilyMember[];
  onDelete: (id: string) => void;
  onEdit: (member: FamilyMember) => void;
  formatDate: (dateString: string) => string;
}

export default function FamilyMemberList({ members, onDelete, onEdit, formatDate }: FamilyMemberListProps) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 py-12 text-center">
        <FaUserPlus className="mb-4 h-16 w-16 text-gray-300" />
        <p className="text-gray-500">등록된 가족원이 없습니다.</p>
        <p className="mt-1 text-sm text-gray-400">위 폼을 통해 가족원을 등록해보세요!</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {members.map((member) => (
        <FamilyMemberItem key={member.id} member={member} onDelete={onDelete} onEdit={onEdit} formatDate={formatDate} />
      ))}
    </ul>
  );
}

interface FamilyMemberItemProps {
  member: FamilyMember;
  onDelete: (id: string) => void;
  onEdit: (member: FamilyMember) => void;
  formatDate: (dateString: string) => string;
}

function FamilyMemberItem({ member, onDelete, onEdit, formatDate }: FamilyMemberItemProps) {
  return (
    <li className="overflow-hidden rounded-lg border border-transparent bg-white p-4 transition-all hover:border-indigo-100 hover:bg-indigo-50/30">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-indigo-800">{member.name}</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(member)}
            className="flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-100 active:scale-95">
            <FaEdit size={12} /> 수정
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600 transition-all hover:bg-red-100 active:scale-95">
            <FaTrash size={12} /> 삭제
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-medium text-indigo-500">가족원</span>
        <span className="text-xs text-gray-400">{formatDate(member.createdAt)}</span>
      </div>
    </li>
  );
}
