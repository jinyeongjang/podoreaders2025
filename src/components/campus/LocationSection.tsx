import { FaLocationArrow, FaCalendarAlt, FaClock } from 'react-icons/fa';

interface Location {
  id: string;
  name: string;
  address: string;
  details: string;
  meetDate: string;
  meetTime: string;
  createdAt: string;
}

interface LocationSectionProps {
  locations: Location[];
  handleLocationClick: () => void;
}

const LocationSection = ({ locations, handleLocationClick }: LocationSectionProps) => {
  const hasLocations = locations.length > 0;

  return (
    <div className="container mx-auto mb-6 w-full overflow-hidden rounded-xl bg-white shadow-md">
      <div className="relative">
        <div className="border-b border-indigo-100 bg-indigo-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-indigo-800">
              <FaLocationArrow className="text-indigo-600" /> 모임장소
            </h3>
            <button
              onClick={handleLocationClick}
              className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-200">
              더보기
            </button>
          </div>
        </div>

        {hasLocations ? (
          <div className="p-4">
            {locations.map((location) => (
              <div key={location.id} className="rounded-lg bg-gray-50/80 p-4 hover:bg-gray-50">
                <h4 className="text-base font-medium text-indigo-800">{location.name}</h4>

                <div className="mt-2 flex items-start gap-2">
                  <FaLocationArrow className="mt-1 h-4 w-4 flex-shrink-0 text-indigo-500" />
                  <span className="text-sm text-gray-600">{location.address}</span>
                </div>

                {(location.meetDate || location.meetTime) && (
                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    {location.meetDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FaCalendarAlt className="text-indigo-400" /> {location.meetDate}
                      </div>
                    )}
                    {location.meetTime && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FaClock className="text-indigo-400" /> {location.meetTime}
                      </div>
                    )}
                  </div>
                )}

                {location.details && <p className="mt-2 text-sm text-gray-500">{location.details}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="m-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-8 text-center">
            <FaLocationArrow className="mb-3 h-10 w-10 text-gray-300" />
            <p className="mb-4 text-gray-500">아직 등록된 모임장소가 없어요.</p>
            <button
              onClick={handleLocationClick}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-all hover:bg-indigo-700 active:scale-95">
              <FaLocationArrow className="h-4 w-4" /> 모임장소 등록하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSection;
