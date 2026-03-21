import type { Metadata } from 'next';
import SubpageLayout from '@/components/SubpageLayout';

export const metadata: Metadata = {
  title: '大学広報動画 - 学生のリアルな声で入学者を迎える',
  description:
    '在学生インタビュー動画で志願者の共感を生み、大学の魅力をリアルに届ける広報動画サービス。キャンパスライフや学びの魅力を等身大の声で伝えます。',
};

const vimeoBase = 'https://player.vimeo.com/video/';
const params = '?badge=0&autopause=0&player_id=0&app_id=58479';

export default function UniversityPage() {
  return (
    <SubpageLayout
      heroTitle={
        <>
          大学の<span className="text-primary">「ファン」</span>である学生の声で、
          <br />次の入学者を迎える
        </>
      }
      heroSubtitle={
        <>
          <span className="text-primary font-semibold">リアルな声</span>でターゲットとなる学生の共感を生み
          <br />
          <span className="text-primary font-semibold">安価</span>で手に入る大学の動画プロモーション
        </>
      }
      heroVideoUrl={`${vimeoBase}1017754838?h=2df374323e${params}`}
      problemHeading="発信しているのに、選ばれない"
      problemSubheading={<>大学として情報発信はしているものの、<br />実際にはこんな課題を感じていませんか？</>}
      problems={[
        '予算が限られているのに、多様な学生の声を発信したい',
        '学部サイトを作っても、そもそも辿りつかない',
        'SNS発信は大事だと知りながら、魅力のコンテンツがない',
        '教授でコースの魅力を伝えたいが、時間が取れない',
        'パンフレットを見てもらっても、オンラインに誘導したい',
      ]}
      problemConclusion={<>結果として、<br />大学の魅力が十分に伝わらず、志願者とのミスマッチが起きている。</>}
      solutionTitle="テステモは、リアルな声で伝えます"
      solutionSubtitle={<>在学生・卒業生のインタビューを通して<br />大学の&ldquo;本当の魅力&rdquo;を可視化</>}
      solutionPoints={['志願者が「自分に合うか」を判断できるコンテンツ']}
      videoSectionTitle="リアルな声が、志願者の判断を変える"
      videoSectionSubtitle="インタビュー動画（横型：90〜120秒 / 縦型：30〜60秒）"
      videoHorizontalDesc={<>横型は大学サイトや説明会で<span className="text-primary font-bold">「しっかり伝える」</span>ために</>}
      videoVerticalDesc={<>縦型はSNSで<span className="text-primary font-bold">「見つけてもらう」</span>ために</>}
      horizontalVideos={[
        `${vimeoBase}1019675789?h=8ca81d7847${params}`,
        `${vimeoBase}1082523091${params}`,
        `${vimeoBase}1049154514${params}`,
        `${vimeoBase}1019649377${params}`,
      ]}
      verticalVideos={[
        `${vimeoBase}1077851874?h=4cc1f2e2a6${params}`,
        `${vimeoBase}1077854511?h=4e8398acf7${params}`,
        `${vimeoBase}1077853072?h=82e17e407b${params}`,
      ]}
    />
  );
}
