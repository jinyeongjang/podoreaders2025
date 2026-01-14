import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FaUserCog, FaDesktop, FaHeart } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa6';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect } from 'react';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { pretendard } from '../lib/fonts';

// hooks
import { useAuthStore } from '../store/authStore';

// components
import QtCheck from './qt-check';
import NoticeSection from '../components/home/NoticeSection';

export default function Home() {
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  // hooks
  const { user } = useAuthStore(); // 사용자 인증 정보 가져오기
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={pretendard.className}>
      <Header />

      {/* 사이드바 - 로그인 시에만 표시 */}
      <AnimatePresence>
        {mounted && user && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed right-0 top-1/2 z-40 -translate-y-1/2 transform">
            <div className="flex flex-col items-center gap-3 rounded-l-2xl bg-white/80 py-5 pl-3 pr-4 shadow-2xl backdrop-blur-md">
              <motion.a
                href="/familyManagement"
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-4 text-white shadow-lg shadow-indigo-500/40 transition-all hover:shadow-xl hover:shadow-indigo-500/60"
                title="가족원 관리">
                <FaUserCog className="h-6 w-6 transition-transform group-hover:rotate-12" />
                <span className="mt-1.5 text-xs font-semibold">가족원관리</span>
              </motion.a>

              <motion.a
                href="/familyManagement"
                whileHover={{ scale: 1.15, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-4 text-white shadow-lg shadow-blue-500/40 transition-all hover:shadow-xl hover:shadow-blue-500/60"
                title="홈으로">
                <FaUserPlus className="h-6 w-6 transition-transform group-hover:scale-110" />
                <span className="mt-1.5 text-xs font-semibold">가족원추가</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="relative overflow-hidden bg-slate-100 py-24 sm:py-32">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="container relative mx-auto max-w-6xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.3 }}
                className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="text-slate-800">포도리더스</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mb-10 text-lg text-slate-800 sm:text-xl">
                &quot;큐티, 말씀 읽기 횟수를 기록하다&quot;
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="mx-auto mb-12 max-w-2xl text-base text-slate-600 md:text-lg xs:text-sm">
                가족원들의 큐티 및 말씀 기록 데일리 체크할 수 있는 가족원 전용 플랫폼
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.2, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 10 }}
                  onClick={() => router.push('/campusSelect')}
                  className="hover:shadow-3xl group flex items-center gap-3 rounded-2xl bg-white px-10 py-5 font-bold text-indigo-600 shadow-2xl shadow-black/20 transition-all hover:shadow-black/30">
                  <FaHeart className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span>캠퍼스 선택하기</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* 플랫폼 미리보기 Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-indigo-50 py-20">
          <div className="container relative mx-auto max-w-6xl px-4">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-16 text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-4 py-2 backdrop-blur-sm">
                <FaDesktop className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-700">플랫폼 적용화면</span>
              </motion.div>

              <p className="mx-auto max-w-2xl text-sm tracking-tight text-slate-800 xs:text-xs">
                2025년 2월~12월까지 기도캠퍼스 소캠에서 실제로 사용했던 데이터 입니다.
              </p>
              <p className="mx-auto max-w-2xl text-sm tracking-tight text-slate-600 xs:text-xs">
                테스트를 하기 위한 가족원 선택부분은 &quot;가족원(테스트)&quot;만 추가가능합니다.
              </p>
            </motion.div>

            {/* Browser Mockup Container */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative">
              {/* 브라우저 Mockup Container */}
              <div className="relative mx-auto max-w-5xl">
                <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200">
                  {/* 브라우저 Mockup */}
                  <div className="flex items-center gap-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-5 py-3.5">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400 shadow-sm"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-sm"></div>
                      <div className="h-3 w-3 rounded-full bg-green-400 shadow-sm"></div>
                    </div>
                    <div className="flex flex-1 items-center gap-2 rounded-lg bg-white px-4 py-1.5 shadow-sm">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span className="text-sm text-slate-500">포도리더스</span>
                    </div>
                  </div>

                  <NoticeSection />
                  <QtCheck />
                </div>
              </div>
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-16 text-center">
              <p className="mb-6 text-slate-600">데일리 체크할 준비가 되었나요? </p>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 600, damping: 10 }}
                onClick={() => router.push('/campusSelect')}
                className="hover:shadow-3xl group inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-10 py-5 font-bold text-indigo-600 shadow-2xl shadow-black/20 transition-all hover:shadow-black/30">
                <FaHeart className="h-5 w-5 transition-transform group-hover:scale-110"></FaHeart>
                <span>캠퍼스 선택하기</span>
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
