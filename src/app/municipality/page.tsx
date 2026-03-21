import type { Metadata } from 'next';
import SubpageLayout from '@/components/SubpageLayout';

export const metadata: Metadata = {
  title: '自治体移住促進動画 - 移住者のリアルな声で次の移住者を迎える',
  description:
    '先輩移住者のインタビュー動画で移住検討者の共感を生み、地域の魅力をリアルに届ける移住促進動画サービス。限られた予算で効果的なプロモーションを実現します。',
};

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
      problemHeading="発信しているのに、選ばれない"
      problemSubheading={<>自治体として情報発信はしているものの、<br />実際にはこんな課題を感じていませんか？</>}
      problems={[
        '予算が限られているのに、移住者のリアルな声を発信したい',
        '移住サイトを作っても、そもそも辿りつかない',
        'SNS発信は大事だと知りながら、魅力のコンテンツがない',
        '限られた人員で、継続的な発信が難しい',
        'パンフレットを見てもらっても、オンラインに誘導したい',
      ]}
      problemConclusion={<>結果として、<br />地域の魅力が十分に伝わらず、移住後のミスマッチが起きている。</>}
      solutionTitle="テステモは、リアルな声で伝えます"
      solutionSubtitle={<>移住者・地域に関わる人のインタビューを通して<br />地域の&ldquo;本当の魅力&rdquo;を可視化</>}
      solutionPoints={['移住後の暮らしを具体的にイメージできるコンテンツ']}
      videoSectionTitle="リアルな声が、移住の判断を変える"
      videoSectionSubtitle="インタビュー動画（横型：90〜120秒 / 縦型：30〜60秒）"
      videoHorizontalDesc={<>横型は移住サイトや説明会・イベントで<span className="text-primary font-bold">「しっかり伝える」</span>ために</>}
      videoVerticalDesc={<>縦型はSNSで<span className="text-primary font-bold">「見つけてもらう」</span>ために</>}
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
