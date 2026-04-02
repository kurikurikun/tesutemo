'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import RssFeed from '@/components/RssFeed';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Video, Users, Sparkles, ArrowRight, Play, ClipboardCheck, MessageSquare, UserPlus, TrendingUp, GraduationCap, MapPin } from 'lucide-react';

function HeroCarousel() {
  const images = [
    '/hero-1.png',
    '/hero-2.png',
    '/hero-3.png',
    '/hero-4.png',
    '/hero-5.png',
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
                  alt={`TesuTemo participant ${(i % images.length) + 1}`}
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
    <section className="pt-28 pb-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <p className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight text-gray-900" aria-hidden="true">
            Real Voices.
            <br />
            <span className="text-primary italic">
              Better Decisions.
            </span>
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="mt-5 text-lg text-gray-500 tracking-wide leading-relaxed">
            People trust real voices over advertising.<br />
            TesuTemo captures interviews with employees, students, residents, and customers — all online —<br className="hidden sm:inline" /> delivering video content that drives better decisions.
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-10 mb-10">
            <HeroCarousel />
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#usecases"
              className="bg-primary text-white px-8 py-3.5 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              View Use Cases
            </a>
            <a
              href="#contact"
              className="border border-gray-200 text-gray-600 px-8 py-3.5 rounded-full font-medium hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Contact Us
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ContextSection() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)',
        backgroundSize: '36px 36px'
      }} />
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#7e91cf]/8 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Label */}
        <FadeIn>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-gray-200 bg-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" style={{boxShadow: '0 0 8px #e95228'}} />
              <span className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-semibold">Problem → Solution</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary" style={{boxShadow: '0 0 8px #e95228'}} />
            </div>
          </div>
        </FadeIn>

        {/* ===== PROBLEM 1: People decide based on real voices ===== */}
        <div className="max-w-5xl mx-auto mb-8">
          <FadeIn>
            <div className="relative rounded-3xl p-8 lg:p-12 border border-gray-200 bg-white shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gray-200 rounded-tl-3xl" />

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-center">
                {/* Left: Headline */}
                <div>
                  <span className="inline-block text-sm uppercase tracking-[0.4em] text-gray-300 font-semibold mb-5">Problem 01</span>
                  <h3 className="text-4xl lg:text-[3rem] font-bold text-gray-900 leading-[1.25]">
                    <span className="text-primary">Real voices</span>, not ads, drive decisions.
                  </h3>
                </div>

                {/* Right: Points */}
                <div className="space-y-6">
                  {[
                    {
                      text: 'Amazon reviews, Google ratings — people trust the voices of those who have been there, bought that.',
                      bold: false,
                    },
                    {
                      text: "Yet for important life decisions like education, careers, relocation, and service adoption, trusted 'reviews' are hard to find.",
                      bold: true,
                    },
                    {
                      text: 'The more important the life decision, the more important it is to hear trusted reviews.',
                      bold: false,
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-2 w-2.5 h-2.5 rounded-full bg-primary" />
                      <p className={`text-base lg:text-lg leading-relaxed ${item.bold ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Plus sign between problems */}
        <FadeIn>
          <div className="flex justify-center mb-8">
            <div className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm">
              <span className="text-lg font-bold text-gray-400 leading-none">+</span>
            </div>
          </div>
        </FadeIn>

        {/* ===== PROBLEM 2: You're sharing information, but it's not getting through ===== */}
        <div className="max-w-5xl mx-auto mb-8">
          <FadeIn>
            <div className="relative rounded-3xl p-8 lg:p-12 border border-gray-200 bg-white shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gray-200 rounded-tl-3xl" />

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-center">
                {/* Left: Headline */}
                <div>
                  <span className="inline-block text-sm uppercase tracking-[0.4em] text-gray-300 font-semibold mb-5">Problem 02</span>
                  <h3 className="text-4xl lg:text-[3rem] font-bold text-gray-900 leading-[1.25]">
                    Pushing out content isn&apos;t the same as building trust.
                  </h3>
                </div>

                {/* Right: Points */}
                <div className="space-y-6">
                  {[
                    {
                      text: 'Websites, brochures, and social media — they\'re your words, not theirs.',
                      bold: false,
                    },
                    {
                      text: 'One-sided messaging can\'t build the trust that drives real decisions.',
                      bold: true,
                    },
                    {
                      text: 'Without authentic voices, interest doesn\'t convert.',
                      bold: false,
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-2 w-2.5 h-2.5 rounded-full bg-primary" />
                      <p className={`text-base lg:text-lg leading-relaxed ${item.bold ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Result callout after both problems */}
        <FadeIn>
          <div className="flex justify-center mb-8">
            <div className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm">
              <ArrowRight className="w-4 h-4 text-gray-400 rotate-90" strokeWidth={2.5} />
            </div>
          </div>
          <div className="max-w-5xl mx-auto mb-8">
            <div className="rounded-xl px-6 py-5 bg-red-50 border border-red-100">
              <p className="text-base lg:text-lg text-red-500 font-semibold text-center">
                Bad fit. Missed opportunity. For both sides.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Down arrow */}
        <FadeIn>
          <div className="flex justify-center mb-8">
            <div className="w-10 h-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center shadow-sm">
              <ArrowRight className="w-4 h-4 text-primary rotate-90" strokeWidth={2.5} />
            </div>
          </div>
        </FadeIn>

        {/* ===== BRIDGE ===== */}
        <div className="max-w-5xl mx-auto mb-8">
          <FadeIn>
            <div className="text-center py-8">
              <div className="inline-block px-8 py-6 rounded-2xl border border-primary/20 bg-white shadow-md">
                <p className="text-base text-gray-500 leading-snug mb-2">You already have fans. It&apos;s time to let them talk.</p>
                <p className="text-xl text-primary font-bold leading-snug">Let the people who chose you, convince the people considering you.</p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Down arrow */}
        <FadeIn>
          <div className="flex justify-center mb-8">
            <div className="w-10 h-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center shadow-sm">
              <ArrowRight className="w-4 h-4 text-primary rotate-90" strokeWidth={2.5} />
            </div>
          </div>
        </FadeIn>

        {/* ===== SOLUTION ===== */}
        <div className="max-w-5xl mx-auto mb-20">
          <FadeIn>
            <div className="relative rounded-3xl p-8 lg:p-12 overflow-hidden"
              style={{background: 'linear-gradient(145deg, #e95228 0%, #f06030 40%, #d94820 100%)'}}>
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full"
                style={{background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)'}} />
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }} />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white/25 rounded-br-3xl" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
                <div>
                  <span className="inline-block text-sm uppercase tracking-[0.4em] text-white/50 font-semibold mb-5">Solution</span>
                  <h3 className="text-4xl lg:text-5xl font-bold text-white leading-[1.2]">
                    Let your people<br />do the talking.
                  </h3>
                </div>

                <div>
                  <p className="text-base lg:text-lg text-white/85 mb-7 leading-relaxed">
                    Real voices of people who chose your company, university, region.
                  </p>

                  <div className="rounded-2xl p-6 mb-7 border border-white/25 bg-white/15 backdrop-blur-sm">
                    <p className="text-lg font-bold text-white text-center leading-snug">
                      Building connection and trust to enable authentic decision making.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-white/85">
                    <Video className="w-5 h-5 flex-shrink-0" />
                    <p className="text-base lg:text-lg font-medium">All online, all done for you, testimonial video</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Value Section */}
        <FadeIn>
          <div className="max-w-5xl mx-auto">
            <div className="rounded-3xl p-8 lg:p-12 border border-gray-200 bg-white shadow-lg">

              <div className="text-center mb-10">
                <span className="inline-block text-[9px] uppercase tracking-[0.4em] text-primary font-semibold mb-4">Value</span>
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">Real voices. Real faces. Real trust.</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {[
                  { label: 'Expression', vimeo: 'https://player.vimeo.com/video/1020065025?h=c786d2097a&title=0&byline=0&portrait=0' },
                  { label: 'Warmth', vimeo: 'https://player.vimeo.com/video/1014779536?h=2c4b22d316&title=0&byline=0&portrait=0' },
                  { label: 'True Feelings', vimeo: 'https://player.vimeo.com/video/1173147932?h=22cefed8a7&title=0&byline=0&portrait=0' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl p-4 text-center overflow-hidden border border-primary/15 bg-gray-50">
                    <div className="mb-4 mx-auto max-w-[180px]">
                      <div className="relative w-full rounded-xl overflow-hidden shadow-sm" style={{ paddingBottom: '177.78%' }}>
                        <iframe
                          src={item.vimeo}
                          className="absolute top-0 left-0 w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title={`Tesutemo Interview - ${item.label}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center rounded-2xl p-6 border border-primary/20 bg-primary/5">
                <p className="text-base lg:text-lg text-gray-700 font-medium leading-relaxed">
                  Words and expressions that build trust — impossible to fake, impossible to ignore.
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
    { num: '①', title: 'Your Challenge', desc: "We'll discuss your goals and work out exactly how TesuTemo can best help solve them.", icon: ClipboardCheck },
    { num: '②', title: 'Your Voice', desc: 'Share the profile of your ideal interviewee. We\'ll take it from there.', icon: MessageSquare },
    { num: '③', title: 'Your TesuTemo', desc: 'Once your videos are done, they\'re ready to go — straight to your website, social media, and beyond.', icon: Play },
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
              <span className="text-primary">3</span> steps to voices that work for you.
            </h2>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              No crew. No travel. No hassle. Just real voices, delivered.
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
                  <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg">
                    <step.icon className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>

                  {/* Step number and title */}
                  <div className="text-left mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      <span className="text-primary">{step.num}</span> {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed text-left">
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
      title: 'Recruitment',
      description: 'Connect with talent through real employee voices',
      href: '/en/recruitment',
      vimeo: 'https://player.vimeo.com/video/1177652915?h=be43651176&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      icon: TrendingUp,
      title: 'Case Studies',
      description: 'Win new customers through real customer voices',
      href: '/en/case-study',
      image: '/usecase-customer.png',
    },
    {
      icon: GraduationCap,
      title: 'Universities',
      description: 'Reach future students through real student voices',
      href: '/en/university',
      vimeo: 'https://player.vimeo.com/video/1019675789?h=8ca81d7847&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      icon: MapPin,
      title: 'Municipalities',
      description: 'Attract new residents through real voices of those who relocated',
      href: '/en/municipality',
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
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Real voices accelerate decision-making</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Stronger hiring, better customer acquisition, trust-building, migration promotion. Choose the category that fits your goals
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
                    Learn More
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
    { icon: Video, title: 'Heard it from someone who\'s been there.', desc: 'Not a marketing pitch. Real experiences from real people — the kind that actually move decisions.' },
    { icon: Users, title: 'The things words alone can\'t say.', desc: 'Tone, expression, warmth — the human signals that build genuine trust.' },
    { icon: Sparkles, title: 'Done for you, start to finish.', desc: 'From first conversation to final video, everything happens online. Fast, simple, no disruption.' },
  ];

  return (
    <section id="features" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-primary to-primary-light rounded-full">
              <span className="text-sm uppercase tracking-wider text-white font-semibold">Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">What makes it work.</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Information informs. Real voices convince.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
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
    { name: 'Fujinomiya City', logo: '/logo-fujinomiya.png' },
    { name: 'Otsuki Town', logo: '/logo-otsuki.png' },
    { name: 'Kansai University', logo: '/logo-kansai.png' },
    { name: 'Waseda University', logo: '/logo-waseda.png' },
  ];

  return (
    <section className="bg-white border-y border-gray-100 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-primary to-primary-light rounded-full">
              <span className="text-sm uppercase tracking-wider text-white font-semibold">Trusted By</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Organizations using TesuTemo</h2>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Companies and organizations that recognize the value of real voices are already using TesuTemo
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
            What Our Clients Say
          </h3>
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-200 hover:border-primary/30 transition-all">
              <div className="text-primary text-4xl mb-4 leading-none">&ldquo;</div>
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                The personality of the students and the impact of the classes — the realism and warmth of live interviews that AI-generated content simply cannot replicate. That is the true value of TesuTemo!
              </p>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900">Kansai University</p>
                <p className="text-sm text-gray-600">Faculty & Graduate School Administrative Group</p>
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
      <Header locale="en" />
      <main>
        <HeroSection />
        <ContextSection />
        <ProcessSection />
        <UseCasesSection />
        <FeaturesSection />
        <CustomersSection />
        <RssFeed />
        <ContactForm locale="en" />
      </main>
      <Footer locale="en" />
    </>
  );
}
