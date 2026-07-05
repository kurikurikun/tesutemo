'use client';

import { useState, FormEvent } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import FadeIn from './FadeIn';

interface PlanConfig {
  sns: { ja: string; en: string; price: number; descJa: string; descEn: string };
  screening: { ja: string; en: string; price: number; descJa: string; descEn: string; descJa2?: string; descEn2?: string };
  perPerson: boolean;
  showIntervieweeCount: boolean;
  minInterviewees?: number;
  discountThreshold?: number;
  discountRate?: number;
  optionPrice: number;
  noteJa?: string[];
  noteEn?: string[];
}

const DEFAULT_PLAN_CONFIG: PlanConfig = {
  sns: { ja: 'Instagramプラン', en: 'Instagram Plan', price: 240000, descJa: '・3名インタビュー\n・1人あたり縦動画3本。各動画2分以内\n・合計縦動画9本', descEn: '· 3 interviewees\n· 3 vertical clips per person, under 2 min each\n· 9 vertical videos in total' },
  screening: { ja: 'YouTubeプラン', en: 'YouTube Plan', price: 400000, descJa: '・4名インタビュー\n・1人あたり横動画1本。各動画約10分\n・合計横動画4本', descEn: '· 4 interviewees\n· 1 long horizontal video per person, ~10 min each\n· 4 horizontal videos in total' },
  perPerson: false,
  showIntervieweeCount: false,
  optionPrice: 0,
  noteJa: ['気軽に更新できるオプションも用意しています。', '① 追加インタビュー', '② 継続コンテンツプラン（半年契約）'],
  noteEn: ['Easy options to keep your channel growing:', '① Additional interviewee', '② Ongoing Content Plan (6-month contract)'],
};

interface EnquiryFormProps {
  locale?: 'ja' | 'en';
  defaultUseCase?: string;
  planConfig?: PlanConfig;
}

const INTERVIEWEE_OPTIONS = [3, 4, 5, 6] as const;

function formatYen(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}

function calcTotal(plan: string | null, count: number, options: string[], config: PlanConfig): number | null {
  if (!plan) return null;
  if (config.showIntervieweeCount && count === 0) return null;
  const planPrice = plan === 'sns' ? config.sns.price : config.screening.price;
  if (config.perPerson) {
    const discount = config.discountThreshold && count >= config.discountThreshold ? (config.discountRate || 1) : 1;
    const planTotal = Math.round(planPrice * count * discount);
    const optionsTotal = options.length * config.optionPrice;
    return planTotal + optionsTotal;
  }
  // Flat package pricing
  return planPrice + options.length * config.optionPrice;
}

