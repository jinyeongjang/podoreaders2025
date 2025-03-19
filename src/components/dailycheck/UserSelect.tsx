import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import usersData from '../../data/users.json';

interface UserSelectProps {
  userName: string;
  setUserName: (name: string) => void;
}

const UserSelect: React.FC<UserSelectProps> = ({ userName, setUserName }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleUserSelect = (name: string) => {
    setUserName(name);
    setShowUserDropdown(false);
  };

  const handleResetUser = () => {
    setUserName('');
    setShowUserDropdown(false);
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="relative flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-lg text-gray-700 transition-all hover:border-indigo-500 hover:shadow-md focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 active:scale-95">
          <div className="flex items-center gap-3">
            <FaUser className="h-5 w-5 text-gray-400" />
            <span>{userName || '가족원을 선택하세요'}</span>
          </div>

          <FaChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {showUserDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full z-10 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              {usersData.users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleUserSelect(user.name)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-gray-700 transition-colors hover:bg-indigo-50 active:bg-indigo-100">
                  <FaUser className="h-4 w-4 text-gray-400" />
                  <span>{user.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {userName && (
        <button
          type="button"
          onClick={handleResetUser}
          className="flex items-center justify-center rounded-xl border border-gray-300 px-4 text-gray-500 transition-all hover:border-violet-500 hover:text-violet-500 hover:shadow-md active:scale-95">
          초기화
        </button>
      )}
    </div>
  );
};

export default UserSelect;
