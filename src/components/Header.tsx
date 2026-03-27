'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tesutemo-logo.png" alt="TesuTemo" className="h-9" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/recruitment" className="text-sm font-medium text-accent hover:text-accent/70 transition-colors">
              採用促進 for 企業
            </Link>
            <Link href="/municipality" className="text-sm font-medium text-accent hover:text-accent/70 transition-colors">
              for 自治体
            </Link>
            <Link href="/university" className="text-sm font-medium text-accent hover:text-accent/70 transition-colors">
              for 大学
            </Link>
            <Link
              href="#contact"
              className="bg-primary text-white text-sm px-5 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              はじめる
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-5 px-6 space-y-4">
          <Link href="/recruitment" className="block text-sm font-medium text-accent" onClick={() => setMobileOpen(false)}>
            採用促進 for 企業
          </Link>
          <Link href="/municipality" className="block text-sm font-medium text-accent" onClick={() => setMobileOpen(false)}>
            for 自治体
          </Link>
          <Link href="/university" className="block text-sm font-medium text-accent" onClick={() => setMobileOpen(false)}>
            for 大学
          </Link>
          <Link
            href="#contact"
            className="inline-block bg-primary text-white text-sm px-5 py-2.5 rounded-full font-medium"
            onClick={() => setMobileOpen(false)}
          >
            はじめる
          </Link>
        </div>
      )}
    </header>
  );
}
