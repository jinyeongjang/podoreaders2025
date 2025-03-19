import { ThermometerUser, getLegendColor } from './utils';

interface UserLegendProps {
  users: ThermometerUser[];
  selectedUser: string | null;
  onUserSelect: (userName: string) => void;
}

const UserLegend = ({ users, selectedUser, onUserSelect }: UserLegendProps) => {
  return (
    <div className="mt-6 grid grid-cols-4 gap-2 rounded-xl bg-gray-50/80 p-4 backdrop-blur-sm xs:mt-3 xs:grid-cols-3 xs:gap-2 xs:p-0">
      {users.map((user) => (
        <div
          key={user.userName}
          onClick={() => onUserSelect(user.userName)}
          className={`flex cursor-pointer items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md hover:ring-2 hover:ring-indigo-500 ${selectedUser === user.userName ? 'ring-2 ring-indigo-500' : ''} xs:gap-2 xs:p-2`}>
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm transition-transform xs:h-7 xs:w-7 ${getLegendColor(user.userName)}`}>
            <span className="text-sm font-bold text-white xs:text-xs">{user.userName[0]}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-800 xs:text-xs">{user.userName}</div>
            <div className="text-xs font-medium text-indigo-600 xs:text-[10px]">{user.value.toFixed(1)}°C</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserLegend;
