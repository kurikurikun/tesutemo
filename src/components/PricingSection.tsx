'use client';

import FadeIn from './FadeIn';

export default function PricingSection() {
  const plans = [
    {
      name: 'SNS',
      price: '¥120,000',
      description: 'SNS向け縦型動画パッケージ',
      features: ['インタビュー動画 1本', 'SNS最適化編集', '縦型フォーマット', '納品まで2週間'],
      highlighted: false,
    },
    {
      name: 'SNS+上映',
      price: '¥180,000',
      description: 'SNS + イベント上映用動画',
      features: ['インタビュー動画 1本', 'SNS最適化編集', '横型フォーマット追加', 'イベント上映対応', '納品まで3週間'],
      highlighted: true,
      badge: 'Best Value',
    },
    {
      name: 'オプション',
      price: '¥30,000',
      description: '追加インタビュー・編集',
      features: ['追加インタビュー 1名分', '既存動画への追加編集', 'テロップ追加', '個別対応'],
      highlighted: false,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center mb-2">料金プラン</h2>
          <p className="text-center text-gray-500 mb-12">Pricing</p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <div
                className={`rounded-2xl p-8 h-full flex flex-col ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-primary to-primary-light text-white ring-2 ring-primary shadow-xl scale-105'
                    : 'bg-gray-50 text-gray-900 border border-gray-200'
                }`}
              >
                {plan.badge && (
                  <span className="inline-block self-start bg-white text-primary text-xs font-bold px-3 py-1 rounded-full mb-4">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-white/80' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                <p className="text-3xl font-bold mb-6">
                  {plan.price}
                  <span className={`text-sm font-normal ${plan.highlighted ? 'text-white/70' : 'text-gray-400'}`}>
                    {' '}/ 本
                  </span>
                </p>
                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className={`mt-0.5 ${plan.highlighted ? 'text-white' : 'text-primary'}`}>&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-8 block text-center py-2.5 rounded-full font-medium text-sm transition-colors ${
                    plan.highlighted
                      ? 'bg-white text-primary hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  お問い合わせ
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
