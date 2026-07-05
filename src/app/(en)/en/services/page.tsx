import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Choose your TesuTemo style | TesuTemo',
  description: 'Four ways to collect real interview videos — for recruitment, universities, municipalities, and customer stories.',
  robots: { index: true, follow: true },
};

const services = [
  {
    key: 'sagashi',
    name: 'TesuTemo Voice Scout',
    start: 'Which person to interview?',
    desc: 'Collect quick responses from a wide group, then identify the people worth sitting down with for a full interview. Free to try.',
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
            <div className="mb-12">
              <p className="text-xs font-medium tracking-[0.14em] uppercase text-primary mb-5">Services</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Choose your TesuTemo style
              </h1>
              <p className="text-gray-500 text-lg">
                <span className="font-medium text-gray-700">Recruitment, customers, universities, municipalities</span> — choose from these styles.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((s, i) => (
              <FadeIn key={s.key} delay={i * 0.08}>
                <div
                  className="rounded-2xl p-8 h-full flex flex-col"
                  style={{ backgroundColor: '#FBF8F2', border: '1px solid #E4DCCF' }}
                >
                  <p className="text-sm font-semibold text-primary mb-3">{s.name}</p>

                  <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-4">{s.start}</h2>

                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{s.desc}</p>

                  <ul className="space-y-2.5 mb-6 flex-grow">
                    {s.steps.map((step, n) => (
                      <li key={n} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-gray-400 mb-5">{s.tags.join(' · ')}</p>

                  <Link
                    href={s.href}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all self-start ${
                      s.ctaStyle === 'filled'
                        ? 'bg-primary text-white hover:bg-[#c74320]'
                        : 'border border-gray-300 text-gray-700 hover:border-gray-400 bg-white'
                    }`}
                  >
                    {s.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.35}>
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
