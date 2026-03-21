'use client';

import SubpageLayout from '@/components/SubpageLayout';

const vimeoBase = 'https://player.vimeo.com/video/';
const params = '?badge=0&autopause=0&player_id=0&app_id=58479';

export default function MunicipalityPage() {
  return (
    <SubpageLayout
      heroTitle={
        <>
          地域の<span className="text-primary">「ファン」</span>である先輩移住者の声で、
          <br />次の移住者を迎える
        </>
      }
      heroSubtitle={
        <>
          <span className="text-primary font-semibold">リアルな声</span>で移住者の共感を生み
          <br />
          <span className="text-primary font-semibold">安価</span>で手に入る移住の動画プロモーション
        </>
      }
      heroVideoUrl={`${vimeoBase}1010426949?h=34d0ad59fb${params}`}
      problemIntro="自治体の移住促進における課題"
      problems={[
        'Webサイトやパンフレットだけでは地域の魅力が伝わらない',
        '移住検討者に地域のリアルな暮らしを届けられない',
        '他の自治体との差別化が難しい',
        '移住後のミスマッチで定住につながらない',
        '限られた予算で効果的なプロモーションができない',
      ]}
      solutionTitle="先輩移住者のリアルな声が、次の移住者を引き寄せる"
      solutionDesc="実際に移住した方のインタビュー動画を通じて、パンフレットでは伝わらない地域の暮らしや魅力をリアルに届けます。等身大の声が、移住検討者の共感を生みます。"
      horizontalVideos={[
        `${vimeoBase}1010823028?h=680857e13b${params}`,
        `${vimeoBase}1050610140?h=a5b8353977${params}`,
      ]}
      verticalVideos={[
        `${vimeoBase}1015054920?h=aa8a72196a${params}`,
        `${vimeoBase}1013400453?h=89cb5fd807${params}`,
        `${vimeoBase}1050617850?h=2e4031d8bd${params}`,
      ]}
    />
  );
}
