import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronDown, FaUser } from 'react-icons/fa';

interface CampusUser {
  id: number;
  name: string;
}

interface UserDropdownProps {
  userName: string;
  showUserDropdown: boolean;
  setShowUserDropdown: (show: boolean) => void;
  campusUsers?: CampusUser[];
  handleUserSelect: (name: string) => void;
}

export default function UserDropdown({
  userName,
  showUserDropdown,
  setShowUserDropdown,
  campusUsers,
  handleUserSelect,
}: UserDropdownProps) {
  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => setShowUserDropdown(!showUserDropdown)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        animate={{
          background: userName
            ? [
                'linear-gradient(0deg, #818cf8, #a5b4fc)',
                'linear-gradient(120deg, #818cf8, #a5b4fc)',
                'linear-gradient(240deg, #818cf8, #a5b4fc)',
                'linear-gradient(360deg, #818cf8, #a5b4fc)',
              ]
            : undefined,
        }}
        transition={{
          background: {
            repeat: Infinity,
            duration: 8,
            ease: 'linear',
          },
        }}
        className={`group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border px-5 py-4 text-left text-lg shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-indigo-200 ${
          userName
            ? 'border-indigo-400 text-white shadow-indigo-200'
            : 'border-gray-300 bg-white text-gray-500 hover:border-indigo-300 hover:shadow-lg'
        }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="relative z-10 flex items-center gap-3">
          <div
            className={`rounded-full p-2 transition-all ${
              userName ? 'bg-white/20 shadow-lg backdrop-blur-sm' : 'bg-gray-100 group-hover:bg-indigo-100'
            }`}>
            <FaUser className={`h-4 w-4 ${userName ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'}`} />
          </div>
          <span className={`font-semibold ${userName ? 'text-white drop-shadow-md' : 'text-slate-800'}`}>
            {userName || '가족원을 선택해주세요'}
          </span>
        </div>
        <motion.div
          animate={{ rotate: showUserDropdown ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10">
          <FaChevronDown
            className={`h-5 w-5 transition-colors ${
              userName ? 'text-white' : 'text-white-500 group-hover:text-indigo-400'
            }`}
          />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showUserDropdown && campusUsers && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full z-20 mt-2 max-h-[400px] w-full overflow-hidden rounded-2xl border-2 border-indigo-200 bg-white/95 shadow-2xl shadow-indigo-100 backdrop-blur-sm">
            <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: '400px' }}>
              {campusUsers.map((user, index) => (
                <motion.button
                  key={user.id}
                  type="button"
                  onClick={() => handleUserSelect(user.name)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  whileHover={{ x: 4 }}
                  className={`group relative flex w-full items-center gap-4 border-b border-gray-100 px-5 py-4 text-left transition-all last:border-b-0 ${
                    userName === user.name
                      ? 'bg-gradient-to-r from-indigo-100 via-indigo-50 to-indigo-50 text-indigo-800'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-50'
                  }`}>
                  {/* Hover indicator */}
                  <div
                    className={`absolute left-0 top-0 h-full w-1 transition-all ${
                      userName === user.name
                        ? 'bg-gradient-to-b from-indigo-500 to-indigo-500'
                        : 'bg-transparent group-hover:bg-gradient-to-b group-hover:from-indigo-400 group-hover:to-indigo-400'
                    }`}
                  />

                  <div
                    className={`rounded-full p-2.5 transition-all ${
                      userName === user.name
                        ? 'bg-gradient-to-br from-indigo-400 to-indigo-500 shadow-lg shadow-indigo-200'
                        : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-indigo-400 group-hover:to-indigo-500'
                    }`}>
                    <FaUser
                      className={`h-4 w-4 transition-colors ${
                        userName === user.name ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      }`}
                    />
                  </div>
                  <span
                    className={`flex-1 font-medium transition-colors ${
                      userName === user.name ? 'text-indigo-900' : 'group-hover:text-indigo-700'
                    }`}>
                    {user.name}
                  </span>
                  {userName === user.name && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-500 shadow-lg">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
