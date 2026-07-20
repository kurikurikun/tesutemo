import "./index.css";
import { Fragment } from "react";
import { Composition, CalculateMetadataFunction } from "remotion";
import type { Caption } from "@remotion/captions";
import { loadFont as loadNotoSansJP } from "@remotion/google-fonts/NotoSansJP";
import { ComasShort, ComasShortPreview } from "./clients/comas/ComasShort";
import { ComasEndCard, EndCardLine } from "./clients/comas/ComasEndCard";
import {
  ComasStoryCard,
  ComasStoryCardPreview,
} from "./clients/comas/ComasStoryCard";
import { ComasBrandEndCard } from "./clients/comas/ComasBrandEndCard";
import {
  ComasNameStrip,
  ComasNameStripPreview,
} from "./clients/comas/ComasNameStrip";

// Japanese family for the terajima (Tejima) end cards. Inter has no CJK glyphs.
const { fontFamily: notoSansJP } = loadNotoSansJP();

import hookApsGarbage from "./clients/comas/captions/hook_apps_garbage.json";
import methodLetsStruggle from "./clients/comas/captions/method_lets_struggle.json";
import resultsRecommend from "./clients/comas/captions/results_recommend.json";
import closerMtfuji from "./clients/comas/captions/closer_mtfuji.json";

// All current Comas shorts are vertical 1080x1920 @ 24fps (DaVinci timelines).
const FPS = 24;
const WIDTH = 1080;
const HEIGHT = 1920;

// The Ariel long-forms (A_story / B_method) are horizontal.
const LONGFORM_WIDTH = 1920;
const LONGFORM_HEIGHT = 1080;

// Terajima yoko name strips — identical treatment to the Ariel strips
// (white, name beside role, 34px at 82% height). Only the family differs,
// because Inter carries no CJK glyphs.
const TERAJIMA_STRIP_PROPS = {
  name: "手島拓也",
  role: "GAOGAO株式会社　共同創業者兼グループCEO",
  fontSize: 34,
  fontFamily: notoSansJP,
};

const TERAJIMA_NAME_STRIPS = [
  // Frame counts match the Resolve timelines exactly.
  { id: "TerajimaAStoryNameStrip", durationInFrames: 4946 },
  { id: "TerajimaBTeamNameStrip", durationInFrames: 4883 },
];

/**
 * Terajima right-panel summary cards. Same treatment as the Ariel cards —
 * two lines, one teal phrase, tiling the whole picture — but in Japanese, so
 * they need Noto Sans JP and a smaller size (CJK sets wider than Latin at the
 * same px). `start` values are the section boundaries on the Resolve
 * timelines; card 1 spans hook + self-intro, as Ariel's title card does.
 */
const TERAJIMA_CARD_FONT = { fontFamily: notoSansJP, fontSize: 46 };

const TERAJIMA_A_CARDS: {
  id: string;
  start: number;
  durationInFrames: number;
  lines: EndCardLine[];
}[] = [
  {
    id: "TerajimaAStory1Title",
    start: 0,
    durationInFrames: 770,
    lines: [
      [{ text: "私が英語で" }],
      [{ text: "商談を成約", teal: true }, { text: "するまで" }],
    ],
  },
  {
    id: "TerajimaAStory2NoOne",
    start: 770,
    durationInFrames: 1082,
    lines: [
      [{ text: "業務で英語は使う。でも" }],
      [{ text: "直してくれる人", teal: true }, { text: "はいない" }],
    ],
  },
  {
    id: "TerajimaAStory3Tailored",
    start: 1852,
    durationInFrames: 592,
    lines: [
      [{ text: "教科書ではなく" }],
      [{ text: "私の業務", teal: true }, { text: "に合わせたレッスン" }],
    ],
  },
  {
    id: "TerajimaAStory4Cadence",
    start: 2444,
    durationInFrames: 494,
    lines: [
      [{ text: "週1回45分", teal: true }],
      [{ text: "曜日と時間を決めて続ける" }],
    ],
  },
  {
    id: "TerajimaAStory5Updates",
    start: 2938,
    durationInFrames: 390,
    lines: [
      [{ text: "状況に合わせて" }],
      [{ text: "カリキュラムが変わる", teal: true }],
    ],
  },
  {
    id: "TerajimaAStory6Result",
    start: 3328,
    durationInFrames: 538,
    lines: [
      [{ text: "2年で、英語が" }],
      [{ text: "商談で使える", teal: true }, { text: "レベルに" }],
    ],
  },
  {
    id: "TerajimaAStory7Recommend",
    start: 3866,
    durationInFrames: 1080,
    lines: [
      [{ text: "グローバルに挑む経営者に" }],
      [{ text: "自信", teal: true }, { text: "をつけるタイミング" }],
    ],
  },
];

