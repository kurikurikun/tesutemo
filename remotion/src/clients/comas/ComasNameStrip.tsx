import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily: interFontFamily } = loadFont();

/** Same panel geometry as ComasStoryCard — picture 0–849, panel 849–1920. */
const PANEL_LEFT_PCT = (849 / 1920) * 100;

/**
 * Speaker name/role strip for the right-hand panel, sitting below the summary
 * cards (~82% of frame height, matching the probel reference).
 *
 * Transparent, and intended to run the FULL length of the timeline as a single
 * clip — that way it stays put through the gaps between story cards instead of
 * blinking out with them.
 */
export const ComasNameStrip: React.FC<{
  name?: string;
  role?: string;
  fontSize?: number;
  /** Override for CJK — Inter has no Japanese glyphs. */
  fontFamily?: string;
}> = ({
  name = "Dr. Ariel Thorpe",
  role = "Chiropractor",
  fontSize = 28,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const appear = spring({
    frame,
    fps,
    delay: 20,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          position: "absolute",
          left: `${PANEL_LEFT_PCT}%`,
          width: `${100 - PANEL_LEFT_PCT}%`,
          top: "82%",
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 28,
          padding: "0 60px",
          boxSizing: "border-box",
          opacity: interpolate(appear, [0, 1], [0, 1]) * fadeOut,
          transform: `translateY(${interpolate(appear, [0, 1], [10, 0])}px)`,
          fontFamily: fontFamily ?? interFontFamily,
          color: "rgba(255,255,255,0.92)",
          letterSpacing: 0.3,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontWeight: 600, fontSize }}>{name}</span>
        <span style={{ fontWeight: 400, fontSize: fontSize - 2 }}>{role}</span>
      </div>
    </AbsoluteFill>
  );
};

/** Preview variant with the teal panel behind, for checking in Studio. */
export const ComasNameStripPreview: React.FC<
  React.ComponentProps<typeof ComasNameStrip>
> = (props) => (
  <AbsoluteFill style={{ backgroundColor: "#2E2E2E" }}>
    <AbsoluteFill
      style={{
        left: `${PANEL_LEFT_PCT}%`,
        width: `${100 - PANEL_LEFT_PCT}%`,
        backgroundColor: "#38B6C8",
      }}
    />
    <ComasNameStrip {...props} />
  </AbsoluteFill>
);
