import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'サービスの選び方 | TesuTemo',
  description: 'テステモのサービス一覧。インタビュー動画の収録方法は、状況に合わせて選べます。',
  robots: { index: true, follow: true },
};

const services = [
  {
    key: 'sagashi',
    name: 'テステモ声さがし',
    start: '語れる人が、まだ分からない',
    desc: '簡易的に多くの人から話を集め、その中からじっくりインタビューしたい人を見つけ出します。無料でお試しいただけます。',
    steps: [
      'アンケートとあわせて、動画か音声で回答できる質問リンクを送付',
      '回答者がスマホにむけて自由に回答・投稿。アプリ不要',
      '回答者の中から有望な語り手をリストアップしてご提案',
    ],
    tags: ['採用', '顧客', '大学', '自治体'],
    cta: 'お問い合わせ',
    href: '/#contact',
    ctaStyle: 'outline',
  },
  {
    key: 'interview',
    name: 'テステモ フルサービス',
    start: '相手は決まっている・任せたい',
    desc: 'プロのインタビュアーがオンライン完結で本音を引き出し、そのままSNSなどで使える動画でお渡しします。',
    steps: [
      '対象者の日程調整とヒアリング項目のすり合わせ',
      'プロのインタビュアーがオンラインで本音を引き出す',
      'SNSなどですぐ使える形に編集して納品',
    ],
    tags: ['採用', '顧客', '大学', '自治体'],
    cta: 'お問い合わせ',
    href: '/#contact',
    ctaStyle: 'filled',
  },
  {
    key: 'camera',
    name: 'テステモ同行カメラ',
    start: 'もう、現地に行く予定がある',
    desc: 'ライターの取材など、すでに現地に伺う機会に同行する形でカメラも。撮影クルーの出張なしで、記事取材と同じ一回からインタビュー動画も残せます。現場のスマホを、私たちが遠隔でディレクション。',
    steps: [
      '現地での取材日までにスマホとスタンドを郵送で届ける',
      '訪問先でスマホ設置していただき、こちらが遠隔でディレクション',
      '編集済み動画を納品',
    ],
    tags: ['採用', '顧客', '大学', '自治体'],
    cta: 'お問い合わせ',
    href: '/#contact',
    ctaStyle: 'outline',
  },
  {
    key: 'lite',
    name: 'テステモセルフ収録',
    start: '自分たちで、手軽に録りたい',
    desc: 'アプリのインストールは不要。ブラウザだけで、社員・学生・お客様・移住者の声をその場で収録。リンクを送るだけで動画が集まり、プロの編集でSNSなどで使える動画でお渡しします。',
    steps: [
      '収録用リンクを社員・学生・お客様に送るだけ',
      '相手がブラウザ上でその場で収録。アプリ不要',
      'プロが編集し、使える動画に仕上げてお渡し',
    ],
    tags: ['採用', '顧客', '大学', '自治体'],
    cta: '無料で試す',
    href: '/lite/signup',
    ctaStyle: 'filled',
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header currentPath="/services" />
      <main className="min-h-screen pt-24 pb-24" style={{ backgroundColor: '#F4EFE7' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          <FadeIn>
            <div className="mb-12">
              <p className="text-xs font-medium tracking-[0.14em] uppercase text-primary mb-5">Services</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                テステモのスタイルを選ぶ
              </h1>
              <p className="text-gray-500 text-lg">
                <span className="font-medium text-gray-700">採用・顧客の声・大学・移住</span> — どの分野でも、この4つから入れます。
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

                  <p className="text-xs text-gray-400 mb-5">{s.tags.join('・')}</p>

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
              組み合わせも可能です。声さがしで見つけ、セルフ収録で広く集め、本命はインタビューで仕上げる、という流れもつくれます。
            </p>
          </FadeIn>

        </div>
      </main>
      <Footer />
    </>
  );
}