const TERAJIMA_B_CARDS: {
  id: string;
  start: number;
  durationInFrames: number;
  lines: EndCardLine[];
}[] = [
  {
    id: "TerajimaBTeam1Title",
    start: 0,
    durationInFrames: 1058,
    lines: [
      [{ text: "開発チームの英語を" }],
      [{ text: "会社の基準", teal: true }, { text: "にするまで" }],
    ],
  },
  {
    id: "TerajimaBTeam2Goal",
    start: 1058,
    durationInFrames: 1105,
    lines: [
      [{ text: "ゴールは" }],
      [{ text: "英語で登壇", teal: true }, { text: "すること" }],
    ],
  },
  {
    id: "TerajimaBTeam3CEFR",
    start: 2163,
    durationInFrames: 1334,
    lines: [
      [{ text: "英語による" }],
      [{ text: "情報格差をなくす", teal: true }],
    ],
  },
  {
    id: "TerajimaBTeam4Rollout",
    start: 3497,
    durationInFrames: 707,
    lines: [
      [{ text: "まずはPMから" }],
      [{ text: "次のメンバー", teal: true }, { text: "へ広げていく" }],
    ],
  },
  {
    id: "TerajimaBTeam5OptIn",
    start: 4204,
    durationInFrames: 284,
    lines: [
      [{ text: "やりたい人", teal: true }, { text: "にだけ" }],
      [{ text: "オファーした" }],
    ],
  },
  {
    id: "TerajimaBTeam6Value",
    start: 4488,
    durationInFrames: 395,
    lines: [
      [{ text: "講師が" }, { text: "業務を理解", teal: true }, { text: "して" }],
      [{ text: "次のレッスンを考える" }],
    ],
  },
];

const COMAS_SHORTS = [
  { id: "ComasHookAppsGarbage", captions: hookApsGarbage, durationInFrames: 1424 },
  { id: "ComasMethodLetsStruggle", captions: methodLetsStruggle, durationInFrames: 2493 },
  { id: "ComasResultsRecommend", captions: resultsRecommend, durationInFrames: 1763 },
  { id: "ComasCloserMtfuji", captions: closerMtfuji, durationInFrames: 507 },
] satisfies { id: string; captions: Caption[]; durationInFrames: number }[];

// Punchy end-card summaries — one per Ariel short. `teal: true` marks a
// segment rendered in Comas teal; the rest is white on almost-black.
const END_CARD_FRAMES = 84; // ~3.5s at 24fps
const END_CARDS: { id: string; lines: EndCardLine[] }[] = [
  {
    id: "ComasEndHook",
    lines: [
      [{ text: "Comas", teal: true }, { text: " gave me the language" }],
      [{ text: "and the culture," }],
      [{ text: "for " }, { text: "my life", teal: true }],
      [{ text: "and " }, { text: "my business.", teal: true }],
    ],
  },
  {
    id: "ComasEndMethod",
    lines: [
      [{ text: "I need to " }, { text: "struggle", teal: true }],
      [{ text: "to really learn." }],
      [{ text: "Comas", teal: true }, { text: " helps me" }],
      [{ text: "until it " }, { text: "sticks.", teal: true }],
    ],
  },
  {
    id: "ComasEndResults",
    lines: [
      [{ text: "My clients notice." }],
      [{ text: "I'm speaking faster." }],
      [{ text: "Comas", teal: true }, { text: " is prepared" }],
      [{ text: "for " }, { text: "any business.", teal: true }],
    ],
  },
  {
    id: "ComasEndMtfuji",
    lines: [
      [{ text: "Comas", teal: true }, { text: " gives me that rush," }],
      [{ text: "the one where Japan" }],
      [{ text: "finally clicks.", teal: true }],
    ],
  },
];

