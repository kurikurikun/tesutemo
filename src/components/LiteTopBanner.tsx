'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export default function LiteTopBanner() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { label: '採用促進 for 企業', href: '/recruitment' },
    { label: 'for 自治体', href: '/municipality' },
    { label: 'for 大学', href: '/university' },
  ]

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/tesutemo-logo.png" alt="TesuTemo" width={96} height={36} className="h-9 w-auto" />
          </Link>

          {/* Nav + CTA (right-aligned, same as main site) */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#7e91cf] hover:text-[#7e91cf]/70 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              className="bg-[#e95228] text-white text-sm px-5 py-2 rounded-full font-medium hover:bg-[#e95228]/90 transition-colors"
            >
              はじめる
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-5 px-6 space-y-4">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-sm font-medium text-[#7e91cf]"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="inline-block bg-[#e95228] text-white text-sm px-5 py-2.5 rounded-full font-medium"
            onClick={() => setMobileOpen(false)}
          >
            はじめる
          </Link>
        </div>
      )}
    </header>
  )
}
