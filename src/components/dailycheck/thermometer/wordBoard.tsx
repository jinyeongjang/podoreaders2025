import { motion } from 'framer-motion';
import { ThermometerUser, getYutPosition, getBackgroundColor, getOffsetPosition } from './utils';

interface wordBoardProps {
  userGroups: Map<string, ThermometerUser[]>;
  selectedUser: string | null;
}

const wordBoard = ({ userGroups, selectedUser }: wordBoardProps) => {
  return (
    <div className="relative aspect-square w-full overflow-visible rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-4 shadow-xl xs:p-2">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        {/* 지그재그 경로 - 10줄 */}
        <path
          d="M 5,5 L 95,5 L 95,15 L 5,15 L 5,25 L 95,25 L 95,35 L 5,35 L 5,45 L 95,45 L 95,55 L 5,55 L 5,65 L 95,65 L 95,75 L 5,75 L 5,85 L 95,85 L 95,95 L 5,95"
          fill="none"
          stroke="#4F46E5"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 정착점들 - 순서 반전 */}
        {Array.from({ length: 100 }).map((_, i) => {
          const pos = getYutPosition(100 - (i * 100) / 99);
          return (
            <circle
              key={i}
              cx={pos.x}
              cy={pos.y}
              r="1"
              fill={i === 99 ? '#FF0000' : i === 0 ? '#4F46E5' : '#FFFFFF'}
              stroke="#4F46E5"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>

      {/* 사용자 말 렌더링 */}
      <div className="absolute inset-[10px] mb-[4px] overflow-visible">
        {Array.from(userGroups.entries()).map(([posKey, groupUsers]) => (
          <div key={posKey}>
            {groupUsers.map((user, index) => (
              <UserMarker
                key={`${user.userName}-${index}`}
                user={user}
                index={index}
                samePositionUsers={groupUsers}
                isSelected={selectedUser === user.userName}
                selectedUser={selectedUser}
                totalUsers={groupUsers.length}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
interface UserMarkerProps {
  user: ThermometerUser;
  index: number;
  samePositionUsers: ThermometerUser[];
  isSelected: boolean;
  selectedUser: string | null;
  totalUsers: number;
}

const UserMarker = ({ user, index, samePositionUsers, isSelected, selectedUser, totalUsers }: UserMarkerProps) => {
  const basePosition = getYutPosition(user.value);
  const adjustedPosition = getOffsetPosition(
    basePosition,
    samePositionUsers.findIndex((u) => u.userName === user.userName),
    samePositionUsers.length,
  );

  return (
    <motion.div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isSelected ? 1 : selectedUser ? 0.3 : 1,
        scale: isSelected ? 1.2 : 1,
        left: `${adjustedPosition.x}%`,
        top: `${adjustedPosition.y}%`,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}>
      <div
        className={`group relative h-6 w-6 rounded-full bg-gradient-to-br shadow-lg transition-all duration-300 hover:z-50 hover:shadow-xl ${isSelected ? 'ring-4 ring-indigo-300 ring-opacity-50' : ''} ${getBackgroundColor(user.userName)}`}
        style={{
          zIndex: isSelected ? 50 : totalUsers - index,
          boxShadow: isSelected ? '0 0 20px rgba(99, 102, 241, 0.5)' : '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}>
        <div className="absolute left-1/2 top-[120%] z-[100] hidden -translate-x-1/2 rounded-lg bg-gray-800/90 px-3 py-2 text-sm text-white shadow-xl backdrop-blur-sm transition-all duration-200 group-hover:block group-hover:scale-100 xs:px-2 xs:py-1 xs:text-xs">
          <div className="font-medium">{user.userName}</div>
          <div className="mt-1 text-center font-bold tracking-wider">{user.value.toFixed(1)}°C</div>
        </div>
      </div>
    </motion.div>
  );
};

export default wordBoard;
