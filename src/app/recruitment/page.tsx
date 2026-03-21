import type { Metadata } from 'next';
import SubpageLayout from '@/components/SubpageLayout';

export const metadata: Metadata = {
  title: '採用動画 - 社員のリアルな声で仲間を集める',
  description:
    '社員インタビュー動画で求職者の共感を生み、ミスマッチのない採用を実現。リアルな声で職場の雰囲気や働きがいを伝える採用プロモーション動画サービス。',
};

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
      problemHeading="発信しているのに、応募が来ない"
      problemSubheading={<>企業として情報発信はしているものの、<br />実際にはこんな課題を感じていませんか？</>}
      problems={[
        '予算が限られているのに、社員のリアルな声を発信したい',
        '採用サイトを作っても、そもそも辿りつかない',
        'SNS発信は大事だと知りながら、魅力のコンテンツがない',
        '限られた人員で、継続的な発信が難しい',
        'すぐに発信したいのに、従来の撮影では時間がかかる',
      ]}
      problemConclusion={<>結果として、<br />会社が求める数とタイプの応募者が集まらず、採用のミスマッチが起きている。</>}
      solutionTitle="テステモは、リアルな声で伝えます"
      solutionSubtitle={<>社員のインタビューを通して<br />企業の&ldquo;本当の魅力&rdquo;を可視化</>}
      solutionPoints={['入社後の働き方を具体的にイメージできるコンテンツ']}
      videoSectionTitle="リアルな声が、入社の判断を変える"
      videoSectionSubtitle="インタビュー動画（横型：90〜120秒 / 縦型：30〜60秒）"
      videoHorizontalDesc={<>横型は採用サイトや説明会・イベントで<span className="text-primary font-bold">「しっかり伝える」</span>ために</>}
      videoVerticalDesc={<>縦型はSNSで<span className="text-primary font-bold">「見つけてもらう」</span>ために</>}
      onlineFeatures={[
        { title: '日常環境だから', desc: '自身のスマホに向けて話すことで、リラックスした状態でリアルな声を聞くことができる' },
        { title: '専用ソフトで高品質に収録', desc: 'ログイン・サインアップ不要の専用ソフトで収録することで、音声・映像の品質を保ちながら、現地に撮影に行く必要がなく、コストを抑えて実施できる' },
        { title: '求職者の情報収集チャネルに最適化', desc: 'ターゲットとなる求職者が日常的に使うSNSに適したコンテンツとして活用できる' },
      ]}
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
