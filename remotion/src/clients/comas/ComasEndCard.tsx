import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily: interFontFamily } = loadFont();

// ── Comas brand palette ──
const TEAL = "#32B0C5"; // primary brand teal (from comasjapan.com CTAs)
const TEAL_BRIGHT = "#4FCBDF"; // lighter teal (hero headline) — for gradient/glow
const NEAR_BLACK = "#0E141B"; // almost-black base, faint navy tint to match brand
const NEAR_BLACK_2 = "#0A0E13"; // slightly darker for the vertical gradient

export type EndCardSegment = { text: string; teal?: boolean };
export type EndCardLine = EndCardSegment[];

const AccentBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 14 });
  const width = interpolate(grow, [0, 1], [0, 120]);
  return (
    <div
      style={{
        width,
        height: 8,
        borderRadius: 4,
        background: `linear-gradient(90deg, ${TEAL} 0%, ${TEAL_BRIGHT} 100%)`,
        marginBottom: 56,
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
  const delay = 8 + index * 6;
  const s = spring({ frame, fps, delay, config: { damping: 22, stiffness: 220, mass: 0.7 } });
  const translateY = interpolate(s, [0, 1], [34, 0]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        fontFamily,
        fontWeight: 800,
        fontSize,
        lineHeight: 1.3,
        letterSpacing: -0.5,
        color: "#FFFFFF",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      {line.map((seg, i) => (
        <span key={i} style={{ color: seg.teal ? TEAL_BRIGHT : "#FFFFFF" }}>
          {seg.text}
        </span>
      ))}
    </div>
  );
};

const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, delay: 24, config: { damping: 200 }, durationInFrames: 18 });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 150,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: interpolate(s, [0, 1], [0, 1]),
        // COMAS wordmark is Latin — always Inter, regardless of the body font.
        fontFamily: interFontFamily,
        fontWeight: 800,
        fontSize: 34,
        letterSpacing: 14,
        color: TEAL,
        paddingLeft: 14, // optical centering for the letter-spacing
      }}
    >
      COMAS
    </div>
  );
};

/**
 * Punchy end card. `fontFamily` defaults to Inter (English cards); pass a
 * Japanese family (e.g. Noto Sans JP) for the terajima set. `fontSize`
 * defaults to 64.
 */
export const ComasEndCard: React.FC<{
  lines: EndCardLine[];
  fontFamily?: string;
  fontSize?: number;
}> = ({ lines, fontFamily = interFontFamily, fontSize = 64 }) => {
  return (
    <AbsoluteFill
      style={{
        // Solid opaque base + gradient on top: guarantees a fully opaque frame
        // even when rendered to an alpha codec (ProRes 4444).
        backgroundColor: NEAR_BLACK,
        backgroundImage: `linear-gradient(180deg, ${NEAR_BLACK} 0%, ${NEAR_BLACK_2} 100%)`,
      }}
    >
      {/* soft teal glow behind the text for depth / brand colour */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(closest-side at 50% 44%, ${TEAL}22 0%, ${TEAL}00 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 50px",
        }}
      >
        <AccentBar />
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
      <Wordmark />
    </AbsoluteFill>
  );
};
