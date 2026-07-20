import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily: interFontFamily } = loadFont();

const NAVY = "#1E2B3C";
const TEAL = "#32B0C5";

/**
 * Stacked lockup (mark above wordmark), 875x550 native with real alpha —
 * supersedes the 540x76 horizontal asset noted in COMAS_HANDOFF. Rendered at
 * 480px wide (a downscale, so it stays sharp), giving ~300px of logo height,
 * about 28% of frame height. Native width is 875 if you ever want it larger.
 */
const LOGO_WIDTH = 480;

/**
 * Brand end card, structured like the probel one: flat background, client
 * logo centred, tagline beneath. Opaque — this replaces picture rather than
 * overlaying it, so it does NOT need an alpha export.
 */
export const ComasBrandEndCard: React.FC<{
  tagline?: string;
  background?: "white" | "teal" | "navy";
  /** Override for CJK — Inter has no Japanese glyphs. */
  fontFamily?: string;
  /** JP copy sets tighter than Latin at the same size. */
  fontSize?: number;
}> = ({
  tagline = "Customized Language Programs for Real-World Results",
  background = "white",
  fontFamily,
  fontSize = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoIn = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const taglineIn = spring({
    frame,
    fps,
    delay: 10,
    config: { damping: 200 },
    durationInFrames: 18,
  });

  // Gentle fade at the tail so it can butt against black or the next clip.
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const bg =
    background === "teal" ? TEAL : background === "navy" ? NAVY : "#FFFFFF";
  // Logo artwork is dark, so it needs a light ground; invert it on dark cards.
  const invertLogo = background !== "white";
  const taglineColor = background === "white" ? NAVY : "#FFFFFF";

  return (
    <AbsoluteFill style={{ backgroundColor: bg, opacity: fadeOut }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 34,
        }}
      >
        <Img
          src={staticFile("comas_logo_stacked.png")}
          style={{
            width: LOGO_WIDTH,
            opacity: interpolate(logoIn, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(logoIn, [0, 1], [12, 0])}px)`,
            filter: invertLogo ? "brightness(0) invert(1)" : undefined,
          }}
        />
        <div
          style={{
            fontFamily: fontFamily ?? interFontFamily,
            fontWeight: 700,
            fontSize,
            letterSpacing: 0.4,
            color: taglineColor,
            opacity: interpolate(taglineIn, [0, 1], [0, 1]),
            textAlign: "center",
          }}
        >
          {tagline}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
