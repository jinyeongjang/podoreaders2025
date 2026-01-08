import { FaUsers, FaUserPlus } from 'react-icons/fa';

interface FamilyMember {
  id: string;
  name: string;
  createdAt: string;
}

interface FamilyMemberSectionProps {
  familyMembers: FamilyMember[];
  handleRegisterClick: () => void;
  formatDate: (dateString: string) => string;
}

export default function FamilyMemberSection({
  familyMembers,
  handleRegisterClick,
  formatDate,
}: FamilyMemberSectionProps) {
  const hasFamilyMembers = familyMembers.length > 0;

  return (
    <div className="container mx-auto mb-6 mt-6 w-full overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="border-b border-indigo-100 bg-indigo-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-indigo-700">
            <FaUsers className="text-indigo-500" /> 가족원 현황
          </h2>
          <button
            onClick={handleRegisterClick}
            className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-200">
            더보기
          </button>
        </div>
      </div>

      <div className="p-4">
        {hasFamilyMembers ? (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      이름
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      등록일
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {familyMembers.slice(0, 5).map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800">{member.name}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                        {formatDate(member.createdAt).split(' ')[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {familyMembers.length > 5 && (
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-center">
                <button
                  onClick={handleRegisterClick}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                  더보기
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-8 text-center">
            <FaUsers className="mb-3 h-10 w-10 text-gray-300" />
            <p className="mb-4 text-gray-500">아직 등록된 가족원이 없습니다.</p>
            <button
              onClick={handleRegisterClick}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-all hover:bg-indigo-700 active:scale-95">
              <FaUserPlus className="h-4 w-4" /> 가족원 등록하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
