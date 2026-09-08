/**
 * /prep/<token> に出す作例写真のスロット。
 *
 * techcrew-videos.ts と同じ考え方で、`src` が空のスロットはページ側が黙って
 * 飛ばす。写真が1枚も入っていなくてもページは成立するので、キットが届いて
 * 撮影できてから、このファイルだけを直せばよい。
 *
 * ## 撮り方
 *
 * 実際にお送りするキット（三脚スタンド＋LEDライト）を使って撮ること。
 * 以前のPDFに載せていた「卓上スタンド」「本を積む」の写真は、もう送るものと
 * 違うので使わない。
 *
 * 良い例と悪い例を並べるのが目的なので、同じ部屋・同じ人で撮ると効く。
 *
 * ## 入れ方
 *
 * 1. 画像を public/prep/ に置く（例: public/prep/setup.jpg）。
 * 2. 下のスロットの `src` に '/prep/setup.jpg' と書く。
 * 3. キャプションは prep.ts の PREP_COPY[lang].photoCaptions に日英とも入っている。
 *    写真の内容を変えたらそちらも直すこと。
 *
 * 画像は横1200px程度、JPEGで十分。スマホで開かれるので重すぎないように。
 */

export type PrepPhoto = {
  /** photoCaptions のキーと対応。並び順もこの配列のとおり。 */
  key: 'setup' | 'frame-good' | 'frame-bad' | 'room-bad'
  /** 何を撮るかのメモ。表示されない。 */
  note: string
  /** public/ からのパス。空 = まだ出さない。 */
  src?: string
  /** ○×どちらの例か。ページ側の枠の色に使う。 */
  tone: 'good' | 'bad' | 'neutral'
}

export const PREP_PHOTOS: PrepPhoto[] = [
  {
    key: 'setup',
    tone: 'neutral',
    note: 'キット一式を立てた全体像を横から。三脚の高さ・ライトの位置・座った人の目線が1枚でわかること。',
    // src: '/prep/setup.jpg',
  },
  {
    key: 'frame-good',
    tone: 'good',
    note: '良い画角。カメラが実際に見ている絵（スマホ画面のスクショでよい）。目線の高さ、頭上の余白適度、背景すっきり。',
    // src: '/prep/frame-good.jpg',
  },
  {
    key: 'frame-bad',
    tone: 'bad',
    note: '悪い画角。スマホを机に直置きして下から見上げた絵。frame-good と同じ部屋・同じ人で撮ると差が出る。',
    // src: '/prep/frame-bad.jpg',
  },
  {
    key: 'room-bad',
    tone: 'bad',
    note: '悪い環境。窓を背にした逆光＋背景に物が写り込んでいる状態。できればイヤホンもつけておくと3点セットで伝わる。',
    // src: '/prep/room-bad.jpg',
  },
]

/** 用意できている写真だけ。1枚もなければ空配列。 */
export const readyPrepPhotos = (): (PrepPhoto & { src: string })[] =>
  PREP_PHOTOS.flatMap((p) => (p.src ? [{ ...p, src: p.src }] : []))
