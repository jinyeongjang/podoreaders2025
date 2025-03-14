import ThermometerCard from '../dailycheck/ThermometerCard';

interface StatisticsSectionProps {
  totals: {
    qtTotal: number;
    bibleTotal: number;
  };
}

export default function StatisticsSection({ totals }: StatisticsSectionProps) {
  return (
    <div className="container mx-auto flex w-[640px] items-center gap-4 py-2 tracking-tighter xs:w-full">
      {/* QT 온도계 */}
      <div className="flex-1">
        <ThermometerCard title="가족원 전체 큐티 횟수" value={totals.qtTotal} unit="회" />
      </div>

      {/* 말씀 읽기 온도계 */}
      <div className="flex-1">
        <ThermometerCard title="가족원 전체 말씀 읽기" value={totals.bibleTotal} unit="장" />
      </div>
    </div>
  );
}
