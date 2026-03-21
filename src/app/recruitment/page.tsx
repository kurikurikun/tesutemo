'use client';

import SubpageLayout from '@/components/SubpageLayout';

const vimeoBase = 'https://player.vimeo.com/video/';
const params = '?title=0&byline=0&portrait=0';

export default function RecruitmentPage() {
  return (
    <SubpageLayout
      heroTitle="会社の「ファン」である社員の声で、次の仲間を迎える"
      heroSubtitle="リアルな社員インタビューで、企業の本当の魅力を求職者に届ける"
      heroVideoUrl={`${vimeoBase}1020065025?h=c786d2097a${params}`}
      problemIntro="企業採用における課題"
      problems={[
        '求人情報だけでは社風や働き方が伝わらない',
        '入社後のミスマッチで早期離職が多い',
        '他社との差別化が難しく応募が集まらない',
        '採用コストが年々増加している',
        '優秀な人材へのアプローチ方法が限られている',
      ]}
      solutionTitle="社員のリアルな声が、次の仲間を引き寄せる"
      solutionDesc="実際に働いている社員のインタビュー動画を通じて、求人票では伝わらない職場の雰囲気や仕事のやりがいをリアルに届けます。共感を生む等身大の声が、ミスマッチのない採用を実現します。"
      horizontalVideos={[
        `${vimeoBase}1020065025?h=c786d2097a${params}`,
        `${vimeoBase}1014779536?h=2c4b22d316${params}`,
      ]}
      verticalVideos={[
        `${vimeoBase}1015054920${params}`,
        `${vimeoBase}1013400453${params}`,
        `${vimeoBase}1050617850${params}`,
      ]}
    />
  );
}
