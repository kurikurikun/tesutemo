'use client';

import Link from 'next/link';
import { Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Tagline */}
        <div className="mb-16 text-center">
          <p className="text-xl lg:text-2xl text-gray-800 leading-relaxed max-w-4xl mx-auto">
            TesuTemo collects <span className="font-bold" style={{ color: '#7e91cf' }}>real stories</span> from students, employees, customers and residents to help people make{' '}
            <span className="font-bold" style={{ color: '#e95228' }}>better life decisions.</span>
          </p>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Column */}
          <div>
            <h4 className="font-bold mb-4 text-lg" style={{ color: '#7e91cf' }}>Company</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>TesuTemo</li>
              <li>株式会社move-ment</li>
              <li>本社　東京都品川区東五反田1-18-5-503</li>
              <li>支店　広島市東区牛田南1-13-4</li>
              <li>代表取締役　クリス・モア</li>
            </ul>
          </div>

          {/* Testimonial videos for Column */}
          <div>
            <h4 className="font-bold mb-4 text-lg" style={{ color: '#7e91cf' }}>Testimonial videos for</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/recruitment" className="underline hover:opacity-70 transition-opacity" style={{ color: '#7e91cf' }}>
                  企業採用 companies
                </Link>
              </li>
              <li>
                <Link href="/municipality" className="underline hover:opacity-70 transition-opacity" style={{ color: '#7e91cf' }}>
                  自治体 regional towns
                </Link>
              </li>
              <li>
                <Link href="/university" className="underline hover:opacity-70 transition-opacity" style={{ color: '#7e91cf' }}>
                  大学 universities
                </Link>
              </li>
            </ul>
          </div>

          {/* More Column */}
          <div>
            <h4 className="font-bold mb-4 text-lg" style={{ color: '#7e91cf' }}>More</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <a href="https://move-ment.co" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity" style={{ color: '#7e91cf' }}>
                  move-ment.co
                </a>
              </li>
              <li>
                <a href="https://FilminginJapan.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity" style={{ color: '#7e91cf' }}>
                  FilminginJapan.com
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/tesutemo" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" style={{ color: '#7e91cf' }} aria-label="Instagram">
                <Instagram size={28} />
              </a>
              <a href="https://www.youtube.com/playlist?list=PLXjq0jhj86YbkqLTjsA4i5a1rshcYnwZN" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" style={{ color: '#7e91cf' }} aria-label="YouTube">
                <Youtube size={28} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-600">
            &copy; 2026 TesuTemo / move-ment. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
