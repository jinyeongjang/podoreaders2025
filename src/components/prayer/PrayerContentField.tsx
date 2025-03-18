interface PrayerContentFieldProps {
  content: string;
  onChange: (content: string) => void;
}

const PrayerContentField: React.FC<PrayerContentFieldProps> = ({ content, onChange }) => {
  return (
    <div>
      <label htmlFor="content" className="mb-2 mt-12 block font-medium text-gray-700">
        기도제목 내용
      </label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-2 block h-[250px] w-full rounded-lg border border-gray-300 py-3 pl-2 pr-4 text-lg shadow-sm transition-all hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  );
};

export default PrayerContentField;
