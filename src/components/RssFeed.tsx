'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import FadeIn from './FadeIn';

interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content?: string;
}

export default function RssFeed() {
  const [articles, setArticles] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://note.com/chris_moore/rss')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setArticles(data.items.slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return html;
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-[#7e91cf] to-[#9ea9d5] rounded-full">
              <span className="text-sm uppercase tracking-wider text-white font-semibold">Blog</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              最新記事
              <br />
              <span className="text-3xl lg:text-4xl">Latest Articles</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              テステモに関する最新の情報やインサイトをお届けします
            </p>
          </div>
        </FadeIn>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {articles.map((article, i) => (
              <FadeIn key={article.link} delay={i * 0.1}>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-2xl border border-gray-100 hover:border-primary transition-all duration-300 hover:shadow-xl overflow-hidden h-full"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Calendar size={16} />
                      <time>{formatDate(article.pubDate)}</time>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {stripHtml(article.content || article.description)}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                      <span>Read more</span>
                      <ExternalLink size={16} />
                    </div>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        )}

        <FadeIn>
          <div className="text-center">
            <a
              href="https://note.com/chris_moore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-full transition-all border-2 border-accent text-accent bg-white hover:bg-gray-50"
            >
              View all articles
              <ExternalLink size={20} />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
