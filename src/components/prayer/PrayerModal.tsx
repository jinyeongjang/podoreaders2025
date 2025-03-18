import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { pretendard } from '../../lib/fonts';
import { useRouter } from 'next/router';
import { usePrayer } from '../../context/PrayerContext';
import { supabase } from '../../lib/supabaseClient';
import PrayerSuccessModal from './PrayerSuccessModal';
import PrayerFormHeader from './PrayerFormHeader';
import UserSelection from './UserSelection';
import PrayerContentField from './PrayerContentField';
import SubmitButton from './SubmitButton';

interface PrayerRequest {
  id: number;
  content: string;
  user_name: string;
  created_at: Date;
  updated_at: Date;
}

type PrayerInput = Omit<PrayerRequest, 'id' | 'created_at' | 'updated_at'>;

interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrayerModal({ isOpen, onClose }: PrayerModalProps) {
  const router = useRouter();
  usePrayer();
  const [newRequest, setNewRequest] = useState<Partial<PrayerInput>>({
    content: '',
    user_name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const modalRoot = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.getElementById('modal-root') || document.body;
    modalRoot.current = root;
    setMounted(true);

    return () => {
      setMounted(false);
      modalRoot.current = null;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.user_name || !newRequest.content) {
      alert('작성자와 기도제목 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('prayers')
        .insert([
          {
            content: newRequest.content,
            user_name: newRequest.user_name,
          },
        ])
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setShowSuccessModal(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('기도제목 전송 실패:', error);
      alert('기도제목 전송에 실패했습니다.');
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setNewRequest({
      content: '',
      user_name: '',
    });
    onClose();
    router.push('/');
  };

  const handleUserSelect = (name: string) => {
    setNewRequest({ ...newRequest, user_name: name });
  };

  const handleResetUser = () => {
    setNewRequest({ ...newRequest, user_name: '' });
  };

  const handleContentChange = (content: string) => {
    setNewRequest({ ...newRequest, content });
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm ${pretendard.className}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 500 }}
              className="h-[650px] w-[650px] overflow-hidden rounded-3xl bg-white px-5 py-8 tracking-tighter shadow-xl xs:w-[390px] xs:px-5 xs:py-5">
              <PrayerFormHeader onClose={onClose} />

              <form onSubmit={handleSubmit} className="space-y-4">
                <UserSelection
                  selectedUser={newRequest.user_name}
                  onSelectUser={handleUserSelect}
                  onResetUser={handleResetUser}
                />

                <PrayerContentField content={newRequest.content || ''} onChange={handleContentChange} />

                <SubmitButton isSubmitting={isSubmitting} />
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessModal && (
          <PrayerSuccessModal
            user_name={newRequest.user_name || ''}
            content={newRequest.content || ''}
            onClose={handleSuccessModalClose}
          />
        )}
      </AnimatePresence>
    </>,
    modalRoot.current !== null ? modalRoot.current : document.body,
  );
}
