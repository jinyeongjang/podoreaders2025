import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

// 공지사항 인터페이스
interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

// 모임장소 인터페이스
interface Location {
  id: string;
  name: string;
  address: string;
  details: string;
  meetDate: string;
  meetTime: string;
  createdAt: string;
}

// 가족원 인터페이스
interface FamilyMember {
  id: string;
  name: string;
  createdAt: string;
}

// 상태메시지 인터페이스
interface StatusMessage {
  message: string;
  updatedAt: string;
}

export function useWordCampusMinhwa() {
  const router = useRouter();

  // 권한 관련 상태
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 상태
  const [notices, setNotices] = useState<Notice[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [hasFamilyMembers, setHasFamilyMembers] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({ message: '', updatedAt: '' });
  const [statusMessageId, setStatusMessageId] = useState<string>('');

  // 모달 상태
  const [showRandomPicker, setShowRandomPicker] = useState(false);

  // 권한 확인 및 데이터 로딩
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
        const campusAuthorized = localStorage.getItem('campusAuthorized') === 'true';
        const selectedCampus = localStorage.getItem('selectedCampus');
        const lastPassword = localStorage.getItem('lastPassword');

        if (
          campusAuthorized &&
          (selectedCampus === 'word_minhwa' || selectedCampus === 'word') &&
          lastPassword === '1234'
        ) {
          setIsAuthorized(true);
        } else {
          router.push('/campusSelect');
        }
        setIsLoading(false);
      };

      checkAuth();

      // Supabase에서 공지사항 불러오기
      const loadNotices = async () => {
        try {
          const { data, error } = await supabase
            .from('wordCampus_notices_minhwa')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

          if (error) {
            console.error('공지사항 로딩 중 오류 발생:', error);
            return;
          }

          if (data) {
            setNotices(data);
          }
        } catch (error) {
          console.error('공지사항 로딩 중 오류 발생:', error);
        }
      };

      loadNotices();

      // Supabase에서 모임장소 불러오기
      const loadLocations = async () => {
        try {
          const { data, error } = await supabase
            .from('wordCampus_minhwa_locations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);

          if (error) {
            console.error('모임장소 로딩 중 오류 발생:', error);
            // 오류 발생 시 localStorage에서 백업 데이터 불러오기
            const savedLocations = localStorage.getItem('wordCampusLocations');
            if (savedLocations) {
              const parsedLocations = JSON.parse(savedLocations);
              setLocations(parsedLocations.slice(0, 1));
            }
            return;
          }

          if (data) {
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
            localStorage.setItem('wordCampusLocations', JSON.stringify(locationData));
          }
        } catch (error) {
          console.error('모임장소 로딩 중 오류 발생:', error);
          const savedLocations = localStorage.getItem('wordCampusLocations');
          if (savedLocations) {
            const parsedLocations = JSON.parse(savedLocations);
            setLocations(parsedLocations.slice(0, 1));
          }
        }
      };

      loadLocations();

      // Supabase에서 가족원 목록 불러오기
      const loadFamilyMembers = async () => {
        try {
          const { data, error } = await supabase
            .from('wordCampus_minhwa_family_members')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('가족원 목록 불러오기 오류:', error);
            const storedMembers = localStorage.getItem('campusFamilyMembers_minhwa');
            if (storedMembers) {
              const parsedMembers = JSON.parse(storedMembers);
              setFamilyMembers(parsedMembers);
              setHasFamilyMembers(parsedMembers.length > 0);
            }
            return;
          }

          if (data) {
            const members: FamilyMember[] = data.map((item) => ({
              id: item.id.toString(),
              name: item.name,
              createdAt: item.created_at,
            }));
            setFamilyMembers(members);
            setHasFamilyMembers(members.length > 0);
            localStorage.setItem('campusFamilyMembers_minhwa', JSON.stringify(members));
          }
        } catch (error) {
          console.error('가족원 목록 불러오기 오류:', error);
          const storedMembers = localStorage.getItem('campusFamilyMembers_minhwa');
          if (storedMembers) {
            const parsedMembers = JSON.parse(storedMembers);
            setFamilyMembers(parsedMembers);
            setHasFamilyMembers(parsedMembers.length > 0);
          }
        }
      };

      loadFamilyMembers();

      // Supabase에서 상태메시지 불러오기
      const loadStatusMessage = async () => {
        try {
          const { data, error } = await supabase
            .from('wordCampus_status_minhwa')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('상태메시지 로딩 중 오류 발생:', error);
            return;
          }

          if (data) {
            setStatusMessage({
              message: data.message,
              updatedAt: data.updated_at,
            });
            setStatusMessageId(data.id);
          }
        } catch (error) {
          console.error('상태메시지 로딩 중 오류 발생:', error);
        }
      };

      loadStatusMessage();
    }
  }, [router]);

  // 상태메시지 저장
  const handleSaveStatusMessage = useCallback(
    async (messageToSave: string) => {
      try {
        if (statusMessageId) {
          const { error } = await supabase
            .from('wordCampus_status_minhwa')
            .update({ message: messageToSave })
            .eq('id', statusMessageId);

          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from('wordCampus_status_minhwa')
            .insert({ message: messageToSave })
            .select()
            .single();

          if (error) throw error;
          if (data) {
            setStatusMessageId(data.id);
          }
        }

        const { data: updatedData, error: fetchError } = await supabase
          .from('wordCampus_status_minhwa')
          .select('*')
          .eq('id', statusMessageId)
          .single();

        if (fetchError) throw fetchError;

        if (updatedData) {
          setStatusMessage({
            message: updatedData.message,
            updatedAt: updatedData.updated_at,
          });
        }
      } catch (error) {
        console.error('상태메시지 저장 중 오류 발생:', error);
        alert('상태메시지 저장에 실패했습니다.');
      }
    },
    [statusMessageId],
  );

  // 날짜 포맷팅
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, []);

  // 페이지 이동 핸들러
  const handleRegisterClick = useCallback(() => {
    router.push('/campusSelect/familyRegistration_minhwa');
  }, [router]);

  const handleNoticeClick = useCallback(() => {
    router.push('/campusSelect/wordCampus_minhwa_notices');
  }, [router]);

  const handleLocationClick = useCallback(() => {
    router.push('/campusSelect/wordCampus_minhwa_location');
  }, [router]);

  const handleRecordsClick = useCallback(() => {
    router.push('/campusSelect/wordCampus_minhwa_records');
  }, [router]);

  // 순서뽑기 모달
  const handleRandomPickerClick = useCallback(() => {
    setShowRandomPicker(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowRandomPicker(false);
  }, []);

  return {
    // 상태
    isAuthorized,
    isLoading,
    notices,
    locations,
    familyMembers,
    hasFamilyMembers,
    statusMessage,
    showRandomPicker,

    // 핸들러
    handleSaveStatusMessage,
    formatDate,
    handleRegisterClick,
    handleNoticeClick,
    handleLocationClick,
    handleRecordsClick,
    handleRandomPickerClick,
    handleCloseModal,
  };
}