export default function EnquiryForm({ locale = 'ja', defaultUseCase = '', planConfig }: EnquiryFormProps) {
  const t = locale === 'en';
  const config = planConfig || DEFAULT_PLAN_CONFIG;

  const [plan, setPlan] = useState<string | null>(null);
  const [interviewees, setInterviewees] = useState(0);
  const [customCount, setCustomCount] = useState('');

  const toolLabel = defaultUseCase === 'university'
    ? { ja: '志願者獲得ツール', en: 'student attraction tool' }
    : defaultUseCase === 'municipality'
    ? { ja: '移住促進ツール', en: 'migration promotion tool' }
    : { ja: '採用拡大ツール', en: 'recruitment growth tool' };

  const [useCase, setUseCase] = useState(defaultUseCase);
  const [details, setDetails] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [touched, setTouched] = useState(false);

  const effectiveCount = config.showIntervieweeCount
    ? (interviewees === 6 ? (parseInt(customCount) || 0) : interviewees)
    : 2;
  const total = calcTotal(plan, effectiveCount, [], config);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!plan || (config.showIntervieweeCount && effectiveCount < (config.minInterviewees || 3)) || !name || !email || !company) return;

    setStatus('sending');
    try {
      const planLabel = plan === 'sns' ? (t ? config.sns.en : config.sns.ja) : (t ? config.screening.en : config.screening.ja);
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '56f12d3d-3999-4828-bf4d-8400c34959b6',
          subject: `TesuTemo Enquiry: ${planLabel}`,
          plan: planLabel,


          use_case: useCase || 'Not specified',
          estimated_total: total ? formatYen(total) : 'N/A',
          name, email, company,
          website: website || 'Not provided',
          details: details || 'None',
        }),
      });
      if (res.ok) setStatus('sent');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  const sectionLabel = "text-xs font-medium tracking-[0.12em] uppercase text-accent mb-5 pb-3 border-b border-accent/20";
  const cardBase = "border rounded-xl p-4 cursor-pointer transition-all select-none";
  const cardSelected = "border-[1.5px] border-accent bg-accent/5";
  const cardUnselected = "border-gray-200 hover:border-accent/40";
  const fieldLabel = "block text-[15px] font-medium text-gray-600 mb-2";
  const inputClass = "w-full text-[15px] text-gray-900 bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all";

  return (
    <>
    <style>{`
      @keyframes pulseOrange {
        0%, 100% { color: #e95228; }
        50% { color: #ffcab8; }
      }
      @keyframes pulseBorderA {
        0%, 100% { box-shadow: 0 0 0 3px rgba(233, 82, 40, 0.35); }
        50% { box-shadow: 0 0 0 3px rgba(233, 82, 40, 0.08); }
      }
      @keyframes pulseBorderB {
        0%, 100% { box-shadow: 0 0 0 3px rgba(233, 82, 40, 0.08); }
        50% { box-shadow: 0 0 0 3px rgba(233, 82, 40, 0.35); }
      }
    `}</style>
    <section id="contact" className="py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* Full-width header */}
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-primary mb-4">
              {t ? 'Get started' : 'お問い合わせ'}
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {t ? 'Build your package' : 'パッケージを選ぶ'}
            </h2>
            <p className="text-gray-500 text-lg max-w-lg mx-auto mb-4">
              {t
                ? <>Select your plan and options.<br />We&apos;ll confirm availability within 2 business days.</>
                : <>プランとオプションを選択してください。<br />2営業日以内にご連絡いたします。</>}
            </p>
            <p className="text-gray-700 text-base max-w-xl mx-auto">
              {t
                ? <>You&apos;re not just getting videos — you&apos;re getting a fully launch-ready <strong>Instagram or YouTube channel</strong>. A complete <strong>{toolLabel.en}</strong> you can keep building on with additional interviews or an ongoing content plan.</>
                : <>動画を納品して終わりではありません。すぐに運用できる<strong>InstagramまたはYouTubeチャンネル</strong>をまるごとお届けします。追加インタビューや継続プランで、あとからいくらでも拡張できる<strong>{toolLabel.ja}</strong>です。</>}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 items-start">

          {/* Left column — sticky info */}
          <div className="lg:sticky lg:top-[80px] bg-gray-50 rounded-2xl border border-gray-200 p-8 lg:p-8">
            <FadeIn direction="left">
              <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-gray-400 mb-4">
                {t ? 'Plans & pricing' : 'プラン・料金'}
              </p>
              <div className="mb-8 space-y-3">
                {/* Instagram Plan */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-primary/15 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{t ? config.sns.en : config.sns.ja}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{formatYen(config.sns.price)}</div>
                      <div className="text-xs text-gray-400">{t ? 'excl. tax' : '税別'}</div>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-5xl font-black text-primary leading-none">9</span>
                    <span className="text-sm text-gray-500 mb-1">{t ? 'videos' : '本の動画'}</span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {(t ? config.sns.descEn : config.sns.descJa).split('\n').map((line, i) => (
                      <p key={i} className="text-sm text-gray-600">{line}</p>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                    <p className="text-xs font-medium text-green-700">{t ? 'Account setup & posting included free' : 'アカウント開設・動画投稿まで無償対応'}</p>
                  </div>
                </div>

                {/* YouTube Plan */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/60 border border-primary/15 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{t ? config.screening.en : config.screening.ja}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{formatYen(config.screening.price)}</div>
                      <div className="text-xs text-gray-400">{t ? 'excl. tax' : '税別'}</div>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-5xl font-black text-primary leading-none">4</span>
                    <span className="text-sm text-gray-500 mb-1">{t ? 'videos' : '本の動画'}</span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {(t ? config.screening.descEn : config.screening.descJa).split('\n').map((line, i) => (
                      <p key={i} className="text-sm text-gray-600">{line}</p>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                    <p className="text-xs font-medium text-green-700">{t ? 'Channel setup & posting included free' : 'チャンネル開設・動画投稿まで無償対応'}</p>
                  </div>
                </div>

                {(t ? config.noteEn : config.noteJa)?.length ? (
                  <div className="mt-3 px-1 pt-3 border-t border-gray-200">
                    {(t ? config.noteEn : config.noteJa)!.map((note, i) => (
                      <p key={i} className="text-sm text-gray-500">{note}</p>
                    ))}
                  </div>
                ) : null}
              </div>

            </FadeIn>
          </div>

          {/* Right column — form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 lg:px-14 lg:py-10">
          <FadeIn direction="right">
            {status === 'sent' ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t ? 'Enquiry received' : 'お問い合わせを受付しました'}
                </h3>
                <p className="text-gray-500 text-lg max-w-sm mx-auto">
                  {t
                    ? 'Thank you. We\'ll review your requirements and get back to you within 2 business days.'
                    : 'ありがとうございます。内容を確認の上、2営業日以内にご連絡いたします。'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Section 1: Package */}
                <div className="mb-14">
                  <p className={sectionLabel}>01 — {t ? 'Select your package' : 'パッケージを選ぶ'}</p>

                  {/* Simplified plan selection — just name + price */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[15px] font-medium text-gray-600">
                        {t ? 'Plan' : 'プラン'}<span className="text-red-500 ml-0.5">*</span>
                      </label>
                      {!plan && (
                        <span
                          className="text-sm font-semibold flex items-center gap-1"
                          style={{ animation: 'pulseOrange 3s ease-in-out infinite' }}
                        >
                          {t ? 'Start here' : 'ここから選択'} ↓
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {(['sns', 'screening'] as const).map((key, i) => (
                        <div
                          key={key}
                          onClick={() => setPlan(key)}
                          className={`${cardBase} ${plan === key ? cardSelected : cardUnselected}`}
                          style={!plan ? { animation: `${i === 0 ? 'pulseBorderA' : 'pulseBorderB'} 3s ease-in-out infinite` } : undefined}
                        >
                          <div className="text-[15px] font-medium text-gray-900">{t ? config[key].en : config[key].ja}</div>
                          <div className="text-[15px] font-medium text-primary mt-1">
                            {formatYen(config[key].price)}
                          </div>
                          {!config.perPerson && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-[12px] text-gray-500 whitespace-pre-line">
                                {t ? config[key].descEn.split('\n')[0] : config[key].descJa.split('\n')[0]}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {touched && !plan && (
                      <p className="text-sm text-red-500 mt-1">{t ? 'Please select a plan' : 'プランを選択してください'}</p>
                    )}
                  </div>

                  {/* Interviewees */}
                  {config.showIntervieweeCount && (
                  <div className="mb-6">
                    <label className={fieldLabel}>
                      {t ? 'Number of interviewees' : 'インタビュー人数'}<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {INTERVIEWEE_OPTIONS.map(n => (
                        <div
                          key={n}
                          onClick={() => { setInterviewees(n); if (n !== 6) setCustomCount(''); }}
                          className={`${cardBase} text-center ${interviewees === n ? cardSelected : cardUnselected}`}
                        >
                          <div className="text-[15px] font-medium text-gray-900">
                            {n === 6 ? (t ? '6+' : '6人以上') : (t ? `${n}` : `${n}人`)}
                          </div>
                          {n >= 4 && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              -15%{n === 6 ? '+' : ''}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {interviewees === 6 && (
                      <input
                        type="number"
                        min="6"
                        value={customCount}
                        onChange={e => setCustomCount(e.target.value)}
                        placeholder={t ? 'Enter number (6+)' : '人数を入力（6人以上）'}
                        className={`${inputClass} mt-3`}
                      />
                    )}
                    {touched && effectiveCount < (config.minInterviewees || 3) && (
                      <p className="text-sm text-red-500 mt-1">
                        {t ? `Minimum ${config.minInterviewees || 3} interviewees` : `${config.minInterviewees || 3}名以上を選択してください`}
                      </p>
                    )}
                  </div>
                  )}

                </div>

                {/* Price Estimate — sticky running total */}
                {total !== null && (
                  <div className="mb-14 bg-accent/5 border border-accent/20 rounded-xl p-5 sticky top-[72px] z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium tracking-wider uppercase text-accent mb-1">
                          {t ? 'Estimated total' : 'お見積もり'}
                        </p>
                        <div className="text-sm text-gray-500 space-y-0.5">
                          <p>
                            {plan === 'sns' ? (t ? config.sns.en : config.sns.ja) : (t ? config.screening.en : config.screening.ja)}
                            {config.perPerson && <> × {effectiveCount}{t ? ' people' : '人'}</>}
                            {config.perPerson && config.discountThreshold && effectiveCount >= config.discountThreshold && (
                              <span className="text-green-600 ml-1">(-{Math.round((1 - (config.discountRate || 1)) * 100)}%)</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatYen(total)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 2: Your needs */}
                <div className="mb-14">
                  <p className={sectionLabel}>02 — {t ? 'Tell us your needs' : 'ご要望を教えてください'}</p>

                  <div className="mb-5">
                    <label className={fieldLabel}>{t ? 'Use case' : '用途'}</label>
                    <select value={useCase} onChange={e => setUseCase(e.target.value)} className={inputClass}>
                      <option value="">{t ? 'Select...' : '選択してください...'}</option>
                      <option value="recruitment">{t ? 'Recruitment' : '採用'}</option>
                      <option value="university">{t ? 'University / Education' : '大学・教育機関'}</option>
                      <option value="municipality">{t ? 'Municipality / Government' : '自治体'}</option>
                      <option value="corporate">{t ? 'Corporate PR' : '企業PR'}</option>
                      <option value="other">{t ? 'Other' : 'その他'}</option>
                    </select>
                  </div>

                  <div>
                    <label className={fieldLabel}>
                      {t ? 'Additional details' : '補足事項'}
                      <span className="text-gray-400 font-normal ml-1">{t ? '(optional)' : '（任意）'}</span>
                    </label>
                    <textarea
                      value={details}
                      onChange={e => setDetails(e.target.value)}
                      rows={3}
                      placeholder={t ? 'Timeline, specific requirements, questions...' : 'スケジュール、特別なご要望、ご質問など...'}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                {/* Section 3: About you */}
                <div className="mb-14">
                  <p className={sectionLabel}>03 — {t ? 'Tell us about you' : 'お客様情報を入力'}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div>
                      <label className={fieldLabel}>
                        {t ? 'Name' : 'お名前'}<span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder={t ? 'Full name' : '山田 太郎'} className={inputClass} />
                    </div>
                    <div>
                      <label className={fieldLabel}>
                        {t ? 'Company' : '会社名'}<span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input type="text" required value={company} onChange={e => setCompany(e.target.value)} placeholder={t ? 'Company name' : '株式会社テステモ'} className={inputClass} />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className={fieldLabel}>
                      {t ? 'Email' : 'メールアドレス'}<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={t ? 'you@company.com' : 'example@company.com'} className={inputClass} />
                  </div>

                  <div>
                    <label className={fieldLabel}>
                      {t ? 'Company website' : '会社ウェブサイト'}
                      <span className="text-gray-400 font-normal ml-1">{t ? '(optional)' : '（任意）'}</span>
                    </label>
                    <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://" className={inputClass} />
                  </div>
                </div>

                {/* Submit */}
                <div>
                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                      <p className="text-[15px] text-red-600">
                        {t ? 'Submission failed. Please try again.' : '送信に失敗しました。もう一度お試しください。'}
                      </p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-gradient-to-r from-primary to-primary-light text-white rounded-full text-base font-semibold py-4 px-6 shadow-lg hover:shadow-xl transition-all hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t ? 'Sending...' : '送信中...'}
                      </>
                    ) : (
                      <>
                        {t ? 'Submit enquiry' : 'お問い合わせを送信'}
                        <Send size={18} />
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-400 text-center mt-3 leading-relaxed">
                    {t
                      ? 'No commitment — just an enquiry. We\'ll get back to you within 2 business days.'
                      : 'お問い合わせのみ、契約の義務はありません。2営業日以内にご連絡いたします。'}
                  </p>
                </div>
              </form>
            )}
          </FadeIn>
          </div>
        </div>

        {/* Bottom section — process + contact */}
        <FadeIn>
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Team contact */}
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-gray-400 mb-5">
                {t ? 'Or contact us directly' : '直接のお問い合わせ'}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/chris-moore.png" alt="Chris Moore" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                  <div>
                    <div className="group relative h-5">
                      <p className="text-sm font-medium text-gray-900 transition-opacity duration-300 group-hover:opacity-0">Chris Moore</p>
                      <p className="text-sm font-medium text-gray-900 absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">{t ? 'Chris Moore' : 'クリス・モア'}</p>
                    </div>
                    <a href="mailto:chris@move-ment.co" className="text-xs text-primary hover:underline">chris@move-ment.co</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/kinoshita.png" alt="Yosuke Kinoshita" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                  <div>
                    <div className="group relative h-5">
                      <p className="text-sm font-medium text-gray-900 transition-opacity duration-300 group-hover:opacity-0">Yosuke Kinoshita</p>
                      <p className="text-sm font-medium text-gray-900 absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap">{t ? 'Yosuke Kinoshita' : '木下陽介'}</p>
                    </div>
                    <a href="mailto:kinoshita@move-ment.co" className="text-xs text-primary hover:underline">kinoshita@move-ment.co</a>
                  </div>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-gray-400 mb-5">
                {t ? 'What happens next' : '導入までの流れ'}
              </p>
              <div className="space-y-4">
                {(t ? [
                  ['Submit this form.', 'Takes about two minutes.'],
                  ['We confirm availability', 'within 2 business days.'],
                  ['You decide.', 'No obligation until you give the go-ahead.'],
                  ['Online briefing', 'to align on goals and logistics.'],
                  ['Interviews & delivery.', 'Real voices, ready to share — within 2 weeks.'],
                ] : [
                  ['フォームを送信', '約2分で完了します。'],
                  ['2営業日以内にご連絡', '内容を確認し、ご案内いたします。'],
                  ['ご検討・ご決定', 'ご納得いただいてからのスタートです。'],
                  ['オンライン打ち合わせ', '目的や進め方を確認します。'],
                  ['撮影＆納品', 'リアルな声を、約2週間以内にお届けします。'],
                ]).map(([title, desc], i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[11px] font-semibold text-primary">{i + 1}</span>
                    </div>
                    <div className="text-sm text-gray-600 leading-snug">
                      <strong className="text-gray-900">{title}</strong> {desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
    </>
  );
}