// Japanese end cards for the terajima shorts (Tejima's testimonial, 商談/business-English arc).
const TERAJIMA_END_CARDS: { id: string; lines: EndCardLine[] }[] = [
  {
    // seiyaku (成約) — Comas's simulation practice won him a real deal
    id: "TerajimaEndSeiyaku",
    lines: [
      [{ text: "コマス", teal: true }, { text: "の英語での" }],
      [{ text: "シミュレーションが、" }],
      [{ text: "商談で" }, { text: "活きた", teal: true }, { text: "。" }],
    ],
  },
  {
    // kachi (価値) — not generic; built around his situation
    id: "TerajimaEndKachi",
    lines: [
      [{ text: "型通りじゃない。" }],
      [{ text: "コマス", teal: true }, { text: "は、私に合わせる。" }],
      [{ text: "だから、" }, { text: "実践", teal: true }, { text: "で効く。" }],
    ],
  },
  {
    // B2 → C1 — measurable level jump, works in real negotiations
    id: "TerajimaEndB2C1",
    lines: [
      [{ text: "コマス", teal: true }, { text: "で2年。" }],
      [{ text: "実際に、商談に" }],
      [{ text: "生きてくる", teal: true }, { text: "英語力。" }],
    ],
  },
  {
    // tsuzukekata (続け方) — sustainable routine sharpened how he conveys his thinking
    id: "TerajimaEndTsuzukekata",
    lines: [
      [{ text: "週1回、45分。" }],
      [{ text: "自分の考えを、" }, { text: "整理して", teal: true }],
      [{ text: "伝える力", teal: true }, { text: "が、伸びた。" }],
    ],
  },
];

const calculateMetadata: CalculateMetadataFunction<{ captions: Caption[] }> =
  async () => {
    return {
      defaultCodec: "prores",
      defaultVideoImageFormat: "png",
      defaultPixelFormat: "yuva444p10le",
      defaultProResProfile: "4444",
    };
  };

// Same alpha settings, for the story-card compositions (different prop shape).
const alphaMetadata: CalculateMetadataFunction<{
  lines: EndCardLine[];
}> = async () => {
  return {
    defaultCodec: "prores",
    defaultVideoImageFormat: "png",
    defaultPixelFormat: "yuva444p10le",
    defaultProResProfile: "4444",
  };
};

/**
 * Right-panel summary cards for 26_7_16_Ariel_B_method (1920x1080, 24fps).
 * Boundaries snapped to the picture cuts on V2, so cards change on the edit.
 */
