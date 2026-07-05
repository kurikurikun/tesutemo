'use client';

import { CheckCircle2, Plus } from 'lucide-react';
import FadeIn from './FadeIn';

export default function PricingSection({ locale = 'ja' }: { locale?: 'ja' | 'en' } = {}) {
  const isEn = locale === 'en';

  const plans = isEn
    ? [
        {
          name: 'Instagram Plan',
          desc: 'Share the appeal of working at your company on social media.',
          details: '3 interviewees / 3 short vertical videos per person (under 2 min) — 9 videos total.\nAccount setup and posting available on request.',
          price: '240,000',
          addons: [
            { label: 'Additional interviewee', price: '¥80,000 / person' },
            {
              label: 'Ongoing Content Plan (6-month contract)',
              price: '¥65,000 / month',
              note: 'Add 1 new interview every month and keep your account active.',
            },
          ],
        },
        {
          name: 'YouTube Plan',
          desc: "Let your employees tell the world — in their own words — why your company is worth joining.",
          details: '4 interviewees / 1 long horizontal video per person (approx. 10 min) — 4 videos total.\nChannel setup and posting available on request.',
          price: '400,000',
          featured: true,
          addons: [
            { label: 'Additional interviewee', price: '¥100,000 / person' },
            {
              label: 'Ongoing Content Plan (6-month contract)',
              price: '¥80,000 / month',
              note: 'Add 1 new interview every month and keep your channel growing.',
            },
          ],
        },
      ]
    : [
        {
          name: 'Instagramプラン',
          desc: 'SNSで、御社で働く魅力を発信するためのプラン。',
          details: '3名インタビュー／お一人あたり2分以内のショート縦動画を3本。合計9本。\nご希望に応じて、アカウント開設・動画投稿まで対応します。',
          price: '240,000',
          addons: [
            { label: '追加インタビュー', price: 'お一人あたり ¥80,000（税別）' },
            {
              label: '継続コンテンツプラン（半年契約）',
              price: '月額 ¥65,000（税別）',
              note: '毎月1名のインタビューを追加し、アカウントを更新し続けます。',
            },
          ],
        },
        {
          name: 'YouTubeプラン',
          desc: '御社の働きがいを、社員自身の言葉でじっくり伝えるためのプラン。',
          details: '4名インタビュー／お一人あたり10分のロング横動画を1本。合計4本。\nご希望に応じて、チャンネル開設・動画投稿まで対応します。',
          price: '400,000',
          featured: true,
          addons: [
            { label: '追加インタビュー', price: 'お一人あたり ¥100,000（税別）' },
            {
              label: '継続コンテンツプラン（半年契約）',
              price: '月額 ¥80,000（税別）',
              note: '毎月1名のインタビューを追加し、チャンネルを更新し続けます。',
            },
          ],
        },
      ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <FadeIn>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-16">
            {isEn ? 'TesuTemo Pricing Plans' : 'TesuTemoの料金プラン'}
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <div
                className={`rounded-3xl p-8 lg:p-10 h-full flex flex-col ${
                  plan.featured
                    ? 'bg-gradient-to-br from-[#fff5f0] to-[#ffe8dd] border-2 border-primary shadow-xl lg:scale-[1.02]'
                    : 'bg-gray-50'
                }`}
              >
                {plan.featured && (
                  <div className="flex justify-center mb-4">
                    <span className="px-6 py-2 rounded-full text-sm font-semibold text-white bg-accent">
                      {isEn ? 'Recommended' : 'おすすめ'}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${plan.featured ? 'text-gray-900' : 'text-gray-700'}`}>
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{plan.desc}</p>
                </div>

                <div className="mb-6">
                  <div className="text-5xl font-bold text-gray-900 mb-1">
                    {plan.price}
                    <span className="text-3xl">{isEn ? '' : '円'}</span>
                  </div>
                  <p className="text-sm text-gray-500">{isEn ? '(excl. tax)' : '（税別）'}</p>
                </div>

                <div className={`rounded-xl p-4 mb-6 text-sm text-gray-700 whitespace-pre-line ${plan.featured ? 'bg-white/60' : 'bg-white'}`}>
                  <CheckCircle2 size={16} className="text-primary inline mr-1 mb-0.5" />
                  {plan.details}
                </div>

                <div className={`border-t pt-5 mb-8 flex-grow space-y-4 ${plan.featured ? 'border-primary/30' : 'border-gray-200'}`}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {isEn ? 'Add-ons' : 'オプション追加'}
                  </p>
                  {plan.addons.map((addon) => (
                    <div key={addon.label} className="flex items-start gap-2">
                      <Plus size={15} className="text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{addon.label}</p>
                        <p className="text-sm text-primary font-semibold">{addon.price}</p>
                        {addon.note && <p className="text-xs text-gray-500 mt-0.5">{addon.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="#contact"
                  className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-[#c74320] transition-all duration-300 text-center block"
                >
                  {isEn ? 'Contact' : 'お問い合わせ'}
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
