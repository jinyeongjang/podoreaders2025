import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

interface FamilyMember {
  name: string;
}

interface SuccessFamilyRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMore: () => void;
  onGoHome: () => void;
  familyMember: FamilyMember;
}

const SuccessFamilyRegistrationModal: React.FC<SuccessFamilyRegistrationModalProps> = ({
  isOpen,
  onClose,
  familyMember,
}) => {
  if (!isOpen || !familyMember) return null;

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

          <h2 className="mb-3 text-2xl font-bold text-gray-900">가족원 등록 완료</h2>

          <div className="mb-6 space-y-3 rounded-2xl bg-gray-50 p-4 text-gray-600">
            <p className="font-medium text-gray-900">
              <span className="font-semibold text-indigo-600">{familyMember.name}</span>님의 가족원 등록이
              완료되었습니다.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex justify-between rounded-lg bg-white p-3 shadow-sm">
                <span className="font-medium text-gray-600">가족원 이름</span>
                <span className="font-semibold text-indigo-700">{familyMember.name}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
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

export default SuccessFamilyRegistrationModal;
