import React, { createContext, useContext, useState, useEffect } from 'react';

interface PrayerNote {
  id: number;
  prayerId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  password?: string;
}

interface AddNoteParams {
  title: string;
  content: string;
  isPrivate: boolean;
  password?: string;
  prayerId: number; // null을 허용하지 않음
}

interface PrayerNoteContextType {
  notes: PrayerNote[];
  addNote: (note: AddNoteParams) => void;
  updateNote: (id: number, note: Partial<PrayerNote>) => void;
  deleteNote: (id: number) => void;
  verifyPassword: (id: number, password: string) => boolean;
}

// Context 생성
const PrayerNoteContext = createContext<PrayerNoteContextType | undefined>(undefined);

// 로컬 스토리지 키
const STORAGE_KEY = 'prayerNotes';

export function PrayerNoteProvider({ children }: { children: React.ReactNode }) {
  // 기도 노트 상태 관리
  const [notes, setNotes] = useState<PrayerNote[]>([]);

  // 초기 로딩 시 로컬 스토리지에서 기도 노트 불러오기
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // 로컬 스토리지에 기도 노트 저장
  const saveNotes = (updatedNotes: PrayerNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  // 새로운 기도 노트 추가
  const addNote = (note: AddNoteParams) => {
    // 파라미터 타입 변경
    const now = new Date().toISOString();
    const newNote = {
      ...note,
      id: Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    saveNotes([newNote, ...notes]);
  };

  // 기존 기도 노트 수정
  const updateNote = (id: number, note: Partial<PrayerNote>) => {
    const updatedNotes = notes.map((item) =>
      item.id === id
        ? {
            ...item,
            ...note,
            updatedAt: new Date().toISOString(),
          }
        : item,
    );
    saveNotes(updatedNotes);
  };

  // 기도 노트 삭제
  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    saveNotes(updatedNotes);
  };

  // 비밀 기도 노트 비밀번호 확인
  const verifyPassword = (id: number, password: string) => {
    const note = notes.find((note) => note.id === id);
    if (!note || !note.isPrivate) return true;
    return note.password === password;
  };

  return (
    <PrayerNoteContext.Provider value={{ notes, addNote, updateNote, deleteNote, verifyPassword }}>
      {children}
    </PrayerNoteContext.Provider>
  );
}

// Custom Hook - Context 사용을 위한 래퍼
export function usePrayerNote() {
  const context = useContext(PrayerNoteContext);
  if (context === undefined) {
    throw new Error('usePrayerNote must be used within a PrayerNoteProvider');
  }
  return context;
}
