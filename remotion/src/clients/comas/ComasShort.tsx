import { AbsoluteFill } from "remotion";
import type { Caption } from "@remotion/captions";
import { CaptionsOverlay } from "../../captions/CaptionsOverlay";
import { comasCaptionStyle } from "./style";

/**
 * Caption overlay for one Ariel/Comas short. Transparent background —
 * render as an alpha export and composite on top of the picture in
 * DaVinci Resolve, same pattern as the Carro Japan telops.
 */
export const ComasShort: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <CaptionsOverlay captions={captions} style={comasCaptionStyle} />
    </AbsoluteFill>
  );
};

/**
 * Preview version with a dark placeholder background, for reviewing the
 * caption design in Remotion Studio without the real footage loaded.
 */
export const ComasShortPreview: React.FC<{ captions: Caption[] }> = ({
  captions,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a1a" }}>
      <CaptionsOverlay captions={captions} style={comasCaptionStyle} />
    </AbsoluteFill>
  );
};
