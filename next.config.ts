import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sfile.chatglm.cn',
        pathname: '/images-ppt/**',
      },
    ],
  },
};

export default nextConfig;
