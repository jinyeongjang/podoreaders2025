import { useState } from 'react';
import { useRouter } from 'next/router';

export const useHomeModals = () => {
  const router = useRouter();
  const [isPrayerModalOpen, setPrayerModalOpen] = useState(false);
  const [isNoteModalOpen, setNoteModalOpen] = useState(false);
  const [showDevFeatures, setShowDevFeatures] = useState(false);
  const [showDevFeatureModal, setShowDevFeatureModal] = useState(false);
  const [showExportFeatureModal, setShowExportFeatureModal] = useState(false);
  const [isFamilyAccessModalOpen, setFamilyAccessModalOpen] = useState(false);

  // 개발자 기능 핸들러
  const handleDevFeatureClick = () => {
    setShowDevFeatureModal(true);
  };

  // 개발자 기능 확인
  const handleDevFeatureConfirm = () => {
    setShowDevFeatureModal(false);
    setShowDevFeatures(true);
  };

  // 엑셀 내보내기 핸들러
  const handleExportToXLSX = () => {
    setShowExportFeatureModal(true);
  };

  // 가족 접근 핸들러
  const handleFamilyAccessClick = () => {
    setFamilyAccessModalOpen(true);
  };

  // 가족 접근 확인
  const handleFamilyAccessConfirm = (password: string) => {
    if (password === '2025') {
      setFamilyAccessModalOpen(false);
      router.push('/familyManagement');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  return {
    router,
    isPrayerModalOpen,
    setPrayerModalOpen,
    isNoteModalOpen,
    setNoteModalOpen,
    showDevFeatures,
    setShowDevFeatures,
    showDevFeatureModal,
    setShowDevFeatureModal,
    showExportFeatureModal,
    setShowExportFeatureModal,
    isFamilyAccessModalOpen,
    setFamilyAccessModalOpen,
    handleDevFeatureClick,
    handleDevFeatureConfirm,
    handleExportToXLSX,
    handleFamilyAccessClick,
    handleFamilyAccessConfirm
  };
};
