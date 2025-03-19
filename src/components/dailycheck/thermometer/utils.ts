// 사용자 인터페이스 정의
export interface ThermometerUser {
  userName: string;
  value: number;
  rank?: number;
}

// 컬러 스키마 정의
export const colorSchemes = [
  // rose, red, pink 계열
  { from: 'from-rose-400', to: 'to-red-500' },
  { from: 'from-red-400', to: 'to-rose-600' },
  { from: 'from-pink-400', to: 'to-rose-500' },
  { from: 'from-rose-400', to: 'to-pink-600' },

  // blue, indigo, sky, cyan 계열
  { from: 'from-blue-400', to: 'to-indigo-500' },
  { from: 'from-sky-400', to: 'to-blue-600' },
  { from: 'from-cyan-400', to: 'to-blue-500' },
  { from: 'from-indigo-400', to: 'to-blue-600' },

  // green, emerald, teal, lime 계열
  { from: 'from-green-400', to: 'to-emerald-500' },
  { from: 'from-emerald-400', to: 'to-teal-500' },
  { from: 'from-lime-400', to: 'to-green-600' },
  { from: 'from-teal-400', to: 'to-green-500' },

  // purple, violet, pink, fuchsia 계열
  { from: 'from-purple-400', to: 'to-violet-500' },
  { from: 'from-violet-400', to: 'to-purple-600' },
  { from: 'from-fuchsia-400', to: 'to-purple-500' },
  { from: 'from-pink-400', to: 'to-fuchsia-500' },

  // amber, orange, yellow, red 계열
  { from: 'from-amber-400', to: 'to-orange-500' },
  { from: 'from-yellow-400', to: 'to-amber-500' },
  { from: 'from-orange-400', to: 'to-red-500' },
  { from: 'from-yellow-400', to: 'to-orange-500' },
];

// 유저 컬러 인덱스 계산
export const getUserColorIndex = (userName: string) => {
  const sum = userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return sum % 20;
};

// 배경색 가져오기
export const getBackgroundColor = (userName: string) => {
  const colorIndex = getUserColorIndex(userName);
  const scheme = colorSchemes[colorIndex];
  return `${scheme.from} ${scheme.to}`;
};

// 범례 배경색 가져오기
export const getLegendColor = (userName: string) => {
  const colorIndex = getUserColorIndex(userName);
  const scheme = colorSchemes[colorIndex];
  return `bg-gradient-to-br ${scheme.from} ${scheme.to}`;
};

// 온도 위치 계산
export const getYutPosition = (value: number) => {
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const invertedPosition = Math.floor(((100 - normalizedValue) / 100) * 99);
  const row = Math.floor(invertedPosition / 10);
  const col = invertedPosition % 10;
  const isRightToLeft = row % 2 === 1;

  const y = 5 + row * 10;
  const x = isRightToLeft
    ? 95 - (col * 10 + col * 0.1)
    : 5 + (col * 10 + col * 0.1);

  return { x, y };
};

// 겹치는 말들을 대각선으로 배치
export const getOffsetPosition = (
  position: { x: number; y: number },
  index: number,
  total: number
) => {
  if (total <= 1) return position;

  const offsetRadius = 4;
  const angleStep = (Math.PI * 2) / total;
  const angle = angleStep * index - Math.PI / 4;

  return {
    x: position.x + Math.cos(angle) * offsetRadius,
    y: position.y + Math.sin(angle) * offsetRadius,
  };
};
