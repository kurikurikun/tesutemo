/**
 * インタビュー前の「準備の確認」ページ（/prep/<token>）で使う型とコピー。
 *
 * ## なぜこれがあるか
 *
 * これまでは案内をPDFで送っていたが、「いつものZoom面談だろう」と思われて
 * 読まれないことがあった。実際に当日、バーチャル背景・イヤホン・スマホの高さを
 * その場で直してもらう羽目になっている。
 *
 * そこでPDFをやめ、1人1本のURLを送る。ページ側で
 *
 *   - 「これは撮影であってオンライン会議ではない」と最初に伝える
 *   - 事故になりやすい3点を **個別の** チェックにする（まとめて1つにしない。
 *     8個読ませることに意味がある）
 *   - 開封・読了・送信のタイムスタンプを残す
 *
 * ができるようにした。誰がまだ読んでいないかは /ops/prep で見る。
 *
 * ## テーブル
 *
 * Supabase の `prep_acknowledgements`（作成済み）。氏名と電話番号が入るので
 * **RLS はポリシーゼロの deny-all** にしてある。src/lib/supabase.ts の anon キーは
 * ブラウザに出ているので、この表には絶対に anon で触らせない。読み書きはすべて
 * サーバ側の API ルートから `getSupabaseAdmin()`（service key）で行う。
 *
 * ```sql
 * create table public.prep_acknowledgements (
 *   id uuid primary key default gen_random_uuid(),
 *   name text not null,
 *   company text,
 *   interview_date date,
 *   interview_time time,
 *   lang text not null default 'ja' check (lang in ('ja', 'en')),
 *   interview_type text not null default 'recruitment'
 *     check (interview_type in ('recruitment', 'case_study')),
 *   riverside_url text,
 *   kit_shipped_at timestamptz,
 *   kit_tracking text,
 *   first_opened_at timestamptz,
 *   submitted_at timestamptz,
 *   family_name text,
 *   given_name text,
 *   family_kana text,
 *   given_kana text,
 *   job_title text,
 *   phone text,
 *   steps_seen jsonb not null default '{}'::jsonb,
 *   user_agent text,
 *   created_at timestamptz not null default now()
 * );
 * create index prep_acknowledgements_interview_date_idx
 *   on public.prep_acknowledgements (interview_date);
 * alter table public.prep_acknowledgements enable row level security;
 *
 * -- これを忘れると本番のAPIが 42501 permission denied で落ちる。RLS の話とは別で、
 * -- 表そのものの GRANT。マイグレーションで作った表には自動で付かなかった。
 * grant select, insert, update, delete on public.prep_acknowledgements to service_role;
 * revoke all on public.prep_acknowledgements from anon, authenticated;
 * ```
 *
 * 撮影が終わった行の `phone` は残しておく理由がないので、そのうち消す仕組みが
 * いる（いまは手動）。
 *
 * ## 言語
 *
 * 行ごとに `lang` を持たせて、コピーはこのファイルの `PREP_COPY` から引く。
 * 英語版のためにルートを増やす必要はない。英語は日本語の直訳ではなく、
 * 英語として自然な言い回しにしてある（サイト本体の EN ページと同じ方針）。
 */

export type PrepLang = 'ja' | 'en'

/** DBの1行 = 1人分のリンク。`id` がそのまま /prep/<id> のトークンになる。 */
export type PrepRow = {
  id: string
  name: string
  company: string | null
  interview_date: string | null
  /**
   * 開始時刻。日本時間の壁時計としてそのまま出す（timestamptz にすると端末の
   * タイムゾーンでずれる）。英語版だけ (JST) を添える。
   */
  interview_time: string | null
  lang: PrepLang
  interview_type: PrepInterviewType
  /** 当日入るスタジオのURL。入っていればページに参加ボタンを出す。 */
  riverside_url: string | null
  kit_shipped_at: string | null
  kit_tracking: string | null
  first_opened_at: string | null
  submitted_at: string | null
  family_name: string | null
  given_name: string | null
  family_kana: string | null
  given_kana: string | null
  job_title: string | null
  phone: string | null
  /** 画面IDごとに、そこへ進んだ時刻。 */
  steps_seen: Record<string, string> | null
  user_agent: string | null
  created_at: string
}

/** ページが本人に見せてよい範囲だけ。電話番号などは返さない。 */
export type PrepPublicRow = Pick<
  PrepRow,
  | 'name'
  | 'company'
  | 'interview_date'
  | 'interview_time'
  | 'lang'
  | 'interview_type'
  | 'riverside_url'
  | 'submitted_at'
