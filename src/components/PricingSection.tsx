'use client';

import { CheckCircle2 } from 'lucide-react';
import FadeIn from './FadeIn';

export default function PricingSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-16">
            TesuTemoの料金プラン
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* SNS Plan */}
          <FadeIn>
            <div className="bg-gray-50 rounded-3xl p-8 lg:p-10 h-full flex flex-col">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-6">SNSプラン</h3>
                <div className="text-5xl font-bold text-gray-900 mb-8">
                  120,000<span className="text-3xl">円</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-1" />
                  <p className="text-gray-700">インタビュー 1人</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    縦型動画 4本
                    <br />
                    <span className="text-sm text-gray-500">30秒前後、SNS投稿用</span>
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-300">
                  <p className="text-sm font-medium mb-1 text-accent">※ 最低催行人数3人</p>
                  <p className="text-sm font-medium text-accent">※ 4人以上は一人当たり15%割引となります</p>
                </div>
              </div>

              <a
                href="#contact"
                className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-[#c74320] transition-all duration-300 text-center block"
              >
                コンタクト
              </a>
            </div>
          </FadeIn>

          {/* SNS + Screening Plan (Featured) */}
          <FadeIn delay={0.1}>
            <div className="bg-gradient-to-br from-[#fff5f0] to-[#ffe8dd] rounded-3xl p-8 lg:p-10 border-2 border-primary relative h-full flex flex-col shadow-xl lg:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="px-6 py-2 rounded-full text-sm font-semibold text-white bg-accent">
                  Best Value
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">SNS+上映プラン</h3>
                <div className="text-5xl font-bold text-gray-900 mb-8">
                  180,000<span className="text-3xl">円</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    縦型動画 4本
                    <br />
                    <span className="text-sm text-gray-500">30秒前後、SNS投稿用</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    横型動画 2本
                    <br />
                    <span className="text-sm text-gray-500">90秒前後、YOUTUBE、イベント上映など</span>
                  </p>
                </div>
                <div className="pt-4 border-t border-primary/30">
                  <p className="text-sm font-medium mb-1 text-accent">※ 最低催行人数3人</p>
                  <p className="text-sm font-medium text-accent">※ 4人以上は一人当たり15%割引となります</p>
                </div>
              </div>

              <a
                href="#contact"
                className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-[#c74320] transition-all duration-300 shadow-lg text-center block"
              >
                コンタクト
              </a>
            </div>
          </FadeIn>

          {/* Option Plan */}
          <FadeIn delay={0.2}>
            <div className="bg-gray-50 rounded-3xl p-8 lg:p-10 h-full flex flex-col">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-6">オプション</h3>
                <div className="text-5xl font-bold text-gray-900 mb-8">
                  30,000<span className="text-3xl">円</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-white">1</span>
                  </div>
                  <p className="text-gray-700">
                    インタビュー記事
                    <br />
                    <span className="text-sm text-gray-500">配布や友方のサイトに記載用</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                  <p className="text-gray-700">
                    フルインタビュー動画
                    <br />
                    <span className="text-sm text-gray-500">質問をタイトルとして構入たが動画未編集</span>
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-300">
                  <p className="text-sm font-medium text-accent">※各オプション1、2の価格となります</p>
                </div>
              </div>

              <a
                href="#contact"
                className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-[#c74320] transition-all duration-300 text-center block"
              >
                コンタクト
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
