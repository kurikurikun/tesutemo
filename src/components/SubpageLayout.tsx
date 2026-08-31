'use client';

import SubpageHeader from './SubpageHeader';
import Footer from './Footer';
import EnquiryForm from './EnquiryForm';
import FadeIn from './FadeIn';
import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import VideoCarousel from './VideoCarousel';
import VerticalReel from './VerticalReel';

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
  defaultUseCase?: string;
  locale?: 'ja' | 'en';
  currentPath?: string;
  planConfig?: Record<string, unknown>;
  children?: ReactNode;
}

/**
 * 横型 / 縦型 の見出し。細い罫線ではさんだラベルが、2つの動画ブロックの間の
 * 区切りも兼ねている。ラベルはアクセントの #7e91cf、説明文の中の強調は
 * これまで通りプライマリのオレンジなので、色が競合しない。
 */
function FormatHeading({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-4">
        <span className="h-px w-10 bg-accent/40 sm:w-16" />
        <span className="-mr-[0.2em] text-sm font-bold tracking-[0.2em] text-accent">{label}</span>
        <span className="h-px w-10 bg-accent/40 sm:w-16" />
      </div>
      <p className="mt-4 text-center text-gray-600">{children}</p>
    </div>
  );
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
  defaultUseCase = '',
  locale = 'ja',
  currentPath = '/',
  planConfig,
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
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight lg:leading-[1.4]">
                  {heroTitle}
                </h1>
                <div className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {heroSubtitle}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* EN pointed at /en/case-study; parked on #videos (matching JA)
                      until Comas approves publication. Restore once approved. */}
                  <a
                    href="#videos"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    {isEn ? 'View Case Studies' : '事例を見る'}
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
            <p className="text-center text-gray-500 mb-12">{videoSectionSubtitle}</p>
          </FadeIn>

          {/* 横型と縦型は、それぞれの見出しの下に置く。以前は「横型は…」「縦型は…」の
              2行をセクション冒頭にまとめて出していたが、そこから離れた場所に2つの
              大きな帯が続くので、どちらの説明がどちらの帯なのか読み手が覚えて
              おかないといけなかった。説明文はそのまま、置き場所だけ移してある。 */}
          {horizontalVideos.length > 0 && (
            <FadeIn>
              <FormatHeading label={isEn ? 'HORIZONTAL' : '横型'}>{videoHorizontalDesc}</FormatHeading>
              <VideoCarousel videos={horizontalVideos} />
            </FadeIn>
          )}

          {/* 縦型は SNS 風の縦スクロールフィード。3列グリッドをやめた経緯と
              自動再生の扱いは VerticalReel.tsx のヘッダに書いてある。 */}
          {verticalVideos.length > 0 && (
            <FadeIn delay={0.2}>
              <div className="mt-16">
                <FormatHeading label={isEn ? 'VERTICAL' : '縦型'}>{videoVerticalDesc}</FormatHeading>
                <div className="max-w-2xl mx-auto">
                  <VerticalReel videos={verticalVideos} isEn={isEn} />
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

      <EnquiryForm locale={locale} defaultUseCase={defaultUseCase} {...(planConfig ? { planConfig: planConfig as never } : {})} />
      <Footer locale={locale} />
    </>
  );
}

