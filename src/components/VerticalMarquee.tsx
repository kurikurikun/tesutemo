'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * 縦型ショートが自動で流れ続ける帯。トップページの「文字や写真では伝わらない」用。
 *
 * 狙いは1本を見せることではなく「リアルな声がこれだけある」という量の印象。
 * 4列グリッドをやめた理由は、9:16 を4つ横に並べると1本が細くなること、そして
 * 本数を増やすとセクションが下へ伸び続けること。帯なら何本入れても高さは一定。
 *
 * /recruitment の縦スクロールフィード（VerticalReel）はここでは使わない。あちらは
 * ページの目的が「作品を見せること」なので4000px超の高さが許されるが、トップページの
 * このセクションは長い話の一節なので、高さが固定される見せ方でないと成立しない。
 *
 * ## 音は必ず1本だけ
 *
 * 帯では常に複数が同時に流れているので、「音のON/OFF」を帯全体の状態にすると
 * 押した瞬間に見えている全員が喋り出す。音を持てるのは常に1枚だけ（soundIndex）で、
 * 別のカードで音を出すと前のカードは自動でミュートに戻る。
 *
 * ## 止まる条件
 *
 * ホバー、キーボードフォーカス、そして「どれかで音を出しているとき」。音を出す＝
 * その1本を見たいということなので、ベルトは止める。タッチ環境にはホバーがないため、
 * この3つ目がないと動く的をタップし続けることになる。
 *
 * ## 触るとおかしくなりやすい3点
 *
 * - animation は CSS クラスで当てること。style 属性で animation ショートハンドを
 *   書くと animation-play-state: running まで一緒に入り、:hover 側の指定が効かない。
 * - iframe には pointer-events: none。カードはほぼ全面が別オリジンの iframe なので、
 *   これがないとポインタが iframe に吸われて親の :hover が立たず、ホバーで止まらない。
 *   自動再生＋自前の音ボタンがあるので、Vimeo 側の操作は元々不要。
 * - 停止条件に :focus-within ではなく :has(:focus-visible) を使う。focus-within だと
 *   音ボタンをクリックした指がそのままフォーカスを持ち続け、ベルトが止まったままになる。
 */

export type ShowcaseVideo = { name: string; vimeo: string };

type Props = {
  videos: ShowcaseVideo[];
  isEn?: boolean;
  /** 帯の左右をぼかす色。セクションの背景と合わせる。 */
  edgeColor?: string;
};

/** これだけ画面に近づいたら iframe を作る。1.5画面ぶん手前。 */
const PRELOAD_MARGIN = '150% 0px';

const cardUrl = (url: string) =>
  `${url}${url.includes('?') ? '&' : '?'}muted=1&loop=1&title=0&byline=0&portrait=0&dnt=1`;

/** @vimeo/player のうち、ここで使うぶんだけ。SDKは動的 import なので自前で型を持つ。 */
type VimeoPlayer = {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  setMuted: (muted: boolean) => Promise<boolean>;
};

function MarqueeCard({
  video,
  hasSound,
  onSoundToggle,
  isEn,
}: {
  video: ShowcaseVideo;
  hasSound: boolean;
  onSoundToggle: () => void;
  isEn: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<VimeoPlayer | null>(null);
  const [mounted, setMounted] = useState(false);

  // 画面に近づいてから iframe を作る。帯は常に十数枚あるので、全部を最初から
  // 置くとプレイヤーアプリを十数個読み込むことになる。
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
    const player = playerRef.current;
    if (!player) return;
    player.setMuted(!hasSound).catch(() => {});
    if (hasSound) player.play().catch(() => {});
  }, [hasSound]);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[9/16] w-[68vw] shrink-0 overflow-hidden rounded-2xl bg-black shadow-lg shadow-[#7e91cf]/25 ring-1 ring-black/5 sm:w-[300px] lg:w-[340px]"
    >
      {mounted && (
        <iframe
          ref={iframeRef}
          src={cardUrl(video.vimeo)}
          className="pointer-events-none h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={`TesuTemo - ${video.name}`}
        />
      )}
      <button
        type="button"
        onClick={onSoundToggle}
        aria-label={hasSound ? (isEn ? 'Mute' : 'ミュートする') : isEn ? 'Turn sound on' : '音を出す'}
        aria-pressed={hasSound}
        className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1.5 text-[11px] font-medium text-white backdrop-blur transition hover:bg-black/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {hasSound ? <Volume2 size={14} /> : <VolumeX size={14} />}
        <span>{hasSound ? (isEn ? 'Muted' : 'ミュート') : isEn ? 'Sound' : '音を出す'}</span>
      </button>
    </div>
  );
}

export default function VerticalMarquee({ videos, isEn = false, edgeColor = '#f9fafb' }: Props) {
  // 音を持っているカードの番号。null なら全部ミュート。常に1枚だけ。
  const [soundIndex, setSoundIndex] = useState<number | null>(null);
  const toggleSound = useCallback(
    (index: number) => setSoundIndex((current) => (current === index ? null : index)),
    []
  );

  // 切れ目なくループさせるため同じ並びを2周ぶん並べ、-50% まで動かす。
  const loop = [...videos, ...videos];
  const paused = soundIndex !== null;

  return (
    <div className="tt-marquee relative overflow-hidden">
      <style>{`
        @keyframes tt-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .tt-marquee-track { animation: tt-marquee 60s linear infinite; }
        .tt-marquee:hover .tt-marquee-track,
        .tt-marquee:has(:focus-visible) .tt-marquee-track,
        .tt-marquee-track.is-paused { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .tt-marquee-track { animation: none; }
        }
      `}</style>

      <div className={`tt-marquee-track flex w-max gap-5 ${paused ? 'is-paused' : ''}`}>
        {loop.map((video, i) => (
          <MarqueeCard
            key={`${video.name}-${i}`}
            video={video}
            hasSound={soundIndex === i}
            onSoundToggle={() => toggleSound(i)}
            isEn={isEn}
          />
        ))}
      </div>

      {/* 両端をぼかして、帯が画面の外へ続いているように見せる */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16"
        style={{ backgroundImage: `linear-gradient(to right, ${edgeColor}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16"
        style={{ backgroundImage: `linear-gradient(to left, ${edgeColor}, transparent)` }}
      />
    </div>
  );
}
