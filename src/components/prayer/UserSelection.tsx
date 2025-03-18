import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaUser, FaSpinner } from 'react-icons/fa';
import usersData from '../../data/users.json';

interface UserSelectionProps {
  selectedUser: string | undefined;
  onSelectUser: (name: string) => void;
  onResetUser: () => void;
}

const UserSelection: React.FC<UserSelectionProps> = ({ selectedUser, onSelectUser, onResetUser }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleUserSelect = (name: string) => {
    onSelectUser(name);
    setShowUserDropdown(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <label htmlFor="author" className="mt-5 block font-medium text-gray-700">
          작성자
        </label>
        {selectedUser && (
          <button
            type="button"
            onClick={onResetUser}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-gray-500 transition-all hover:border-violet-500 hover:text-violet-500 hover:shadow-md active:scale-95 xs:w-[100px] xs:px-1">
            <FaSpinner className="h-4 w-4" />
            초기화
          </button>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="relative flex h-[50px] w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 text-left text-[22px] text-sm text-gray-700 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-95">
          <div className="flex items-center gap-3">
            <FaUser className="h-5 w-5 text-gray-400" />
            <span className="text-base">{selectedUser || '작성자를 선택하세요'}</span>
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
              className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 absolute left-0 right-0 top-full z-50 mt-1 max-h-[400px] w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {usersData.users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleUserSelect(user.name)}
                  className="flex h-[50px] w-full items-center gap-3 px-4 text-left text-base text-gray-700 transition-colors hover:bg-indigo-50 active:bg-indigo-100">
                  <FaUser className="h-4 w-4 text-gray-400" />
                  <span>{user.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default UserSelection;
