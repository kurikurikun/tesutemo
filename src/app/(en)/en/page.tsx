'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import RssFeed from '@/components/RssFeed';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import Image from 'next/image';
import { Video, Users, Sparkles, Shield, UserPlus, TrendingUp, Clock } from 'lucide-react';

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
                People trust real voices over advertising. TesuTemo captures interviews with your employees and your customers — all online — and turns them into video that moves hiring and buying decisions.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#what-we-do" className="bg-primary text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors text-center">
                  See what we do
                </a>
                <a href="#contact" className="inline-flex items-center gap-2 text-gray-500 text-sm font-medium border-b border-gray-200 pb-0.5 self-start sm:self-center">
                  Contact Us
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 7h10M8 3l4 4-4 4" /></svg>
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Right: staggered pair of business interview stills */}
          <FadeIn delay={0.15}>
            <div className="grid grid-cols-2 gap-3 max-w-[420px] mx-auto lg:max-w-none">
              {[
                // hero-20 is top-aligned on purpose: its 株式会社プロベル name strip sits in the
                // top band of the frame, and a half-sliced strip reads as a mistake.
                { src: '/hero-20.jpg', offset: '', pos: '50% 0%' },
                { src: '/hero-4.png', offset: 'mt-8 lg:mt-12', pos: '50% 20%' },
              ].map((img) => (
                <div key={img.src} className={`relative rounded-2xl overflow-hidden h-[280px] lg:h-[360px] ${img.offset}`}>
                  <Image src={img.src} alt="" fill className="object-cover" style={{ objectPosition: img.pos }} />
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
                <span className="text-primary">Real voices</span>, not ads,<br />drive decisions.
              </h2>
              <div className="flex flex-col gap-3">
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200">Amazon reviews, Glassdoor ratings — people trust whoever got there first and told the truth about it.</p>
                <p className="text-sm lg:text-base text-gray-900 font-medium leading-relaxed pl-4 border-l-2 border-primary">Yet when someone is deciding where to work — or which service to buy — there is no trusted &lsquo;review&rsquo; of you to read.</p>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200">The bigger the decision, the less honest information there is to go on.</p>
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
                Pushing out content isn&apos;t<br /><span className="text-gray-400">the same as building trust.</span>
              </h2>
              <div className="flex flex-col gap-3">
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200">Careers page, service deck, social — all of it is your words, not theirs.</p>
                <p className="text-sm lg:text-base text-gray-900 font-medium leading-relaxed pl-4 border-l-2 border-primary">Every company says the same things, so nothing sets you apart.</p>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200">Applications stall. So do deals.</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Consequence */}
        <FadeIn>
          <div className="bg-red-50 border-l-[3px] border-red-400 rounded-r-lg px-6 py-5 mb-10">
            <p className="text-sm lg:text-base font-semibold text-red-600">The result? Hires who leave, and buyers who never decide.</p>
          </div>
        </FadeIn>

        {/* Bridge */}
        <FadeIn>
          <div className="flex items-center gap-6 mb-10">
            <div className="flex-1 h-px bg-gray-200" />
            <p className="text-sm text-gray-500 whitespace-nowrap text-center">You already have fans. It&apos;s time to let them talk.<br /><span className="text-primary font-semibold">Let the people who chose you, convince the people considering you.</span></p>
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
                  Let your people<br />do the talking.
                </h2>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">Real voices from the people who chose you — the employees who stayed and the customers who bought — so the next candidate and the next buyer can judge for themselves.</p>
            </div>
            <div className="bg-white p-10 lg:p-12 flex flex-col gap-4">
              {[
                'Real people, real expressions — the human signals that build genuine trust',
                'All online, from first conversation to final delivered video',
                'No crew, no travel, no hassle — just authentic voices that work for you',
                'Ready to publish straight to your careers page, service site, and social',
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
    { label: 'Expression', vimeo: 'https://player.vimeo.com/video/1020065025?h=c786d2097a&title=0&byline=0&portrait=0' },
    { label: 'Warmth', vimeo: 'https://player.vimeo.com/video/1014779536?h=2c4b22d316&title=0&byline=0&portrait=0' },
    { label: 'True Feelings', vimeo: 'https://player.vimeo.com/video/1173147932?h=22cefed8a7&title=0&byline=0&portrait=0' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-snug">
              Real voices.<br />Real faces. Real trust.
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs sm:text-right">
              Words and expressions that build trust — impossible to fake, impossible to ignore.
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
    { num: '01', title: 'Your Challenge', desc: "We'll discuss your goals and work out exactly how TesuTemo can best help solve them." },
    { num: '02', title: 'Your Voice', desc: "Share the profile of your ideal interviewee. We'll take it from there." },
    { num: '03', title: 'Your TesuTemo', desc: "Once your videos are done, they're ready to go — straight to your website, social media, and beyond." },
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
            <span className="text-primary">3</span> steps to voices that work for you.
          </h2>
        </FadeIn>

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

        <FadeIn>
          <div className="flex items-center gap-4 px-6 py-5 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
              <Clock size={15} className="text-primary" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              No crew. No travel. No hassle. <span className="font-semibold text-gray-900">Everything happens online</span> — fast, simple, with minimal disruption to your team.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// The two things TesuTemo sells to companies. Not "use cases": that label came from
// the four-audience top page, where the section was a router. Not "services" either —
// /services already owns that word for the four delivery styles.
function WhatWeDoSection() {
  const cases = [
    {
      tag: 'Recruitment',
      icon: UserPlus,
      title: 'Hire the right people',
      description: 'Connect with talent through real employee voices',
      href: '/en/recruitment',
      vimeo: 'https://player.vimeo.com/video/1177652915?h=be43651176&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      tag: 'Case Studies',
      icon: TrendingUp,
      title: 'Win more customers',
      description: 'Give buyers a trusted voice to judge you by',
      href: '/en/case-study',
      vimeo: 'https://player.vimeo.com/video/1211121590?h=bfb474263b&badge=0&autopause=0&player_id=0&app_id=58479',
    },
  ];

  return (
    <section id="what-we-do" className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-6 h-px bg-gray-400 flex-shrink-0" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">What We Do</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-3">Recruitment, and case studies.</h2>
          <p className="text-base text-gray-600 mb-12">Employee voices to bring people in. Customer voices to close the deal. Both built for companies.</p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((c, i) => (
            <FadeIn key={c.title} delay={i * 0.1}>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-full">
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <iframe
                    src={c.vimeo}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={c.title}
                  />
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
                      Learn More →
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
    { icon: Video, title: "Heard it from someone who's been there.", desc: "Not a marketing pitch. Real experiences from real people — the kind that actually move decisions." },
    { icon: Users, title: "The things words alone can't say.", desc: "Tone, expression, warmth — the human signals that build genuine trust." },
    { icon: Shield, title: 'Fewer mismatches.', desc: 'Knowing the reality upfront means better fit — for both sides.' },
    { icon: Sparkles, title: 'Done for you, start to finish.', desc: 'From first conversation to final video, everything happens online. Fast, simple, no disruption.' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-6 h-px bg-gray-400 flex-shrink-0" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">Why TesuTemo</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-3">What makes it work.</h2>
          <p className="text-base text-gray-600 mb-12">Information informs. Real voices convince.</p>
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
 * Trusted By — corporate only.
 *
 * The old logo wall (Fujinomiya City / Otsuki Town / Kansai University / Waseda University)
 * and the Kansai University quote were university and municipality proof, so they came off
 * this company-facing top page; both still live on /en/university and /en/municipality.
 *
 * What stands in is the one piece of corporate work already named publicly on this site:
 * the プロベル recruitment interview, whose company name strip is baked into the still. No
 * client logo files exist in public/ and no corporate testimonial quote exists anywhere in
 * the repo, so neither is invented here. The company name is left in Japanese because that
 * is how it appears on screen — there is no romanization to copy from.
 */
function CustomersSection() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">

          <FadeIn>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Trusted By</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Companies using TesuTemo</h2>
            <p className="text-sm text-gray-600 leading-relaxed">Companies that recognize the value of real voices are already using TesuTemo</p>
          </FadeIn>

          <div>
            <FadeIn>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden grid grid-cols-1 sm:grid-cols-[240px_1fr]">
                <div className="relative h-[220px] sm:h-full min-h-[220px] bg-gray-100">
                  <Image src="/hero-20.jpg" alt="株式会社プロベル employee interview" fill className="object-cover" style={{ objectPosition: '50% 30%' }} />
                </div>
                <div className="p-7 lg:p-8 flex flex-col justify-center">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-2">Recruitment interviews</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">株式会社プロベル</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    Employees telling it in their own words — cut into video their careers page and social feeds can actually use, so candidates get a feel for the place before they apply.
                  </p>
                  <Link
                    href="/en/recruitment"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.06em] uppercase text-gray-900 border-b border-gray-900 pb-px self-start"
                  >
                    See how it works →
                  </Link>
                </div>
              </div>
            </FadeIn>
            <FadeIn>
              <p className="mt-5 text-sm text-gray-500">
                Customer interview work is published on the{' '}
                <Link href="/en/case-study" className="text-accent underline underline-offset-2 hover:opacity-70 transition-opacity">case studies page</Link>.
              </p>
              {/* Quiet route out to the non-corporate work — kept low on a company-facing
                  top page, but university/municipality keep their inbound links. */}
              <p className="mt-3 text-sm text-gray-500">
                We work with universities and municipalities too —{' '}
                <Link href="/en/university" className="text-accent underline underline-offset-2 hover:opacity-70 transition-opacity">for universities</Link>
                <span className="text-gray-300 mx-2">/</span>
                <Link href="/en/municipality" className="text-accent underline underline-offset-2 hover:opacity-70 transition-opacity">for municipalities</Link>
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
      <Header locale="en" />
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
        <ContactForm locale="en" />
      </main>
      <Footer locale="en" />
    </>
  );
}
