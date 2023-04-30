/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pixabay.com',
        port: '',
        pathname: '/get/**',
      },
    ],
  },
};
