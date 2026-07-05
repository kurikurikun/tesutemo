import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import ServiceFlowDiagram, {
  type FlowNode,
  iconLink,
  iconWave,
  iconShortlist,
  iconCalendar,
  iconVideoCall,
  iconBox,
  iconPhoneTripod,
  iconBrowserRecord,
  iconOutput,
} from '@/components/ServiceFlowDiagram';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Choose your TesuTemo style | TesuTemo',
  description: 'Four ways to collect real interview videos — for recruitment, universities, municipalities, and customer stories.',
  robots: { index: true, follow: true },
};

const services: {
  key: string;
  name: string;
  start: string;
  desc: string;
  nodes: [FlowNode, FlowNode, FlowNode];
  steps: string[];
  tags: string[];
  cta: string;
  href: string;
  ctaStyle: 'filled' | 'outline';
}[] = [
  {
    key: 'sagashi',
    name: 'TesuTemo Voice Scout',
    start: 'Which person to interview?',
    desc: 'Collect quick responses from a wide group, then identify the people worth sitting down with for a full interview. Free to try.',
    nodes: [
      { caption: 'Send link', icon: iconLink },
      { caption: 'They reply', icon: iconWave },
      { caption: 'We shortlist', icon: iconShortlist },
    ],
    steps: [
      'Send a link along with your usual survey. Respondents reply by video or voice, no app needed',
      'They record on their smartphone, freely and at their own pace',
      'We review responses and propose the most promising interviewees',
    ],
    tags: ['Recruitment', 'Customers', 'University', 'Municipality'],
    cta: 'Get in touch',
    href: '/en#contact',
    ctaStyle: 'outline',
  },
  {
    key: 'interview',
    name: 'TesuTemo Full Service',
    start: 'You know who — and want it handled',
    desc: 'A professional interviewer draws out honest, candid answers online. You receive ready-to-use videos for social media and beyond.',
    nodes: [
      { caption: 'Schedule', icon: iconCalendar },
      { caption: 'Interview online', icon: iconVideoCall },
      { caption: 'Edit & deliver', icon: iconOutput },
    ],
    steps: [
      'We coordinate scheduling and align on interview topics',
      'A professional interviewer conducts the session online',
      'Edited and delivered ready-to-use for social media',
    ],
    tags: ['Recruitment', 'Customers', 'University', 'Municipality'],
    cta: 'Get in touch',
    href: '/en#contact',
    ctaStyle: 'filled',
  },
  {
    key: 'camera',
    name: 'TesuTemo On-Location',
    start: "You're already visiting — bring us remotely",
    desc: "When you're heading out for a written interview and photos, we join remotely and direct the shoot on your smartphone. No film crew travel costs. Just one visit, and you leave with both written content and interview videos.",
    nodes: [
      { caption: 'Ship kit', icon: iconBox },
      { caption: 'Direct remotely', icon: iconPhoneTripod },
      { caption: 'Edit & deliver', icon: iconOutput },
    ],
    steps: [
      'We ship a smartphone and stand to you before your customer visit',
      'Set it up on-site — we direct the shoot remotely',
      'Edited videos delivered',
    ],
    tags: ['Recruitment', 'Customers', 'University', 'Municipality'],
    cta: 'Get in touch',
    href: '/en#contact',
    ctaStyle: 'outline',
  },
  {
    key: 'lite',
    name: 'TesuTemo Self-Record',
    start: 'You want to collect video comments',
    desc: 'No app download needed. Staff, students, customers, or residents record directly in the browser. Share a link and we edit everything into social-ready content.',
    nodes: [
      { caption: 'Send link', icon: iconLink },
      { caption: 'Record in browser', icon: iconBrowserRecord },
      { caption: 'Edit & deliver', icon: iconOutput },
    ],
    steps: [
      'Send a recording link to staff, students, or customers',
      'They record in the browser — no app needed',
      'We edit and deliver polished, social-ready videos',
    ],
    tags: ['Recruitment', 'Customers', 'University', 'Municipality'],
    cta: 'Try for free',
    href: '/lite/signup',
    ctaStyle: 'filled',
  },
];

export default function ServicesEnPage() {
  return (
    <>
      <Header locale="en" currentPath="/en/services" />
      <main className="min-h-screen pt-24 pb-24" style={{ backgroundColor: '#F4EFE7' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          <FadeIn>
            <div className="mb-14 max-w-3xl">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-5">Services</p>
              <h1 className="text-4xl lg:text-[3.25rem] font-black text-gray-900 leading-[1.16] mb-5">
                Choose your TesuTemo style
              </h1>
              <p className="text-gray-500 text-lg leading-[1.75]">
                <span className="font-medium text-gray-700">Recruitment, customers, universities, municipalities</span> — choose from these styles.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-3xl overflow-hidden"
              style={{ backgroundColor: '#E4DCCF', border: '1px solid #E4DCCF' }}
            >
              {services.map((s) => (
                <div
                  key={s.key}
                  className="p-8 md:p-12 lg:p-[52px] flex flex-col gap-6"
                  style={{ backgroundColor: '#FBF8F2' }}
                >
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[13px] font-bold text-primary tracking-[0.06em]">{s.name}</span>
                    <h2 className="text-[28px] font-black text-gray-900 leading-[1.35]">{s.start}</h2>
                  </div>

                  <p className="text-[15px] leading-[1.95]" style={{ color: '#6E655B' }}>
                    {s.desc}
                  </p>

                  <ServiceFlowDiagram nodes={s.nodes} />

                  <ul className="flex flex-col gap-3.5">
                    {s.steps.map((step, n) => (
                      <li key={n} className="flex items-start gap-3.5 text-[15px] leading-[1.7]" style={{ color: '#3A342E' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-none mt-[9px]" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between flex-wrap gap-4 mt-auto pt-1">
                    <span className="text-[13.5px] font-medium tracking-[0.04em]" style={{ color: '#9A9086' }}>
                      {s.tags.join(' · ')}
                    </span>
                    <Link
                      href={s.href}
                      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold transition-all ${
                        s.ctaStyle === 'filled'
                          ? 'bg-primary text-white hover:brightness-95 shadow-[0_14px_24px_-12px_rgba(233,83,31,0.55)]'
                          : 'bg-white text-gray-900 border-[1.5px] hover:bg-[#FBF8F2]'
                      }`}
                      style={s.ctaStyle === 'outline' ? { borderColor: '#E0D8CB' } : undefined}
                    >
                      {s.cta} <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-sm text-gray-400 mt-10 text-center">
              You can mix and match. Scout first, self-record broadly, then go full-service for the interviews that matter most.
            </p>
          </FadeIn>

        </div>
      </main>
      <Footer locale="en" />
    </>
  );
}
