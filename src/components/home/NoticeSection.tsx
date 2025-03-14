import { motion } from 'framer-motion';
import { RiUserHeartLine } from 'react-icons/ri';

export default function NoticeSection() {
  return (
    <>
      {/* 공지사항 - 가족모임 전까지 제출 안내 */}
      <motion.div className="container mx-auto mt-2 w-[640px] rounded-t-lg bg-indigo-500 px-5 py-2 tracking-tighter text-white shadow-xl xs:w-full">
        <div className="flex items-start space-x-3">
          <div>
            <h3 className="text-lg xs:text-[15px]"> 기도캠퍼스 - 정찬주 가족원님 반가워요! 👋 </h3>
          </div>
        </div>
      </motion.div>

      {/* 공지사항 - 가족모임 전까지 제출 안내 */}
      <motion.div
        className="container mx-auto w-[640px] rounded-b-lg px-5 py-4 tracking-tighter text-white shadow-xl xs:w-full xs:px-4 xs:py-2"
        style={{
          background: 'linear-gradient(45deg, #4F46E5, #60A5FA, #9EA5E9, #3B82F6)',
          backgroundSize: '400% 400%',
          animation: 'gradient 5s ease infinite',
        }}>
        <div className="flex items-start space-x-2">
          <RiUserHeartLine className="h-8 w-8 text-white xs:h-12 xs:w-12" />
          <div>
            <p className="text-lg font-semibold xs:text-[15px]">
              가족모임 안내: 3월 모임 장소는 &apos;중강당&apos; 입니다.
            </p>
            <p className="text-sm">주일 가족모임 전까지 반드시 큐티, 말씀 횟수, 기도제목을 작성해주세요.</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
