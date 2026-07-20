'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import RssFeed from '@/components/RssFeed';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import Image from 'next/image';
import { Video, Users, Shield, Sparkles, UserPlus, TrendingUp, GraduationCap, MapPin, Clock } from 'lucide-react';

function PlayBtn() {
  return (
    <div className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="#e95228"><polygon points="2,1 9,5 2,9"/></svg>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="pt-28 pb-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left: text */}
          <div>
            <FadeIn>
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-6 h-px bg-primary flex-shrink-0" />
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary">
                  Testimonial Interview Video
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-gray-900 mb-6">
                Real Voices.<br />
                <span className="text-primary">Better Decisions.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-10 max-w-md">
                人は、広告よりも「人の声」で意思決定する。<br />
                テステモは、採用・学生生活・移住・顧客の声をオンライン完結で収録し、判断につながる動画コンテンツを届けるサービスです。
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#usecases" className="bg-primary text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors text-center">
                  導入事例を見る
                </a>
                <a href="#contact" className="inline-flex items-center gap-2 text-gray-500 text-sm font-medium border-b border-gray-200 pb-0.5 self-start sm:self-center">
                  お問い合わせ
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 7h10M8 3l4 4-4 4" /></svg>
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Right: 3-column staggered grid */}
          <FadeIn delay={0.15}>
            <div className="grid grid-cols-3 gap-2 max-w-[380px] mx-auto lg:max-w-none">
              {[
                '/hero-20.jpg', '/hero-1.png', '/hero-3.png',
                '/hero-5.png', '/hero-21.png', '/hero-4.png',
              ].map((src) => (
                <div key={src} className="relative rounded-xl overflow-hidden h-[190px]">
                  <Image src={src} alt="" fill className="object-cover" style={{ objectPosition: '50% 20%' }} />
                  <PlayBtn />
                </div>
              ))}
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}

