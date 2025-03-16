import { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { AttendanceRecord } from '../../pages/familyManagement';
import { AnimatePresence } from 'framer-motion';
import AttendanceRegistrationModal, { AttendanceSubmitData } from './AttendanceRegistrationModal';
import AttendanceSummary from './attendance/AttendanceSummary';
import CampusAttendanceList from './attendance/CampusAttendanceList';
import NoRecordsMessage from './attendance/NoRecordsMessage';

interface FamilyAttendanceViewProps {
  attendanceRecords: AttendanceRecord[];
  selectedDate: string;
  updateAttendanceStatus: (userId: number, date: string, isPresent: boolean, note?: string) => Promise<void>;
  familyMembers: { id: number; name: string; campus?: string; family_leader?: string }[]; // 가족원 목록
  bulkUpdateAttendance?: (data: AttendanceSubmitData) => Promise<void>; // 일괄 업데이트 함수
}

const FamilyAttendanceView: React.FC<FamilyAttendanceViewProps> = ({
  attendanceRecords,
  selectedDate,
  updateAttendanceStatus,
  familyMembers = [],
  bulkUpdateAttendance,
}) => {
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 해당 날짜에 대한 기록 필터링
  const filteredRecords = attendanceRecords.filter(
    (record) => new Date(record.date).toISOString().split('T')[0] === selectedDate,
  );

  // 캠퍼스별 그룹화
  const recordsByGroup = filteredRecords.reduce(
    (acc, record) => {
      const group = record.campus || '미지정';
      if (!acc[group]) acc[group] = [];
      acc[group].push(record);
      return acc;
    },
    {} as Record<string, AttendanceRecord[]>,
  );

  // 출석율 계산
  const attendanceRate =
    filteredRecords.length > 0
      ? Math.round((filteredRecords.filter((r) => r.is_present).length / filteredRecords.length) * 100)
      : 0;

  // 캠퍼스 목록
  const campusList = ['기도', '말씀', '찬양'];

  // 일괄 등록 처리 핸들러
  const handleBulkRegistration = async (data: AttendanceSubmitData) => {
    if (bulkUpdateAttendance) {
      await bulkUpdateAttendance(data);
      return;
    }

    // bulkUpdateAttendance가 제공되지 않는 경우
    try {
      // 일괄 등록 처리
      for (const member of data.members) {
        await updateAttendanceStatus(member.id, data.date, member.isPresent, member.note);
      }
      alert(`${data.members.length}명의 출석 정보가 등록되었습니다.`);
    } catch (error) {
      console.error('일괄 출석 등록 오류:', error);
      throw new Error('일괄 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 출결 통계 요약 */}
      <AttendanceSummary
        selectedDate={selectedDate}
        totalCount={filteredRecords.length}
        presentCount={filteredRecords.filter((r) => r.is_present).length}
        attendanceRate={attendanceRate}
      />

      {/* 출결 일괄 등록 버튼 */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md active:scale-95">
          <FaUserPlus className="h-4 w-4" />
          출결 일괄 등록
        </button>
      </div>

      {/* 캠퍼스별 출결 목록 */}
      {Object.entries(recordsByGroup).map(([campus, records]) => (
        <CampusAttendanceList
          key={campus}
          campus={campus}
          records={records}
          updateAttendanceStatus={updateAttendanceStatus}
          selectedDate={selectedDate}
        />
      ))}

      {/* 기록이 없는 경우 */}
      {filteredRecords.length === 0 && <NoRecordsMessage />}

      {/* 출결 일괄 등록 modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AttendanceRegistrationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleBulkRegistration}
            familyMembers={familyMembers}
            campusList={campusList}
            defaultDate={selectedDate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FamilyAttendanceView;
