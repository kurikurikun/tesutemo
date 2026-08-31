import type { Metadata } from 'next';
import FadeIn from '@/components/FadeIn';
import { VerticalMarquee, VerticalStrip, type ShowcaseVideo } from '@/components/VerticalShowcase';

/**
 * 【比較用の使い捨てページ】トップページ「文字や写真では伝わらない」の縦型の
 * 見せ方を、A案 / B案 / 現行 の3つ並べて見比べるためだけのページ。
 *
 * どれを採るか決まったら、このディレクトリと VerticalShowcase.tsx の負けた方を
 * 消すこと。noindex にしてあるが、そもそも本番に残す想定のページではない。
 */

export const metadata: Metadata = {
  title: '縦型の見せ方 A/B',
  robots: { index: false, follow: false },
};

const v = (id: string, h: string) =>
  `https://player.vimeo.com/video/${id}?h=${h}&title=0&byline=0&portrait=0`;

// 客先が偏って見えないよう Comas と TECH CREW を交互に。プロベルは入れない
// （営業代行であって顧客ではなく、素材にロゴが焼き込まれているものもある）。
const videos: ShowcaseVideo[] = [
  { name: '手島 — S1', vimeo: v('1211072475', '8e9082a9da') },
  { name: '清水 — S1', vimeo: v('1222248136', '094e6a6fd2') },
  { name: 'Ariel — hook', vimeo: v('1211072516', '73c275066b') },
  { name: '野田 — S1', vimeo: v('1221072287', '09e1a18a37') },
  { name: '手島 — S2', vimeo: v('1211072453', 'c96d4c9dc8') },
  { name: '清水 — S2', vimeo: v('1222248158', 'bd8a70f8de') },
  { name: 'Ariel — results', vimeo: v('1211072550', '5072a1c650') },
  { name: '野田 — S3', vimeo: v('1221072528', '5fc3a51de8') },
];

function Heading() {
  return (
    <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
      <h2 className="text-3xl font-bold leading-snug tracking-tight text-gray-900 lg:text-4xl">
        文字や写真では
        <br />
        伝わらない
      </h2>
      <p className="max-w-xs text-sm leading-relaxed text-gray-600 sm:text-right">
        表情、温度感、本音まで含めて伝えることで、信頼できる判断材料を提供します
      </p>
    </div>
  );
}

function Label({ tag, title, note }: { tag: string; title: string; note: string }) {
  return (
    <div className="mx-auto mb-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-5">
        <p className="mb-1 text-xs font-bold tracking-[0.2em] text-primary">{tag}</p>
        <p className="font-bold text-gray-900">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">{note}</p>
      </div>
    </div>
  );
}

export default function VerticalsLabPage() {
  return (
    <main className="pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500">
          比較用のページです。本番のトップページには出ていません。動画は8本 —
          Comas と TECH CREW を交互に並べています。
        </p>
      </div>

      <Label
        tag="A"
        title="横スクロールの帯"
        note="右端が見切れて「まだある」と分かる。矢印で1枚ずつ送る。何本増やしてもセクションの高さは変わらない。"
      />
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Heading />
          </FadeIn>
          <VerticalStrip videos={videos} />
        </div>
      </section>

      <Label
        tag="B"
        title="自動で流れ続ける帯"
        note="操作しなくても動き続ける。ホバーで停止。「リアルな声がたくさんある」という印象が主で、1本を見せることは主目的ではない。"
      />
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Heading />
          </FadeIn>
        </div>
        <VerticalMarquee videos={videos} />
      </section>

      <Label
        tag="現行"
        title="4列のグリッド（いま本番に出ているもの）"
        note="比較のために同じ見出しで4本だけ。1本あたりが細く、本数を増やすと下に伸び続ける。"
      />
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Heading />
          </FadeIn>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {videos.slice(0, 4).map((item) => (
              <div key={item.name} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
                  <iframe
                    src={item.vimeo}
                    className="absolute left-0 top-0 h-full w-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={`TesuTemo - ${item.name}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
