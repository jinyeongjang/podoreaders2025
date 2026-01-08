import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/layout/Header';
import { pretendard } from '../../lib/fonts';
import { FaPaperPlane, FaArrowLeft, FaLocationArrow } from 'react-icons/fa';
import { supabase } from '../../lib/supabaseClient';

// components
import EditLocationModal from '../../components/modals/EditLocationModal';
import LocationList from '../../components/location/LocationList';
import SuccessLocationModal from '../../components/modals/SuccessLocationModal';
import DeleteLocationModal from '../../components/modals/DeleteLocationModal';
import DatePicker from '../../components/location/DatePicker';
import TimePicker from '../../components/location/TimePicker';

interface Location {
  id: string;
  name: string;
  address: string;
  details: string;
  meetDate: string;
  meetTime: string;
  createdAt: string;
}

export default function LocationsMinhwaPage() {
  const router = useRouter();

  // 캠퍼스 권한 확인
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 폼 상태 관리
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [details, setDetails] = useState('');
  const [meetDate, setMeetDate] = useState('');
  const [meetTime, setMeetTime] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);

  // 수정 모달 상태 관리
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // 등록 성공 모달 상태 관리
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredLocation, setRegisteredLocation] = useState<Location | null>(null);

  // 삭제 확인 모달 상태 관리
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string>('');
  const [locationToDeleteData, setLocationToDeleteData] = useState<Location | null>(null);

  // 권한 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
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
        setIsLoading(false);
      };

      checkAuth();

      // Supabase에서 모임장소 정보 불러오기
      const loadLocations = async () => {
        try {
          const { data, error } = await supabase
            .from('wordCampus_minhwa_locations')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('모임장소 로딩 중 오류 발생:', error);
            // 오류 발생 시 로컬 스토리지에서 백업 데이터 불러오기
            const savedLocations = localStorage.getItem('wordCampusLocations');
            if (savedLocations) {
              setLocations(JSON.parse(savedLocations));
            }
            return;
          }

          if (data) {
            // DB 데이터를 Location 형식으로 변환
            const locationData: Location[] = data.map((item) => ({
              id: item.id,
              name: item.name,
              address: item.address,
              details: item.details || '',
              meetDate: item.meet_date || '',
              meetTime: item.meet_time || '',
              createdAt: item.created_at,
            }));
            setLocations(locationData);
            // 로컬 스토리지에도 백업 저장
            localStorage.setItem('wordCampusLocations', JSON.stringify(locationData));
          }
        } catch (error) {
          console.error('모임장소 로딩 중 오류 발생:', error);
          // 오류 발생 시 로컬 스토리지에서 백업 데이터 불러오기
          const savedLocations = localStorage.getItem('wordCampusLocations');
          if (savedLocations) {
            setLocations(JSON.parse(savedLocations));
          }
        }
      };

      loadLocations();
    }
  }, [router]);

  // 모임장소 등록 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !address.trim()) {
      alert('모임 이름과 주소는 필수 입력 항목입니다.');
      return;
    }

    try {
      // Supabase에 새 모임장소 등록
      const { data, error } = await supabase
        .from('wordCampus_minhwa_locations')
        .insert({
          name,
          address,
          details: details || null,
          meet_date: meetDate || null,
          meet_time: meetTime || null,
        })
        .select()
        .single();

      if (error) {
        console.error('모임장소 등록 중 오류 발생:', error);
        alert('모임장소 등록에 실패했습니다.');
        return;
      }

      if (data) {
        // DB 데이터를 Location 형식으로 변환
        const newLocation: Location = {
          id: data.id,
          name: data.name,
          address: data.address,
          details: data.details || '',
          meetDate: data.meet_date || '',
          meetTime: data.meet_time || '',
          createdAt: data.created_at,
        };

        const updatedLocations = [newLocation, ...locations];
        setLocations(updatedLocations);

        // 로컬 스토리지에 백업 저장
        localStorage.setItem('wordCampusLocations', JSON.stringify(updatedLocations));

        // 등록된 모임장소 저장 및 성공 모달 표시
        setRegisteredLocation(newLocation);
        setShowSuccessModal(true);

        // 폼 초기화
        setName('');
        setAddress('');
        setDetails('');
        setMeetDate('');
        setMeetTime('');
      }
    } catch (error) {
      console.error('모임장소 등록 중 오류 발생:', error);
      alert('모임장소 등록에 실패했습니다.');
    }
  };

  // 성공 모달 닫기
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setRegisteredLocation(null);
  };

  // 모임장소 수정 시작 - 모달 표시
  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setShowEditModal(true);
  };

  // 모달에서 수정 저장
  const handleSaveEdit = async ({
    name,
    address,
    details,
    meetDate,
    meetTime,
  }: {
    name: string;
    address: string;
    details: string;
    meetDate: string;
    meetTime: string;
  }) => {
    if (editingLocation) {
      try {
        // Supabase에 모임장소 업데이트
        const { error } = await supabase
          .from('wordCampus_minhwa_locations')
          .update({
            name,
            address,
            details: details || null,
            meet_date: meetDate || null,
            meet_time: meetTime || null,
          })
          .eq('id', editingLocation.id);

        if (error) {
          console.error('모임장소 수정 중 오류 발생:', error);
          alert('모임장소 수정에 실패했습니다.');
          return;
        }

        // 수정된 내용으로 모임장소 업데이트
        const updatedLocations = locations.map((location) =>
          location.id === editingLocation.id
            ? {
                ...location,
                name,
                address,
                details,
                meetDate,
                meetTime,
              }
            : location,
        );

        setLocations(updatedLocations);
        localStorage.setItem('wordCampusLocations', JSON.stringify(updatedLocations));

        // 모달 닫기
        setShowEditModal(false);
        setEditingLocation(null);
      } catch (error) {
        console.error('모임장소 수정 중 오류 발생:', error);
        alert('모임장소 수정에 실패했습니다.');
      }
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingLocation(null);
  };

  // 모임장소 삭제 요청 처리 - 삭제 모달 표시
  const handleDelete = (id: string) => {
    const locationData = locations.find((location) => location.id === id) || null;
    if (locationData) {
      setLocationToDelete(id);
      setLocationToDeleteData(locationData);
      setShowDeleteModal(true);
    }
  };

  // 모임장소 삭제 확인 처리
  const confirmDelete = async () => {
    try {
      // Supabase에서 모임장소 삭제
      const { error } = await supabase.from('wordCampus_minhwa_locations').delete().eq('id', locationToDelete);

      if (error) {
        console.error('모임장소 삭제 중 오류 발생:', error);
        alert('모임장소 삭제에 실패했습니다.');
        return;
      }

      const updatedLocations = locations.filter((location) => location.id !== locationToDelete);
      setLocations(updatedLocations);

      // 로컬 스토리지에 저장
      localStorage.setItem('wordCampusLocations', JSON.stringify(updatedLocations));

      // 모달 닫기
      setShowDeleteModal(false);
      setLocationToDelete('');
      setLocationToDeleteData(null);
    } catch (error) {
      console.error('모임장소 삭제 중 오류 발생:', error);
      alert('모임장소 삭제에 실패했습니다.');
    }
  };

  // 삭제 모달 닫기
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setLocationToDelete('');
    setLocationToDeleteData(null);
  };

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-4 text-emerald-700">권한을 확인하는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 권한이 없으면 빈 페이지 반환
  if (!isAuthorized) {
    return null;
  }

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-emerald-50 to-white ${pretendard.className}`}>
      <Header />

      <main className="container mx-auto max-w-2xl px-4 py-2">
        {/* 뒤로가기 버튼 */}
        <div className="mb-4 mt-4">
          <button
            onClick={() => router.push('/campusSelect/wordCampus_minhwa')}
            className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-emerald-600 shadow-sm transition-all hover:bg-emerald-50 hover:text-emerald-800 active:scale-95">
            <FaArrowLeft className="h-4 w-4" /> 노민화 가족 페이지로 돌아가기
          </button>
        </div>

        {/* 모임장소 작성 폼 */}
        <div className="mb-8 rounded-xl bg-white p-0 shadow-lg">
          <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-emerald-700">
              <FaLocationArrow className="text-emerald-500" /> 모임장소를 등록해볼까요?
            </h2>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-lg font-semibold text-gray-700">
                  1. 모임 이름
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-3 text-lg transition-all hover:border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="예: 민화 가족 주간 모임"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="meetDateSection" className="mb-2 block text-lg font-semibold text-gray-700">
                  2. 모임 일시(선택)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <DatePicker value={meetDate} onChange={setMeetDate} />
                  <TimePicker value={meetTime} onChange={setMeetTime} />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="mb-2 block text-lg font-semibold text-gray-700">
                  3. 모임 주소(필수)
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-3 text-lg transition-all hover:border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="여기에 간단한 주소를 입력해요."
                />
              </div>

              <div className="mb-4">
                <label htmlFor="details" className="mb-2 block text-lg font-semibold text-gray-700">
                  4. 상세 정보(선택)
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="h-32 w-full rounded-xl border border-gray-300 p-3 text-lg transition-all hover:border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="모임 장소에 대한 추가정보를 입력해요."></textarea>
              </div>

              <div className="flex">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition-all hover:bg-emerald-700 focus:outline-none active:scale-95">
                  <FaPaperPlane /> 모임장소 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 등록된 모임장소 목록 */}
        <div className="rounded-xl bg-white p-0 shadow-lg">
          <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-4">
            <h2 className="text-xl font-bold text-emerald-700">등록된 모임장소</h2>
          </div>

          <div className="p-6">
            <LocationList locations={locations} onEdit={handleEdit} onDelete={handleDelete} formatDate={formatDate} />
          </div>
        </div>
      </main>

      {/* 수정 모달 */}
      {showEditModal && editingLocation && (
        <EditLocationModal location={editingLocation} onClose={handleCloseModal} onSave={handleSaveEdit} />
      )}

      {/* 등록 성공 모달 */}
      {registeredLocation && (
        <SuccessLocationModal
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
          location={registeredLocation}
        />
      )}

      {/* 삭제 확인 모달 */}
      {locationToDeleteData && (
        <DeleteLocationModal
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="모임장소 삭제"
          locationName={locationToDeleteData.name}
          locationAddress={locationToDeleteData.address}
          locationDetails={locationToDeleteData.details}
          meetDate={locationToDeleteData.meetDate}
          meetTime={locationToDeleteData.meetTime}
        />
      )}
    </div>
  );
}
