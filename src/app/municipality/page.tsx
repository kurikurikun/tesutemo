import type { Metadata } from 'next';
import SubpageLayout from '@/components/SubpageLayout';

export const metadata: Metadata = {
  title: '自治体移住促進動画 - 移住者のリアルな声で次の移住者を迎える',
  description:
    '先輩移住者のインタビュー動画で移住検討者の共感を生み、地域の魅力をリアルに届ける移住促進動画サービス。限られた予算で効果的なプロモーションを実現します。',
};

const v = (id: string, h?: string) =>
  `https://player.vimeo.com/video/${id}?${h ? `h=${h}&` : ''}badge=0&autopause=0&player_id=0&app_id=58479`;

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
      heroVideoUrl={v('1010426949', '34d0ad59fb')}
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
      onlineFeatures={[
        { title: '日常環境だから', desc: '自身のスマホに向けて話すことで、リラックスした状態でリアルな声を聞くことができる' },
        { title: '専用ソフトで高品質に収録', desc: 'ログイン・サインアップ不要の専用ソフトで収録することで、音声・映像の品質を保ちながら、現地に撮影に行く必要がなく、コストを抑えて実施できる' },
        { title: '移住検討者の情報収集チャネルに最適化', desc: 'ターゲットとなる移住検討者が日常的に使うSNSに適したコンテンツとして活用できる' },
      ]}
      horizontalVideos={[
        v('1010823028', '680857e13b'),
        v('1050610140', 'a5b8353977'),
      ]}
      verticalVideos={[
        v('1015054920', 'aa8a72196a'),
        v('1013400453', '89cb5fd807'),
        v('1050617850', '2e4031d8bd'),
      ]}
    >
      {/* TesuTemoの導入により変わるプロモーションの現場 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              TesuTemoの導入により変わるプロモーションの現場
            </h2>
            <p className="text-lg text-gray-600">導入することで、自治体の広報・移住促進はこう変わります</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: '動画素材がすぐ使える', desc: 'SNSや移住相談会・イベントで使用するために適した\n縦型・横型の動画素材が手に入る' },
              { title: '制作の手間が減る', desc: '制作の手間が大幅に減ることで\n担当者の負担が減る' },
              { title: '共感されるコンテンツ', desc: 'Z世代 / α世代にとって信頼性のあるリアルな声は共感を生む' },
              { title: '稟議が通しやすい', desc: '低予算で豊富なプランにより稟議を通しやすい' },
              { title: '現地に行かず実施できる', desc: '現地に撮影に行く必要がなく、\n距離に関係なく低コストで実施できる' },
              { title: '移住促進の導線を強化', desc: 'パンフレットや移住サイトに動画を組み込むことで、\n相談・来訪につながる導線をつくる' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0 mt-1" />
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 ml-7 whitespace-pre-line">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SubpageLayout>
  );
}
