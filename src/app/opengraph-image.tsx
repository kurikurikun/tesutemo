import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'TesuTemo - リアルな声で意思決定を支えるインタビュー動画サービス';
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
          background: 'linear-gradient(135deg, #fff5f0 0%, #ffffff 40%, #e8ecf5 100%)',
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
            background: 'linear-gradient(90deg, #e95228, #ff6b4a, #7e91cf)',
            display: 'flex',
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #e95228, #ff6b4a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '40px',
              fontWeight: 'bold',
            }}
          >
            T
          </div>
          <span
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#1a1a1a',
              display: 'flex',
            }}
          >
            TesuTemo
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center',
            marginBottom: '16px',
            display: 'flex',
          }}
        >
          リアルな声で意思決定を支える
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
          インタビュー動画で採用・大学広報・移住促進をサポート
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: '40px',
            padding: '16px 48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #e95228, #ff6b4a)',
            color: 'white',
            fontSize: '22px',
            fontWeight: 'bold',
            display: 'flex',
          }}
        >
          詳しくはこちら →
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '16px',
            color: '#999',
            display: 'flex',
          }}
        >
          tesutemo.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
