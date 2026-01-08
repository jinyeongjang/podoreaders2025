import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaThermometerHalf, FaBook, FaPlus, FaMinus } from 'react-icons/fa';
import { pretendard } from '../lib/fonts';
import Head from 'next/head';
import Header from '../components/layout/Header';
import NumberFlow from '@number-flow/react';

// hooks, 온도계산식
import { calculateTemperature } from '../hooks/useTemperatureStats';

// components
import Thermometer from '../components/temperature/Thermometer';
import ProgressBar from '../components/temperature/ProgressBar';

// 경험치 계산을 위한 함수들을 직접 정의
// 레벨 계산 함수
const calculateLevel = (chapters: number): number => {
  return Math.min(Math.floor(chapters / 10) + 1, 119);
};

// 경험치 계산 유틸리티 함수
const calculateExp = (chapters: number) => {
  // 현재 레벨에서의 경험치 퍼센트 계산 (다음 레벨까지)
  const currentLevel = calculateLevel(chapters);
  const chaptersForCurrentLevel = (currentLevel - 1) * 10;
  const chaptersInCurrentLevel = chapters - chaptersForCurrentLevel;
  const expPercentage = (chaptersInCurrentLevel / 10) * 100;

  return {
    current: chaptersInCurrentLevel,
    max: 10,
    percentage: Math.min(expPercentage, 100),
  };
};

// 레벨 타이틀 함수
const getLevelTitle = (level: number): string => {
  if (level < 5) return '말씀 초보';
  if (level < 15) return '말씀 견습생';
  if (level < 30) return '말씀 탐험가';
  if (level < 50) return '말씀 연구가';
  if (level < 75) return '말씀 전문가';
  if (level < 100) return '말씀 마스터';
  return '말씀 대가';
};

