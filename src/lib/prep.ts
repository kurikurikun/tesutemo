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
 *   lang text not null default 'ja' check (lang in ('ja', 'en')),
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
  lang: PrepLang
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
  'name' | 'company' | 'interview_date' | 'lang' | 'submitted_at'
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
export const PREP_STEPS = ['intro', 'critical', 'app', 'contact'] as const

export type PrepStep = (typeof PREP_STEPS)[number]


// スタンドの説明はあえて置かない。指示や情報が増えるほど、結局誰も読まないし
// やらない。伝えるのは「スタンドを使って目線の高さに」だけで、それはNGの3つめに
// 入っている。高さの数字・脚の開き方・床置きと卓上の違いは、当日こちらから声を
// かけて直せる範囲なので、ページには書かない。

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
  title: string
  lede: string
  forWhom: (name: string) => string
  onDate: (date: string) => string

  alreadyDone: string
  alreadyDoneBody: string

  kitTitle: string
  kitLede: string
  kitNote: string
  kitItems: string[]

  ngTitle: string
  ngLede: string
  ng: { title: string; body: string }[]

  roomTitle: string
  roomBullets: string[]

  appTitle: string
  appBullets: string[]
  appWarning: string
  appIos: string
  appAndroid: string

  dayTitle: string
  dayBullets: string[]

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
    title: 'これは「撮影」です。オンライン会議ではありません。',
    lede:
      'お送りするのは、御社のウェブサイトや採用ページで長く使われる動画です。画面越しの打ち合わせと違い、映り方と音がそのまま残ります。5分だけお時間をください。ここに書いてあることを押さえていただけると、当日は話すことだけに集中できます。',
    forWhom: (name) => `${name} 様へ`,
    onDate: (date) => `インタビュー日：${date}`,

    alreadyDone: 'ご確認ありがとうございました。',
    alreadyDoneBody:
      '内容は受け付けています。当日までにもう一度読み返したいときは、このページをそのまま開いてください。',

    kitTitle: 'お届けするもの',
    kitLede:
      'インタビューの1週間ほど前に、撮影用のスタンドをお送りします。ライトもリモコンもこのスタンドに付いていますので、ご自身で用意していただくものはありません。',
    kitNote:
      '前日までに届いていない場合は、下の連絡先までお知らせください。予備をお持ちします。',
    kitItems: [
      'スマホスタンド（LEDライト付き）。組み立ては不要です',
      'ライトは充電式です。前日に充電だけお願いします',
    ],
    ngTitle: 'この3つだけ、お願いします',
    ngLede: '過去に、当日その場で直していただくことになった3点です。',
    ng: [
      {
        title: 'バーチャル背景・美肌フィルターはオフに',
        body:
          '背景を差し替えると、輪郭がにじんだり、手を動かしたときに指先が欠けたりします。編集で直せません。実際の部屋のまま撮らせてください。',
      },
      {
        title: 'イヤホンは使わない（有線・無線とも）',
        body:
          'イヤホンのマイクは口元から遠く、音がこもります。スマホ本体のマイクのほうがきれいに録れます。ワイヤレスは途中で切れることもあるので、耳から外してお待ちください。',
      },
      {
        title: 'スマホは目線の高さに',
        body:
          '机に直接置いたり手で持ったりすると、カメラが下から見上げる画になります。同梱のスタンドに取り付けて、座ったときにレンズが目の高さにくるように合わせてください。床でも机の上でも構いません。細かい位置は当日お声がけします。',
      },
    ],

    roomTitle: '撮影する場所',
    roomBullets: [
      'できるだけ静かな場所（空調やドアの音も入ります）',
      '背景はできるだけスッキリと',
      '窓を背にすると逆光になります。窓は正面か横に',
    ],

    appTitle: '当日までにアプリを入れる',
    appBullets: [
      'App Store か Google Play から、無料アプリ「Riverside」をインストールしてください。',
      'インタビューはパソコンではなく、ご自身のスマホで受けていただきます。',
    ],
    appWarning:
      '「Continue with Google」「Continue with Apple」などをタップしてサインインしないでください。アカウントを作る必要はありません。',
    appIos: 'iPhone の方はこちら（App Store）',
    appAndroid: 'Android の方はこちら（Google Play）',

    dayTitle: '当日の入り方',
    dayBullets: [
      'ご案内メールで届いたリンクをスマホで開く',
      '「Join via App」→「I’m ready!」→「Join」の順にタップ',
      'アプリから直接入る場合は「Join Session via Link」にリンクを貼り付け →「Join studio」→「I’m ready!」→「Join」',
    ],

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
    helpBody: '当日でも構いません。つながらないときはお電話ください。',

    photoCaptions: {
      setup: 'スタンドを立てた状態。座ってレンズが目の高さにきています。',
      'frame-good': 'これが良い画角です。目線の高さ、頭の上の余白も適度。',
      'frame-bad': 'これはNG。机に直置きすると、下から見上げる画になります。',
      'room-bad': 'これもNG。窓を背にすると逆光に。背景の写り込みも整理してください。',
    },
  },

  en: {
    metaTitle: 'Before your interview | TesuTemo',
    kicker: 'Please read before the day',
    title: 'This is a shoot, not a video call.',
    lede:
      'What we record will live on your company’s website and hiring pages for years. Unlike a normal meeting, how you look and sound is what stays. Give us five minutes here and on the day you can think about nothing but what you want to say.',
    forWhom: (name) => `For ${name}`,
    onDate: (date) => `Interview date: ${date}`,

    alreadyDone: 'Thanks — you’re all set.',
    alreadyDoneBody:
      'We’ve got your confirmation. This page stays open if you want to look anything up again before the day.',

    kitTitle: 'What we’re sending you',
    kitLede:
      'About a week before your interview, a stand arrives by post. The light and the remote are both part of it, so there’s nothing you need to buy or borrow.',
    kitNote:
      'If it hasn’t arrived the day before, let us know at the number below and we’ll bring a spare.',
    kitItems: [
      'A phone stand with an LED light. Nothing to assemble',
      'The light runs on a battery — just charge it the night before',
    ],
    ngTitle: 'Three things that really matter',
    ngLede: 'These are the three we’ve had to fix on the day. If you remember nothing else, remember these.',
    ng: [
      {
        title: 'Turn off virtual backgrounds and beauty filters',
        body:
          'A replaced background smears your outline and makes bits of you disappear when you move your hands. We can’t fix that in the edit. Your actual room is fine — that’s the point.',
      },
      {
        title: 'No earphones — wired or wireless',
        body:
          'An earphone mic sits far from your mouth and makes you sound boxed in. Your phone’s own mic is better. Wireless ones also drop out mid-sentence, so please take them out before we start.',
      },
      {
        title: 'Put the phone at eye level',
        body:
          'Flat on a desk or held in your hand, the camera ends up looking up at you. Put it in the stand we send and set it so the lens meets your eyes while you’re sitting down — on the floor or on your desk, whichever is easier. We’ll help you fine-tune it on the day.',
      },
    ],

    roomTitle: 'Where to sit',
    roomBullets: [
      'Somewhere quiet — air conditioning and doors both make it onto the recording',
      'A tidy background',
      'Don’t sit with a window behind you. Put it in front of you or to one side',
    ],

    appTitle: 'Install the app beforehand',
    appBullets: [
      'Install the free Riverside app from the App Store or Google Play.',
      'The interview runs on your own phone, not a computer.',
    ],
    appWarning:
      'Don’t tap “Continue with Google”, “Continue with Apple” or anything like it. You don’t need an account.',
    appIos: 'iPhone — App Store',
    appAndroid: 'Android — Google Play',

    dayTitle: 'Joining on the day',
    dayBullets: [
      'Open the link from your invitation email on your phone',
      'Tap “Join via App” → “I’m ready!” → “Join”',
      'Or from the app: “Join Session via Link”, paste the link → “Join studio” → “I’m ready!” → “Join”',
    ],

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
    helpBody: 'Even on the day. If you can’t get through, call.',

    photoCaptions: {
      setup: 'The stand set up. Seated, the lens is level with the eyes.',
      'frame-good': 'This is the framing we want — eye level, a sensible amount of headroom.',
      'frame-bad': 'Not this. Flat on the desk, the camera ends up looking up at you.',
      'room-bad': 'Not this either. A window behind you backlights your face, and the shelf is in shot.',
    },
  },
}
