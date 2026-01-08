import Link from 'next/link';
import { FaHome, FaChevronRight } from 'react-icons/fa';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center gap-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 rounded-lg bg-white/40 px-2 py-1 shadow-sm backdrop-blur-sm">
        {/* 홈 아이콘 항상 첫 번째에 추가 */}
        <li>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-gray-600 transition hover:bg-gray-100/60 hover:text-indigo-600">
            <FaHome className="h-3.5 w-3.5" />
            <span>홈</span>
          </Link>
        </li>

        {/* 구분선 */}
        <li className="text-gray-400">
          <FaChevronRight className="h-3 w-3" />
        </li>

        {/* 나머지 항목들 */}
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-1 text-gray-400">
                <FaChevronRight className="h-3 w-3" />
              </span>
            )}

            {item.href && !item.isActive ? (
              <Link
                href={item.href}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-gray-600 transition hover:bg-gray-100/60 hover:text-indigo-600">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 rounded-md bg-indigo-50/80 px-2 py-1 font-medium text-indigo-600 backdrop-blur-sm">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
