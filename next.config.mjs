/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon.svg",
        permanent: true
      },
      {
        source: "/favicon.png",
        destination: "/favicon.svg",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
