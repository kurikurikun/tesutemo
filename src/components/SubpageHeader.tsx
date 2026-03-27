'use client';

import Link from 'next/link';

export default function SubpageHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm bg-accent">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          TesuTemo
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-white hover:text-gray-200 transition-colors"
          >
            トップ
          </Link>
          <a
            href="#contact"
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-[#c74320] transition-all duration-300"
          >
            はじめる
          </a>
        </div>
      </div>
    </header>
  );
}
