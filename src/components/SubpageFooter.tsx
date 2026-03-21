'use client';

import Link from 'next/link';

export default function SubpageFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link href="/" className="text-white font-bold text-lg">TesuTemo</Link>
            <p className="text-sm text-gray-400 mt-1">株式会社move-ment</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/recruitment" className="hover:text-white transition-colors">企業採用</Link>
            <Link href="/municipality" className="hover:text-white transition-colors">自治体</Link>
            <Link href="/university" className="hover:text-white transition-colors">大学</Link>
            <Link href="/case-study" className="hover:text-white transition-colors">導入事例</Link>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6">
          <p className="text-xs text-gray-500">&copy; 2026 TesuTemo / move-ment</p>
        </div>
      </div>
    </footer>
  );
}
