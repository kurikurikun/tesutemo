'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

/**
 * トップページの「文字や写真では伝わらない」用、縦型の見せ方2案。
 *
 * どちらを採るか決めるための **比較用**。決まったら負けた方と /lab/verticals を消す。
 *
 * - VerticalStrip   … 横スクロールの帯。右端が少し見切れて「まだある」と分かる。
 * - VerticalMarquee … 同じ帯がゆっくり自動で流れ続ける。ホバーで停止。
 *
 * /recruitment の縦スクロールフィード（VerticalReel）はここでは使わない。あちらは
 * ページの目的が「作品を見せること」なので4000px超の高さが許されるが、トップページの
 * このセクションは長い話の一節なので、高さが固定される見せ方でないと成立しない。
 *
 * 音は showcase 単位で1つの状態。自動再生はミュートでしか始められないため、まず
 * ミュートで流し、押されたときだけ音を出す。
 */

export type ShowcaseVideo = { name: string; vimeo: string };

type Props = {
  videos: ShowcaseVideo[];
  isEn?: boolean;
};

const PRELOAD_MARGIN = '150% 0px';

const cardUrl = (url: string) =>
  `${url}${url.includes('?') ? '&' : '?'}muted=1&loop=1&title=0&byline=0&portrait=0&dnt=1`;

type VimeoPlayer = {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  setMuted: (muted: boolean) => Promise<boolean>;
};

function ShowcaseCard({
  video,
  soundOn,
  onSoundToggle,
  isEn,
  className = '',
}: {
  video: ShowcaseVideo;
  soundOn: boolean;
  onSoundToggle: () => void;
  isEn: boolean;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<VimeoPlayer | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: PRELOAD_MARGIN }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    const el = wrapRef.current;
    let observer: IntersectionObserver | undefined;

    import('@vimeo/player').then(({ default: Player }) => {
      if (cancelled || !iframeRef.current || !el) return;
      const player = new Player(iframeRef.current) as unknown as VimeoPlayer;
      playerRef.current = player;
      player.setMuted(true).catch(() => {});

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) player.play().catch(() => {});
          else player.pause().catch(() => {});
        },
        { threshold: 0.5 }
      );
      observer.observe(el);
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      playerRef.current?.pause().catch(() => {});
    };
  }, [mounted]);

  useEffect(() => {
    playerRef.current?.setMuted(!soundOn).catch(() => {});
  }, [soundOn]);

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-[9/16] shrink-0 overflow-hidden rounded-2xl bg-black shadow-lg shadow-[#7e91cf]/25 ring-1 ring-black/5 ${className}`}
    >
      {mounted && (
        <iframe
          ref={iframeRef}
          src={cardUrl(video.vimeo)}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={`TesuTemo - ${video.name}`}
        />
      )}
      <button
        type="button"
        onClick={onSoundToggle}
        aria-label={soundOn ? (isEn ? 'Mute' : 'ミュートする') : isEn ? 'Turn sound on' : '音を出す'}
        aria-pressed={soundOn}
        className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1.5 text-[11px] font-medium text-white backdrop-blur transition hover:bg-black/75"
      >
        {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
        <span>{soundOn ? (isEn ? 'Muted' : 'ミュート') : isEn ? 'Sound' : '音を出す'}</span>
      </button>
    </div>
  );
}

/** 案A: 横スクロールの帯。矢印で1枚ずつ送る。高さは固定。 */
export function VerticalStrip({ videos, isEn = false }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const toggle = useCallback(() => setSoundOn((on) => !on), []);

  const nudge = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('div');
    const step = card ? card.getBoundingClientRect().width + 20 : 320;
    track.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((v) => (
          <ShowcaseCard
            key={v.name}
            video={v}
            soundOn={soundOn}
            onSoundToggle={toggle}
            isEn={isEn}
            className="w-[68vw] snap-start sm:w-[300px] lg:w-[340px]"
          />
        ))}
      </div>

      {[-1, 1].map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => nudge(d as 1 | -1)}
          aria-label={d === -1 ? (isEn ? 'Previous' : '前へ') : isEn ? 'Next' : '次へ'}
          className={`absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg ring-1 ring-black/5 transition hover:bg-gray-50 sm:flex ${
            d === -1 ? '-left-5' : '-right-5'
          }`}
        >
          {d === -1 ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
      ))}
    </div>
  );
}

/** 案B: 同じ帯が自動で流れ続ける。ホバー／フォーカスで停止。 */
export function VerticalMarquee({ videos, isEn = false }: Props) {
  const [soundOn, setSoundOn] = useState(false);
  const toggle = useCallback(() => setSoundOn((on) => !on), []);
  // 切れ目なくループさせるため同じ並びを2周ぶん並べ、-50% まで動かす。
  const loop = [...videos, ...videos];

  return (
    <div className="group relative overflow-hidden">
      <style>{`
        @keyframes tt-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .tt-marquee-track { animation: none !important; } }
      `}</style>
      <div
        className="tt-marquee-track flex w-max gap-5 group-hover:[animation-play-state:paused]"
        style={{ animation: 'tt-marquee 45s linear infinite' }}
      >
        {loop.map((v, i) => (
          <ShowcaseCard
            key={`${v.name}-${i}`}
            video={v}
            soundOn={soundOn}
            onSoundToggle={toggle}
            isEn={isEn}
            className="w-[68vw] sm:w-[300px] lg:w-[340px]"
          />
        ))}
      </div>
      {/* 両端をぼかして、帯が続いているように見せる */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-gray-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-50 to-transparent" />
    </div>
  );
}
