import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('http://127.0.0.1:54321/storage/v1/object/public/avatars/**'),
      new URL('http://127.0.0.1:54321/storage/v1/object/public/screenshots/**'),
      new URL('http://127.0.0.1:54321/storage/v1/object/public/references/ref-image.*')
    ]
  }
};

export default nextConfig;
