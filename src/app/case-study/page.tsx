'use client';

import SubpageLayout from '@/components/SubpageLayout';

const vimeoBase = 'https://player.vimeo.com/video/';
const params = '?title=0&byline=0&portrait=0';

export default function CaseStudyPage() {
  return (
    <SubpageLayout
      heroTitle="自社の「ファン」の声で、次の顧客を動かす"
      heroSubtitle="リアルな顧客インタビューで、商品・サービスの本当の価値を届ける"
      heroVideoUrl={`${vimeoBase}1017754838?h=2df374323e${params}`}
      problemIntro="顧客獲得における課題"
      problems={[
        '商品・サービスの魅力が伝わりきらない',
        'レビューサイトの口コミだけでは信頼が不十分',
        '競合との差別化ポイントが伝わらない',
        'コンバージョン率が伸び悩んでいる',
        '既存顧客の満足度を新規獲得に活かせていない',
      ]}
      solutionTitle="顧客のリアルな声が、次の顧客を動かす"
      solutionDesc="実際に利用している顧客のインタビュー動画を通じて、テキストレビューでは伝わらない使用感や満足度をリアルに届けます。信頼できる第三者の声が、見込み客の不安を解消し購買への一歩を後押しします。"
      horizontalVideos={[
        `${vimeoBase}1019675789?h=8ca81d7847${params}`,
        `${vimeoBase}1082523091${params}`,
        `${vimeoBase}1049154514${params}`,
        `${vimeoBase}1019649377${params}`,
      ]}
      verticalVideos={[
        `${vimeoBase}1020046986${params}`,
        `${vimeoBase}1049144140${params}`,
        `${vimeoBase}1169470823${params}`,
      ]}
    />
  );
}