>

export type PrepStatus = 'unopened' | 'opened' | 'acknowledged'

export function prepStatus(row: Pick<PrepRow, 'first_opened_at' | 'submitted_at'>): PrepStatus {
  if (row.submitted_at) return 'acknowledged'
  if (row.first_opened_at) return 'opened'
  return 'unopened'
}

/**
 * 画面の並び。**進むこと自体が「読んだ」の記録** で、チェックボックスは置かない。
 *
 * チェックボックスは実際には機能していなかった。読んだかどうかではなく、箱に印を
 * つける気があるかどうかしか測れない（Obar & Oeldorf-Hirsch の調査では、規約を
 * 読み飛ばした人も含めて97%が同意している）。しかも「スタンドが届きました」の
 * ようにこちらの発送待ちの項目が混ざると、まだ届いていない人は送信すらできず、
 * 結局こちらには何も届かない。
 *
 * 目的は「守った証拠」ではなく「何が必要か分かってもらうこと」。だから止めない。
 * 代わりに、どの画面まで進んだかを1つずつ記録する。送信がなくても「この人は
 * 3枚目を見ていない」と分かるので、当日そこだけ口頭で補える。
 */
export const PREP_STEPS = ['before', 'onday', 'contact'] as const

export type PrepStep = (typeof PREP_STEPS)[number]


// スタンドの説明はあえて置かない。指示や情報が増えるほど、結局誰も読まないし
// やらない。伝えるのは「スタンドを使って目線の高さに」だけで、それはNGの3つめに
// 入っている。高さの数字・脚の開き方・床置きと卓上の違いは、当日こちらから声を
// かけて直せる範囲なので、ページには書かない。

/**
 * ページに <a href> として出すURLなので、スキームを確かめてから保存する。
 * /ops はパスワードで守られているとはいえ、javascript: のようなものを埋めない。
 */
export function cleanUrl(value: unknown): string | null {
  const raw = String(value ?? '').trim()
  if (!raw) return null
  try {
    const u = new URL(raw)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : null
  } catch {
    return null
  }
}

/**
 * インタビューの種類。採用と導入事例で、変わるのは冒頭の一文と、完成イメージとして
 * 見せるページだけ。中身（撮影環境・アプリ・当日の入り方・フォーム）は共通。
 */
export type PrepInterviewType = 'recruitment' | 'case_study'

/** もっと見たい人のための行き先。埋め込みで足りる人はここを踏まない。 */
export const SHOWCASE_URL: Record<PrepInterviewType, string> = {
  recruitment: 'https://www.tesutemo.co/recruitment',
  case_study: 'https://www.tesutemo.co/case-study',
}

/**
 * 1枚目に置く完成例。文章で「こういう動画です」と書くより、30秒見てもらうほうが早い。
 * サイト本体で出している縦型と同じもの（限定公開なので hash は必須）。
 *
 * インタビューの種類に合わせる。採用の人に導入事例を見せても参考にならない。
 */
export const PREP_EXAMPLES: Record<PrepInterviewType, { id: string; hash: string }[]> = {
  // TECH CREW 採用インタビュー（/recruitment で公開中）
  recruitment: [
    { id: '1221072399', hash: 'e94079d935' }, // 野田さん S2
    { id: '1222248180', hash: '709b280571' }, // 清水さん S3
  ],
  // Comas 導入事例（/case-study で公開中）
  case_study: [
    { id: '1211072475', hash: '8e9082a9da' }, // 手島さん S1
    { id: '1211072453', hash: 'c96d4c9dc8' }, // 手島さん S2
  ],
}

export const exampleEmbedUrl = ({ id, hash }: { id: string; hash: string }) =>
  `https://player.vimeo.com/video/${id}?h=${hash}&badge=0&autopause=0&player_id=0&app_id=58479`

export const RIVERSIDE_IOS = 'https://apps.apple.com/us/app/riverside-fm/id1554443872'
export const RIVERSIDE_ANDROID = 'https://play.google.com/store/apps/details?id=riverside.fm'

export const PREP_CONTACT = {
  company: '株式会社move-ment',
  person: '木下',
  personEn: 'Kinoshita',
  tel: '090-2095-5234',
  email: 'kinoshita@move-ment.co',
}

