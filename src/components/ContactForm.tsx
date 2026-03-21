'use client';

import { useState, FormEvent } from 'react';
import { Mail, User, Building, Send, CheckCircle } from 'lucide-react';
import FadeIn from './FadeIn';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '56f12d3d-3999-4828-bf4d-8400c34959b6',
          ...formData,
        }),
      });
      if (res.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Info */}
          <FadeIn direction="left">
            <div>
              <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-primary to-primary-light rounded-full">
                <span className="text-sm uppercase tracking-wider text-white font-semibold">Contact</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                お問い合わせ
                <br />
                <span className="text-3xl lg:text-4xl">Get in Touch</span>
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                テステモについてのご質問や、導入に関するご相談など、
                お気軽にお問い合わせください。
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/chris-moore.png" alt="Chris Moore" className="w-16 h-16 rounded-full object-cover shadow-md flex-shrink-0" />
                  <div>
                    <div className="group relative h-6 mb-1">
                      <p className="font-semibold text-gray-900 transition-opacity duration-300 group-hover:opacity-0">Chris Moore</p>
                      <p className="font-semibold text-gray-900 absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">クリス・モア</p>
                    </div>
                    <a href="mailto:chris@move-ment.co" className="text-sm text-primary hover:underline block">
                      chris@move-ment.co
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/kinoshita.png" alt="Yosuke Kinoshita" className="w-16 h-16 rounded-full object-cover shadow-md flex-shrink-0" />
                  <div>
                    <div className="group relative h-6 mb-1">
                      <p className="font-semibold text-gray-900 transition-opacity duration-300 group-hover:opacity-0">Yosuke Kinoshita</p>
                      <p className="font-semibold text-gray-900 absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap">木下陽介</p>
                    </div>
                    <a href="mailto:kinoshita@move-ment.co" className="text-sm text-primary hover:underline block">
                      kinoshita@move-ment.co
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right Column - Form */}
          <FadeIn direction="right">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 lg:p-10">
              {status === 'sent' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">送信完了</h3>
                  <p className="text-gray-600">
                    お問い合わせありがとうございます。
                    <br />
                    担当者より2営業日以内にご連絡いたします。
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      お名前 <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="山田 太郎"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      メールアドレス <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@company.com"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      会社名・組織名 <span className="text-gray-400 font-normal">（任意）</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Building size={20} />
                      </div>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="株式会社テステモ"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      お問い合わせ内容 <span className="text-primary">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="お問い合わせ内容をご記入ください"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">
                      <span className="text-primary">プライバシーポリシー</span>に同意の上、送信してください。お預かりした個人情報は、お問い合わせへの対応のみに使用いたします。
                    </p>
                  </div>
                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-600">送信に失敗しました。もう一度お試しください。</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full px-8 py-4 text-lg font-semibold rounded-full transition-all shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-primary-light text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        送信中...
                      </>
                    ) : (
                      <>
                        送信する
                        <Send size={20} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
