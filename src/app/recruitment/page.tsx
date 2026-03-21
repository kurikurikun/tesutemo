'use client';

import SubpageLayout from '@/components/SubpageLayout';

const vimeoBase = 'https://player.vimeo.com/video/';
const params = '?badge=0&autopause=0&player_id=0&app_id=58479';

export default function RecruitmentPage() {
  return (
    <SubpageLayout
      heroTitle={
        <>
          会社の<span className="text-primary">「ファン」</span>である社員の声で、
          <br />次の仲間を迎える
        </>
      }
      heroSubtitle={
        <>
          <span className="text-primary font-semibold">リアルな声</span>で求職者の共感を生み
          <br />
          <span className="text-primary font-semibold">安価</span>で手に入る採用の動画プロモーション
        </>
      }
      heroVideoUrl={`${vimeoBase}1017754838?h=2df374323e${params}`}
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
        `${vimeoBase}1019675789?h=8ca81d7847${params}`,
        `${vimeoBase}1082523091${params}`,
        `${vimeoBase}1049154514${params}`,
        `${vimeoBase}1019649377${params}`,
      ]}
      verticalVideos={[
        `${vimeoBase}1020046986?h=83e6b0fedd${params}`,
        `${vimeoBase}1049144140${params}`,
        `${vimeoBase}1169470823?h=af1c20547e${params}`,
      ]}
    />
  );
}
