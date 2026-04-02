'use client';

import Link from 'next/link';

interface SubpageHeaderProps {
  locale?: 'ja' | 'en';
  currentPath?: string;
}

export default function SubpageHeader({ locale = 'ja', currentPath = '/' }: SubpageHeaderProps) {
  const isEN = locale === 'en';
  const toggleHref = isEN
    ? currentPath.replace(/^\/en/, '') || '/'
    : `/en${currentPath === '/' ? '' : currentPath}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm bg-accent">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link href={isEN ? '/en' : '/'} className="text-2xl font-bold text-white">
          TesuTemo
        </Link>
        <div className="flex items-center gap-6">
          <a href={toggleHref} className="flex items-center gap-0.5 rounded-full border border-white/30 bg-white/10 p-0.5 text-xs font-semibold">
            <span className={`px-2.5 py-1 rounded-full transition-colors ${isEN ? 'bg-white text-gray-900 shadow-sm' : 'text-white/60 hover:text-white'}`}>EN</span>
            <span className={`px-2.5 py-1 rounded-full transition-colors ${!isEN ? 'bg-white text-gray-900 shadow-sm' : 'text-white/60 hover:text-white'}`}>JP</span>
          </a>
          <a
            href="#contact"
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-[#c74320] transition-all duration-300"
          >
            {isEN ? 'Get Started' : 'はじめる'}
          </a>
        </div>
      </div>
    </header>
  );
}
