'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * 縦型ショートを、SNSのように上から下へスクロールして見せるフィード。
 *
 * 3列グリッドをやめた理由: 9:16 を3つ横に並べると1本あたりが細くなり、
 * 縦型が本来持っている「画面いっぱいで人の顔を見る」感じが消える。1本ずつ
 * 縦に積んで、画面に入った動画だけをミュート再生する。音はカード右上のボタン。
 *
 * 自動再生はブラウザの仕様上ミュートでしか始められないので、まず muted で
 * 再生し、ユーザーが押したときだけ音を出す。OSで「視差効果を減らす」を有効に
 * している人には自動再生をせず、Vimeo標準のコントロールから手で再生してもらう。
 */

type Props = {
  videos: string[];
  isEn?: boolean;
};

/** フィード用のパラメータを足す。ループ・ミュート、Vimeoのタイトル類は非表示。 */
const reelUrl = (url: string) =>
  `${url}${url.includes('?') ? '&' : '?'}muted=1&loop=1&title=0&byline=0&portrait=0&dnt=1`;

function ReelItem({ url, index, isEn }: { url: string; index: number; isEn: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // @vimeo/player の Player インスタンス。型は動的 import なので unknown 扱い。
  const playerRef = useRef<{
    play: () => Promise<void>;
    pause: () => Promise<void>;
    setMuted: (m: boolean) => Promise<boolean>;
  } | null>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let observer: IntersectionObserver | undefined;

    import('@vimeo/player').then(({ default: Player }) => {
      if (cancelled || !iframeRef.current || !wrapRef.current) return;

      const player = new Player(iframeRef.current);
      playerRef.current = player;
      player.setMuted(true).catch(() => {});

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // 画面の6割以上入ったら再生、外れたら停止。同時に鳴らないようにするため。
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) player.play().catch(() => {});
          else player.pause().catch(() => {});
        },
        { threshold: 0.6 }
      );
      observer.observe(wrapRef.current);
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      playerRef.current?.pause().catch(() => {});
    };
  }, []);

  const toggleSound = () => {
    const player = playerRef.current;
    if (!player) return;
    const next = !muted;
    player.setMuted(next).catch(() => {});
    if (!next) player.play().catch(() => {});
    setMuted(next);
  };

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-[9/16] w-full max-w-[min(43.875vh,405px)] overflow-hidden rounded-3xl bg-black shadow-2xl shadow-black/40 ring-1 ring-white/10"
    >
      <iframe
        ref={iframeRef}
        src={reelUrl(url)}
        className="h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title={isEn ? `Vertical video ${index + 1}` : `縦型動画 ${index + 1}`}
      />
      <button
        type="button"
        onClick={toggleSound}
        aria-label={
          muted
            ? isEn ? 'Turn sound on' : '音を出す'
            : isEn ? 'Mute' : 'ミュートする'
        }
        aria-pressed={!muted}
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-black/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        <span>{muted ? (isEn ? 'Sound' : '音を出す') : (isEn ? 'Muted' : 'ミュート')}</span>
      </button>
    </div>
  );
}

export default function VerticalReel({ videos, isEn = false }: Props) {
  return (
    <div className="rounded-[2.5rem] bg-gray-900 px-4 py-12 sm:px-8">
      <p className="mb-8 text-center text-sm font-medium tracking-wide text-gray-400">
        {isEn ? 'Scroll to watch' : 'スクロールして見る'}
      </p>
      <div className="space-y-10">
        {videos.map((url, i) => (
          <ReelItem key={url} url={url} index={i} isEn={isEn} />
        ))}
      </div>
    </div>
  );
}
