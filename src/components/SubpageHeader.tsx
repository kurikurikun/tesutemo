'use client';

import Link from 'next/link';

export default function SubpageHeader() {
  return (
    <header className="bg-accent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            TesuTemo
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm border border-white/40 px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              トップ
            </Link>
            <Link
              href="#contact"
              className="text-sm bg-white text-gray-900 px-5 py-1.5 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              はじめる
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
