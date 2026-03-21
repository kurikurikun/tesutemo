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
      problemIntro="大学広報における課題"
      problems={[
        'パンフレットやWebサイトだけでは大学の魅力が伝わらない',
        'オープンキャンパスに来られない学生にリーチできない',
        '学部ごとの特色や雰囲気を具体的に伝えられない',
        '留学生向けの情報発信が不足している',
        '志願者数の減少に歯止めがかからない',
      ]}
      solutionTitle="在学生のリアルな声が、次の入学者を引き寄せる"
      solutionDesc="実際に通っている学生のインタビュー動画を通じて、パンフレットでは伝わらないキャンパスライフや学びの魅力をリアルに届けます。等身大の声が、志願者の共感を生みます。"
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