function ContextSection() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Eyebrow */}
        <FadeIn>
          <div className="flex items-center gap-3 mb-2">
            <span className="block w-6 h-px bg-gray-400 flex-shrink-0" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">Problem → Solution</span>
          </div>
        </FadeIn>

        {/* Problem 01 */}
        <FadeIn>
          <div className="grid grid-cols-[160px_1fr] border-t border-gray-200 py-12">
            <div className="text-[72px] font-bold leading-none text-gray-200 tracking-tight select-none">01</div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-snug mb-5">
                人は、広告より<br />「<span className="text-primary">人の声</span>」で決める。
              </h2>
              <div className="flex flex-col gap-3">
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200">Amazonのレビュー、Googleの口コミ、先に体験した人の声を信頼して判断する時代。</p>
                <p className="text-sm lg:text-base text-gray-900 font-medium leading-relaxed pl-4 border-l-2 border-primary">でも、進学・就職・移住・サービス導入には、信頼できる「レビュー」がない。</p>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200">重要な意思決定ほど「信頼できる声」が届いていない。</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Problem 02 */}
        <FadeIn>
          <div className="grid grid-cols-[160px_1fr] border-t border-gray-200 py-12">
            <div className="text-[72px] font-bold leading-none text-gray-200 tracking-tight select-none">02</div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-snug mb-5">
                情報は発信しているのに、<br /><span className="text-gray-400">伝わらない。</span>
              </h2>
              <div className="flex flex-col gap-3">
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200">Webサイトやパンフレット、SNSなどで情報発信はしているものの、</p>
                <p className="text-sm lg:text-base text-gray-900 font-medium leading-relaxed pl-4 border-l-2 border-primary">本当の魅力が伝わらず、他社・他校・他地域との差別化ができない。</p>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200">応募・集客につながらない。</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Consequence */}
        <FadeIn>
          <div className="bg-red-50 border-l-[3px] border-red-400 rounded-r-lg px-6 py-5 mb-10">
            <p className="text-sm lg:text-base font-semibold text-red-600">結果 → ミスマッチが起き、双方に機会損失が生まれる。</p>
          </div>
        </FadeIn>

        {/* Bridge */}
        <FadeIn>
          <div className="flex items-center gap-6 mb-10">
            <div className="flex-1 h-px bg-gray-200" />
            <p className="text-sm text-gray-500 whitespace-nowrap">本当に必要なのは、<span className="text-primary font-semibold">「実際に選んだ人のリアルな声」</span></p>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </FadeIn>

        {/* Solution */}
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gray-900 p-10 lg:p-12 flex flex-col justify-between gap-8">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary mb-5">Solution</p>
                <h2 className="text-3xl lg:text-4xl font-bold text-white leading-snug">
                  テステモは、<br />リアルな声で<br /><span className="text-primary">伝えます</span>
                </h2>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">実際にその企業・大学・地域を選んだ人へのインタビューを通して、判断につながる情報を動画で届ける</p>
            </div>
            <div className="bg-white p-10 lg:p-12 flex flex-col gap-4">
              {[
                '表情、温度感、本音まで含めて伝えることができる',
                'オンライン完結で、従来の現地撮影より担当者の負担がはるかに少ない',
                '信頼できる判断材料として、意思決定を後押しする',
                'SNS・採用サイト・大学ページへの掲載まで、すぐに使える素材として納品',
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <p className="text-sm lg:text-base text-gray-900 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}

function ValueSection() {
  const videos = [
    { label: '表情', vimeo: 'https://player.vimeo.com/video/1020065025?h=c786d2097a&title=0&byline=0&portrait=0' },
    { label: '温度感', vimeo: 'https://player.vimeo.com/video/1014779536?h=2c4b22d316&title=0&byline=0&portrait=0' },
    { label: '本音', vimeo: 'https://player.vimeo.com/video/1173147932?h=22cefed8a7&title=0&byline=0&portrait=0' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-snug">
              文字や写真では<br />伝わらない
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs sm:text-right">
              表情、温度感、本音まで含めて伝えることで、信頼できる判断材料を提供します
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {videos.map((v, i) => (
            <FadeIn key={v.label} delay={i * 0.1}>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
                  <iframe
                    src={v.vimeo}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={`Tesutemo - ${v.label}`}
                  />
                </div>
                <div className="px-5 py-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-900">{v.label}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { num: '01', title: '打ち合わせ', desc: '課題をヒアリングし、最適な活用プランをご提案します' },
    { num: '02', title: '候補者選び', desc: '最適な人物像のイメージまでをお伝えし、それに合わせて、候補者を選んで頂きます' },
    { num: '03', title: 'できあがり', desc: 'あとはTesuTemoにお任せください。動画が完成すれば、発信するだけです' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-6 h-px bg-gray-400 flex-shrink-0" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">Process</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-12">
            たった<span className="text-primary">3</span>ステップ
          </h2>
        </FadeIn>

        {/* Step grid */}
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 border border-gray-200 rounded-xl overflow-hidden mb-5">
            {steps.map((step) => (
              <div key={step.num} className="bg-white p-9 lg:p-10">
                <div className="text-5xl font-bold text-gray-200 tracking-tight leading-none mb-5 select-none">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Process note */}
        <FadeIn>
          <div className="flex items-center gap-4 px-6 py-5 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
              <Clock size={15} className="text-primary" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              全てオンラインで行うので、従来の現地での撮影と比べ、<span className="font-semibold text-gray-900">やり取りの時間が大幅に減り</span>、担当者さま・被写体さまの負担がはるかに少ない
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function UseCasesSection() {
  const cases = [
    {
      tag: 'for 企業',
      icon: UserPlus,
      title: '人材を採用する',
      description: '社員のリアルな声で、人材と出会う',
      href: '/recruitment',
      vimeo: 'https://player.vimeo.com/video/1177652915?h=be43651176&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      tag: 'for 企業',
      icon: TrendingUp,
      title: '顧客を増やす',
      description: 'お客様のリアルな声で、次の顧客と出会う',
      // Unlinked until Comas approves publication of their interviews.
      // Restore to '/case-study' once approved.
      href: '',
      image: '/usecase-customer.png',
    },
    {
      tag: 'for 大学',
      icon: GraduationCap,
      title: '学生と出会う',
      description: '在学生のリアルな声で、未来の学生と出会う',
      href: '/university',
      vimeo: 'https://player.vimeo.com/video/1019675789?h=8ca81d7847&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      tag: 'for 自治体',
      icon: MapPin,
      title: '移住者を増やす',
      description: '移住者のリアルな声で、新しい住民と出会う',
      href: '/municipality',
      vimeo: 'https://player.vimeo.com/video/1010822965?h=430839385f&badge=0&autopause=0&player_id=0&app_id=58479',
    },
  ];

  return (
    <section id="usecases" className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-6 h-px bg-gray-400 flex-shrink-0" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">Use Cases</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-3">リアルな声が意思決定を加速</h2>
          <p className="text-base text-gray-600 mb-12">採用強化、集客改善、信頼構築、移住促進。目的に合ったカテゴリを選んでください</p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((c, i) => (
            <FadeIn key={c.title} delay={i * 0.1}>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-full">
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  {c.vimeo ? (
                    <iframe
                      src={c.vimeo}
                      className="w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      title={c.title}
                    />
                  ) : (
                    <Image src={c.image!} alt={c.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  )}
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-2">{c.tag}</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{c.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">{c.description}</p>
                  {c.href && (
                    <Link
                      href={c.href}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.06em] uppercase text-gray-900 border-b border-gray-900 pb-px self-start"
                    >
                      もっとみる →
                    </Link>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: Video, title: 'リアルな判断材料', desc: '実際に経験した人の声だから、自分に合うかどうかが具体的にわかる' },
    { icon: Users, title: '本音が見える', desc: '文章では見えない、表情や言葉の温度感まで伝わる' },
    { icon: Shield, title: 'ミスマッチを防ぐ', desc: '事前にリアルを知ることで、選択のズレを減らす' },
    { icon: Sparkles, title: 'オンラインで完結', desc: 'インタビューから納品まで、すべてオンラインでスピーディに' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-6 h-px bg-gray-400 flex-shrink-0" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">Why TesuTemo</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-3">テステモが選ばれる理由</h2>
          <p className="text-base text-gray-600 mb-12">他の情報では分からない「本音」を、動画で。</p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.08}>
              <div className="bg-white p-8 lg:p-9 h-full">
                <f.icon size={22} className="text-primary mb-5" strokeWidth={1.5} />
                <h3 className="text-base font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomersSection() {
  const customers = [
    { name: '富士宮市', logo: '/logo-fujinomiya.png' },
    { name: '大月町', logo: '/logo-otsuki.png' },
    { name: '関西大学', logo: '/logo-kansai.png' },
    { name: '早稲田大学', logo: '/logo-waseda.png' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gray-50 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">

          {/* Left */}
          <FadeIn>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Trusted By</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">導入実績</h2>
            <p className="text-sm text-gray-600 leading-relaxed">すでに、リアルな声の価値に気づいた企業・団体が活用を始めています</p>
          </FadeIn>

          {/* Right */}
          <div>
            <FadeIn>
              <div className="flex flex-wrap gap-3 mb-10">
                {customers.map((c) => (
                  <div key={c.name} className="bg-white border border-gray-200 rounded-lg px-5 py-3 h-[52px] flex items-center justify-center">
                    <Image src={c.logo} alt={c.name} width={120} height={32} className="h-7 w-auto object-contain" />
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn>
              <div className="bg-white border border-gray-200 rounded-xl p-7 lg:p-8">
                <blockquote className="text-base text-gray-900 leading-relaxed mb-5">
                  「学生の人柄や授業のインパクトなど、AI生成では出せない生のインタビューのリアルさや親近感がこのテステモの価値だなと改めて感じました！」
                </blockquote>
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-gray-900">関西大学</span> — 学部・大学院事務グループ
                </p>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ContextSection />
        <ValueSection />
        <ProcessSection />
        <UseCasesSection />
        <FeaturesSection />
        <CustomersSection />
        <RssFeed />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
