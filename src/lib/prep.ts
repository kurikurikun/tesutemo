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
 *   scrolled_to_end_at timestamptz,
 *   submitted_at timestamptz,
 *   full_name text,
 *   job_title text,
 *   phone text,
 *   contact_note text,
 *   checks jsonb,
 *   user_agent text,
 *   created_at timestamptz not null default now()
 * );
 * create index prep_acknowledgements_interview_date_idx
 *   on public.prep_acknowledgements (interview_date);
 * alter table public.prep_acknowledgements enable row level security;
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
  scrolled_to_end_at: string | null
  submitted_at: string | null
  full_name: string | null
  job_title: string | null
  phone: string | null
  contact_note: string | null
  checks: Record<string, boolean> | null
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

export const PREP_CHECK_KEYS = [
  'kit_received',
  'light_charged',
  'riverside_installed',
  'no_signin',
  'no_virtual_background',
  'no_earphones',
  'eye_level',
  'quiet_tidy_room',
] as const

export type PrepCheckKey = (typeof PREP_CHECK_KEYS)[number]

/**
 * `critical` の3つが、実際に当日その場で直してもらうことになった項目。
 * ページ上でも赤く出して、他のチェックと同じ重さに見えないようにしている。
 */
export const PREP_CRITICAL_CHECKS: PrepCheckKey[] = [
  'no_virtual_background',
  'no_earphones',
  'eye_level',
]

