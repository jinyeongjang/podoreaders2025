import { FaLocationArrow, FaCalendarAlt, FaClock, FaEdit, FaTrash } from 'react-icons/fa';

interface Location {
  id: string;
  name: string;
  address: string;
  details: string;
  meetDate: string;
  meetTime: string;
  createdAt: string;
}

interface LocationListProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
}

export default function LocationList({ locations, onEdit, onDelete, formatDate }: LocationListProps) {
  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 py-12 text-center">
        <FaLocationArrow className="mb-4 h-16 w-16 text-gray-300" />
        <p className="text-gray-500">등록된 모임장소가 없습니다.</p>
        <p className="mt-1 text-sm text-gray-400">새로운 모임장소를 등록해보세요!</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {locations.map((location) => (
        <LocationItem
          key={location.id}
          location={location}
          onEdit={onEdit}
          onDelete={onDelete}
          formatDate={formatDate}
        />
      ))}
    </ul>
  );
}

interface LocationItemProps {
  location: Location;
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
}

function LocationItem({ location, onEdit, onDelete, formatDate }: LocationItemProps) {
  return (
    <li className="overflow-hidden rounded-lg border border-transparent bg-white p-4 transition-all hover:border-indigo-100 hover:bg-indigo-50/30">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-indigo-800">{location.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(location)}
            className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-600 transition-all hover:bg-amber-100 active:scale-95">
            <FaEdit size={12} /> 수정
          </button>
          <button
            onClick={() => onDelete(location.id)}
            className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600 transition-all hover:bg-red-100 active:scale-95">
            <FaTrash size={12} /> 삭제
          </button>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        <p className="flex items-start gap-2">
          <FaLocationArrow className="mt-1 flex-shrink-0 text-indigo-500" />
          <span>{location.address}</span>
        </p>

        <div className="mt-1 flex items-center gap-4">
          {location.meetDate && (
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <FaCalendarAlt className="text-indigo-400" /> {location.meetDate}
            </p>
          )}

          {location.meetTime && (
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <FaClock className="text-indigo-400" /> {location.meetTime}
            </p>
          )}
        </div>
      </div>

      {location.details && (
        <div className="mt-3 rounded-md bg-gray-50 p-3 text-sm text-gray-600">{location.details}</div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-medium text-indigo-500">모임장소</span>
        <span className="text-xs text-gray-400">{formatDate(location.createdAt)}</span>
      </div>
    </li>
  );
}
