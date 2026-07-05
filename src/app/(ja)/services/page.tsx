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
  title: 'サービスの選び方 | TesuTemo',
  description: 'テステモのサービス一覧。インタビュー動画の収録方法は、状況に合わせて選べます。',
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
    name: 'テステモ声さがし',
    start: '語れる人が、まだ分からない',
    desc: '簡易的に多くの人から話を集め、その中からじっくりインタビューしたい人を見つけ出します。無料でお試しいただけます。',
    nodes: [
      { caption: 'リンク送付', icon: iconLink },
      { caption: '自由に回答', icon: iconWave },
      { caption: '候補を提案', icon: iconShortlist },
    ],
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
    nodes: [
      { caption: '日程調整', icon: iconCalendar },
      { caption: 'オンライン取材', icon: iconVideoCall },
      { caption: '編集して納品', icon: iconOutput },
    ],
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
    nodes: [
      { caption: '機材を郵送', icon: iconBox },
      { caption: '遠隔で指示', icon: iconPhoneTripod },
      { caption: '編集して納品', icon: iconOutput },
    ],
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
    nodes: [
      { caption: 'リンク送付', icon: iconLink },
      { caption: 'その場で収録', icon: iconBrowserRecord },
      { caption: '編集して納品', icon: iconOutput },
    ],
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
            <div className="mb-14 max-w-3xl">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-5">Services</p>
              <h1 className="text-4xl lg:text-[3.25rem] font-black text-gray-900 leading-[1.16] mb-5">
                テステモのスタイルを選ぶ
              </h1>
              <p className="text-gray-500 text-lg leading-[1.75]">
                <span className="font-medium text-gray-700">採用・顧客の声・大学・移住</span> — どの分野でも、この4つから入れます。
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
              組み合わせも可能です。声さがしで見つけ、セルフ収録で広く集め、本命はインタビューで仕上げる、という流れもつくれます。
            </p>
          </FadeIn>

        </div>
      </main>
      <Footer />
    </>
  );
}
