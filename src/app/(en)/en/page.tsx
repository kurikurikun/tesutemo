'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import RssFeed from '@/components/RssFeed';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import { Video, Users, Sparkles, Shield, Clock } from 'lucide-react';

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
                People trust real voices over advertising. TesuTemo captures your employees and your customers on camera — all online.
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
  // Four real client shorts, replacing the three generic Expression/Warmth/True Feelings
  // demos. Comas from /en/case-study, TECH CREW from the 2026-08 delivery; all unlisted,
  // so each embed carries its hash. `name` is for the key and the iframe title only — it
  // is not rendered, so no client is named in visible copy.
  const videos = [
    { name: '手島 — S1', vimeo: 'https://player.vimeo.com/video/1211072475?h=8e9082a9da&title=0&byline=0&portrait=0' },
    { name: 'Ariel — hook', vimeo: 'https://player.vimeo.com/video/1211072516?h=73c275066b&title=0&byline=0&portrait=0' },
    { name: '清水 — S1', vimeo: 'https://player.vimeo.com/video/1222248136?h=094e6a6fd2&title=0&byline=0&portrait=0' },
    { name: '野田 — S1', vimeo: 'https://player.vimeo.com/video/1221072287?h=09e1a18a37&title=0&byline=0&portrait=0' },
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {videos.map((v, i) => (
            <FadeIn key={v.name} delay={i * 0.1}>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
                  <iframe
                    src={v.vimeo}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={`TesuTemo - ${v.name}`}
                  />
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
//
// White, not gray-50: the hero and this section read as one continuous top area, with
// the hairline rule doing the separating rather than a change of ground.
function WhatWeDoSection() {
  const offers = [
    {
      tag: 'Recruitment',
      title: 'Hire the right people',
      lead: 'Employees telling it in their own words, so candidates get a feel for the place before they apply. Filmed and delivered entirely online.',
      points: [
        <>Candidates see the real workplace before they apply, so fewer bad fits</>,
        <>A small team can keep posting without booking a shoot every time</>,
      ],
      href: '/en/recruitment',
      vimeo: 'https://player.vimeo.com/video/1222247699?h=2a1e5a09e6&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      tag: 'Case Studies',
      title: 'Win more customers',
      lead: 'Your customers in their own words, so buyers hear it from someone other than you. A trusted third voice on what your product is actually worth.',
      points: [
        <>Answers the doubts that stall a deal</>,
        <>Something to hand a buyer mid-conversation, or run on your site</>,
      ],
      href: '/en/case-study',
      vimeo: 'https://player.vimeo.com/video/1211121590?h=bfb474263b&badge=0&autopause=0&player_id=0&app_id=58479',
    },
  ];

  return (
    <section id="what-we-do" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
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
                  Learn More →
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Format is true of both offers, so it is stated once here instead of
            repeating near-identically inside each column. */}
        <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-3">
          <p className="text-sm text-gray-500 leading-relaxed">
            Landscape cuts to <span className="text-primary font-bold">make the case</span> on your site and at events
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Vertical cuts to <span className="text-primary font-bold">get found</span> on social
          </p>
        </div>
      </div>

      {/* The CTA the hero gave up. One action, not a competing pair, and it sits where
          someone has just finished reading both offers. */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <p className="text-base lg:text-lg text-white/70 leading-relaxed max-w-xl">
            Everything happens online, with minimal disruption to your team. Start with a conversation.
          </p>
          <a
            href="#contact"
            className="bg-primary text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors text-center whitespace-nowrap self-start sm:self-auto flex-shrink-0"
          >
            Contact Us
          </a>
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
 * 導入実績 — the corporate client roll call.
 *
 * Named in copy for the first time, on Chris's say-so (2026-08).
 *
 * プロベル is deliberately NOT here, and must not be added: they are a sales agency
 * TesuTemo pays, not a customer, so listing them as a client would misrepresent the
 * relationship. Their footage still runs on /en/recruitment — see the note there.
 *
 * Name forms: TECH CREW Inc. is that company's own footer copyright, two words and
 * uppercase. Comas follows the spelling used throughout COMAS_HANDOFF.md — its logo
 * sets the mark in caps, which reads as styling rather than a different name, but
 * worth confirming before print.
 *
 * Names, not logos: public/ holds no logo file for any of the three, and three
 * lonely tiles would read thinner than the work itself. Each entry says what was
 * actually made and links to the page that shows it.
 */
function CustomersSection() {
  const clients = [
    { name: 'TECH CREW Inc.', work: 'Recruitment interviews', href: '/en/recruitment' },
    { name: 'Comas', work: 'Customer interviews', href: '/en/case-study' },
  ];

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clients.map((c, i) => (
                <FadeIn key={c.name} delay={i * 0.08}>
                  <Link
                    href={c.href}
                    className="h-full bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-1.5 hover:border-gray-300 transition-colors"
                  >
                    <span className="text-base font-bold text-gray-900">{c.name}</span>
                    <span className="text-sm text-gray-500">{c.work}</span>
                  </Link>
                </FadeIn>
              ))}
            </div>
            <FadeIn>
              {/* Quiet route out to the non-corporate work — kept low on a company-facing
                  top page, but university/municipality keep their inbound links. */}
              <p className="mt-5 text-sm text-gray-500">
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
