/**
 * TECH CREW Inc.（techcrew.co.jp）— 採用インタビュー動画。
 *
 * 2名 × 横型2本・縦型4〜5本 = 横型4本 / 縦型9本。すべて Vimeo にアップ済み。
 *
 * ## 出す動画を変えるときの手順
 *
 * 1. 下のスロットの `id` / `hash` のコメントを外す（= 公開してよい動画）。
 * 2. /recruitment のページ側で `pickVideos(TECHCREW_VERTICAL, [...])` に
 *    `key` を並べる。並び順はページ側が決める。
 *
 * JA と EN の /recruitment は両方このファイルを読んでいるので、ID の管理は
 * ここ1箇所で済む。`id` が未入力のスロットは `pickVideos` / `readyVideos` が
 * 除外するので、空の iframe や壊れた枠が出ることはない。用意できたものから
 * 順に公開できる。
 *
 * 社名表記: ロゴとフッターの実物で確認済み。ロゴは **TECH CREW**（2語・大文字）、
 * フッターの著作権表示は **TECH CREW Inc.**。TechCrew と1語で詰めない。
 * 日本語の法人格表記（株式会社◯◯）は未確認 — サイト上に和文の社名を出すときは
 * 先に確認すること。事業内容はサービス業の現場で働く人向けの人材管理テクノロジー。
 *
 * 状況（2026-08）:
 * - Vimeo 側の公開設定は13本すべて `view: unlisted` / `embed: public`。
 *   unlisted なので **hash（URL の h=）は必須**。
 * - 縦型9本は公開可。うち4本を /recruitment に、野田S1・清水S1をトップページに出している。
 * - 横型4本はまだ出していない。清水A（1222247699）はトランスコード待ち、
 *   野田A（1222225510）は 2:45 以降に別フック候補が残った確認用の版。
 *   差し替え・確認が済むまで id はコメントのまま。
 */

export type VideoSlot = {
  /** ページ側から指名するための安定したキー。 */
  key: string;
  /** どの動画のスロットかを人が読むためのラベル。表示はされない。 */
  note: string;
  /** Vimeo の数字ID。空 = まだ出さない。 */
  id?: string;
  /** 限定公開動画のハッシュ（URL の h= の値）。公開動画なら不要。 */
  hash?: string;
};

const embedUrl = (id: string, hash?: string) =>
  `https://player.vimeo.com/video/${id}?${hash ? `h=${hash}&` : ''}badge=0&autopause=0&player_id=0&app_id=58479`;

/** 埋まっているスロットだけを埋め込みURLに変換する。未入力は落とす。 */
export const readyVideos = (slots: VideoSlot[]): string[] =>
  slots.flatMap((s) => (s.id ? [embedUrl(s.id, s.hash)] : []));

/**
 * 指定した `key` の順で埋め込みURLを返す。id が入っていないスロットと、
 * 存在しない key は黙って飛ばすので、並びを先に書いておいて動画が届いてから
 * id を埋める、という運用ができる。
 */
export const pickVideos = (slots: VideoSlot[], keys: string[]): string[] => {
  const byKey = new Map(slots.map((s) => [s.key, s]));
  return keys.flatMap((k) => {
    const s = byKey.get(k);
    return s?.id ? [embedUrl(s.id, s.hash)] : [];
  });
};

// 横型はまだ公開待ち（上のコメント参照）。確認が取れたら id / hash のコメントを外す。
export const TECHCREW_HORIZONTAL: VideoSlot[] = [
  { key: 'noda-a',    note: '野田さん — A「作りたいものを作る」 2:38' },             // id: '1222225510', hash: '447221aeae'  ※2:45以降に別フック候補が残る確認用
  { key: 'noda-b',    note: '野田さん — B「ぶつかることで」 2:50' },                 // id: '1222225734', hash: '0a1be063e1'
  { key: 'shimizu-a', note: '清水さん — A「子育てしていてもレベルアップ」 3:47' },   // id: '1222247699', hash: '2a1e5a09e6'  ※Vimeoでトランスコード中
  { key: 'shimizu-b', note: '清水さん — B「言ってもいい、やってもいい」 4:44' },     // id: '1222248018', hash: '742f9ff032'
];

// 9本すべて公開可。どれをどこに出すかは各ページの pickVideos() の並びが決める。
// 野田S1・清水S1はトップページ（「文字や写真では伝わらない」セクション）で使用中。
export const TECHCREW_VERTICAL: VideoSlot[] = [
  { key: 'noda-s1',    note: '野田さん — S1「我」 0:34' },                             /* トップページで使用中 */ // id: '1221072287', hash: '09e1a18a37'
  { key: 'noda-s2',    note: '野田さん — S2「ぶつかることで、いいものができる」 0:36', id: '1221072399', hash: 'e94079d935' },
  { key: 'noda-s3',    note: '野田さん — S3「人生の中に、仕事がある」 1:02' },          // id: '1221072528', hash: '5fc3a51de8'
  { key: 'noda-s4',    note: '野田さん — S4「迷ったら、まず話してみて」 0:29', id: '1221072753', hash: 'c73c229278' },
  { key: 'shimizu-s1', note: '清水さん — S1「輝いて成長したい人」 0:44' },              /* トップページで使用中 */ // id: '1222248136', hash: '094e6a6fd2'
  { key: 'shimizu-s2', note: '清水さん — S2「歯車を動かす」 0:44' },                    // id: '1222248158', hash: 'bd8a70f8de'
  { key: 'shimizu-s3', note: '清水さん — S3「自立している人が多い」 0:44', id: '1222248180', hash: '709b280571' },
  { key: 'shimizu-s4', note: '清水さん — S4「家庭が一番大事」 1:07', id: '1222248224', hash: 'd10afb1a09' },
  { key: 'shimizu-s5', note: '清水さん — S5「仕事もプライベートも全力で」 0:46' },      // id: '1222248237', hash: 'ec4bf195ef'
];
