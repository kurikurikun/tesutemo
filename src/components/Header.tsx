'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  locale?: 'ja' | 'en';
  currentPath?: string;
}

export default function Header({ locale = 'ja', currentPath = '/' }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isEN = locale === 'en';

  const navItems = isEN
    ? [
        { label: 'Recruitment', href: '/en/recruitment' },
        { label: 'Municipalities', href: '/en/municipality' },
        { label: 'Universities', href: '/en/university' },
      ]
    : [
        { label: '採用促進 for 企業', href: '/recruitment' },
        { label: 'for 自治体', href: '/municipality' },
        { label: 'for 大学', href: '/university' },
      ];

  const ctaLabel = isEN ? 'Get Started' : 'はじめる';
  const ctaHref = isEN ? '#contact' : '#contact';

  const toggleLabel = isEN ? 'JP' : 'EN';
  const toggleHref = isEN
    ? currentPath.replace(/^\/en/, '') || '/'
    : `/en${currentPath === '/' ? '' : currentPath}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={isEN ? '/en' : '/'} className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tesutemo-logo.png" alt="TesuTemo" className="h-9" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-accent hover:text-accent/70 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={toggleHref}
              className="text-sm font-medium text-gray-500 hover:text-accent transition-colors"
            >
              {toggleLabel}
            </a>
            <Link
              href={ctaHref}
              className="bg-primary text-white text-sm px-5 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              {ctaLabel}
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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-sm font-medium text-accent"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={toggleHref}
            className="block text-sm font-medium text-gray-500"
            onClick={() => setMobileOpen(false)}
          >
            {toggleLabel}
          </a>
          <Link
            href={ctaHref}
            className="inline-block bg-primary text-white text-sm px-5 py-2.5 rounded-full font-medium"
            onClick={() => setMobileOpen(false)}
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </header>
  );
}
