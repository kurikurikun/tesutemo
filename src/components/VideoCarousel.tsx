'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoCarouselProps {
  videos: string[];
  gradient?: string;
}

export default function VideoCarousel({
  videos,
  gradient = 'from-[#ffd4c4] via-[#ffe4d4] to-[#ffc4b4]',
}: VideoCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % videos.length);
  }, [videos.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + videos.length) % videos.length);
  }, [videos.length]);

  return (
    <div className="max-w-5xl mx-auto mb-8">
      <div className={`relative bg-gradient-to-br ${gradient} rounded-3xl overflow-hidden shadow-2xl p-8 lg:p-12`}>
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
        >
          <ChevronRight size={24} className="text-gray-700" />
        </button>

        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {videos.map((url, i) => (
              <div key={i} className="w-full flex-shrink-0 px-4">
                <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
                  <iframe
                    src={url}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={`Video ${i + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === current ? 'bg-primary scale-110' : 'bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