type Copy = {
  metaTitle: string
  kicker: string
  /** 改行は意図したところで入れる（whitespace-pre-line で保持される）。 */
  title: string
  /** 冒頭の一文。採用と導入事例で、ここだけ変わる。 */
  lede: Record<PrepInterviewType, string>
  forWhom: (name: string) => string
  onDate: (when: string) => string

  alreadyDone: string
  alreadyDoneBody: string

  /** 完成例。埋め込みの見出しと、もっと見たい人へのリンク。 */
  examplesTitle: string
  showcaseLabel: string

  /** 当日の撮影環境。以前は赤いカード3枚＋場所の箇条書きだったが、1つの並びにした。 */
  envTitle: string
  envLede: string
  envBullets: string[]

  /**
   * 画面は「いつやるか」で割る。1枚目＝当日まで、2枚目＝当日、3枚目＝連絡先。
   * 導入の説明だけで1枚使うほどの中身がないので、当日までにやることと同じ枚に
   * まとめている。枚数が増えるほど途中で離脱する場所も増える。
   */
  beforeTitle: string
  onDayTitle: string

  appBullets: string[]
  appWarning: string
  appIos: string
  appAndroid: string

  joinButton: string
  joinNote: string

  formTitle: string
  formLede: string
  /** 入力がそのままテロップになることを伝える。理由が分かると書き方が変わる。 */
  captionNote: string
  captionPreviewLabel: string
  familyNameLabel: string
  familyNamePlaceholder: string
  givenNameLabel: string
  givenNamePlaceholder: string
  kanaLabel: string
  familyKanaPlaceholder: string
  givenKanaPlaceholder: string
  jobTitleLabel: string
  jobTitlePlaceholder: string
  phoneLabel: string
  phoneHelp: string
  phonePlaceholder: string
  submit: string
  submitting: string
  submitError: string
  requiredNote: string
  /** 進むボタン。押すことが「読みました」になる。 */
  next: string
  back: string
  stepOf: (n: number, total: number) => string

  doneTitle: string
  doneBody: string

  helpTitle: string
  helpBody: string

  photoCaptions: Record<string, string>
}

