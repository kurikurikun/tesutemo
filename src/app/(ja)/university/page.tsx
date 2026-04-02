import type { Metadata } from 'next';
import SubpageLayout from '@/components/SubpageLayout';
import VideoCarousel from '@/components/VideoCarousel';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '大学広報動画・学生インタビュー動画の制作｜TesuTemo',
  description:
    '在学生インタビュー動画で志願者の共感を生み、大学の魅力をリアルに届ける広報動画サービス。キャンパスライフや学びの魅力を等身大の声で伝えます。',
  alternates: {
    canonical: 'https://www.tesutemo.co/university',
    languages: { en: 'https://www.tesutemo.co/en/university' },
  },
};

const v = (id: string, h?: string) =>
  `https://player.vimeo.com/video/${id}?${h ? `h=${h}&` : ''}badge=0&autopause=0&player_id=0&app_id=58479`;

export default function UniversityPage() {
  return (
    <SubpageLayout
      currentPath="/university"
      heroTitle={
        <>
          学生のリアルな声で志願者を増やす。
          <br /><span className="text-primary">大学広報インタビュー動画</span>サービス
        </>
      }
      heroSubtitle={
        <>
          <span className="text-primary font-semibold">リアルな声</span>でターゲットとなる学生の共感を生み
          <br />
          <span className="text-primary font-semibold">安価</span>で手に入る大学の動画プロモーション
        </>
      }
      heroVideoUrl={v('1017754838', '2df374323e')}
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
      onlineFeatures={[
        { title: '日常環境だから', desc: '自身のスマホに向けて話すことで、リラックスした状態でリアルな話を聞くことができる' },
        { title: '専用ソフトで高品質に収録', desc: 'ログイン・サインアップ不要の専用ソフトで収録することで、音声・映像の品質を保ちながら、気軽にインタビューを受けられる' },
        { title: '学生の情報収集チャネルに最適化', desc: 'ターゲットとなる学生が日常的に使うSNSに適したコンテンツとして活用できる' },
      ]}
      horizontalVideos={[
        v('1019675789', '8ca81d7847'),
        v('1082523091'),
        v('1049154514'),
        v('1019649377'),
      ]}
      verticalVideos={[
        v('1020046986', '83e6b0fedd'),
        v('1049144140'),
        v('1169470823', 'af1c20547e'),
      ]}
      companyLabel="大学名"
      companyPlaceholder="大学"
    >
      {/* TesuTemoの導入により変わるプロモーションの現場 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              TesuTemoの導入により変わるプロモーションの現場
            </h2>
            <p className="text-lg text-gray-600">導入することで、大学の広報・募集活動はこう変わります</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: '動画素材がすぐ使える', desc: 'SNSや説明会に使用するために適した\n縦型、横型の動画素材が手に入る' },
              { title: '制作の手間が減る', desc: '制作の手間が大幅に減ることで\n担当者の負担が減る' },
              { title: '共感されるコンテンツ', desc: 'Z世代 / α世代にとって信頼性のあるリアルな声は共感を生む' },
              { title: '稟議が通しやすい', desc: '低予算で豊富なプランにより稟議を通しやすい' },
              { title: '説明会の効率化', desc: '学校での説明会に複数の在学生を呼ばなくても\nテステモの動画で伝える' },
              { title: 'オンライン導線の強化', desc: 'パンフレットに在学生の声でみれるQRコードを貼る' },
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

      {/* 実際のTesuTemo活用事例と、利用者さまの声 */}
      <section className="py-20 bg-gradient-to-b from-[#d4d9f0] to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              実際のTesuTemo活用事例と、
            </h2>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
              利用者さまの声
            </h2>
          </div>

          {/* 活用事例動画 - green gradient carousel */}
          <div className="mb-16">
            <VideoCarousel
              videos={[
                v('1077851874', '4cc1f2e2a6'),
                v('1077854511', '4e8398acf7'),
                v('1077853072', '82e17e407b'),
              ]}
              gradient="from-[#a8d5ba] via-[#b8dfc8] to-[#98c5aa]"
            />
          </div>

          {/* Testimonial */}
          <div className="max-w-4xl mx-auto">
            {/* University Logo and Title */}
            <div className="flex items-center justify-center gap-6 mb-12">
              <Image src="/logo-kansai.png" alt="関西大学" width={80} height={80} className="h-20 w-auto" />
              <div className="text-left border-l-2 border-gray-300 pl-6">
                <p className="text-lg text-gray-600 mb-1">学部・大学院事務グループ</p>
                <p className="text-2xl font-semibold text-gray-900">大淵さん</p>
              </div>
            </div>

            {/* Testimonial Quotes */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 border-l-4 border-primary shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  年間何度も実施している併設校や受験生向けの学部説明会の際に、毎回学生に10分ほどのプレゼンのために来てもらうのは大変なので、このTesuTemo動画を活用させてもらっています。前後に先生のプレゼンもあるので、ゼミの説明や学部留学プログラムの概要はそちらで紹介し、途中で学生の声を挟んで<span className="text-primary font-semibold">説明会にメリハリ</span>をつけています。
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border-l-4 border-primary shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  また、春に向けて制作している学部パンフレットの中で、ゼミ活動の紹介のページや学部留学プログラムのページに<span className="text-primary font-semibold">QRコードを掲載</span>して、TesuTemo動画を学部のHPにアップロードさせていただき、そのページにとぶように準備をしています。
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border-l-4 border-primary shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  既存のHPや学部パンフレットや学部説明会などのスライドにTesuTemo動画を受けとることで、わざわざ学生の手配をしていた<span className="text-primary font-semibold">手間やコストも減らせる</span>ことができるので、私たちはとても重宝しています。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SubpageLayout>
  );
}
