const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
// const withPWA = require("next-pwa")({
//   dest: "public",
// });

module.exports = {
  images: {
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
    ],
  },
  webpack: (config, { isServer }) => {
    const prefix = config.assetPrefix ?? config.basePath ?? "";
    config.module.rules.push({
      test: /\.mp4$/,
      use: [
        {
          loader: "file-loader",
          options: {
            publicPath: `${prefix}/_next/static/media/`,
            outputPath: `${isServer ? "../" : ""}static/media/`,
            name: "[name].[hash].[ext]",
          },
        },
      ],
    });

    return config;
  },
};
