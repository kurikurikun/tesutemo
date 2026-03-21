'use client';

import SubpageHeader from './SubpageHeader';
import SubpageFooter from './SubpageFooter';
import ContactForm from './ContactForm';
import PricingSection from './PricingSection';
import FadeIn from './FadeIn';
import { ReactNode, useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface SubpageProps {
  heroTitle: ReactNode;
  heroSubtitle: ReactNode;
  heroVideoUrl: string;
  problemHeading: string;
  problemSubheading: ReactNode;
  problems: string[];
  problemConclusion: ReactNode;
  solutionTitle: string;
  solutionSubtitle: ReactNode;
  solutionPoints: string[];
  videoSectionTitle: string;
  videoSectionSubtitle: string;
  videoHorizontalDesc: ReactNode;
  videoVerticalDesc: ReactNode;
  onlineFeatures: { title: string; desc: string }[];
  horizontalVideos: string[];
  verticalVideos: string[];
  children?: ReactNode;
}

export default function SubpageLayout({
  heroTitle,
  heroSubtitle,
  heroVideoUrl,
  problemHeading,
  problemSubheading,
  problems,
  problemConclusion,
  solutionTitle,
  solutionSubtitle,
  solutionPoints,
  videoSectionTitle,
  videoSectionSubtitle,
  videoHorizontalDesc,
  videoVerticalDesc,
  onlineFeatures,
  horizontalVideos,
  verticalVideos,
  children,
}: SubpageProps) {
  return (
    <>
      <SubpageHeader />

      {/* Hero */}
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-b from-gray-50 to-white" style={{ backgroundColor: '#c5cee8' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight lg:leading-[1.4]">
                  {heroTitle}
                </h1>
                <div className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {heroSubtitle}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#videos"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    導入事例を見る
                    <ArrowRight size={20} />
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-[#c74320] transition-all duration-300"
                  >
                    はじめる
                    <ArrowRight size={20} />
                  </a>
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="aspect-video bg-gradient-to-br from-[#7e91cf] to-[#5a6eb3] rounded-3xl overflow-hidden shadow-2xl">
                <iframe
                  src={heroVideoUrl}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Hero video"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-900">{problemHeading}</h2>
            <p className="text-center text-gray-500 mb-12 leading-relaxed">{problemSubheading}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="bg-gray-50 rounded-2xl p-8 mb-10">
              <ul className="space-y-5">
                {problems.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-gray-700">{p}</p>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="border-l-4 border-primary pl-6 py-2">
              <p className="text-gray-800 font-medium text-center leading-relaxed">{problemConclusion}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">{solutionTitle}</h2>
            <p className="text-gray-600 mb-10 leading-relaxed text-lg">{solutionSubtitle}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="space-y-4">
              {solutionPoints.map((point, i) => (
                <div key={i} className="bg-primary text-white text-lg font-medium py-5 px-8 rounded-2xl">
                  {point}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Videos */}
      <section id="videos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">{videoSectionTitle}</h2>
            <p className="text-center text-gray-500 mb-4">{videoSectionSubtitle}</p>
            <div className="text-center space-y-1 mb-12">
              <p className="text-gray-600">{videoHorizontalDesc}</p>
              <p className="text-gray-600">{videoVerticalDesc}</p>
            </div>
          </FadeIn>

          {/* Horizontal Videos Carousel */}
          {horizontalVideos.length > 0 && (
            <FadeIn>
              <VideoCarousel videos={horizontalVideos} />
            </FadeIn>
          )}

          {/* Vertical Videos */}
          {verticalVideos.length > 0 && (
            <FadeIn delay={0.2}>
              <div className="max-w-5xl mx-auto mt-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {verticalVideos.map((url, i) => (
                    <div key={i} className="bg-gradient-to-br from-[#e8f0fe] to-[#d0e1fd] rounded-3xl p-6 shadow-xl">
                      <div className="aspect-[9/16] bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
                        <iframe
                          src={url}
                          className="w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title={`Vertical video ${i + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Online Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">すべてオンラインで完結だから</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {onlineFeatures.map((feature, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="bg-white rounded-2xl p-8 shadow-sm h-full flex flex-col">
                  <span className="text-4xl font-bold text-primary/20 mb-4">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-lg font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{feature.desc}</p>
                </div>
                {i < onlineFeatures.length - 1 && (
                  <div className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-gray-300 text-2xl">→</div>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {children}

      <PricingSection />
      <ContactForm />
      <SubpageFooter />
    </>
  );
}

function VideoCarousel({ videos }: { videos: string[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % videos.length);
  }, [videos.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + videos.length) % videos.length);
  }, [videos.length]);

  // Autoplay every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="max-w-5xl mx-auto mb-8">
      <div className="relative bg-gradient-to-br from-[#ffd4c4] via-[#ffe4d4] to-[#ffc4b4] rounded-3xl overflow-hidden shadow-2xl p-8 lg:p-12">
        {/* Navigation arrows */}
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

        {/* Video slides */}
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

        {/* Dots */}
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
