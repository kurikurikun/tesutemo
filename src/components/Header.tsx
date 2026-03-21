'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <img src="/tesutemo-logo.png" alt="TesuTemo" className="h-10" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/recruitment" className="text-lg hover:opacity-70 transition-opacity" style={{ color: '#7e91cf' }}>
              採用促進 for 企業
            </Link>
            <Link href="/municipality" className="text-lg hover:opacity-70 transition-opacity" style={{ color: '#7e91cf' }}>
              for 自治体
            </Link>
            <Link href="/university" className="text-lg hover:opacity-70 transition-opacity" style={{ color: '#7e91cf' }}>
              for 大学
            </Link>
            <Link
              href="#contact"
              className="bg-gray-900 text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              はじめる
            </Link>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
          <Link href="/recruitment" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMobileOpen(false)}>
            採用促進 for 企業
          </Link>
          <Link href="/municipality" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMobileOpen(false)}>
            for 自治体
          </Link>
          <Link href="/university" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMobileOpen(false)}>
            for 大学
          </Link>
          <Link
            href="#contact"
            className="inline-block bg-gray-900 text-white text-sm px-5 py-2 rounded-full"
            onClick={() => setMobileOpen(false)}
          >
            はじめる
          </Link>
        </div>
      )}
    </header>
  );
}
