import { AnimatePresence, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import WordBoard from './thermometer/wordBoard';
import UserDetailPanel from './thermometer/UserDetailPanel';
import UserLegend from './thermometer/UserLegend';
import { ThermometerUser, getYutPosition } from './thermometer/utils';

interface ThermometerCard3Props {
  users: ThermometerUser[];
}

const ThermometerCard3 = ({ users }: ThermometerCard3Props) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);

  // 사용자 선택 핸들러
  const handleUserSelect = (userName: string) => {
    if (selectedUser === userName) {
      setSelectedUser(null);
      setDetailsVisible(false);
    } else {
      setSelectedUser(userName);
      setDetailsVisible(true);
    }
  };

  // 선택된 사용자의 데이터 가져오기
  const getSelectedUserData = () => {
    if (!selectedUser) return null;
    return users.find((user) => user.userName === selectedUser);
  };

  // 애니메이션 컨트롤러
  const bubbleControls = useAnimation();

  // 선택된 사용자가 변경될 때마다 애니메이션 재생
  useEffect(() => {
    if (detailsVisible && selectedUser) {
      bubbleControls.start((i) => ({
        y: [-20, -40, -20],
        opacity: [0, 1, 0],
        transition: {
          duration: 2,
          delay: i * 0.3,
          repeat: Infinity,
          repeatType: 'loop',
        },
      }));
    }
  }, [detailsVisible, selectedUser, bubbleControls]);

  // 같은 위치의 사용자들을 그룹화하는 함수
  const groupUsersByPosition = (users: ThermometerUser[]) => {
    const groups = new Map<string, ThermometerUser[]>();

    users.forEach((user) => {
      const position = getYutPosition(user.value);
      const key = `${position.x}-${position.y}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)?.push(user);
    });

    return groups;
  };

  const userGroups = groupUsersByPosition(users);
  const selectedUserData = getSelectedUserData();

  return (
    <div className="relative mx-auto min-h-[500px] max-w-4xl overflow-visible rounded-xl bg-white p-6 xs:min-h-[400px] xs:p-3">
      <h2 className="mb-6 text-center text-xl font-bold text-gray-800 xs:mb-3 xs:text-base">
        [개발중인 기능] 말씀 릴레이 온도 현황판
      </h2>

      {/* 워드 보드 영역 */}
      <WordBoard userGroups={userGroups} selectedUser={selectedUser} />

      {/* 선택된 사용자 상세 정보 표시 영역 */}
      <AnimatePresence>
        {detailsVisible && selectedUserData && (
          <UserDetailPanel userData={selectedUserData} bubbleControls={bubbleControls} />
        )}
      </AnimatePresence>

      {/* 사용자 범례 */}
      <UserLegend users={users} selectedUser={selectedUser} onUserSelect={handleUserSelect} />

      {/* 설명 섹션 */}
      <div className="mt-4 space-y-1.5 text-center">
        <p className="text-sm font-medium text-gray-700 xs:text-xs">3월부터 기록 시작(0°C) → 도착(100°C) 말씀 릴레이</p>
        <p className="text-xs text-gray-500 xs:text-[10px]">1회당 0.084°C씩 상승 (1189장 완독 시 100°C = 99.876)</p>
      </div>
    </div>
  );
};

export default ThermometerCard3;
