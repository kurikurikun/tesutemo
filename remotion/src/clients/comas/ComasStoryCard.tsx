import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import type { EndCardLine } from "./ComasEndCard";

const { fontFamily: interFontFamily } = loadFont();

/**
 * These cards sit on the flat teal panel, NOT the near-black of the end cards,
 * so the end-card palette inverts: teal-on-teal is invisible. Emphasis is
 * Comas navy; the accent bar is white at partial opacity.
 */
const NAVY = "#12303A"; // deepened Comas navy — high contrast on the teal panel

/**
 * Geometry of the right-hand panel in the 1920x1080 Ariel long-form layout.
 * The picture occupies x 0–849; the flat teal panel runs x 849–1920. Measured
 * off the Resolve viewer, so re-check if the framing changes.
 */
const PANEL_LEFT_PCT = (849 / 1920) * 100;

const AccentBar: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
    durationInFrames: 14,
  });
  return (
    <div
      style={{
        width: interpolate(grow, [0, 1], [0, 96]),
        height: 7,
        borderRadius: 4,
        backgroundColor: "rgba(255,255,255,0.85)",
        marginBottom: 40,
      }}
    />
  );
};

const Line: React.FC<{
  line: EndCardLine;
  index: number;
  fontFamily: string;
  fontSize: number;
}> = ({ line, index, fontFamily, fontSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame,
    fps,
    delay: 8 + index * 6,
    config: { damping: 22, stiffness: 220, mass: 0.7 },
  });
  return (
    <div
      style={{
        transform: `translateY(${interpolate(s, [0, 1], [28, 0])}px)`,
        opacity: interpolate(s, [0, 1], [0, 1]),
        fontFamily,
        fontWeight: 800,
        fontSize,
        lineHeight: 1.32,
        letterSpacing: -0.5,
        color: "#FFFFFF",
        textAlign: "center",
      }}
    >
      {line.map((seg, i) => (
        <span key={i} style={{ color: seg.teal ? NAVY : "#FFFFFF" }}>
          {seg.text}
        </span>
      ))}
    </div>
  );
};

/**
 * Summary card for the right-hand panel of the Ariel long-forms.
 *
 * Transparent background — render as an alpha export (ProRes 4444) and drop
 * on a track above the picture in Resolve at Zoom 1.0 / Pos 0, same pattern
 * as the caption overlays.
 *
 * Holds for the whole composition duration, with a spring-in at the head and
 * a short fade at the tail so consecutive cards cross cleanly.
 */
export const ComasStoryCard: React.FC<{
  lines: EndCardLine[];
  fontFamily?: string;
  fontSize?: number;
  showAccentBar?: boolean;
}> = ({
  lines,
  fontFamily = interFontFamily,
  fontSize = 54,
  showAccentBar = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade the whole card out over the last 12 frames (0.5s at 24fps).
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent", opacity: fadeOut }}>
      <AbsoluteFill
        style={{
          // AbsoluteFill forces width:100% — must set width explicitly too,
          // or the box starts at the panel edge and runs off the frame.
          left: `${PANEL_LEFT_PCT}%`,
          width: `${100 - PANEL_LEFT_PCT}%`,
          justifyContent: "center",
          alignItems: "center",
          padding: "0 80px",
          boxSizing: "border-box",
        }}
      >
        {showAccentBar ? <AccentBar delay={4} /> : null}
        {lines.map((line, i) => (
          <Line
            key={i}
            line={line}
            index={i}
            fontFamily={fontFamily}
            fontSize={fontSize}
          />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Preview variant: teal panel behind the text, to check contrast in Studio. */
export const ComasStoryCardPreview: React.FC<{
  lines: EndCardLine[];
  fontFamily?: string;
  fontSize?: number;
  showAccentBar?: boolean;
}> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#2E2E2E" }}>
      <AbsoluteFill
        style={{
          left: `${PANEL_LEFT_PCT}%`,
          width: `${100 - PANEL_LEFT_PCT}%`,
          backgroundColor: "#38B6C8",
        }}
      />
      <ComasStoryCard {...props} />
    </AbsoluteFill>
  );
};
