import type { Metadata } from 'next';
import SubpageLayout from '@/components/SubpageLayout';

export const metadata: Metadata = {
  title: '導入事例動画・顧客インタビュー動画の制作｜TesuTemo',
  description:
    '顧客インタビュー動画で見込み客の不安を解消し、購買を後押しする導入事例動画サービス。信頼できる第三者の声で商品・サービスの本当の価値を届けます。',
  alternates: {
    canonical: 'https://www.tesutemo.co/case-study',
    languages: { en: 'https://www.tesutemo.co/en/case-study' },
  },
};

const v = (id: string, h?: string) =>
  `https://player.vimeo.com/video/${id}?${h ? `h=${h}&` : ''}badge=0&autopause=0&player_id=0&app_id=58479`;

export default function CaseStudyPage() {
  return (
    <SubpageLayout
      currentPath="/case-study"
      heroTitle={
        <>
          顧客のリアルな声が、最強の営業ツールになる。
          <br /><span className="text-primary">導入事例インタビュー動画</span>サービス
        </>
      }
      heroSubtitle="リアルな顧客インタビューで、商品・サービスの本当の価値を届ける"
      heroVideoUrl={v('1017754838', '2df374323e')}
      problemHeading="発信しているのに、選ばれない"
      problemSubheading={<>企業として情報発信はしているものの、<br />実際にはこんな課題を感じていませんか？</>}
      problems={[
        '商品・サービスの魅力が伝わりきらない',
        'レビューサイトの口コミだけでは信頼が不十分',
        '競合との差別化ポイントが伝わらない',
        'コンバージョン率が伸び悩んでいる',
        '既存顧客の満足度を新規獲得に活かせていない',
      ]}
      problemConclusion={<>結果として、<br />商品・サービスの本当の価値が伝わらず、顧客獲得の機会を逃している。</>}
      solutionTitle="テステモは、リアルな声で伝えます"
      solutionSubtitle={<>顧客のインタビューを通して<br />商品・サービスの&ldquo;本当の価値&rdquo;を可視化</>}
      solutionPoints={['見込み客が「自分にも合うか」を判断できるコンテンツ']}
      videoSectionTitle="リアルな声が、購買の判断を変える"
      videoSectionSubtitle="インタビュー動画（横型：90〜120秒 / 縦型：30〜60秒）"
      videoHorizontalDesc={<>横型はWebサイトやイベントで<span className="text-primary font-bold">「しっかり伝える」</span>ために</>}
      videoVerticalDesc={<>縦型はSNSで<span className="text-primary font-bold">「見つけてもらう」</span>ために</>}
      onlineFeatures={[
        { title: '日常環境だから', desc: '自身のスマホに向けて話すことで、リラックスした状態でリアルな声を聞くことができる' },
        { title: '専用ソフトで高品質に収録', desc: 'ログイン・サインアップ不要の専用ソフトで収録することで、音声・映像の品質を保ちながら、現地に撮影に行く必要がなく、コストを抑えて実施できる' },
        { title: '顧客の情報収集チャネルに最適化', desc: 'ターゲットとなる顧客が日常的に使うSNSに適したコンテンツとして活用できる' },
      ]}
      horizontalVideos={[
        v('1019675789', '8ca81d7847'),
        v('1082523091'),
        v('1049154514'),
        v('1019649377'),
      ]}
      verticalVideos={[
        v('1020046986'),
        v('1049144140'),
        v('1169470823'),
      ]}
    />
  );
}
