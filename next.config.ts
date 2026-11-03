import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 1. Ensure Sharp is used for high-performance C++ optimization
    dangerouslyAllowSVG: true, 
    
    // 2. Limit the number of device sizes to reduce processing overhead
    deviceSizes: [640, 750, 828, 1080],
    
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**', // Simplified: this covers both /storage/** and /**
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/linkqu-qris/getqrcode/**',
      },
      {
        protocol: 'https',
        hostname: 'linkqu.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'utils.linkqu.id',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.manzcode.my.id',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.https://kakilimatopup.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'https://kakilimatopup.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'manztopup.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.manztopup.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.tripay.co.id',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tripay.co.id',
        pathname: '/**',
      },
    ],
  },
  
  // 3. Performance & Stability tweaks
  poweredByHeader: false,
  compress: false, // Let Nginx handle compression
  reactStrictMode: true,
  optimizeFonts: false, // Prevents extra CPU usage during build
};

export default nextConfig;