const B_METHOD_CARDS: {
  id: string;
  start: number;
  durationInFrames: number;
  lines: EndCardLine[];
}[] = [
  {
    id: "ArielMethod1Title",
    start: 0,
    durationInFrames: 467,
    lines: [
      [{ text: "How I got lessons" }],
      [{ text: "built around " }, { text: "my business", teal: true }],
    ],
  },
  {
    id: "ArielMethod2Homework",
    start: 467,
    durationInFrames: 811,
    lines: [
      [{ text: "She'd researched my work" }],
      [{ text: "before we ever met", teal: true }],
    ],
  },
  {
    id: "ArielMethod3Struggle",
    start: 1278,
    durationInFrames: 761,
    lines: [
      [{ text: "Being handed the word" }],
      [{ text: "doesn't teach you", teal: true }, { text: " the word" }],
    ],
  },
  {
    id: "ArielMethod4Encourage",
    start: 2039,
    durationInFrames: 430,
    lines: [
      [{ text: "Encouraging on the days" }],
      [{ text: "I think I'm " }, { text: "going nowhere", teal: true }],
    ],
  },
  {
    id: "ArielMethod5Schedule",
    start: 2469,
    durationInFrames: 465,
    lines: [
      [{ text: "Twice a week", teal: true }, { text: ", rescheduled" }],
      [{ text: "around a clinic that overruns" }],
    ],
  },
  {
    id: "ArielMethod6Accountability",
    start: 2934,
    durationInFrames: 571,
    lines: [
      [{ text: "I need to pay someone" }],
      [{ text: "to keep me " }, { text: "on track", teal: true }],
    ],
  },
  {
    id: "ArielMethod7Retested",
    start: 3505,
    durationInFrames: 415,
    lines: [
      [{ text: "Retested, so I can see" }],
      [{ text: "I'm actually improving", teal: true }],
    ],
  },
  {
    id: "ArielMethod8AnyBusiness",
    start: 3920,
    durationInFrames: 398,
    lines: [
      [{ text: "Prepared for my clinic," }],
      [{ text: "prepared for " }, { text: "any business", teal: true }],
    ],
  },
];

/**
 * Right-panel summary cards for 26_7_16_Ariel_A_story (1920x1080, 24fps).
 * durationInFrames matches the card's in/out on the Resolve timeline, so each
 * export drops straight onto the track at the listed start frame.
 */
