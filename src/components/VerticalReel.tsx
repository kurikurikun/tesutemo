'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';

/**
 * 縦型ショートを、SNSのように上から下へ1本ずつ見せるフィード。
 *
 * 3列グリッドをやめた理由: 9:16 を3つ横に並べると1本あたりが細くなり、
 * 縦型が本来持っている「画面いっぱいで人の顔を見る」感じが消える。
 *
 * ## 声が混ざらないようにする仕組み
 *
 * 画面に入った動画だけを再生し、外れたものは止める（IntersectionObserver, 0.6）。
 * 同時に鳴るのはインタビュー動画にとって致命的なので、ここは崩さないこと。
 *
 * 音を持てるのは常に1本だけ（soundIndex）。別のカードで音を出すと前のカードは
 * ミュートに戻る。以前はフィード全体で1つの真偽値にしていたが、縦に長い画面では
 * 2枚が同時に 0.6 を超えて両方再生されることがあり、そのとき2人ぶんの声が重なる。
 * トップページの帯（VerticalMarquee）と同じ持ち方に揃えてある。
 * ブラウザに音つき再生を拒否されたらミュートに戻す。
 *
 * 音を出したカードにはリングが付くが、トップページの帯と違って他のカードを暗く
 * する処理は入れていない。ここは一度に1本しか見えないので、暗くする相手がおらず
 * 効果がないため。帯と揃っていないのは意図的。
 *
 * ## 読み込みを軽くする仕組み
 *
 * Vimeoの埋め込みは1つがプレイヤーアプリ1個ぶんの重さなので、6本ぶんの iframe を
 * 最初から置くとページが重い。各カードは画面から1.5画面ぶん以内に近づいて初めて
 * iframe を作る（下の PRELOAD_MARGIN）。実際に存在するプレイヤーは常時2〜3個で、
 * 自動再生しているのはそのうち1つだけ。
 *
 * ## 色と、矢印が fixed である理由
 *
 * 地は薄い藤色 (#f0eef8 → #e8e5f5)。/recruitment の「採用現場での活用イメージ」の
 * 帯と同じ組み合わせで、ブランドのアクセント #7e91cf の系統。最初は Tailwind の
 * bg-gray-900 (#111827) を使っていたが、あれは青紫寄りのグレーでブランド色ではない。
 *
 * 前後送りのボタンは position: fixed。sticky にできない事情があって、globals.css が
 * html と body に overflow-x: hidden をかけており、これが position: sticky を無効に
 * する（body がスクロールコンテナになるため）。site全体に効いている指定なので外さず、
 * フィードが画面に入っている間だけ矢印を出す形にした。
 */

type Props = {
  videos: string[];
  isEn?: boolean;
};

/** これだけ画面に近づいたら iframe を作る。1.5画面ぶん手前。 */
const PRELOAD_MARGIN = '150% 0px';

/** 自動再生はミュートでしか始められないので muted=1。ループも入れる。 */
const reelUrl = (url: string) =>
  `${url}${url.includes('?') ? '&' : '?'}muted=1&loop=1&title=0&byline=0&portrait=0&dnt=1`;

/** @vimeo/player のうち、ここで使うぶんだけ。SDKは動的 import なので自前で型を持つ。 */
type VimeoPlayer = {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  setMuted: (muted: boolean) => Promise<boolean>;
};

function ReelItem({
  url,
  index,
  isEn,
  hasSound,
  onSoundToggle,
  onSoundBlocked,
  setItemRef,
  setPlayer,
}: {
  url: string;
  index: number;
  isEn: boolean;
  hasSound: boolean;
  onSoundToggle: () => void;
  onSoundBlocked: () => void;
  setItemRef: (index: number, el: HTMLDivElement | null) => void;
  setPlayer: (index: number, player: VimeoPlayer | null) => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<VimeoPlayer | null>(null);
  const [mounted, setMounted] = useState(false);

  // 画面に近づいてから iframe を作る。一度作ったら外さない（作り直すと再生が飛ぶ）。
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
      { rootMargin: PRELOAD_MARGIN },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    import('@vimeo/player').then(({ default: Player }) => {
      if (cancelled || !iframeRef.current) return;
      const player = new Player(iframeRef.current) as unknown as VimeoPlayer;
      playerRef.current = player;
      setPlayer(index, player);
    });
    return () => {
      cancelled = true;
      setPlayer(index, null);
      playerRef.current = null;
    };
  }, [mounted, index, setPlayer]);

  // 音を持っているのが自分かどうか。持っていなければ黙る。
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    player.setMuted(!hasSound).catch(() => {});
    if (hasSound) player.play().catch(() => onSoundBlocked());
  }, [hasSound, onSoundBlocked]);

  return (
    <div
      ref={(el) => {
        wrapRef.current = el;
        setItemRef(index, el);
      }}
      className={`relative mx-auto aspect-[9/16] w-full max-w-[min(43.875vh,405px)] overflow-hidden rounded-3xl bg-black transition-all duration-500 ${
        hasSound
          ? 'shadow-2xl shadow-[#7e91cf]/50 ring-2 ring-primary/70'
          : 'shadow-2xl shadow-[#7e91cf]/30 ring-1 ring-black/5'
      }`}
    >
      {mounted && (
        <iframe
          ref={iframeRef}
          src={reelUrl(url)}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={isEn ? `Vertical video ${index + 1}` : `縦型動画 ${index + 1}`}
        />
      )}
      <button
        type="button"
        onClick={onSoundToggle}
        aria-label={
          hasSound
            ? isEn
              ? 'Mute'
              : 'ミュートする'
            : isEn
              ? 'Turn sound on'
              : '音を出す'
        }
        aria-pressed={hasSound}
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-black/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {hasSound ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span>
          {hasSound
            ? isEn
              ? 'Muted'
              : 'ミュート'
            : isEn
              ? 'Sound'
              : '音を出す'}
        </span>
      </button>
    </div>
  );
}

