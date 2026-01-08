import { motion } from 'framer-motion';
import { FaCheckCircle, FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

interface Location {
  id: string;
  name: string;
  address: string;
  details: string;
  meetDate: string;
  meetTime: string;
  createdAt: string;
}

interface SuccessLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location;
}

const SuccessLocationModal: React.FC<SuccessLocationModalProps> = ({ isOpen, onClose, location }) => {
  if (!isOpen || !location) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white tracking-tighter shadow-xl">
        <div className="p-8">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
            <FaCheckCircle className="h-8 w-8 text-green-500" />
          </div>

          <h2 className="mb-3 text-2xl font-bold text-gray-900">모임장소 등록 완료</h2>

          <div className="mb-6 space-y-3 rounded-2xl bg-gray-50 p-4 text-gray-600">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="h-4 w-4 text-indigo-500" />
              <h4 className="font-semibold text-gray-800">{location.name}</h4>
            </div>
            <p className="pt-2 text-gray-600">{location.address}</p>
            {location.details && (
              <p className="pt-1 text-sm text-gray-500">
                {location.details.length > 100 ? `${location.details.substring(0, 100)}...` : location.details}
              </p>
            )}

            {(location.meetDate || location.meetTime) && (
              <div className="flex flex-wrap gap-4 pt-2 text-sm">
                {location.meetDate && (
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="h-3 w-3 text-indigo-500" />
                    <span>{location.meetDate}</span>
                  </div>
                )}
                {location.meetTime && (
                  <div className="flex items-center gap-1">
                    <FaClock className="h-3 w-3 text-indigo-500" />
                    <span>{location.meetTime}</span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 text-xs text-gray-500">{new Date(location.createdAt).toLocaleString('ko-KR')}</div>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full rounded-2xl bg-indigo-600 px-5 py-2.5 text-white shadow-sm hover:bg-indigo-700">
              확인
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessLocationModal;
