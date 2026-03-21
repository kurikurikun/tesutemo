'use client';

import SubpageLayout from '@/components/SubpageLayout';
import FadeIn from '@/components/FadeIn';

const vimeoBase = 'https://player.vimeo.com/video/';
const params = '?title=0&byline=0&portrait=0';

export default function MunicipalityPage() {
  return (
    <SubpageLayout
      heroTitle="地域の「ファン」である先輩移住者の声で、次の移住者を迎える"
      heroSubtitle="リアルな移住者インタビューで、地域の魅力を等身大で伝える"
      heroVideoUrl={`${vimeoBase}1010426949?h=34d0ad59fb${params}`}
      problemIntro="自治体の移住促進における課題"
      problems={[
        'パンフレットやウェブサイトだけでは地域の本当の魅力が伝わらない',
        '移住検討者が実際の生活イメージを持てない',
        '他の自治体との差別化が難しい',
        '移住後のミスマッチで定着率が低い',
        '広報予算が限られており効果的な発信ができない',
      ]}
      solutionTitle="先輩移住者のリアルな声が、次の移住者を動かす"
      solutionDesc="実際に移住した方々のインタビュー動画を通じて、パンフレットでは伝わらない生活の実感や地域の温かさをリアルに届けます。等身大の声だからこそ共感が生まれ、移住への一歩を後押しします。"
      horizontalVideos={[
        `${vimeoBase}1010823028${params}`,
        `${vimeoBase}1050610140${params}`,
      ]}
      verticalVideos={[
        `${vimeoBase}1015054920${params}`,
        `${vimeoBase}1013400453${params}`,
        `${vimeoBase}1050617850${params}`,
      ]}
    >
      {/* Value / Benefits section specific to municipality */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">自治体にとっての価値</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '定着率アップ', desc: 'リアルな情報で移住前後のギャップを減らし、定着率を向上' },
              { title: '差別化', desc: '住民のリアルな声は他の自治体にはない唯一無二のコンテンツ' },
              { title: 'コスト削減', desc: 'オンライン完結で撮影費・移動費を大幅に削減' },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="bg-gray-50 rounded-2xl p-8 text-center h-full">
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </SubpageLayout>
  );
}
