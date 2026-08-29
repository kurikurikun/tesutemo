/**
 * TechCrew (techcrew.co.jp) — 採用インタビュー動画。**編集中のプレースホルダー。**
 *
 * 2名 × 横型2本・縦型4本 = 横型4本 / 縦型8本。数日中に Vimeo へ上がる予定。
 *
 * ## 動画が届いたときの手順
 *
 * 下のスロットの `id`（と、限定公開なら `hash`）を埋めるだけ。JA と EN の
 * /recruitment は両方このファイルを読んでいるので、ここ1箇所で両ページに出ます。
 *
 *     { note: '1人目 — 横型①', id: '1234567890', hash: 'abc123def4' },
 *
 * `id` が空のスロットは `readyVideos()` が除外するので、埋まっていないまま本番に
 * 出ても、空の iframe や壊れた枠は描画されません。全部埋まるまで待つ必要はなく、
 * 用意できたものから順に公開されます。
 *
 * 未確認: 会社名の正式表記。techcrew.co.jp に到達できず確認できていないため、
 * サイト上に社名を出す場合は 株式会社◯◯ の表記を確認してから追記すること。
 */

export type VideoSlot = {
  /** どの動画のスロットかを人が読むためのラベル。表示はされない。 */
  note: string;
  /** Vimeo の数字ID。空 = まだ届いていない。 */
  id?: string;
  /** 限定公開動画のハッシュ（URL の h= の値）。公開動画なら不要。 */
  hash?: string;
};

const embedUrl = (id: string, hash?: string) =>
  `https://player.vimeo.com/video/${id}?${hash ? `h=${hash}&` : ''}badge=0&autopause=0&player_id=0&app_id=58479`;

/** 埋まっているスロットだけを埋め込みURLに変換する。未入力は落とす。 */
export const readyVideos = (slots: VideoSlot[]): string[] =>
  slots.flatMap((s) => (s.id ? [embedUrl(s.id, s.hash)] : []));

export const TECHCREW_HORIZONTAL: VideoSlot[] = [
  { note: '1人目 — 横型①' },
  { note: '1人目 — 横型②' },
  { note: '2人目 — 横型①' },
  { note: '2人目 — 横型②' },
];

export const TECHCREW_VERTICAL: VideoSlot[] = [
  { note: '1人目 — 縦型①' },
  { note: '1人目 — 縦型②' },
  { note: '1人目 — 縦型③' },
  { note: '1人目 — 縦型④' },
  { note: '2人目 — 縦型①' },
  { note: '2人目 — 縦型②' },
  { note: '2人目 — 縦型③' },
  { note: '2人目 — 縦型④' },
];
