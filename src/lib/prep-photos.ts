/**
 * /prep/<token> の1枚目に出す、スタンド設置の作例写真。
 *
 * ## いまは仮置き
 *
 * `src` が空のスロットは、灰色の枠とキャプションだけの **プレースホルダー** として
 * 表示される。撮る前でもレイアウトが確認できるようにしてあるが、裏を返すと
 * **本番のインタビュイーにもこの枠が見える**。実際に送る前に必ず写真を入れること。
 *
 * ## 撮り方
 *
 * 実際にお送りするスタンドで、順を追って3枚。同じ場所・同じ人で撮ると、
 * 手順として読める。目線の高さの1枚だけ横幅いっぱいに出る。
 *
 * ## 入れ方
 *
 * 1. 画像を public/prep/ に置く（例: public/prep/stand-1.jpg）。
 * 2. 下のスロットの `src` のコメントを外す。
 * 3. キャプションは prep.ts の PREP_COPY[lang].photoCaptions に日英とも入っている。
 *
 * 画像は横1200px程度、JPEGで十分。スマホで開かれるので重すぎないように。
 */

export type PrepPhoto = {
  /** photoCaptions のキーと対応。並び順もこの配列のとおり。 */
  key: 'stand-1' | 'stand-2' | 'stand-3'
  /** 何を撮るかのメモ。表示されない。 */
  note: string
  /** 2列のうち両方を使う。1枚だけ大きく見せたいとき。 */
  wide?: boolean
  /** public/ からのパス。空 = プレースホルダーのまま。 */
  src?: string
}

export const PREP_PHOTOS: PrepPhoto[] = [
  {
    key: 'stand-1',
    note: '箱から出して立てただけの状態。三脚の脚が開いていることが分かるように。',
    // src: '/prep/stand-1.jpg',
  },
  {
    key: 'stand-2',
    note: 'ホルダーにスマホを挟んだところ。挟み方が分かる寄りで。',
    // src: '/prep/stand-2.jpg',
  },
  {
    key: 'stand-3',
    note: '座った人とスタンドを横から。レンズと目線が同じ高さにあることが一目で分かる絵にする。ここが一番大事なので、横幅いっぱいで出す。',
    wide: true,
    // src: '/prep/stand-3.jpg',
  },
]

/** 写真が1枚でも入っているか。全部空ならプレースホルダー表示になる。 */
export const hasAnyPrepPhoto = (): boolean => PREP_PHOTOS.some((p) => p.src)
