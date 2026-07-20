import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption, TikTokPage } from "@remotion/captions";

// How often the caption page switches (ms). Lower = more word-by-word.
const SWITCH_CAPTIONS_EVERY_MS = 1200;

export type CaptionStyle = {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  textColor: string;
  highlightColor: string;
  /** distance in px from the bottom of the frame */
  bottomOffset: number;
  textShadow: string;
  letterSpacing?: number;
  lineHeight?: number;
};

const CaptionPage: React.FC<{ page: TikTokPage; style: CaptionStyle }> = ({
  page,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000;
  const absoluteTimeMs = page.startMs + currentTimeMs;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: style.bottomOffset,
      }}
    >
      <div
        style={{
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          fontSize: style.fontSize,
          lineHeight: style.lineHeight ?? 1.3,
          letterSpacing: style.letterSpacing ?? 0,
          textAlign: "center",
          whiteSpace: "pre-wrap",
          maxWidth: "85%",
          textShadow: style.textShadow,
        }}
      >
        {page.tokens.map((token) => {
          const isActive =
            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          const hasPassed = token.toMs <= absoluteTimeMs;

          return (
            <span
              key={token.fromMs}
              style={{
                color:
                  isActive || hasPassed ? style.highlightColor : style.textColor,
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Renders `captions` as TikTok-style word-highlighted caption pages.
 * Designed as a transparent overlay — composite on top of the picture
 * (e.g. as a DaVinci Resolve alpha import) rather than embedding video here.
 */
export const CaptionsOverlay: React.FC<{
  captions: Caption[];
  style: CaptionStyle;
}> = ({ captions, style }) => {
  const { fps } = useVideoConfig();

  if (captions.length === 0) {
    return null;
  }

  const { pages } = createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
  });

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          startFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps,
        );
        const durationInFrames = endFrame - startFrame;

        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={index}
            from={Math.round(startFrame)}
            durationInFrames={Math.round(durationInFrames)}
          >
            <CaptionPage page={page} style={style} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