const A_STORY_CARDS: {
  id: string;
  start: number;
  durationInFrames: number;
  lines: EndCardLine[];
}[] = [
  {
    id: "ArielStory1Title",
    start: 0,
    durationInFrames: 789,
    lines: [
      [{ text: "How I'm climbing" }],
      [{ text: "my next " }, { text: "Mount Fuji", teal: true }],
    ],
  },
  {
    id: "ArielStory2School",
    start: 792,
    durationInFrames: 526,
    lines: [
      [{ text: "Language school was intensive" }],
      [{ text: "and " }, { text: "torturous", teal: true }],
    ],
  },
  {
    id: "ArielStory3Trial",
    start: 1328,
    durationInFrames: 512,
    lines: [
      [{ text: "A generous " }, { text: "free trial", teal: true }],
      [{ text: "made it easy to start" }],
    ],
  },
  {
    id: "ArielStory4Tailored",
    start: 1840,
    durationInFrames: 507,
    lines: [
      [{ text: "Lessons built around " }, { text: "my work", teal: true }, { text: "," }],
      [{ text: "not a textbook" }],
    ],
  },
  {
    id: "ArielStory5Progress",
    start: 2347,
    durationInFrames: 742,
    lines: [
      [{ text: "30 minutes, twice a week," }],
      [{ text: "and " }, { text: "my clients noticed", teal: true }],
    ],
  },
  {
    id: "ArielStory6Payoff",
    start: 3114,
    durationInFrames: 709,
    lines: [
      [{ text: "The right lessons made" }],
      [{ text: "fluency", teal: true }, { text: " feel possible" }],
    ],
  },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {COMAS_SHORTS.map((short) => (
        <Fragment key={short.id}>
          {/* Preview: dark background, for reviewing the caption design in Studio */}
          <Composition
            id={`${short.id}Preview`}
            component={ComasShortPreview}
            durationInFrames={short.durationInFrames}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
            defaultProps={{ captions: short.captions }}
          />
          {/* Alpha: transparent background, for compositing over the picture in Resolve */}
          <Composition
            id={`${short.id}Alpha`}
            component={ComasShort}
            durationInFrames={short.durationInFrames}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
            defaultProps={{ captions: short.captions }}
            calculateMetadata={calculateMetadata}
          />
        </Fragment>
      ))}

      {/* Ariel end-card summaries (English) — opaque cards for the ends of the shorts */}
      {END_CARDS.map((card) => (
        <Composition
          key={card.id}
          id={card.id}
          component={ComasEndCard}
          durationInFrames={END_CARD_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{ lines: card.lines }}
        />
      ))}

      {/* Terajima end-card summaries (Japanese, Noto Sans JP) */}
      {TERAJIMA_END_CARDS.map((card) => (
        <Composition
          key={card.id}
          id={card.id}
          component={ComasEndCard}
          durationInFrames={END_CARD_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{ lines: card.lines, fontFamily: notoSansJP, fontSize: 76 }}
        />
      ))}

      {/* Speaker name/role strip — one clip spanning the whole A_story
          timeline (3823 frames), so it holds through the gaps between cards. */}
      <Composition
        id="ArielNameStripPreview"
        component={ComasNameStripPreview}
        durationInFrames={3823}
        fps={FPS}
        width={LONGFORM_WIDTH}
        height={LONGFORM_HEIGHT}
        defaultProps={{
          name: "Dr. Ariel Thorpe, DC",
          role: "Electra Chiropractic, Tokyo",
          fontSize: 34,
        }}
      />
      <Composition
        id="ArielNameStripAlpha"
        component={ComasNameStrip}
        durationInFrames={3823}
        fps={FPS}
        width={LONGFORM_WIDTH}
        height={LONGFORM_HEIGHT}
        defaultProps={{
          name: "Dr. Ariel Thorpe, DC",
          role: "Electra Chiropractic, Tokyo",
          fontSize: 34,
        }}
        calculateMetadata={async () => ({
          defaultCodec: "prores" as const,
          defaultVideoImageFormat: "png" as const,
          defaultPixelFormat: "yuva444p10le" as const,
          defaultProResProfile: "4444" as const,
        })}
      />

      {/* Comas brand end card — structured like the probel one (logo + tagline
          on a flat ground). Opaque: replaces picture, no alpha needed.
          Three background variants to choose from. */}
      {(["white", "teal", "navy"] as const).map((bg) => (
        <Composition
          key={bg}
          id={`ComasBrandEnd${bg[0].toUpperCase()}${bg.slice(1)}`}
          component={ComasBrandEndCard}
          durationInFrames={120}
          fps={FPS}
          width={LONGFORM_WIDTH}
          height={LONGFORM_HEIGHT}
          defaultProps={{ background: bg }}
        />
      ))}

      {/* Japanese brand end card for the terajima yoko. Same teal card as the
          Ariel edits use, with the client's JP tagline and Noto Sans JP —
          Inter renders CJK as blank boxes. 110f matches the ComasEndCard_teal
          clip already cut onto the terajima timelines. */}
      <Composition
        id="ComasBrandEndTealJP"
        component={ComasBrandEndCard}
        durationInFrames={110}
        fps={FPS}
        width={LONGFORM_WIDTH}
        height={LONGFORM_HEIGHT}
        defaultProps={{
          background: "teal" as const,
          tagline: "企業向け語学研修のトータルソリューション",
          fontFamily: notoSansJP,
          fontSize: 34,
        }}
      />

      {/* Ariel B_method right-panel summary cards — 1920x1080 horizontal. */}
      {B_METHOD_CARDS.map((card) => (
        <Fragment key={card.id}>
          <Composition
            id={`${card.id}Preview`}
            component={ComasStoryCardPreview}
            durationInFrames={card.durationInFrames}
            fps={FPS}
            width={LONGFORM_WIDTH}
            height={LONGFORM_HEIGHT}
            defaultProps={{ lines: card.lines }}
          />
          <Composition
            id={`${card.id}Alpha`}
            component={ComasStoryCard}
            durationInFrames={card.durationInFrames}
            fps={FPS}
            width={LONGFORM_WIDTH}
            height={LONGFORM_HEIGHT}
            defaultProps={{ lines: card.lines }}
            calculateMetadata={alphaMetadata}
          />
        </Fragment>
      ))}

      {/* Name strip for B_method — picture runs to 4318. */}
      <Composition
        id="ArielMethodNameStripAlpha"
        component={ComasNameStrip}
        durationInFrames={4318}
        fps={FPS}
        width={LONGFORM_WIDTH}
        height={LONGFORM_HEIGHT}
        defaultProps={{
          name: "Dr. Ariel Thorpe, DC",
          role: "Electra Chiropractic, Tokyo",
          fontSize: 34,
        }}
        calculateMetadata={async () => ({
          defaultCodec: "prores" as const,
          defaultVideoImageFormat: "png" as const,
          defaultPixelFormat: "yuva444p10le" as const,
          defaultProResProfile: "4444" as const,
        })}
      />

      {/* Ariel A_story right-panel summary cards — 1920x1080 horizontal.
          *Preview = teal panel behind, for checking contrast in Studio.
          *Alpha   = transparent, ProRes 4444, for compositing in Resolve. */}
      {A_STORY_CARDS.map((card) => (
        <Fragment key={card.id}>
          <Composition
            id={`${card.id}Preview`}
            component={ComasStoryCardPreview}
            durationInFrames={card.durationInFrames}
            fps={FPS}
            width={LONGFORM_WIDTH}
            height={LONGFORM_HEIGHT}
            defaultProps={{ lines: card.lines }}
          />
          <Composition
            id={`${card.id}Alpha`}
            component={ComasStoryCard}
            durationInFrames={card.durationInFrames}
            fps={FPS}
            width={LONGFORM_WIDTH}
            height={LONGFORM_HEIGHT}
            defaultProps={{ lines: card.lines }}
            calculateMetadata={alphaMetadata}
          />
        </Fragment>
      ))}

      {/* Terajima right-panel summary cards, both videos. */}
      {[...TERAJIMA_A_CARDS, ...TERAJIMA_B_CARDS].map((card) => (
        <Fragment key={card.id}>
          <Composition
            id={`${card.id}Preview`}
            component={ComasStoryCardPreview}
            durationInFrames={card.durationInFrames}
            fps={FPS}
            width={LONGFORM_WIDTH}
            height={LONGFORM_HEIGHT}
            defaultProps={{ lines: card.lines, ...TERAJIMA_CARD_FONT }}
          />
          <Composition
            id={`${card.id}Alpha`}
            component={ComasStoryCard}
            durationInFrames={card.durationInFrames}
            fps={FPS}
            width={LONGFORM_WIDTH}
            height={LONGFORM_HEIGHT}
            defaultProps={{ lines: card.lines, ...TERAJIMA_CARD_FONT }}
            calculateMetadata={alphaMetadata}
          />
        </Fragment>
      ))}

      {/* Terajima yoko name strips — same right-hand panel layout as Ariel, so
          one clip spanning each whole timeline. Japanese needs Noto Sans JP;
          Inter has no CJK glyphs. */}
      {TERAJIMA_NAME_STRIPS.map((s) => (
        <Fragment key={s.id}>
          <Composition
            id={`${s.id}Preview`}
            component={ComasNameStripPreview}
            durationInFrames={s.durationInFrames}
            fps={FPS}
            width={LONGFORM_WIDTH}
            height={LONGFORM_HEIGHT}
            defaultProps={TERAJIMA_STRIP_PROPS}
          />
          <Composition
            id={`${s.id}Alpha`}
            component={ComasNameStrip}
            durationInFrames={s.durationInFrames}
            fps={FPS}
            width={LONGFORM_WIDTH}
            height={LONGFORM_HEIGHT}
            defaultProps={TERAJIMA_STRIP_PROPS}
            calculateMetadata={alphaMetadata}
          />
        </Fragment>
      ))}
    </>
  );
};
