'use client';

import SubpageHeader from './SubpageHeader';
import Footer from './Footer';
import ContactForm from './ContactForm';
import PricingSection from './PricingSection';
import FadeIn from './FadeIn';
import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import VideoCarousel from './VideoCarousel';

interface SubpageProps {
  heroTitle: ReactNode;
  heroSubtitle: ReactNode;
  heroVideoUrl: string;
  problemHeading: ReactNode;
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
  companyLabel?: string;
  companyPlaceholder?: string;
  locale?: 'ja' | 'en';
  currentPath?: string;
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
  companyLabel,
  companyPlaceholder,
  locale = 'ja',
  currentPath = '/',
  children,
}: SubpageProps) {
  const isEn = locale === 'en';
  return (
    <>
      <SubpageHeader locale={locale} currentPath={currentPath} />

      {/* Hero */}
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-b from-accent/10 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight lg:leading-[1.4] break-keep">
                  {heroTitle}
                </h1>
                <div className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {heroSubtitle}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={isEn ? '/en/case-study' : '#videos'}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    {isEn ? 'View Case Studies' : '導入事例を見る'}
                    <ArrowRight size={20} />
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-[#c74320] transition-all duration-300"
                  >
                    {isEn ? 'Get Started' : 'はじめる'}
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

      {/* Problem + Solution flow */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-900">{problemHeading}</h2>
            <p className="text-center text-gray-500 mb-12 leading-relaxed">{problemSubheading}</p>
          </FadeIn>

          {/* Problems */}
          <FadeIn delay={0.1}>
            <div className="bg-gray-50 rounded-2xl p-8 mb-6">
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

          {/* Arrow */}
          <FadeIn delay={0.15}>
            <div className="flex justify-center mb-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-0.5 h-8 bg-gray-300" />
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-300" />
              </div>
            </div>
          </FadeIn>

          {/* Consequence */}
          <FadeIn delay={0.2}>
            <div className="bg-red-50 rounded-2xl p-8 border-l-4 border-red-400 mb-6">
              <p className="text-gray-800 font-medium text-center leading-relaxed">{problemConclusion}</p>
            </div>
          </FadeIn>

          {/* Arrow + label */}
          <FadeIn delay={0.25}>
            <div className="flex justify-center mb-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-0.5 h-4 bg-primary/40" />
                <span className="text-xs font-semibold text-primary tracking-widest uppercase px-3 py-1 bg-primary/10 rounded-full">
                  {isEn ? 'TesuTemo solves this' : 'テステモが解決します'}
                </span>
                <div className="w-0.5 h-4 bg-primary/40" />
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary/40" />
              </div>
            </div>
          </FadeIn>

          {/* Solution */}
          <FadeIn delay={0.3}>
            <div className="bg-primary rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">{solutionTitle}</h3>
              <p className="text-white/80 mb-6 leading-relaxed">{solutionSubtitle}</p>
              <div className="space-y-3">
                {solutionPoints.map((point, i) => (
                  <div key={i} className="bg-white/15 rounded-xl py-4 px-6 font-medium">
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Videos */}
      <section id="videos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="inline-flex w-full justify-center mb-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-center px-8 py-4 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/15">{videoSectionTitle}</h2>
            </div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">{isEn ? 'All online. All done for you.' : 'すべてオンラインで完結だから'}</h2>
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

      <PricingSection locale={locale} />
      <ContactForm companyLabel={companyLabel} companyPlaceholder={companyPlaceholder} locale={locale} />
      <Footer locale={locale} />
    </>
  );
}

