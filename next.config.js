/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "www.nicepng.com",
      },
      {
        protocol: "https",
        hostname: "images.viblo.asia",
      },
      {
        protocol: "https",
        hostname: "png.pngtree.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "server-discord-clone.adaptable.app",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "discord-clone-server-production.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  experimental: {
    workerThreads: true,
    optimizeCss: true, // enabling this will enable SSR for Tailwind
    swcMinify: true,
    gzipSize: true,
    optimizeServerReact: true,
    serverMinification: true,
    webpackBuildWorker: true,
    serverSourceMaps: true,
  },
  staticPageGenerationTimeout: 120,
};

module.exports = nextConfig;
