const { optimizeImage } = require("next/dist/server/image-optimizer");

const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
// const withPWA = require("next-pwa")({
//   dest: "public",
// });

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "books.google.com",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
      {
        protocol: "https",
        hostname: cdnUrl,
      },
      {
        protocol: "https",
        hostname: "i.gr-assets.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};