export default function VerticalReel({ videos, isEn = false }: Props) {
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const players = useRef<(VimeoPlayer | null)[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  // 音を持っているカードの番号。null なら全部ミュート。常に1本だけ。
  const [soundIndex, setSoundIndex] = useState<number | null>(null);
  const [inView, setInView] = useState(false);

  const setItemRef = useCallback((index: number, el: HTMLDivElement | null) => {
    items.current[index] = el;
  }, []);

  const setPlayer = useCallback((index: number, player: VimeoPlayer | null) => {
    players.current[index] = player;
  }, []);

  const toggleSound = useCallback(
    (index: number) => setSoundIndex((current) => (current === index ? null : index)),
    [],
  );

  // ブラウザが音つき再生を拒否したときはミュートに戻す。無音のまま止まるより良い。
  const handleSoundBlocked = useCallback(() => setSoundIndex(null), []);

  // 画面に入った動画だけを再生、外れたら停止。声が重ならないための要。
  useEffect(() => {
    const observed = items.current.filter((el): el is HTMLDivElement =>
      Boolean(el),
    );
    if (observed.length === 0) return;

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = observed.indexOf(entry.target as HTMLDivElement);
          if (index === -1) return;
          if (entry.isIntersecting) {
            setActive(index);
            if (!reduce) players.current[index]?.play().catch(() => {});
          } else {
            players.current[index]?.pause().catch(() => {});
          }
        });
      },
      { threshold: 0.6 },
    );

    observed.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [videos.length]);

  // フィードが画面にある間だけ矢印を出す。
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    // 単純な isIntersecting では駄目だった。パネルは動画6本ぶんの高さ（4000px超）が
    // あるので、下端が画面の上に少し残っているだけでも「交差している」ことになり、
    // すでに下の横型セクションを見ているのに矢印が動画の上に浮いたままになる。
    // 画面中央20%の帯に重なっているときだけ in view とみなす。
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '-40% 0px -40% 0px' },
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    const el = items.current[index];
    if (!el) return;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    el.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  return (
    <div
      ref={panelRef}
      className="rounded-[2.5rem] bg-gradient-to-b from-[#f0eef8] to-[#e8e5f5] px-4 py-12 sm:px-8"
    >
      <div className="space-y-10">
        {videos.map((url, i) => (
          <ReelItem
            key={url}
            url={url}
            index={i}
            isEn={isEn}
            hasSound={soundIndex === i}
            onSoundToggle={() => toggleSound(i)}
            onSoundBlocked={handleSoundBlocked}
            setItemRef={setItemRef}
            setPlayer={setPlayer}
          />
        ))}
      </div>

      {/* 前後の動画へ送るボタン。fixed にしている理由はファイル冒頭のコメント参照。
          フィードが画面から外れている間は隠す。スマホでは動画の右端に少し重なる。 */}
      <div
        aria-hidden={!inView}
        className={`pointer-events-none fixed inset-x-0 top-1/2 z-30 -translate-y-1/2 transition-opacity duration-300 ${
          inView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="mx-auto flex max-w-2xl justify-end px-3 sm:px-6">
          <div
            className={`flex flex-col items-center gap-2 ${inView ? 'pointer-events-auto' : ''}`}
          >
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              tabIndex={inView ? 0 : -1}
              aria-label={isEn ? 'Previous video' : '前の動画'}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg ring-1 ring-black/5 transition hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronUp size={22} />
            </button>
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium tabular-nums text-gray-600 shadow-sm">
              {active + 1} / {videos.length}
            </span>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === videos.length - 1}
              tabIndex={inView ? 0 : -1}
              aria-label={isEn ? 'Next video' : '次の動画'}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg ring-1 ring-black/5 transition hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronDown size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