// ExperienceTracker 컴포넌트를 내부 컴포넌트로 구현
function ExperienceTracker({ chapters }: { chapters: number }) {
  // 레벨 및 경험치 계산
  const level = calculateLevel(chapters);
  const exp = calculateExp(chapters);
  const levelTitle = getLevelTitle(level);

  return (
    <div className="mt-4 rounded-xl bg-indigo-50 p-4 shadow-inner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <span className="text-sm font-bold">Lv.{level}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{levelTitle}</p>
            <div className="mt-1 text-xs text-gray-600">
              {exp.current}/{exp.max} 경험치
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-4 h-7 w-full overflow-hidden rounded-full bg-slate-400 shadow-md">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-400 to-purple-500"
          initial={{ width: '0%' }}
          animate={{ width: `${exp.percentage}%` }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[15px] font-medium text-white shadow-xl">
          {exp.percentage}%
        </div>
      </div>
    </div>
  );
}

export default function TemperatureCalculatorPage() {
  const [chapterCount, setChapterCount] = useState<string>('1');
  const [temperature, setTemperature] = useState<number>(() => calculateTemperature.bible(1));
  const [totalBibleChapters] = useState<number>(1189); // 성경 전체 장수 (구약 929 + 신약 260)
  const [showDirectInput, setShowDirectInput] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [showTempIncreaseInfo, setShowTempIncreaseInfo] = useState(false);
  const [showIncrementTooltip, setShowIncrementTooltip] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);

  // 현재 레벨과 경험치 계산
  const chaptersNum = parseInt(chapterCount) || 1;
  const level = calculateLevel(chaptersNum);
  const levelTitle = getLevelTitle(level);

  // 온도를 계산하는 함수 - useCallback으로 메모이제이션
  const calculateTemp = useCallback((chapters: number) => {
    return calculateTemperature.bible(chapters);
  }, []);

  // 빠른 값 조절을 위한 +/- 버튼 핸들러
  const handleIncrement = useCallback(() => {
    const currentValue = parseInt(chapterCount) || 0;
    const newValue = currentValue + 1;

    // 레벨업 체크
    const currentLevel = calculateLevel(currentValue);
    const newLevel = calculateLevel(newValue);

    if (newLevel > currentLevel) {
      setPreviousLevel(currentLevel);
      setShowLevelUp(true);

      // 3초 후 레벨업 알림 숨김
      setTimeout(() => setShowLevelUp(false), 3000);
    }

    setChapterCount(newValue.toString());
    setTemperature(calculateTemp(newValue));
    setShowIncrementTooltip(true);
  }, [chapterCount, calculateTemp]);

  // 툴팁을 1초 후 자동으로 숨기는 효과
  useEffect(() => {
    if (showIncrementTooltip) {
      const timer = setTimeout(() => {
        setShowIncrementTooltip(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showIncrementTooltip]);

  const handleDecrement = useCallback(() => {
    const currentValue = parseInt(chapterCount) || 0;
    const newValue = Math.max(1, currentValue - 1); // 최소값 1 유지
    setChapterCount(newValue.toString());
    setTemperature(calculateTemp(newValue));
  }, [chapterCount, calculateTemp]);

  // 직접 입력 처리 함수
  const handleDirectInput = () => {
    const num = parseInt(inputValue);
    if (!isNaN(num) && num >= 1) {
      // 최소값 1 유지
      setChapterCount(num.toString());
      setTemperature(calculateTemp(num));
      setShowDirectInput(false);
      setInputValue('');
    }
  };

  // 진행 퍼센트 계산 (전체 성경 기준)
  const progressPercent = Math.min(temperature, 100);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-white ${pretendard.className}`}>
      <Head>
        <title>말씀온도 계산기::포도리더스</title>
      </Head>

      <Header />

      <main className="container mx-auto max-w-[600px] px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="flex items-center text-2xl font-bold text-gray-800">
            <FaThermometerHalf className="mr-2 h-6 w-6 text-red-500" />
            개발기능 - 나의 말씀온도는 몇 도 일까요?
          </h1>
        </div>

        <p className="mb-6 ml-2 text-sm font-medium text-gray-500">
          1189장을 다 채웠을때 온도가 100°C 표시되지 않는 문제와 <br></br>남은장수가 0장으로 표시되지 않는 문제가
          있어요.
        </p>

        {/* 온도계 시각화 + 입력 영역 */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between">
            {/* 온도계 영역 */}
            <div className="mb-6 sm:mb-0">
              <Thermometer temperature={temperature} />
            </div>

            {/* 입력 영역 */}
            <div className="w-full max-w-xs">
              <div className="mb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <FaBook className="h-5 w-5 text-gray-600" />
                  <label htmlFor="chapters" className="text-sm font-medium text-gray-700">
                    말씀을 읽었던 장수를 입력하세요.
                  </label>
                </div>

                {/* 직접 입력 영역 */}
                {showDirectInput ? (
                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleDirectInput();
                        if (e.key === 'Escape') {
                          setShowDirectInput(false);
                          setInputValue('');
                        }
                      }}
                      className="h-[80px] w-full rounded-lg border border-gray-300 px-3 py-3 text-center text-xl font-bold text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      min="1" // 최소값 1로 설정
                      placeholder="말씀 장수를 숫자로만 입력하세요."
                      autoFocus
                    />
                    <div className="flex w-full gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setShowDirectInput(false)}
                        className="flex-1 rounded-lg bg-gray-100 py-5 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        취소
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleDirectInput}
                        className="flex-1 rounded-lg bg-indigo-500 py-5 text-sm font-medium text-white hover:bg-indigo-600">
                        확인
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 숫자 표시 및 +/- 버튼 */}
                    <div className="flex items-center justify-center">
                      <div
                        className="w-[220px] cursor-pointer items-center justify-center rounded-xl bg-gray-50 p-3 text-center text-[80px] font-bold text-gray-900 shadow-xl transition-all hover:bg-indigo-50"
                        onClick={() => setShowDirectInput(true)}>
                        <NumberFlow value={parseInt(chapterCount) || 1} />
                      </div>

                      <div className="ml-5 flex flex-col gap-2">
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={handleIncrement}
                            onMouseEnter={() => setShowTempIncreaseInfo(true)}
                            onMouseLeave={() => setShowTempIncreaseInfo(false)}
                            className="flex h-24 w-24 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-colors hover:bg-indigo-200 hover:shadow-md active:bg-indigo-300"
                            aria-label="장수 1 증가">
                            <FaPlus size={20} />
                          </motion.button>

                          {/* 온도 증가 툴팁 (호버 시) */}
                          <AnimatedTooltip show={showTempIncreaseInfo} position="-right-24 -top-10" />

                          {/* 클릭 시 표시되는 툴팁 */}
                          <AnimatePresence>
                            {showIncrementTooltip && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="pointer-events-none absolute -top-2 left-1/2 w-48 -translate-x-1/2 rounded-xl bg-indigo-500 px-3 py-2 text-center text-xs font-medium text-white shadow-lg">
                                <div className="flex items-center justify-center gap-1">
                                  <FaThermometerHalf className="h-3 w-3" />
                                  <span>+0.084°C 상승했습니다!</span>
                                </div>
                                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-indigo-500"></div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={handleDecrement}
                          className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 hover:shadow-md active:bg-gray-300"
                          aria-label="장수 1 감소"
                          disabled={parseInt(chapterCount) <= 1}>
                          <FaMinus size={20} />
                        </motion.button>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    {parseInt(chapterCount) || 1}장 / {totalBibleChapters}장
                  </span>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
              </div>

              {/* 경험치 및 레벨 정보 - 내부 컴포넌트 사용 */}
              <ExperienceTracker chapters={chaptersNum} />
            </div>
          </div>
        </div>

        {/* 온도 게이지 */}
        <div className="mb-8 rounded-xl bg-white p-5 shadow-lg">
          <ProgressBar temperature={temperature} />
        </div>

        {/* 레벨업 알림 */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-24 left-1/2 w-[300px] -translate-x-1/2 rounded-2xl bg-indigo-600 px-6 py-4 text-center text-white shadow-2xl">
              <h3 className="text-xl font-bold">레벨 업!</h3>
              <p className="text-indigo-200">
                Lv.{previousLevel} → Lv.{level}
              </p>
              <p className="mt-1 text-sm text-white">{levelTitle}이(가) 되었습니다!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 바닥 여백 - 네비게이션바와 겹침 방지 */}
        <div className="h-16"></div>
      </main>
    </div>
  );
}

// 툴팁 컴포넌트
const AnimatedTooltip = ({ show, position }: { show: boolean; position?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={show ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.2 }}
      className={`absolute ${position || '-right-24 -top-10'} w-48 -translate-y-1/2 rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-lg`}>
      <div className="flex items-center gap-2">
        <span>
          1장 추가 시 <strong className="text-blue-300">0.084°C</strong> 상승
        </span>
      </div>
    </motion.div>
  );
};
