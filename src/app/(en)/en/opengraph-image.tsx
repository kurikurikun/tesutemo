import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'TesuTemo - Real voices that drive better decisions';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #eef1f8 0%, #ffffff 40%, #e8ecf5 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #7e91cf, #5a6eb3, #e95228)',
            display: 'flex',
          }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#e95228',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: '#7e91cf',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold',
          }}>T</div>
          TesuTemo
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center',
            marginBottom: '16px',
            display: 'flex',
          }}
        >
          Real Voices. Better Decisions.
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '22px',
            color: '#666',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.6,
            display: 'flex',
          }}
        >
          Interview videos for recruitment, universities, and migration promotion
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: '40px',
            padding: '16px 48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7e91cf, #5a6eb3)',
            color: 'white',
            fontSize: '22px',
            fontWeight: 'bold',
            display: 'flex',
          }}
        >
          Learn More →
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '16px',
            color: '#999',
            display: 'flex',
          }}
        >
          www.tesutemo.co/en
        </div>
      </div>
    ),
    { ...size }
  );
}
