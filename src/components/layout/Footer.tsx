import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 회사 정보 */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center space-x-2">
              <span className="font-semibold text-slate-800">podoreaders 2025.</span>
            </div>
            <p className="mb-4 text-sm text-slate-500">
              큐티, 말씀 읽기를 온도로 변환하여 가족원들의 신앙생활을 도와주는 플랫폼 웹앱.
            </p>
          </div>
        </div>

        {/* 저작권 정보 */}
        <div className="mt-8 flex flex-col items-center justify-between border-t border-slate-200 pt-6 md:flex-row">
          <p className="text-sm text-slate-500">© 2025 Podoreaders. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
