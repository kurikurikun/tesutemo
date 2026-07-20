import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

// Shared move-ment family favicon: the M-M parent mark, white, on a
// per-property tint. Keep the mark identical across all three sites — only
// `background` changes, so the family reads as one but the tabs stay tellable
// apart.
//
//   move-ment.co       #1a1a1a ground, white mark  (its dark palette)
//   tesutemo.co        #e95228 ground, white mark  (TesuTemo orange)  ← this file
//   filminginjapan.com #fdf8f3 ground, #0d0a07 mark  (its cream site ground —
//                      the one inverted tile, for a clear three-way split)
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#e95228',
          borderRadius: '14px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            color: '#ffffff',
            fontSize: '25px',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            lineHeight: 1,
          }}
        >
          <span style={{ display: 'flex' }}>M</span>
          <span
            style={{
              display: 'flex',
              width: '7px',
              height: '4px',
              background: '#ffffff',
              borderRadius: '1px',
            }}
          />
          <span style={{ display: 'flex' }}>M</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
