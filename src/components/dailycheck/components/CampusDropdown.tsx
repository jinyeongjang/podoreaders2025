import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

interface CampusData {
  id: number;
  name: string;
}

interface CampusDropdownProps {
  selectedCampus: string;
  showCampusDropdown: boolean;
  setShowCampusDropdown: (show: boolean) => void;
  handleCampusSelect: (campus: string) => void;
  campuses: CampusData[];
}

const CampusDropdown = ({
  selectedCampus,
  showCampusDropdown,
  setShowCampusDropdown,
  handleCampusSelect,
  campuses,
}: CampusDropdownProps) => {
  return (
    <div className="relative w-[100px] xs:w-[100px]">
      <button
        type="button"
        onClick={() => setShowCampusDropdown(!showCampusDropdown)}
        className="relative flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-lg text-gray-700 transition-all hover:border-indigo-500 hover:shadow-md focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 active:scale-95">
        <span>{selectedCampus || '캠퍼스'}</span>
        <FaChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${showCampusDropdown ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {showCampusDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            {campuses.map((campus) => (
              <button
                key={campus.id}
                type="button"
                onClick={() => handleCampusSelect(campus.name)}
                className="flex w-full items-center px-4 py-3 text-left text-gray-700 transition-colors hover:bg-indigo-50 active:bg-indigo-100">
                <span>{campus.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampusDropdown;
