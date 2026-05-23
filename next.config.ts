import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@libsql/client', 'libsql', 'resend'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sfile.chatglm.cn',
        pathname: '/images-ppt/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
