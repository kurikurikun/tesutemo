'use client';

import SubpageHeader from './SubpageHeader';
import SubpageFooter from './SubpageFooter';
import ContactForm from './ContactForm';
import PricingSection from './PricingSection';
import FadeIn from './FadeIn';
import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

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
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">{solutionSubtitle}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="space-y-3">
              {solutionPoints.map((point, i) => (
                <p key={i} className="text-gray-700">{point}</p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Videos */}
      <section id="videos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">動画プレビュー</h2>
          </FadeIn>

          {horizontalVideos.length > 0 && (
            <>
              <FadeIn>
                <h3 className="text-lg font-semibold mb-4">横型動画</h3>
              </FadeIn>
              <div className="flex gap-4 overflow-x-auto pb-4 mb-10 snap-x snap-mandatory">
                {horizontalVideos.map((url, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="w-[400px] flex-shrink-0 snap-start aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <iframe
                        src={url}
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={`Horizontal video ${i + 1}`}
                      />
                    </div>
                  </FadeIn>
                ))}
              </div>
            </>
          )}

          {verticalVideos.length > 0 && (
            <>
              <FadeIn>
                <h3 className="text-lg font-semibold mb-4">縦型動画</h3>
              </FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {verticalVideos.map((url, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="aspect-[9/16] rounded-xl overflow-hidden bg-gray-100">
                      <iframe
                        src={url}
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={`Vertical video ${i + 1}`}
                      />
                    </div>
                  </FadeIn>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">ご利用の流れ</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '①', title: '打ち合わせ', desc: 'お悩み、課題をヒアリングし、最適なプランをご提案します' },
              { num: '②', title: '候補者選び', desc: '最適な人物像をお伝えし、インタビュー候補者を選んでいただきます' },
              { num: '③', title: 'できあがり', desc: 'オンラインインタビューを実施し、動画を編集・納品します' },
            ].map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.15}>
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm h-full">
                  <div className="w-14 h-14 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
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
