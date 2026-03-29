/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'tesutemo.co' }],
        destination: 'https://www.tesutemo.co/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
