import { pretendard } from '../../lib/fonts';
import Header from '../../components/layout/Header';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaUserPlus, FaFileExport } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { supabase } from '../../lib/supabase';

// components
import SuccessFamilyRegistrationModal from '../../components/modals/SuccessFamilyRegistrationModal';
import FamilyMemberList from '../../components/family/FamilyMemberList';
import DeleteFamilyModal from '../../components/modals/DeleteFamilyModal';
import EditFamilyMemberModal from '../../components/modals/EditFamilyMemberModal';

interface FamilyMember {
  id: string;
  name: string;
  createdAt: string;
}

export default function FamilyRegistrationMinhwaPage() {
  const router = useRouter();

  // 캠퍼스 권한 확인
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',
  });

  // 등록된 가족원 목록
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // 폼 유효성 검사
  const [isFormValid, setIsFormValid] = useState(false);

  // 성공 모달 상태 관리
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredMember, setRegisteredMember] = useState<{ name: string } | null>(null);

  // 삭제 확인 모달 상태 관리
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string>('');
  const [memberToDeleteData, setMemberToDeleteData] = useState<{ name: string } | null>(null);

  // 수정 모달 상태 관리
  const [memberToEdit, setMemberToEdit] = useState<FamilyMember | null>(null);

  // 입력 필드 변경시 유효성 검사
  useEffect(() => {
    setIsFormValid(!!formData.name.trim());
  }, [formData.name]);

  // 권한 확인 및 가족원 목록 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
        try {
          const campusAuthorized = localStorage.getItem('campusAuthorized') === 'true';
          const selectedCampus = localStorage.getItem('selectedCampus');
          const lastPassword = localStorage.getItem('lastPassword');

          // 말씀 캠퍼스 민화팀 권한 확인
          if (
            campusAuthorized &&
            (selectedCampus === 'word_minhwa' || selectedCampus === 'word') &&
            lastPassword === '1234'
          ) {
            setIsAuthorized(true);
          } else {
            // 권한이 없으면 캠퍼스 선택 페이지로 리디렉션
            router.push('/campusSelect');
          }
        } catch (error) {
          console.error('권한 확인 중 오류 발생:', error);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();

      // Supabase에서 가족원 목록 불러오기 (민화팀 전용)
      const loadFamilyMembers = async () => {
        try {
          const { data, error } = await supabase
            .from('wordCampus_minhwa_family_members')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('가족원 목록 불러오기 오류:', error);
            // 오류 발생 시 로컬 스토리지에서 백업 데이터 불러오기
            const storedMembers = localStorage.getItem('campusFamilyMembers_minhwa');
            if (storedMembers) {
              const parsedMembers = JSON.parse(storedMembers);
              setFamilyMembers(parsedMembers);
            }
            return;
          }

          if (data) {
            // DB 데이터를 FamilyMember 형식으로 변환
            const members: FamilyMember[] = data.map((item) => ({
              id: item.id.toString(),
              name: item.name,
              createdAt: item.created_at,
            }));
            setFamilyMembers(members);
            // 로컬 스토리지에도 백업 저장
            localStorage.setItem('campusFamilyMembers_minhwa', JSON.stringify(members));
          }
        } catch (error) {
          console.error('가족원 목록 불러오기 오류:', error);
          // 오류 발생 시 로컬 스토리지에서 백업 데이터 불러오기
          const storedMembers = localStorage.getItem('campusFamilyMembers_minhwa');
          if (storedMembers) {
            const parsedMembers = JSON.parse(storedMembers);
            setFamilyMembers(parsedMembers);
          }
        }
      };

      loadFamilyMembers();
    }
  }, [router]);

  // 폼 필드 변경 핸들러
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) {
      alert('가족원 이름을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Supabase에 가족원 등록
      const { data, error } = await supabase
        .from('wordCampus_minhwa_family_members')
        .insert([{ name: formData.name }])
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const newMember: FamilyMember = {
          id: data[0].id.toString(),
          name: data[0].name,
          createdAt: data[0].created_at,
        };

        // 새 가족원 추가
        const updatedMembers = [newMember, ...familyMembers];

        // 상태 및 로컬 스토리지 업데이트 (민화팀 전용)
        setFamilyMembers(updatedMembers);
        localStorage.setItem('campusFamilyMembers_minhwa', JSON.stringify(updatedMembers));
        localStorage.setItem('campusFamilyRegistered_minhwa', 'true');

        // 등록된 가족원 정보 저장 및 성공 모달 표시
        setRegisteredMember({ name: formData.name });
        setShowSuccessModal(true);

        // 폼 초기화
        setFormData({
          name: '',
        });
      }
    } catch (error) {
      console.error('가족원 등록 오류:', error);
      alert('가족원 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 가족원 삭제 요청 처리
  const handleDeleteMember = (id: string) => {
    const memberData = familyMembers.find((member) => member.id === id);
    if (memberData) {
      setMemberToDelete(id);
      setMemberToDeleteData({
        name: memberData.name,
      });
      setShowDeleteModal(true);
    }
  };

  // 가족원 수정 요청 처리
  const handleEditMember = (member: FamilyMember) => {
    setMemberToEdit(member);
  };

  // 가족원 수정 확인 처리
  const confirmEditMember = async (editedMember: FamilyMember) => {
    try {
      // Supabase에서 가족원 정보 업데이트
      const { error } = await supabase
        .from('wordCampus_minhwa_family_members')
        .update({ name: editedMember.name })
        .eq('id', parseInt(editedMember.id));

      if (error) {
        throw error;
      }

      const updatedMembers = familyMembers.map((member) => (member.id === editedMember.id ? editedMember : member));
      setFamilyMembers(updatedMembers);
      localStorage.setItem('campusFamilyMembers_minhwa', JSON.stringify(updatedMembers));

      // 수정 모달 닫기
      setMemberToEdit(null);
    } catch (error) {
      console.error('가족원 수정 오류:', error);
      alert('가족원 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 수정 모달 닫기
  const closeEditModal = () => {
    setMemberToEdit(null);
  };

  // 삭제 확인 처리
  const confirmDeleteMember = async () => {
    try {
      // Supabase에서 가족원 삭제
      const { error } = await supabase
        .from('wordCampus_minhwa_family_members')
        .delete()
        .eq('id', parseInt(memberToDelete));

      if (error) {
        throw error;
      }

      const updatedMembers = familyMembers.filter((member) => member.id !== memberToDelete);
      setFamilyMembers(updatedMembers);
      localStorage.setItem('campusFamilyMembers_minhwa', JSON.stringify(updatedMembers));

      // 모달 닫기
      setShowDeleteModal(false);
      setMemberToDelete('');
      setMemberToDeleteData(null);
    } catch (error) {
      console.error('가족원 삭제 오류:', error);
      alert('가족원 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 삭제 모달 닫기
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setMemberToDelete('');
    setMemberToDeleteData(null);
  };

  // 성공 모달 닫기 핸들러
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setRegisteredMember(null);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 뒤로 가기 핸들러
  const handleBackClick = () => {
    router.back();
  };

  // 엑셀 내보내기 핸들러
  const handleExportToExcel = () => {
    if (familyMembers.length === 0) {
      alert('내보낼 가족원 데이터가 없습니다.');
      return;
    }

    // 엑셀 데이터 준비
    const excelData = familyMembers.map((member, index) => ({
      번호: index + 1,
      이름: member.name,
      등록일: formatDate(member.createdAt),
    }));

    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // 컬럼 너비 설정
    worksheet['!cols'] = [
      { wch: 8 }, // 번호
      { wch: 15 }, // 이름
      { wch: 15 }, // 등록일
    ];

    // 워크북 생성
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '가족원 목록');

    // 파일명 생성 (현재 날짜 포함)
    const today = new Date();
    const fileName = `정민화_가족원_목록_${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}.xlsx`;

    // 파일 다운로드
    XLSX.writeFile(workbook, fileName);
  };

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
          <p className="mt-4 text-green-700">권한을 확인하는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 권한이 없으면 빈 페이지 반환
  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <Head>
        <title>가족원 등록::노민화 가족 - 포도리더스</title>
        <meta name="description" content="노민화 가족 가족원을 등록하고 관리하세요." />
      </Head>

      <div className={`min-h-screen bg-gradient-to-b from-green-50 to-white ${pretendard.className}`}>
        <Header />

        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* 헤더 */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-green-800">가족원 등록</h1>
            <div className="flex gap-2">
              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
                <FaFileExport className="h-4 w-4" />
                엑셀 내보내기
              </button>
              <button
                onClick={handleBackClick}
                className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-green-700 transition-colors hover:bg-green-200">
                <FaArrowLeft className="h-4 w-4" />
                돌아가기
              </button>
            </div>
          </div>

          {/* 가족원 등록 폼 */}
          <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="border-b border-green-100 bg-green-50 px-6 py-4">
              <h2 className="text-xl font-bold text-green-800">새 가족원 등록</h2>
              <p className="mt-1 text-sm text-green-600">정민화 가족에 새로운 가족원을 추가합니다.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* 이름 입력 필드 */}
              <div className="mb-6">
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
                  가족원 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  maxLength={20}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  required
                />
                <div className="mt-1 text-right text-xs text-gray-500">{formData.name.length}/20자</div>
              </div>

              {/* 등록 버튼 */}
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300">
                <FaUserPlus className="h-4 w-4" />
                {isSubmitting ? '등록 중...' : '가족원 등록'}
              </button>
            </form>
          </div>

          {/* 등록된 가족원 목록 */}
          <FamilyMemberList
            members={familyMembers}
            onDelete={handleDeleteMember}
            onEdit={handleEditMember}
            formatDate={formatDate}
          />
        </div>

        {/* 성공 모달 */}
        <AnimatePresence>
          {showSuccessModal && registeredMember && (
            <SuccessFamilyRegistrationModal
              isOpen={showSuccessModal}
              familyMember={registeredMember}
              onClose={handleSuccessModalClose}
              onAddMore={handleSuccessModalClose}
              onGoHome={handleBackClick}
            />
          )}
        </AnimatePresence>

        {/* 삭제 확인 모달 */}
        <AnimatePresence>
          {showDeleteModal && memberToDeleteData && (
            <DeleteFamilyModal
              isOpen={showDeleteModal}
              title="가족원 삭제"
              memberName={memberToDeleteData.name}
              onConfirm={confirmDeleteMember}
              onClose={closeDeleteModal}
            />
          )}
        </AnimatePresence>

        {/* 수정 모달 */}
        <AnimatePresence>
          {memberToEdit && (
            <EditFamilyMemberModal member={memberToEdit} onSave={confirmEditMember} onClose={closeEditModal} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
