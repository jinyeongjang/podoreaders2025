interface TransportSelectorProps {
  publicTransport: 'subway' | 'bus' | 'car' | '';
  onTransportChange: (transport: 'subway' | 'bus' | 'car') => void;
}

export default function TransportSelector({ publicTransport, onTransportChange }: TransportSelectorProps) {
  return (
    <div className="rounded-xl bg-green-50 p-4">
      <label className="mb-3 block text-sm font-bold text-gray-800">🚇 교통 정보</label>
      <div className="grid grid-cols-3 gap-2 tracking-tighter">
        <button
          type="button"
          onClick={() => onTransportChange('subway')}
          className={`rounded-lg px-3 py-3 text-xs font-semibold transition ${
            publicTransport === 'subway' ? 'bg-sky-700 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}>
          지하철 가까워요
        </button>
        <button
          type="button"
          onClick={() => onTransportChange('bus')}
          className={`rounded-lg px-3 py-3 text-xs font-semibold transition ${
            publicTransport === 'bus' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}>
          버스정류장 가까워요
        </button>
        <button
          type="button"
          onClick={() => onTransportChange('car')}
          className={`rounded-lg px-3 py-3 text-xs font-semibold transition ${
            publicTransport === 'car' ? 'bg-gray-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}>
          차로 이동해요
        </button>
      </div>
    </div>
  );
}
