import FadeIn from './FadeIn';
import { FileText, ExternalLink } from 'lucide-react';

interface Article {
  title: string;
  url: string;
  langLabel: string;
  desc: string;
  thumb: string;
}

const ARTICLES: Record<'ja' | 'en', { heading: string; subheading: string; note: string; readLabel: string; publishedLabel: string; articles: Article[] }> = {
  ja: {
    heading: '記事でも、リアルな声を届ける',
    subheading: 'インタビュー記事（オプション）の制作事例',
    note: 'インタビュー内容をテステモが記事化。お客様のオウンドメディアやコラムにそのまま掲載でき、SEO・検索流入にも活用できます。',
    readLabel: '記事を読む',
    publishedLabel: '掲載先：COMASJAPAN株式会社 コラム',
    articles: [
      {
        title: '英語研修でCEFR B2からC1へ｜英語で商談を成約した導入事例',
        url: 'https://comasjapan.com/column/client-story-gaogao-tejima-cefr/',
        langLabel: '日本語記事',
        desc: '受講者インタビューを基に執筆した導入事例記事。数値の変化と商談成約というビジネス成果を軸に構成。',
        thumb: '/articles/comas-tejima.jpg',
      },
      {
        title: 'Customized Business Japanese Training in Tokyo | A Clinic Owner’s Story',
        url: 'https://comasjapan.com/column/client-story-ariel-thorpe-business-japanese/',
        langLabel: 'English Article',
        desc: '英語話者の受講者インタビューを基に英語で執筆。海外向けの検索流入・集客を狙った導入事例記事。',
        thumb: '/articles/comas-ariel.jpg',
      },
    ],
  },
  en: {
    heading: 'Real voices, in writing too',
    subheading: 'Interview article examples (optional add-on)',
    note: 'We turn each interview into a polished article — ready to publish on your own media or blog, and built to bring in search traffic.',
    readLabel: 'Read the article',
    publishedLabel: 'Published on: COMASJAPAN Inc. column',
    articles: [
      {
        title: 'From CEFR B2 to C1 — closing deals in English (Japanese article)',
        url: 'https://comasjapan.com/column/client-story-gaogao-tejima-cefr/',
        langLabel: 'Japanese Article',
        desc: 'A case-study article written from a learner interview — built around measurable progress and a real business win.',
        thumb: '/articles/comas-tejima.jpg',
      },
      {
        title: 'Customized Business Japanese Training in Tokyo | A Clinic Owner’s Story',
        url: 'https://comasjapan.com/column/client-story-ariel-thorpe-business-japanese/',
        langLabel: 'English Article',
        desc: 'Written in English from an English-speaking client’s interview — a case study aimed at international search traffic.',
        thumb: '/articles/comas-ariel.jpg',
      },
    ],
  },
};

export default function ArticleShowcase({ locale = 'ja' }: { locale?: 'ja' | 'en' }) {
  const t = ARTICLES[locale];
  return (
    <section id="articles" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-900">{t.heading}</h2>
          <p className="text-center text-gray-500 mb-4">{t.subheading}</p>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">{t.note}</p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.articles.map((a, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col h-full bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/40 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="relative border-b border-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.thumb}
                    alt={a.title}
                    className="w-full aspect-[900/497] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col flex-grow p-8">
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center gap-2 text-primary">
                    <FileText size={22} />
                    <span className="text-xs font-semibold tracking-wide px-3 py-1 bg-primary/10 rounded-full">{a.langLabel}</span>
                  </span>
                  <ExternalLink size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors">{a.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">{a.desc}</p>
                <div className="text-xs text-gray-400 mb-4">{t.publishedLabel}</div>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {t.readLabel}
                  <ExternalLink size={14} />
                </span>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
