export const getCurrentKSTDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const formatToKST = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const formatDateDisplay = (date: string | Date) => {
  const d = new Date(date);
  d.setHours(d.getHours() + 9);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
};
