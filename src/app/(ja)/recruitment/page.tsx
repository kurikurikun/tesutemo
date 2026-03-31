import type { Metadata } from 'next';
import SubpageLayout from '@/components/SubpageLayout';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '社員インタビュー動画で採用を強化｜TesuTemo',
  description:
    '社員インタビュー動画で求職者の共感を生み、ミスマッチのない採用を実現。リアルな声で職場の雰囲気や働きがいを伝える採用プロモーション動画サービス。',
  alternates: { canonical: 'https://www.tesutemo.co/recruitment' },
};

const v = (id: string, h?: string) =>
  `https://player.vimeo.com/video/${id}?${h ? `h=${h}&` : ''}badge=0&autopause=0&player_id=0&app_id=58479`;

export default function RecruitmentPage() {
  return (
    <SubpageLayout
      currentPath="/recruitment"
      heroTitle={
        <>
          社員のリアルな声で、採用を変える。
          <br /><span className="text-primary">社員インタビュー動画</span>サービス
        </>
      }
      heroSubtitle={
        <>
          <span className="text-primary font-semibold">リアルな声</span>で求職者の共感を生み
          <br />
          <span className="text-primary font-semibold">安価</span>で手に入る採用の動画プロモーション
        </>
      }
      heroVideoUrl={v('1177652915', 'be43651176')}
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
        v('1177653343', 'ddc7b19cbb'),
      ]}
      verticalVideos={[
        v('1177647609', 'fb5b66c157'),
        v('1177647513', 'd517b6f9ed'),
        v('1177647574', 'c1311764fd'),
      ]}
    >
      {/* 採用現場でのTesuTemo動画活用イメージ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#e8e5f5] to-[#f0eef8] rounded-2xl py-8 px-6 mb-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              採用現場での<br />TesuTemo動画活用イメージ
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                num: '①',
                title: 'SNS',
                points: [
                  'SNSから情報を手に入れているターゲット層と繋がります。',
                  '広範囲なエンゲージメントを得られる強力な手段。',
                  'インタビュー動画は視聴の魅力でシェアされやすく、SNSでの拡散を促進します。',
                ],
              },
              {
                num: '②',
                title: '採用説明会',
                points: [
                  '企業の雰囲気や文化、職場環境を視覚的に伝え、求職者に印象を与えしもらいます',
                  '他の企業との差別化します',
                  '短時間で、求職者の関心を引きつけます',
                  '求職者はその企業で働くイメージを具体的に持ちやすくなります',
                ],
              },
              {
                num: '③',
                title: '企業の採用ページ',
                points: [
                  '企業のリアルな雰囲気と文化を伝え、求職者の信頼を得ると共に、応募意欲を高めます',
                  '企業の雇用ブランディングを強化します',
                  '職場環境や社員の表情、熱意などを直感伝えられます',
                ],
              },
              {
                num: '④',
                title: '採用サイト',
                points: [
                  '応募する際の意思決定を後押しする効果になります',
                  '多様な職種を効率よく比較できます',
                  'マイナビなど、採用サイトも縦動画のショートムービーを導入しています',
                ],
              },
            ].map((item) => (
              <div key={item.num} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{item.num}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary mt-1">{item.title}</h3>
                </div>
                <ul className="space-y-3 ml-14">
                  {item.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="text-gray-700">•</span>
                      <p className="text-gray-700 leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* マイナビスクリーンショット */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <p className="text-lg text-gray-700 font-semibold">マイナビさま</p>
                <p className="text-sm text-gray-500 mt-1">※弊社実績ではなくイメージです</p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/mynavi-screenshot.png"
                  alt="マイナビ ショートムービーギャラリー"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </SubpageLayout>
  );
}
