import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEdit, FaCheckCircle } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import DatePicker from '../location/DatePicker';
import TimePicker from '../location/TimePicker';

interface Location {
  id: string;
  name: string;
  address: string;
  details: string;
  meetDate: string;
  meetTime: string;
  createdAt: string;
}

// 모달 Props 인터페이스
interface EditLocationModalProps {
  location: Location;
  onClose: () => void;
  onSave: (editedLocation: {
    name: string;
    address: string;
    details: string;
    meetDate: string;
    meetTime: string;
  }) => void;
}

// 완료 안내 모달 컴포넌트
function CompleteModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-4 w-full max-w-md overflow-hidden rounded-xl bg-white p-6 shadow-xl xs:p-5">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.7, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full xs:h-14 xs:w-14">
            <FaCheckCircle className="h-10 w-10 text-green-500 xs:h-8 xs:w-8" />
          </motion.div>
          <h3 className="mb-2 text-xl font-bold text-gray-800 xs:text-lg">수정 완료!</h3>
          <p className="mb-6 text-gray-600 xs:mb-5 xs:text-sm">
            모임장소가 수정되었어요. <br />
          </p>
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-4 font-medium text-white shadow-lg transition-all hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl active:scale-95 xs:gap-1.5 xs:py-3.5 xs:text-sm">
            확인
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function EditLocationModal({ location, onClose, onSave }: EditLocationModalProps) {
  const [name, setName] = useState(location.name);
  const [address, setAddress] = useState(location.address);
  const [details, setDetails] = useState(location.details || '');
  const [meetDate, setMeetDate] = useState(location.meetDate || '');
  const [meetTime, setMeetTime] = useState(location.meetTime || '');
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !address.trim()) {
      alert('모임 이름과 주소는 필수 입력 항목입니다.');
      return;
    }

    // 완료 모달 표시 후 저장
    setShowCompleteModal(true);
  };

  const handleConfirmSave = () => {
    // 완료 모달 닫고 변경사항 저장
    setShowCompleteModal(false);
    onSave({ name, address, details, meetDate, meetTime });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white tracking-tighter shadow-xl xs:max-h-[95vh] xs:w-[92vw] xs:overflow-auto">
        <div className="p-6 xs:p-4">
          {/* 헤더 영역 */}
          <div className="mb-4 flex items-center justify-between xs:mb-3">
            <div className="flex items-center gap-3 xs:gap-2">
              <FaMapMarkerAlt className="h-8 w-8 text-indigo-600 xs:h-6 xs:w-6" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 xs:text-base">모임장소 수정하기</h3>
                <p className="text-sm text-gray-600 xs:text-xs">모임장소 정보를 수정합니다</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-500"
              title="닫기">
              <IoMdClose className="h-6 w-6 xs:h-5 xs:w-5" />
            </button>
          </div>

          {/* 폼 내용 */}
          <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-3">
            <div>
              <label htmlFor="edit-name" className="mb-2 block text-sm font-medium text-gray-700 xs:mb-1.5 xs:text-xs">
                모임 이름
              </label>
              <input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-base transition-all hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 xs:p-2.5 xs:text-sm"
                placeholder="예: 1팀 주간 기도모임"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DatePicker value={meetDate} onChange={setMeetDate} />
              <TimePicker value={meetTime} onChange={setMeetTime} />
            </div>

            <div>
              <label
                htmlFor="edit-address"
                className="mb-2 block text-sm font-medium text-gray-700 xs:mb-1.5 xs:text-xs">
                모임 주소
              </label>
              <input
                id="edit-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-base transition-all hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 xs:p-2.5 xs:text-sm"
                placeholder="여기에 간단한 주소를 입력해요."
              />
            </div>

            <div>
              <label
                htmlFor="edit-details"
                className="mb-2 block text-sm font-medium text-gray-700 xs:mb-1.5 xs:text-xs">
                상세 정보
              </label>
              <textarea
                id="edit-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="h-32 w-full rounded-lg border border-gray-300 p-3 text-base transition-all hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 xs:h-24 xs:p-2.5 xs:text-sm"
                placeholder="모임 장소에 대한 추가정보를 입력해요."
              />
            </div>
          </form>

          {/* 푸터 */}
          <div className="mt-6 grid grid-cols-2 gap-4 xs:mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95 xs:py-3.5 xs:text-sm">
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-4 font-medium text-white shadow-lg transition-all hover:shadow-xl active:scale-95 xs:gap-1.5 xs:py-3.5 xs:text-sm">
              <FaEdit className="h-4 w-4 xs:h-3.5 xs:w-3.5" />
              수정하기
            </button>
          </div>
        </div>
      </motion.div>

      {/* 완료 안내 모달 */}
      {showCompleteModal && <CompleteModal onClose={handleConfirmSave} />}
    </motion.div>
  );
}