export const PREP_COPY: Record<PrepLang, Copy> = {
  ja: {
    metaTitle: 'インタビュー前のご確認｜TesuTemo',
    kicker: '当日までにお読みください',
    title: 'これは「撮影」です。\nオンライン会議ではありません。',
    lede: {
      recruitment: 'お送りするのは、御社のサイトや採用ページで長く使われる動画です。',
      case_study:
        'お送りするのは、導入事例として、ウェブサイトや資料で長く使われる動画です。',
    },
    examplesTitle: 'こんな動画になります',
    showcaseLabel: 'ほかの例も見る',
    forWhom: (name) => `${name} 様へ`,
    onDate: (when) => `インタビュー：${when}`,

    alreadyDone: 'ご確認ありがとうございました。',
    alreadyDoneBody:
      '内容は受け付けています。当日までにもう一度読み返したいときは、このページをそのまま開いてください。',

    envTitle: '撮影環境',
    envLede: '撮影の前に一緒に確認して調整しますので、完璧でなくても大丈夫です。',
    envBullets: [
      'バーチャル背景・フィルターはオフに',
      'イヤホンは使わない（有線・無線とも）',
      'スマホはスタンドを調整して目線の高さに',
      '背景はなるべくスッキリに',
      '窓は正面か横に（背にすると逆光になります）',
      'なるべく静かなところで',
    ],

    beforeTitle: '当日までにやること',
    onDayTitle: '当日にやること',
    appBullets: [
      'ライト付きのスマホスタンドをお届けします。お受け取りをお願いします。',
      'インタビューはパソコンではなく、ご自身のスマホで受けていただきます。無料アプリ「Riverside」を入れておいてください。',
    ],
    appWarning:
      '「Continue with Google」などでサインインしないでください。アカウントは不要です。',
    appIos: 'iPhone の方はこちら（App Store）',
    appAndroid: 'Android の方はこちら（Google Play）',

    joinButton: 'インタビューに参加する',
    joinNote: 'お約束の時間になったら、このページを開いてボタンを押してください。',

    formTitle: 'お名前とご連絡先',
    formLede: '最後に、テロップに使うお名前と、当日つながる連絡先を教えてください。',
    captionNote:
      'いただいたお名前と役職は、動画のテロップにそのまま使います。お手数ですが、表示したい表記でご記入ください。',
    captionPreviewLabel: 'テロップの表示イメージ',
    familyNameLabel: '姓',
    familyNamePlaceholder: '田中',
    givenNameLabel: '名',
    givenNamePlaceholder: '太郎',
    kanaLabel: 'フリガナ',
    familyKanaPlaceholder: 'タナカ',
    givenKanaPlaceholder: 'タロウ',
    jobTitleLabel: '役職・肩書き',
    jobTitlePlaceholder: '営業部 マネージャー',
    phoneLabel: '携帯電話番号',
    phoneHelp: '当日、何かあったときにご連絡します。',
    phonePlaceholder: '090-1234-5678',
    submit: '確認しました・送信する',
    submitting: '送信中…',
    submitError: '送信できませんでした。通信環境をご確認のうえ、もう一度お試しください。',
    requiredNote: 'お名前・フリガナ・役職・電話番号のご記入をお願いします。',
    next: '確認しました・次へ',
    back: '前へ',
    stepOf: (n, total) => `${n} / ${total}`,

    doneTitle: 'ありがとうございました。当日お会いしましょう。',
    doneBody:
      'ご確認を受け付けました。当日までに読み返したいときは、このページをそのまま開いてください。ご不明な点があれば、下の連絡先までお気軽にどうぞ。',

    helpTitle: '困ったときは',
    helpBody: 'つながらないときはお電話ください。',

    photoCaptions: {
      'stand-1': 'スタンドを立てたところ',
      'stand-2': 'スマホを取り付けたところ',
      'stand-3': '座って、目線の高さに合わせたところ',
      'stand-4': 'ライトをつけたところ',
    },
  },

  en: {
    metaTitle: 'Before your interview | TesuTemo',
    kicker: 'Please read before the day',
    title: 'This is a shoot.\nNot a video call.',
    lede: {
      recruitment:
        'What we record will live on your company’s website and hiring pages for years.',
      case_study:
        'What we record becomes a customer story, used on the web and in sales material for years.',
    },
    examplesTitle: 'This is what we make',
    showcaseLabel: 'See more examples',
    forWhom: (name) => `For ${name}`,
    onDate: (when) => `Interview: ${when}`,

    alreadyDone: 'Thanks — you’re all set.',
    alreadyDoneBody:
      'We’ve got your confirmation. This page stays open if you want to look anything up again before the day.',

    envTitle: 'Your setup',
    envLede: 'We’ll set all of this up together before we start, so it doesn’t need to be perfect.',
    envBullets: [
      'Virtual backgrounds and filters off',
      'No earphones, wired or wireless',
      'Phone on the stand, at eye level',
      'A tidy background',
      'A window in front of you or to one side, never behind',
      'Somewhere quiet',
    ],

    beforeTitle: 'Before the day',
    onDayTitle: 'On the day',
    appBullets: [
      'A phone stand with a light built in arrives by post — please take it in when it does.',
      'The interview runs on your own phone, not a computer. Install the free Riverside app before the day.',
    ],
    appWarning: 'Don’t sign in with “Continue with Google” or similar. You don’t need an account.',
    appIos: 'iPhone — App Store',
    appAndroid: 'Android — Google Play',

    joinButton: 'Join the interview',
    joinNote: 'At your interview time, open this page and tap the button.',

    formTitle: 'Your name and a number',
    formLede: 'Last thing: the name that goes on screen, and a number we can reach you on.',
    captionNote:
      'Your name and job title go on screen in the finished video exactly as you write them here, so please use the spelling you want shown.',
    captionPreviewLabel: 'How it will appear on screen',
    familyNameLabel: 'Family name',
    familyNamePlaceholder: 'Chen',
    givenNameLabel: 'First name',
    givenNamePlaceholder: 'Sarah',
    kanaLabel: '',
    familyKanaPlaceholder: '',
    givenKanaPlaceholder: '',
    jobTitleLabel: 'Job title',
    jobTitlePlaceholder: 'Sales Manager',
    phoneLabel: 'Mobile number',
    phoneHelp: 'In case we need to reach you on the day.',
    phonePlaceholder: '090-1234-5678',
    submit: 'Confirm and send',
    submitting: 'Sending…',
    submitError: 'That didn’t send. Check your connection and try once more.',
    requiredNote: 'Please fill in your name, job title and phone number.',
    next: 'Got it — next',
    back: 'Back',
    stepOf: (n, total) => `${n} of ${total}`,

    doneTitle: 'Thanks — see you on the day.',
    doneBody:
      'We’ve got your confirmation. This page stays open if you want to look anything up again. Anything unclear, just get in touch below.',

    helpTitle: 'If anything goes wrong',
    helpBody: 'If you can’t get through, call.',

    photoCaptions: {
      'stand-1': 'The stand set up',
      'stand-2': 'Phone mounted',
      'stand-3': 'Seated, adjusted to eye level',
      'stand-4': 'Light switched on',
    },
  },
}