/** 座ったときにレンズが目の高さにくるスタンドの伸ばし方。「目線の高さで」だけでは伝わらなかった。 */
export const STAND_HEIGHT_CM = '110〜120cm'

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
  kitItems: string[]
  kitNote: string

  ngTitle: string
  ngLede: string
  ng: { title: string; body: string }[]

  heightTitle: string
  heightBody: string
  heightBullets: string[]

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
  formGate: string
  checks: Record<PrepCheckKey, string>
  fullNameLabel: string
  fullNamePlaceholder: string
  jobTitleLabel: string
  jobTitlePlaceholder: string
  phoneLabel: string
  phoneHelp: string
  phonePlaceholder: string
  contactNoteLabel: string
  contactNotePlaceholder: string
  submit: string
  submitting: string
  submitError: string
  requiredNote: string

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
      'インタビューの1週間ほど前に、撮影用のスタンドとライトをお送りします。ご自身で用意していただくものはありません。',
    kitItems: [
      'スマホスタンド（三脚・9段階伸縮／最大140cm）',
      'LEDライト（充電式）',
      'ワイヤレスリモコン ── 当日は使いません。箱に入れたままで結構です。',
    ],
    kitNote:
      '前日までに届いていない場合は、下の連絡先までお知らせください。予備をお持ちします。',

    ngTitle: 'この3つだけは、必ず',
    ngLede: '過去に当日その場で直していただくことになった3点です。ここだけは覚えて帰ってください。',
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
        title: 'スマホは目線の高さに固定する',
        body:
          '机に直接置くと、カメラが下から見上げる画になります。同梱のスタンドを使って、座ったときにレンズが目の高さにくるようにしてください。手で持つのもNGです。',
      },
    ],

    heightTitle: 'スタンドの高さ',
    heightBody: `座った状態で、レンズがちょうど目の高さにくるのが正解です。スタンドは床に立てて、${STAND_HEIGHT_CM} ほどまで伸ばしてください（いっぱいまで伸ばすと立ったときの高さになります）。`,
    heightBullets: [
      `伸ばす目安は ${STAND_HEIGHT_CM}。座ってレンズと目が同じ高さになれば正解です`,
      '三脚の脚が広がるので、足元に50cmほどの余裕がある場所に立ててください',
      'ライトは顔の正面、少し上から当たるように。後ろから当てると逆光になります',
      '前日にライトを充電してください。充電式なので、当日に切れると使えません',
      'スマホがスタンドに問題なく取り付けられるか、当日より前に一度お試しください',
    ],

    roomTitle: '撮影する場所',
    roomBullets: [
      'できるだけ静かな場所（空調やドアの開閉音も入ります）',
      '外光や天井の光で、顔に適度な光がはいる場所',
      '背景はできるだけスッキリと。写り込むものは事前に片付けてください',
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

    formTitle: 'ご確認とご連絡先',
    formLede:
      'ここまでの内容をご確認のうえ、チェックを入れて送信してください。当日の連絡先もあわせてお願いします。',
    formGate: '上の内容を最後までご確認ください',
    checks: {
      kit_received: 'スタンドとライトが届きました',
      light_charged: '前日までにライトを充電します',
      riverside_installed: 'Riverside アプリをインストールしました',
      no_signin: '「Continue with…」でサインインしないことを理解しました',
      no_virtual_background: 'バーチャル背景・フィルターはオフにします',
      no_earphones: 'イヤホン（有線・無線とも）は使いません',
      eye_level: `スマホはスタンドで目線の高さ（${STAND_HEIGHT_CM}）に固定します`,
      quiet_tidy_room: '静かで、背景がすっきりした場所を確保します',
    },
    fullNameLabel: 'お名前（フルネーム）',
    fullNamePlaceholder: '山田 太郎',
    jobTitleLabel: '役職・肩書き',
    jobTitlePlaceholder: '営業部 マネージャー',
    phoneLabel: '当日つながる電話番号',
    phoneHelp:
      '撮影にはスマホを使うため、そのスマホは通話中にお使いいただけません。別の電話番号か、当日近くにいらっしゃる方の番号をご記入ください。',
    phonePlaceholder: '090-1234-5678',
    contactNoteLabel: '連絡方法の補足（任意）',
    contactNotePlaceholder: '例：LINEのほうが早いです／当日は総務の田中が同席します',
    submit: '確認しました・送信する',
    submitting: '送信中…',
    submitError: '送信できませんでした。通信環境をご確認のうえ、もう一度お試しください。',
    requiredNote: 'すべてのチェックとご連絡先の入力をお願いします。',

    doneTitle: 'ありがとうございました。当日お会いしましょう。',
    doneBody:
      'ご確認を受け付けました。当日までに読み返したいときは、このページをそのまま開いてください。ご不明な点があれば、下の連絡先までお気軽にどうぞ。',

    helpTitle: '困ったときは',
    helpBody: '当日でも構いません。つながらないときはお電話ください。',

    photoCaptions: {
      setup: 'スタンドとライトを立てた状態。座ってレンズが目の高さにきています。',
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
      'About a week before your interview, a stand and a light will arrive by post. There’s nothing you need to buy or borrow.',
    kitItems: [
      'Phone stand (tripod, 9 height settings, up to 140cm)',
      'LED light (rechargeable)',
      'Wireless remote — you won’t need it. Leave it in the box.',
    ],
    kitNote:
      'If it hasn’t arrived the day before, let us know at the number below and we’ll bring a spare.',

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
          'Flat on a desk, the camera looks up your nose. Use the stand we send and set it so the lens meets your eyes while you’re sitting down. Holding the phone doesn’t work either.',
      },
    ],

    heightTitle: 'Setting the stand',
    heightBody: `You want the lens level with your eyes while you’re seated. Stand it on the floor and extend it to roughly ${STAND_HEIGHT_CM} — fully extended is standing height, which is too tall.`,
    heightBullets: [
      `Aim for about ${STAND_HEIGHT_CM}. If the lens meets your eyes when you sit, it’s right`,
      'The tripod legs spread out, so pick a spot with around 50cm of clear floor',
      'Put the light in front of you and slightly above — behind you it just backlights your face',
      'Charge the light the night before. It runs on a battery, and a flat one is no light at all',
      'Try mounting your phone in the stand once before the day, so nothing is a surprise',
    ],

    roomTitle: 'Where to sit',
    roomBullets: [
      'Somewhere quiet — air conditioning and doors both make it onto the recording',
      'Somewhere daylight or a ceiling light reaches your face',
      'A tidy background. Anything in shot is worth moving beforehand',
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

    formTitle: 'Confirm and leave us a number',
    formLede:
      'Once you’ve read the above, tick everything through and send it over, along with a number we can reach you on.',
    formGate: 'Please read to the end of the page first',
    checks: {
      kit_received: 'The stand and light have arrived',
      light_charged: 'I’ll charge the light the night before',
      riverside_installed: 'I’ve installed the Riverside app',
      no_signin: 'I understand not to sign in with “Continue with…”',
      no_virtual_background: 'I’ll turn off virtual backgrounds and filters',
      no_earphones: 'I won’t use earphones, wired or wireless',
      eye_level: `I’ll put the phone on the stand at eye level (about ${STAND_HEIGHT_CM})`,
      quiet_tidy_room: 'I’ll find a quiet spot with a tidy background',
    },
    fullNameLabel: 'Full name',
    fullNamePlaceholder: 'Taro Yamada',
    jobTitleLabel: 'Job title',
    jobTitlePlaceholder: 'Sales Manager',
    phoneLabel: 'A number we can reach you on',
    phoneHelp:
      'You’ll be filming on your phone, so that phone won’t be free to take a call. Give us a different number, or one for someone who’ll be nearby.',
    phonePlaceholder: '090-1234-5678',
    contactNoteLabel: 'Anything else about reaching you (optional)',
    contactNotePlaceholder: 'e.g. LINE is faster / Tanaka from admin will be with me',
    submit: 'Confirm and send',
    submitting: 'Sending…',
    submitError: 'That didn’t send. Check your connection and try once more.',
    requiredNote: 'Please tick everything and fill in your contact details.',

    doneTitle: 'Thanks — see you on the day.',
    doneBody:
      'We’ve got your confirmation. This page stays open if you want to look anything up again. Anything unclear, just get in touch below.',

    helpTitle: 'If anything goes wrong',
    helpBody: 'Even on the day. If you can’t get through, call.',

    photoCaptions: {
      setup: 'The stand and light set up. Seated, the lens is level with the eyes.',
      'frame-good': 'This is the framing we want — eye level, a sensible amount of headroom.',
      'frame-bad': 'Not this. Flat on the desk, the camera ends up looking up at you.',
      'room-bad': 'Not this either. A window behind you backlights your face, and the shelf is in shot.',
    },
  },
}
