import { loadFont } from "@remotion/google-fonts/Inter";
import type { CaptionStyle } from "../../captions/CaptionsOverlay";

const { fontFamily } = loadFont();

/**
 * Comas brand colors, eyeballed from screenshots of comas.co.jp (no exact
 * hex codes provided) — teal accent from the site's CTA buttons / hero
 * headline / numeral treatment, navy from the logo and header nav. Adjust
 * highlightColor/navy below if you have the real brand hex values.
 */
const COMAS_TEAL = "#1CA7B7";
const COMAS_NAVY = "#1E2B3C";

export const comasCaptionStyle: CaptionStyle = {
  fontFamily,
  fontWeight: 900,
  fontSize: 64,
  textColor: "#FFFFFF",
  highlightColor: COMAS_TEAL,
  bottomOffset: 160,
  lineHeight: 1.25,
  letterSpacing: 0.5,
  // Navy-tinted shadow (from COMAS_NAVY) instead of flat black — ties the
  // outline to the brand's dark tone while still reading on any footage.
  textShadow: `
    0 0 18px rgba(30,43,60,0.8),
    0 3px 10px rgba(30,43,60,0.65),
    2px 2px 0 ${COMAS_NAVY},
    -2px -2px 0 ${COMAS_NAVY},
    2px -2px 0 ${COMAS_NAVY},
    -2px 2px 0 ${COMAS_NAVY}
  `,
};
