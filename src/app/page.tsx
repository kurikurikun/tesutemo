'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import RssFeed from '@/components/RssFeed';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Video, Users, Shield, Sparkles, ArrowRight, Play, AlertCircle, ClipboardCheck, MessageSquare, UserPlus, TrendingUp, GraduationCap, MapPin } from 'lucide-react';

function HeroCarousel() {
  const images = [
    'https://picsum.photos/seed/tst1/400/533',
    'https://picsum.photos/seed/tst2/400/533',
    'https://picsum.photos/seed/tst3/400/533',
    'https://picsum.photos/seed/tst4/400/533',
    'https://picsum.photos/seed/tst5/400/533',
  ];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;

    const scroll = () => {
      scrollPosition += 0.5;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative -mx-4 sm:mx-0">
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div ref={scrollRef} className="overflow-hidden">
        <div className="flex gap-3 sm:gap-4 md:gap-6">
          {/* Duplicate images for seamless loop */}
          {[...images, ...images].map((img, i) => (
            <div key={i} className="flex-shrink-0 w-32 sm:w-36 md:w-44">
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg aspect-[3/4] group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`テステモ参加者 ${(i % images.length) + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="pt-28 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Real Voices.
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Better Decisions.
            </span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-4 text-lg text-gray-600">
            リアルな声で、人生の意思決定を支える
          </p>
          <div className="mt-4 inline-block px-6 py-2 rounded-full border border-[#7e91cf]/30 bg-[#7e91cf]/5">
            <p className="text-base sm:text-lg font-bold" style={{ color: '#7e91cf' }}>
              人は、広告よりも「人の声」で意思決定する
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-8 mb-8">
            <HeroCarousel />
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="inline-block bg-orange-50 text-primary text-sm px-6 py-2 rounded-full mb-8">
            リアルな声を動画で届け、人と組織をつなぐインタビューサービス
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/case-study"
              className="bg-gradient-to-r from-primary to-primary-light text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              導入事例を見る
            </Link>
            <a
              href="#contact"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              お問い合わせ
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ContextSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gray-200/50 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Problem Badge */}
        <FadeIn>
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full">
              <span className="text-sm uppercase tracking-wider text-white font-semibold">Problem → Solution</span>
            </div>
          </div>
        </FadeIn>

        {/* Problem → Bridge → Solution Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 mb-24 max-w-6xl mx-auto items-center">
          {/* Problem Section (Left) */}
          <FadeIn direction="left">
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border-2 border-gray-200 hover:border-gray-300 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  情報は発信しているのに、<br />伝わらない。
                </h3>
              </div>

              <p className="text-base text-gray-700 mb-6 leading-relaxed">
                Webサイトやパンフレット、SNSなどで情報発信はしているものの、
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">✕</span>
                  <p className="text-sm text-gray-600">本当の魅力が伝わっていない</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">✕</span>
                  <p className="text-sm text-gray-600">他社・他校・他地域との差別化ができない</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">✕</span>
                  <p className="text-sm text-gray-600">応募・集客につながらない</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-base font-semibold text-gray-800">
                  結果として、<br />ミスマッチや機会損失が起きている。
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Bridge/Arrow Section (Center) */}
          <FadeIn>
            <div className="flex flex-col items-center justify-center lg:px-4">
              <div className="hidden lg:flex flex-col items-center gap-4">
                <ArrowRight className="w-12 h-12 text-primary" strokeWidth={2.5} />
                <div className="text-center max-w-[200px]">
                  <p className="text-sm font-medium text-gray-700 leading-snug">
                    本当に必要なのは、<br />
                    <span className="text-primary font-bold">「実際に選んだ人の<br />リアルな声」</span>
                  </p>
                </div>
                <ArrowRight className="w-12 h-12 text-primary" strokeWidth={2.5} />
              </div>

              {/* Mobile version */}
              <div className="lg:hidden flex items-center justify-center gap-3 py-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <div className="text-center px-4">
                  <p className="text-sm font-medium text-gray-700 leading-snug mb-2">
                    本当に必要なのは、
                  </p>
                  <p className="text-sm text-primary font-bold">
                    「第三者の<br />リアルな声」
                  </p>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              </div>
            </div>
          </FadeIn>

          {/* Solution Section (Right) */}
          <FadeIn direction="right">
            <div className="bg-gradient-to-br from-primary via-primary-light to-primary rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white">
                    テステモは、<br />リアルな声で伝えます
                  </h3>
                </div>

                <p className="text-base text-white/95 mb-6 leading-relaxed">
                  実際にその企業・大学・地域を選んだ人へのインタビューを通して、
                </p>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <p className="text-lg font-bold text-white text-center">
                    判断につながる<br className="sm:hidden" />リアルな情報を<br className="sm:hidden" />動画で届ける
                  </p>
                </div>

                <div className="flex items-center gap-2 text-white/90">
                  <Video className="w-5 h-5" />
                  <p className="text-sm font-medium">インタビュー動画で意思決定を支援</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Value Section */}
        <FadeIn>
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 lg:p-12 shadow-xl border-2 border-gray-200">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-3">Value</h3>
              <p className="text-center text-gray-600 mb-8">文字や写真では伝わらない</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: '表情', emoji: '😊', vimeo: 'https://player.vimeo.com/video/1020065025?h=c786d2097a&title=0&byline=0&portrait=0' },
                  { label: '温度感', emoji: '🔥', vimeo: 'https://player.vimeo.com/video/1014779536?h=2c4b22d316&title=0&byline=0&portrait=0' },
                  { label: '本音', emoji: '💬', vimeo: 'https://player.vimeo.com/video/1173147932?h=22cefed8a7&title=0&byline=0&portrait=0' },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-2xl p-4 shadow-md border border-primary/20 text-center overflow-hidden">
                    <div className="mb-3 mx-auto max-w-[180px]">
                      <div className="relative w-full rounded-lg overflow-hidden shadow-sm" style={{ paddingBottom: '177.78%' }}>
                        <iframe
                          src={item.vimeo}
                          className="absolute top-0 left-0 w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title={`Tesutemo Interview - ${item.label}`}
                        />
                      </div>
                    </div>
                    <p className="text-xl font-bold text-primary">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="text-center bg-white rounded-2xl p-6 shadow-md">
                <p className="text-lg lg:text-xl text-gray-900 font-semibold leading-relaxed">
                  まで含めて伝えることで、<br className="sm:hidden" />
                  <span className="text-primary">信頼できる判断材料</span>を提供します
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { num: '①', title: '打ち合わせ', desc: 'お悩み、課題に対して、TesuTemoを活用した、オーダーメイドの解決方法をお話合します', icon: ClipboardCheck },
    { num: '②', title: '候補者選び', desc: '最適な人物像のイメージまでをお伝えし、それに合わせて、候補者を選んで頂きます', icon: MessageSquare },
    { num: '③', title: 'できあがり', desc: 'あとはTesuTemoにお任せください。動画が完成すれば、発信するだけです', icon: Play },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-primary/5 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section header */}
        <FadeIn>
          <div className="text-center mb-20">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-primary to-primary-light rounded-full">
              <span className="text-sm uppercase tracking-wider text-white font-semibold">Process</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              たった<span className="text-primary">3</span>ステップ
            </h2>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-2">
              全てオンラインで行うので、従来の現地での撮影と比べ
            </p>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              やり取りの時間が大幅に減り、担当者さま、被写体さまの負担がるかに少ない
            </p>
          </div>
        </FadeIn>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.2}>
              <div className="relative group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/40 to-transparent" />
                )}

                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-primary/30">
                  {/* Icon */}
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg">
                    <step.icon className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>

                  {/* Step number and title */}
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      <span className="text-primary">{step.num}</span> {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed text-center">
                    {step.desc}
                  </p>

                  {/* Decorative accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary to-primary-light opacity-10 rounded-bl-full" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Bottom badge */}
        <FadeIn>
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-white rounded-full shadow-md border-2 border-primary/20">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-gray-700 font-medium">シンプルで迅速なプロセス</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function UseCasesSection() {
  const cases = [
    {
      icon: UserPlus,
      title: '人材を採用する',
      description: '社員のリアルな声で、人材と出会う',
      href: '/recruitment',
      image: 'https://picsum.photos/seed/recruit1/600/400',
    },
    {
      icon: TrendingUp,
      title: '顧客を増やす',
      description: 'お客様のリアルな声で、次の顧客と出会う',
      href: '/case-study',
      image: 'https://picsum.photos/seed/customer1/600/400',
    },
    {
      icon: GraduationCap,
      title: '学生と出会う',
      description: '在学生のリアルな声で、未来の学生と出会う',
      href: '/university',
      vimeo: 'https://player.vimeo.com/video/1019675789?h=8ca81d7847&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      icon: MapPin,
      title: '移住者を増やす',
      description: '移住者のリアルな声で、新しい住民と出会う',
      href: '/municipality',
      vimeo: 'https://player.vimeo.com/video/1010822965?h=430839385f&badge=0&autopause=0&player_id=0&app_id=58479',
    },
  ];

  return (
    <section id="usecases" className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-primary to-primary-light rounded-full">
              <span className="text-sm uppercase tracking-wider text-white font-semibold">Use Cases</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">リアルな声が意思決定を加速</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              採用強化、集客改善、信頼構築、移住促進。目的に合ったカテゴリを選んでください
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {cases.map((c, i) => (
            <FadeIn key={c.title} delay={i * 0.15}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  {c.vimeo ? (
                    <iframe
                      src={c.vimeo}
                      className="w-full h-full object-cover"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={c.title}
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-6 left-6 pointer-events-none">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <c.icon size={24} className="text-gray-900" />
                    </div>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {c.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                    {c.description}
                  </p>
                  <Link
                    href={c.href}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    もっとみる
                    <ArrowRight size={16} />
                  </Link>
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
    <section id="features" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-primary to-primary-light rounded-full">
              <span className="text-sm uppercase tracking-wider text-white font-semibold">Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">テステモが選ばれる理由</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              他の情報では分からない「本音」を、動画で。
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.1}>
              <div className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg h-full">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-gradient-to-br from-primary to-[#c74320]">
                    <f.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {f.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
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
    <section className="bg-white border-y border-gray-100 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-primary to-primary-light rounded-full">
              <span className="text-sm uppercase tracking-wider text-white font-semibold">Trusted By</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">導入実績</h2>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              すでに、リアルな声の価値に気づいた企業・団体が活用を始めています
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 mb-16">
            {customers.map((customer) => (
              <div
                key={customer.name}
                className="bg-white rounded-xl px-4 py-3 hover:shadow-md transition-all duration-300 border border-gray-200 flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={customer.logo}
                  alt={customer.name}
                  className="h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Client Testimonials */}
        <FadeIn>
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-12">
            お客様の声
          </h3>
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-200 hover:border-primary/30 transition-all">
              <div className="text-primary text-4xl mb-4 leading-none">&ldquo;</div>
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                学生の人柄や授業のインパクトなど、AI生成では出せない生のインタビューのリアルさや親近感がこのテステモの価値だなと改めて感じました！
              </p>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900">関西大学</p>
                <p className="text-sm text-gray-600">学部・大学院事務グループ</p>
              </div>
            </div>
          </div>
        </FadeIn>
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
