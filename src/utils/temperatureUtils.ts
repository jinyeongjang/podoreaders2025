// 온도에 따른 색상 및 메시지
export const getTemperatureColor = (temp: number) => {
  if (temp < 25)
    return {
      color: 'from-blue-300 to-blue-500',
      text: '차가움',
      stopColor1: '#93c5fd',
      stopColor2: '#3b82f6',
      bulbLight: '#bfdbfe',
      bulbDark: '#3b82f6',
    };
  if (temp < 50)
    return {
      color: 'from-green-300 to-green-500',
      text: '미지근함',
      stopColor1: '#86efac',
      stopColor2: '#22c55e',
      bulbLight: '#bbf7d0',
      bulbDark: '#22c55e',
    };
  if (temp < 75)
    return {
      color: 'from-yellow-300 to-yellow-500',
      text: '너무 뜨거워요 성령이 불타고 있어요!',
      stopColor1: '#fde047',
      stopColor2: '#eab308',
      bulbLight: '#fef9c3',
      bulbDark: '#eab308',
    };
  if (temp < 100)
    return {
      color: 'from-orange-300 to-orange-500',
      text: '너무 뜨거워요 성령이 불타고 있어요!',
      stopColor1: '#fdba74',
      stopColor2: '#f97316',
      bulbLight: '#fed7aa',
      bulbDark: '#f97316',
    };
  return {
    color: 'from-red-300 to-red-500',
    text: '너무 뜨거워요 성령이 불타고 있어요!',
    stopColor1: '#fca5a5',
    stopColor2: '#ef4444',
    bulbLight: '#fee2e2',
    bulbDark: '#ef4444',
  };
};
