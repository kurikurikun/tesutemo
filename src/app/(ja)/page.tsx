'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import RssFeed from '@/components/RssFeed';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import Image from 'next/image';
import { Video, Users, Shield, Sparkles, Clock } from 'lucide-react';

function HeroSection() {
  return (
    <section className="pt-28 pb-14 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          <FadeIn>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-6 h-px bg-primary flex-shrink-0" />
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary">
                  Testimonial Interview Video
                </span>
              </div>
              <p className="text-xl lg:text-[26px] font-medium text-gray-900 leading-[1.6] tracking-[-0.01em] max-w-[520px]">
                人は、広告よりも「人の声」で意思決定する。テステモは、企業のリアルな声をオンライン完結で収録します。
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-[64px] font-bold tracking-tight leading-[1.1] text-gray-900">
              Real Voices.<br />
              <span className="text-primary">Better Decisions.</span>
            </h1>
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
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200">買う前にレビューを読み、応募する前に口コミを調べる。先に体験した人の声を信頼して判断する時代。</p>
                <p className="text-sm lg:text-base text-gray-900 font-medium leading-relaxed pl-4 border-l-2 border-primary">でも、自社の採用にも、サービスの導入検討にも、信頼できる「レビュー」がない。</p>
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
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200">採用サイトもサービス資料もSNSも用意しているものの、</p>
                <p className="text-sm lg:text-base text-gray-900 font-medium leading-relaxed pl-4 border-l-2 border-primary">どこの会社も同じことを書いているように見え、他社との差別化ができない。</p>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200">応募にも、問い合わせにもつながらない。</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Consequence */}
        <FadeIn>
          <div className="bg-red-50 border-l-[3px] border-red-400 rounded-r-lg px-6 py-5 mb-10">
            <p className="text-sm lg:text-base font-semibold text-red-600">結果 → 採用ではミスマッチが起き、商談では決めきれない見込み客が残る。</p>
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
              <p className="text-sm text-white/50 leading-relaxed">実際にその会社で働く社員、その商品・サービスを選んだ顧客へのインタビューを通して、判断につながる情報を動画で届ける</p>
            </div>
            <div className="bg-white p-10 lg:p-12 flex flex-col gap-4">
              {[
                '表情、温度感、本音まで含めて伝えることができる',
                'オンライン完結で、従来の現地撮影より担当者の負担がはるかに少ない',
                '求職者・見込み客が「自分に合うか」を判断できる材料になる',
                '採用サイト・サービスサイト・SNSにすぐ使える素材として納品',
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

// The two things TesuTemo sells to companies. Not "use cases": that label came from
// the four-audience top page, where the section was a router. Not "services" either —
// /services already owns that word for the four delivery styles (声さがし etc.).
//
// White, not gray-50: the hero and this section read as one continuous top area, with
// the hairline rule doing the separating rather than a change of ground.
function WhatWeDoSection() {
  const offers = [
    {
      tag: '採用',
      title: '人材を採用する',
      lead: '社員のリアルな声で、人材と出会う。求職者が入社後の働き方を具体的にイメージできる動画を、オンライン完結で制作します。',
      points: [
        <>横型は採用サイトや説明会・イベントで<span className="text-primary font-bold">「しっかり伝える」</span>ために</>,
        <>縦型はSNSで<span className="text-primary font-bold">「見つけてもらう」</span>ために</>,
        <>入社後の働き方を具体的にイメージできるコンテンツ</>,
      ],
      href: '/recruitment',
      vimeo: 'https://player.vimeo.com/video/1222247699?h=2a1e5a09e6&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      tag: '導入事例',
      title: '顧客を増やす',
      lead: 'お客様のリアルな声で、次の顧客と出会う。信頼できる第三者の声で、商品・サービスの本当の価値を届けます。',
      points: [
        <>横型はWebサイトやイベントで<span className="text-primary font-bold">「しっかり伝える」</span>ために</>,
        <>縦型はSNSで<span className="text-primary font-bold">「見つけてもらう」</span>ために</>,
        <>見込み客が「自分にも合うか」を判断できるコンテンツ</>,
      ],
      href: '/case-study',
      vimeo: 'https://player.vimeo.com/video/1211265629?h=f1a11af050&badge=0&autopause=0&player_id=0&app_id=58479',
    },
  ];

  return (
    <section id="what-we-do" className="pb-24 lg:pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 grid grid-cols-1 md:grid-cols-2">
          {offers.map((o, i) => (
            <FadeIn key={o.title} delay={i * 0.1}>
              <div
                className={`flex flex-col gap-3.5 pt-11 pb-2 h-full ${
                  i === 0
                    ? 'md:pr-14 md:border-r md:border-gray-200'
                    : 'md:pl-14 border-t border-gray-200 md:border-t-0 mt-10 md:mt-0'
                }`}
              >
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent">{o.tag}</span>
                <h2 className="text-2xl lg:text-[26px] font-bold tracking-[-0.02em] leading-[1.35] text-gray-900">{o.title}</h2>
                <p className="text-base text-gray-600 leading-[1.75]">{o.lead}</p>

                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 my-1">
                  <iframe
                    src={o.vimeo}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={o.title}
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  {o.points.map((point, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <p className="text-[15px] text-gray-600 leading-[1.7]">{point}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href={o.href}
                  className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.06em] uppercase text-gray-900 border-b border-gray-900 pb-px self-start"
                >
                  もっとみる →
                </Link>
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
    { icon: Video, title: 'リアルな判断材料', desc: '実際に働く人・使った人の声だから、自分に合うかどうかが具体的にわかる' },
    { icon: Users, title: '本音が見える', desc: '文章では見えない、表情や言葉の温度感まで伝わる' },
    { icon: Shield, title: 'ミスマッチを防ぐ', desc: '入社前・導入前にリアルを知ることで、期待とのズレを減らす' },
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

/*
 * 導入実績 — corporate only.
 *
 * The old logo wall (富士宮市 / 大月町 / 関西大学 / 早稲田大学) and the 関西大学 quote were
 * university and municipality proof, so they came off this company-facing top page; both
 * still live on /university and /municipality.
 *
 * What stands in is the one piece of corporate work already named publicly on this site:
 * the プロベル recruitment interview, whose company name strip is baked into the still.
 * No client logo files exist in public/ and no corporate testimonial quote exists anywhere
 * in the repo, so neither is invented here. The customer-interview work is linked rather
 * than re-carded, so this section does not repeat the What We Do block above it.
 */
function CustomersSection() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">

          {/* Left */}
          <FadeIn>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Trusted By</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">導入実績</h2>
            <p className="text-sm text-gray-600 leading-relaxed">すでに、リアルな声の価値に気づいた企業が活用を始めています</p>
          </FadeIn>

          {/* Right */}
          <div>
            <FadeIn>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden grid grid-cols-1 sm:grid-cols-[240px_1fr]">
                <div className="relative h-[220px] sm:h-full min-h-[220px] bg-gray-100">
                  <Image src="/hero-20.jpg" alt="株式会社プロベル 社員インタビュー" fill className="object-cover" style={{ objectPosition: '50% 30%' }} />
                </div>
                <div className="p-7 lg:p-8 flex flex-col justify-center">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-2">採用インタビュー</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">株式会社プロベル</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    社員が自分の言葉で語る動画を、採用サイトとSNSで使える素材として制作。会社の理念や働く空気が、求職者に伝わる形になりました。
                  </p>
                  <Link
                    href="/recruitment"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.06em] uppercase text-gray-900 border-b border-gray-900 pb-px self-start"
                  >
                    採用の活用方法を見る →
                  </Link>
                </div>
              </div>
            </FadeIn>
            <FadeIn>
              <p className="mt-5 text-sm text-gray-500">
                顧客インタビューの事例は{' '}
                <Link href="/case-study" className="text-accent underline underline-offset-2 hover:opacity-70 transition-opacity">導入事例ページ</Link>
                {' '}で公開しています。
              </p>
              {/* Quiet route out to the non-corporate work — kept low on a company-facing
                  top page, but university/municipality keep their inbound links. */}
              <p className="mt-3 text-sm text-gray-500">
                大学・自治体向けの実績もあります —{' '}
                <Link href="/university" className="text-accent underline underline-offset-2 hover:opacity-70 transition-opacity">大学の広報に</Link>
                <span className="text-gray-300 mx-2">/</span>
                <Link href="/municipality" className="text-accent underline underline-offset-2 hover:opacity-70 transition-opacity">自治体の移住促進に</Link>
              </p>
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
        {/* What We Do sits directly under the hero: with only two offerings, both for
            companies, what TesuTemo does has to land before the problem framing. */}
        <WhatWeDoSection />
        <ContextSection />
        <ValueSection />
        <ProcessSection />
        <FeaturesSection />
        <CustomersSection />
        <RssFeed />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
