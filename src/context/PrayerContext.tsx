import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// 기도 요청의 기본 구조를 정의하는 인터페이스
export interface PrayerRequest {
  id: number; // 기도 요청의 고유 식별자
  title: string; // 기도 제목
  content: string; // 기도 내용
  author: string; // 작성자 이름
  authorId: number; // 작성자 ID
  createdAt: string; // 생성 일시
  updatedAt: string; // 수정 일시
}

// 기도 컨텍스트에서 사용할 메서드들의 타입 정의
interface PrayerContextType {
  prayers: PrayerRequest[];
  setPrayers: (prayers: PrayerRequest[]) => void;
  addPrayer: (prayer: Omit<PrayerRequest, 'id' | 'createdAt'>) => Promise<PrayerRequest>;
  updatePrayer: (id: number, prayer: Partial<PrayerRequest>) => Promise<PrayerRequest | null>;
  deletePrayer: (id: number) => Promise<void>;
  getPrayer: (id: number) => Promise<PrayerRequest | null>;
}

// Context 생성
const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

// Provider 컴포넌트
export function PrayerProvider({ children }: { children: ReactNode }) {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 초기 로드 시 localStorage에서 데이터 불러오기
  useEffect(() => {
    const savedPrayers = localStorage.getItem('prayers');
    if (savedPrayers) {
      setPrayers(JSON.parse(savedPrayers));
    }
    setIsLoaded(true);
  }, []);

  // prayers 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('prayers', JSON.stringify(prayers));
    }
  }, [prayers, isLoaded]);

  // 새로운 기도 요청 추가
  const addPrayer = async (prayer: Omit<PrayerRequest, 'id' | 'createdAt'>): Promise<PrayerRequest> => {
    try {
      const { data, error } = await supabase.from('prayers').insert(prayer).select().single();

      if (error) throw error;

      const newPrayer: PrayerRequest = {
        ...data,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setPrayers((prev) =>
        [...prev, newPrayer].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      );
      return newPrayer;
    } catch (error) {
      console.error('Failed to add prayer:', error);
      throw error;
    }
  };

  // 기존 기도 요청 수정
  const updatePrayer = async (id: number, updates: Partial<PrayerRequest>): Promise<PrayerRequest | null> => {
    if (!id || !updates) return null;

    try {
      const { data, error } = await supabase.from('prayers').update(updates).eq('id', id).select().single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating prayer:', error);
      throw error;
    }
  };

  // 기도 요청 삭제
  const deletePrayer = async (id: number): Promise<void> => {
    try {
      const { error } = await supabase.from('prayers').delete().eq('id', id);
      if (error) throw error;

      setPrayers((prev) => prev.filter((prayer) => prayer.id !== id));
    } catch (error) {
      console.error('Failed to delete prayer:', error);
      throw error;
    }
  };

  // Context에 제공할 값들
  const value = {
    prayers,
    setPrayers,
    addPrayer,
    updatePrayer,
    deletePrayer,
  };

  // 초기 로드가 완료되지 않았으면 null 반환
  if (!isLoaded) {
    return null;
  }

  return <PrayerContext.Provider value={value}>{children}</PrayerContext.Provider>;
}

// Custom Hook
export function usePrayer() {
  const context = useContext(PrayerContext);
  if (context === undefined) {
    throw new Error('usePrayer must be used within a PrayerProvider');
  }
  return context;
}
